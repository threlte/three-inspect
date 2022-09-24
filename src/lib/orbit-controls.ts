import { three } from '../three';
import { EventDispatcher } from './event-dispatcher';

const twoPI = 2 * Math.PI;
const EPS = 0.000001;

const enum MOUSE {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
  ROTATE = 0,
  DOLLY = 1,
  PAN = 2,
}

const enum TOUCH {
  ROTATE,
  PAN,
  DOLLY_PAN,
  DOLLY_ROTATE,
}

const keys = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  BOTTOM: 'ArrowDown'
}

const STATE = {
  NONE: - 1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
} as const;

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class OrbitControls extends EventDispatcher {

  // Set to false to disable this control
  enabled = true

  // "target" sets the location of focus, where the object orbits around
  target: THREE.Vector3

  // How far you can dolly in and out ( PerspectiveCamera only )
  minDistance = 0
  maxDistance = Infinity

  // How far you can zoom in and out ( OrthographicCamera only )
  minZoom = 0
  maxZoom = Infinity

  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  minPolarAngle = 0 // radians
  maxPolarAngle = Math.PI // radians

  // How far you can orbit horizontally, upper and lower limits.
  // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
  minAzimuthAngle = -Infinity // radians
  maxAzimuthAngle = Infinity // radians

  // Set to true to enable damping (inertia)
  // If damping is enabled, you must call controls.update() in your animation loop
  enableDamping = false
  dampingFactor = 0.05

  // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
  // Set to false to disable zooming
  enableZoom = true
  zoomSpeed = 1.0

  // Set to false to disable rotating
  enableRotate = true
  rotateSpeed = 1.0

  // Set to false to disable panning
  enablePan = true
  panSpeed = 1.0
  screenSpacePanning = true // if false, pan orthogonal to world-space direction camera.up
  keyPanSpeed = 7.0 // pixels moved per arrow key push

  // Set to true to automatically rotate around the target
  // If auto-rotate is enabled, you must call controls.update() in your animation loop
  autoRotate = false
  autoRotateSpeed = 2.0 // 30 seconds per orbit when fps is 60
  reverseOrbit = false // true if you want to reverse the orbit to mouse drag from left to right = orbits left

  // The four arrow keys
  keys = {
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    BOTTOM: 'ArrowDown'
  }

  // Mouse buttons
  mouseButtons = {
    LEFT: MOUSE.ROTATE,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN,
  }

  // Touch fingers
  touches = {
    ONE: TOUCH.ROTATE,
    TWO: TOUCH.DOLLY_PAN
  }

  target0: THREE.Vector3
  position0: THREE.Vector3
  zoom0: number

  // the target DOM element for key events
  _domElementKeyEvents: any = null

	getPolarAngle: () => number
	getAzimuthalAngle: () => number
	getDistance: () => number
	listenToKeyEvents: (el: HTMLElement) => void
	saveState: () => void
	reset: () => void
	update: () => void
	dispose: () => void

	constructor( object: THREE.Camera, domElement: HTMLElement ) {
		const THREE = three()

    super();

		domElement.style.touchAction = 'none'; // disable touch scroll

		this.target = new THREE.Vector3()

		// for reset
		this.target0 = this.target.clone();
		this.position0 = object.position.clone();
		this.zoom0 = (object as THREE.OrthographicCamera).zoom;

		const offset = new THREE.Vector3();

    // so camera.up is the orbit axis
    const quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
    const quatInverse = quat.clone().invert();

    const lastPosition = new THREE.Vector3();
    const lastQuaternion = new THREE.Quaternion();

		let state: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 = STATE.NONE;

    const v = new THREE.Vector3();

		// current position in spherical coordinates
		const spherical = new THREE.Spherical();
		const sphericalDelta = new THREE.Spherical();

		let scale = 1;
		const panOffset = new THREE.Vector3();
		let zoomChanged = false;

		const rotateStart = new THREE.Vector2();
		const rotateEnd = new THREE.Vector2();
		const rotateDelta = new THREE.Vector2();

		const panStart = new THREE.Vector2();
		const panEnd = new THREE.Vector2();
		const panDelta = new THREE.Vector2();

		const dollyStart = new THREE.Vector2();
		const dollyEnd = new THREE.Vector2();
		const dollyDelta = new THREE.Vector2();

		const pointers: PointerEvent[] = [];
		const pointerPositions: Record<number, THREE.Vector2> = {};

		//
		// public methods
		//

		this.getPolarAngle = () => {

			return spherical.phi;

		};

		this.getAzimuthalAngle = () => {

			return spherical.theta;

		};

		this.getDistance = () => {

			return object.position.distanceTo( this.target );

		};

		this.listenToKeyEvents = ( domElement: HTMLElement ) => {

			domElement.addEventListener( 'keydown', onKeyDown );
			this._domElementKeyEvents = domElement;

		};

		this.saveState = () => {

			this.target0.copy( this.target );
			this.position0.copy( object.position );
			this.zoom0 = (object as THREE.OrthographicCamera).zoom;

		};

    this.reset = () => {

      this.target.copy( this.target0 );
      object.position.copy( this.position0 );

			if ( (object as THREE.OrthographicCamera).isOrthographicCamera ) {

				const camera = object as THREE.OrthographicCamera

				camera.zoom = this.zoom0;
  
      	camera.updateProjectionMatrix();

			}
      
      this.dispatchEvent( _changeEvent );
  
      update();
  
      state = STATE.NONE;
  
    };

		// this method is exposed, but perhaps it would be better if we can make it private...
		const update = () => {

      offset.copy( object.position ).sub( this.target );

      // rotate offset to "y-axis-is-up" space
      offset.applyQuaternion( quat );

      // angle from z-axis around y-axis
      spherical.setFromVector3( offset );

      if ( this.autoRotate && state === STATE.NONE ) {

        rotateLeft( getAutoRotationAngle() );

      }

      if ( this.enableDamping ) {

        spherical.theta += sphericalDelta.theta * this.dampingFactor;
        spherical.phi += sphericalDelta.phi * this.dampingFactor;

      } else {

        spherical.theta += sphericalDelta.theta;
        spherical.phi += sphericalDelta.phi;

      }

      // restrict theta to be between desired limits

      let min = this.minAzimuthAngle;
      let max = this.maxAzimuthAngle;

      if ( isFinite( min ) && isFinite( max ) ) {

        if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

        if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

        if ( min <= max ) {

          spherical.theta = Math.max( min, Math.min( max, spherical.theta ) );

        } else {

          spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ?
            Math.max( min, spherical.theta ) :
            Math.min( max, spherical.theta );

        }

      }

      // restrict phi to be between desired limits
      spherical.phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, spherical.phi ) );

      spherical.makeSafe();


      spherical.radius *= scale;

      // restrict radius to be between desired limits
      spherical.radius = Math.max( this.minDistance, Math.min( this.maxDistance, spherical.radius ) );

      // move target to panned location

      if ( this.enableDamping === true ) {

        this.target.addScaledVector( panOffset, this.dampingFactor );

      } else {

        this.target.add( panOffset );

      }

      offset.setFromSpherical( spherical );

      // rotate offset back to "camera-up-vector-is-up" space
      offset.applyQuaternion( quatInverse );

      object.position.copy( this.target ).add( offset );

      object.lookAt( this.target );

      if ( this.enableDamping === true ) {

        sphericalDelta.theta *= ( 1 - this.dampingFactor );
        sphericalDelta.phi *= ( 1 - this.dampingFactor );

        panOffset.multiplyScalar( 1 - this.dampingFactor );

      } else {

        sphericalDelta.set( 0, 0, 0 );

        panOffset.set( 0, 0, 0 );

      }

      scale = 1;

      // update condition is:
      // min(camera displacement, camera rotation in radians)^2 > EPS
      // using small-angle approximation cos(x/2) = 1 - x^2 / 8

      if (
				zoomChanged ||
        lastPosition.distanceToSquared( object.position ) > EPS ||
        8 * ( 1 - lastQuaternion.dot( object.quaternion ) ) > EPS
			) {

        this.dispatchEvent( _changeEvent );

        lastPosition.copy( object.position );
        lastQuaternion.copy( object.quaternion );
        zoomChanged = false;

        return true;

      }

      return false;

    };

    this.update = update

		this.dispose = () => {

			domElement.removeEventListener( 'contextmenu', onContextMenu );

			domElement.removeEventListener( 'pointerdown', onPointerDown );
			domElement.removeEventListener( 'pointercancel', onPointerCancel );
			domElement.removeEventListener( 'wheel', onMouseWheel );

			domElement.removeEventListener( 'pointermove', onPointerMove );
			domElement.removeEventListener( 'pointerup', onPointerUp );


			if ( this._domElementKeyEvents !== null ) {

				this._domElementKeyEvents.removeEventListener( 'keydown', onKeyDown );

			}

		};

		const getAutoRotationAngle = () => {

			return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;

		}

		const getZoomScale = () => {

			return Math.pow( 0.95, this.zoomSpeed );

		}

		const rotateLeft = ( angle: number ) => {

			sphericalDelta.theta -= angle;

		}

		const rotateUp = ( angle: number ) => {

			sphericalDelta.phi -= angle;

		}

		const panLeft = ( distance: number, objectMatrix: THREE.Matrix4 ) => {

      v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
      v.multiplyScalar( - distance );

      panOffset.add( v );

    };

		const panUp = ( distance: number, objectMatrix: THREE.Matrix4 ) => {

      if ( this.screenSpacePanning === true ) {

        v.setFromMatrixColumn( objectMatrix, 1 );

      } else {

        v.setFromMatrixColumn( objectMatrix, 0 );
        v.crossVectors( object.up, v );

      }

      v.multiplyScalar( distance );

      panOffset.add( v );

    };

		// deltaX and deltaY are in pixels; right and down are positive
		const pan = ( deltaX: number, deltaY: number ) => {

      if ( (object as THREE.PerspectiveCamera).isPerspectiveCamera ) {

				const { fov } = object as THREE.PerspectiveCamera

        // perspective
        offset.copy( object.position ).sub( this.target );
        let targetDistance = offset.length();

        // half of the fov is center to top of screen
        targetDistance *= Math.tan( ( fov / 2 ) * Math.PI / 180.0 );

        // we use only clientHeight here so aspect ratio does not distort speed
        panLeft( 2 * deltaX * targetDistance / domElement.clientHeight, object.matrix );
        panUp( 2 * deltaY * targetDistance / domElement.clientHeight, object.matrix );

      } else if ( (object as THREE.OrthographicCamera).isOrthographicCamera ) {

        const camera = object as THREE.OrthographicCamera
        panLeft( deltaX * ( camera.right - camera.left ) / camera.zoom / domElement.clientWidth, camera.matrix );
        panUp( deltaY * ( camera.top - camera.bottom ) / camera.zoom / domElement.clientHeight, camera.matrix );

      } else {

        // camera neither orthographic nor perspective
        console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
        this.enablePan = false;

      }

    };

		const dollyOut = ( dollyScale: number ) => {

			if ( (object as THREE.PerspectiveCamera).isPerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( (object as THREE.OrthographicCamera).isOrthographicCamera ) {

				const camera = object as THREE.OrthographicCamera
				camera.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, camera.zoom * dollyScale ) );
				camera.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				this.enableZoom = false;

			}

		}

		const dollyIn = ( dollyScale: number ) => {

			if ( (object as THREE.PerspectiveCamera).isPerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( (object as THREE.OrthographicCamera).isOrthographicCamera ) {

				const camera = object as THREE.OrthographicCamera
				camera.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, camera.zoom / dollyScale ) );
				camera.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				this.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		const handleMouseDownRotate = ( event: MouseEvent ) => {

			rotateStart.set( event.clientX, event.clientY );

		}

		const handleMouseDownDolly = ( event: MouseEvent ) => {

			dollyStart.set( event.clientX, event.clientY );

		}

		const handleMouseDownPan = ( event: MouseEvent ) => {

			panStart.set( event.clientX, event.clientY );

		}

		const handleMouseMoveRotate = ( event: MouseEvent ) => {

			rotateEnd.set( event.clientX, event.clientY );

			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( this.rotateSpeed );

			rotateLeft( 2 * Math.PI * rotateDelta.x / domElement.clientHeight ); // yes, height

			rotateUp( 2 * Math.PI * rotateDelta.y / domElement.clientHeight );

			rotateStart.copy( rotateEnd );

			update();

		}

		const handleMouseMoveDolly = ( event: MouseEvent ) => {

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			update();

		}

		const handleMouseMovePan = ( event: MouseEvent ) => {

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( this.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			update();

		}

		const handleMouseWheel = ( event: WheelEvent ) => {

			if ( event.deltaY < 0 ) {

				dollyIn( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyOut( getZoomScale() );

			}

			update();

		}

		const handleKeyDown = ( event: KeyboardEvent ) => {

			let needsUpdate = false;

			switch ( event.code ) {

				case keys.UP:
					pan( 0, this.keyPanSpeed );
					needsUpdate = true;
					break;

				case keys.BOTTOM:
					pan( 0, - this.keyPanSpeed );
					needsUpdate = true;
					break;

				case keys.LEFT:
					pan( this.keyPanSpeed, 0 );
					needsUpdate = true;
					break;

				case keys.RIGHT:
					pan( - this.keyPanSpeed, 0 );
					needsUpdate = true;
					break;

			}

			if ( needsUpdate ) {

				// prevent the browser from scrolling on cursor keys
				event.preventDefault();

				update();

			}

		}

		const handleTouchStartRotate = () => {

			if ( pointers.length === 1 ) {

				rotateStart.set( pointers[ 0 ].pageX, pointers[ 0 ].pageY );

			} else {

				const x = 0.5 * ( pointers[ 0 ].pageX + pointers[ 1 ].pageX );
				const y = 0.5 * ( pointers[ 0 ].pageY + pointers[ 1 ].pageY );

				rotateStart.set( x, y );

			}

		}

		const handleTouchStartPan = () => {

			if ( pointers.length === 1 ) {

				panStart.set( pointers[ 0 ].pageX, pointers[ 0 ].pageY );

			} else {

				const x = 0.5 * ( pointers[ 0 ].pageX + pointers[ 1 ].pageX );
				const y = 0.5 * ( pointers[ 0 ].pageY + pointers[ 1 ].pageY );

				panStart.set( x, y );

			}

		}

		const handleTouchStartDolly = () => {

			const dx = pointers[ 0 ].pageX - pointers[ 1 ].pageX;
			const dy = pointers[ 0 ].pageY - pointers[ 1 ].pageY;

			const distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		const handleTouchStartDollyPan = () => {

			if ( this.enableZoom ) handleTouchStartDolly();

			if ( this.enablePan ) handleTouchStartPan();

		}

		const handleTouchStartDollyRotate = () => {

			if ( this.enableZoom ) handleTouchStartDolly();

			if ( this.enableRotate ) handleTouchStartRotate();

		}

		const handleTouchMoveRotate = ( event: PointerEvent ) => {

			if ( pointers.length == 1 ) {

				rotateEnd.set( event.pageX, event.pageY );

			} else {

				const position = getSecondPointerPosition( event );

				const x = 0.5 * ( event.pageX + position.x );
				const y = 0.5 * ( event.pageY + position.y );

				rotateEnd.set( x, y );

			}

			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( this.rotateSpeed );

			rotateLeft( 2 * Math.PI * rotateDelta.x / domElement.clientHeight ); // yes, height

			rotateUp( 2 * Math.PI * rotateDelta.y / domElement.clientHeight );

			rotateStart.copy( rotateEnd );

		}

		const handleTouchMovePan = ( event: PointerEvent ) => {

			if ( pointers.length === 1 ) {

				panEnd.set( event.pageX, event.pageY );

			} else {

				const position = getSecondPointerPosition( event );

				const x = 0.5 * ( event.pageX + position.x );
				const y = 0.5 * ( event.pageY + position.y );

				panEnd.set( x, y );

			}

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( this.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

		}

		const handleTouchMoveDolly = ( event: PointerEvent ) => {

			const position = getSecondPointerPosition( event );

			const dx = event.pageX - position.x;
			const dy = event.pageY - position.y;

			const distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, this.zoomSpeed ) );

			dollyOut( dollyDelta.y );

			dollyStart.copy( dollyEnd );

		}

		const handleTouchMoveDollyPan = ( event: PointerEvent ) => {

			if ( this.enableZoom ) handleTouchMoveDolly( event );

			if ( this.enablePan ) handleTouchMovePan( event );

		}

		const handleTouchMoveDollyRotate = ( event: PointerEvent ) => {

			if ( this.enableZoom ) handleTouchMoveDolly( event );

			if ( this.enableRotate ) handleTouchMoveRotate( event );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		const onPointerDown = ( event: PointerEvent ) => {

			if ( this.enabled === false ) return;

			if ( pointers.length === 0 ) {

				domElement.setPointerCapture( event.pointerId );

				domElement.addEventListener( 'pointermove', onPointerMove );
				domElement.addEventListener( 'pointerup', onPointerUp );

			}

			//

			addPointer( event );

			if ( event.pointerType === 'touch' ) {

				onTouchStart( event );

			} else {

				onMouseDown( event );

			}

		}

		const onPointerMove = ( event: PointerEvent ) => {

			if ( this.enabled === false ) return;

			if ( event.pointerType === 'touch' ) {

				onTouchMove( event );

			} else {

				onMouseMove( event );

			}

		}

		const onPointerUp = ( event: PointerEvent ) => {

		    removePointer( event );

		    if ( pointers.length === 0 ) {

		        domElement.releasePointerCapture( event.pointerId );

		        domElement.removeEventListener( 'pointermove', onPointerMove );
		        domElement.removeEventListener( 'pointerup', onPointerUp );

		    }

		    this.dispatchEvent( _endEvent );

		    state = STATE.NONE;

		}

		const onPointerCancel = ( event: PointerEvent ) => {

			removePointer( event );

		}

		const onMouseDown = ( event: MouseEvent ) => {

			let mouseAction = - 1;

			switch ( event.button ) {

				case 0:

					mouseAction = this.mouseButtons.LEFT;
					break;

				case 1:

					mouseAction = this.mouseButtons.MIDDLE;
					break;

				case 2:

					mouseAction = this.mouseButtons.RIGHT;
					break;

				default:

					mouseAction = - 1;

			}

			switch ( mouseAction ) {

				case MOUSE.DOLLY:

					if ( this.enableZoom === false ) return;

					handleMouseDownDolly( event );

					state = STATE.DOLLY;

					break;

				case MOUSE.ROTATE:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						if ( this.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

					} else {

						if ( this.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

					}

					break;

				case MOUSE.PAN:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						if ( this.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

					} else {

						if ( this.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

					}

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				this.dispatchEvent( _startEvent );

			}

		}

		const onMouseMove = ( event: MouseEvent ) => {

			switch ( state ) {

				case STATE.ROTATE:

					if ( this.enableRotate === false ) return;

					handleMouseMoveRotate( event );

					break;

				case STATE.DOLLY:

					if ( this.enableZoom === false ) return;

					handleMouseMoveDolly( event );

					break;

				case STATE.PAN:

					if ( this.enablePan === false ) return;

					handleMouseMovePan( event );

					break;

			}

		}

		const onMouseWheel = ( event: WheelEvent ) => {

			if ( this.enabled === false || this.enableZoom === false || state !== STATE.NONE ) return;

			event.preventDefault();

			this.dispatchEvent( _startEvent );

			handleMouseWheel( event );

			this.dispatchEvent( _endEvent );

		}

		const onKeyDown = ( event: KeyboardEvent ) => {

			if ( this.enabled === false || this.enablePan === false ) return;

			handleKeyDown( event );

		}

		const onTouchStart = ( event: PointerEvent ) => {

			trackPointer( event );

			switch ( pointers.length ) {

				case 1:

					switch ( this.touches.ONE ) {

						case TOUCH.ROTATE:

							if ( this.enableRotate === false ) return;

							handleTouchStartRotate();

							state = STATE.TOUCH_ROTATE;

							break;

						case TOUCH.PAN:

							if ( this.enablePan === false ) return;

							handleTouchStartPan();

							state = STATE.TOUCH_PAN;

							break;

						default:

							state = STATE.NONE;

					}

					break;

				case 2:

					switch ( this.touches.TWO ) {

						case TOUCH.DOLLY_PAN:

							if ( this.enableZoom === false && this.enablePan === false ) return;

							handleTouchStartDollyPan();

							state = STATE.TOUCH_DOLLY_PAN;

							break;

						case TOUCH.DOLLY_ROTATE:

							if ( this.enableZoom === false && this.enableRotate === false ) return;

							handleTouchStartDollyRotate();

							state = STATE.TOUCH_DOLLY_ROTATE;

							break;

						default:

							state = STATE.NONE;

					}

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				this.dispatchEvent( _startEvent );

			}

		}

		const onTouchMove = ( event: PointerEvent ) => {

			trackPointer( event );

			switch ( state ) {

				case STATE.TOUCH_ROTATE:

					if ( this.enableRotate === false ) return;

					handleTouchMoveRotate( event );

					update();

					break;

				case STATE.TOUCH_PAN:

					if ( this.enablePan === false ) return;

					handleTouchMovePan( event );

					update();

					break;

				case STATE.TOUCH_DOLLY_PAN:

					if ( this.enableZoom === false && this.enablePan === false ) return;

					handleTouchMoveDollyPan( event );

					update();

					break;

				case STATE.TOUCH_DOLLY_ROTATE:

					if ( this.enableZoom === false && this.enableRotate === false ) return;

					handleTouchMoveDollyRotate( event );

					update();

					break;

				default:

					state = STATE.NONE;

			}

		}

		const onContextMenu = ( event: Event ) => {

			if ( this.enabled === false ) return;

			event.preventDefault();

		}

		function addPointer( event: PointerEvent ) {

			pointers.push( event );

		}

		const removePointer = ( event: PointerEvent ) => {

			delete pointerPositions[ event.pointerId ];

			for ( let i = 0; i < pointers.length; i ++ ) {

				if ( pointers[ i ].pointerId == event.pointerId ) {

					pointers.splice( i, 1 );
					return;

				}

			}

		}

		const trackPointer = ( event: PointerEvent ) => {

			let position = pointerPositions[ event.pointerId ];

			if ( position === undefined ) {

				position = new THREE.Vector2();
				pointerPositions[ event.pointerId ] = position;

			}

			position.set( event.pageX, event.pageY );

		}

		const getSecondPointerPosition = ( event: PointerEvent ) => {

			const pointer = ( event.pointerId === pointers[ 0 ].pointerId ) ? pointers[ 1 ] : pointers[ 0 ];

			return pointerPositions[ pointer.pointerId ];

		}

		//

		domElement.addEventListener( 'contextmenu', onContextMenu );

		domElement.addEventListener( 'pointerdown', onPointerDown );
		domElement.addEventListener( 'pointercancel', onPointerCancel );
		domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

		// force an update at start

		update();

	}

}


// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
// This is very similar to OrbitControls, another set of touch behavior
//
//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse, or arrow keys / touch: one-finger move

class MapControls extends OrbitControls {

	constructor( object: THREE.Camera, domElement: HTMLElement ) {

		super( object, domElement );

		this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up

		this.mouseButtons.LEFT = MOUSE.PAN;
		this.mouseButtons.RIGHT = MOUSE.ROTATE;

		this.touches.ONE = TOUCH.PAN;
		this.touches.TWO = TOUCH.DOLLY_ROTATE;

	}

}

export { OrbitControls, MapControls };