import { three } from '../three'

const positions = [ 1, 1, 0, - 1, 1, 0, - 1, - 1, 0, 1, - 1, 0, 1, 1, 0 ];
const positions2 = [ 1, 1, 0, - 1, 1, 0, - 1, - 1, 0, 1, 1, 0, - 1, - 1, 0, 1, - 1, 0 ];

export const createRectAreaLightHelper = (light: THREE.RectAreaLight, color?: THREE.Color) => {
  const THREE = three()

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.computeBoundingSphere();

  const material = new THREE.LineBasicMaterial( { fog: false } );
  const line = new THREE.Line()

  line.type = 'RectAreaLightHelper';

  const geometry2 = new THREE.BufferGeometry();
  geometry2.setAttribute( 'position', new THREE.Float32BufferAttribute( positions2, 3 ) );
  geometry2.computeBoundingSphere();

  line.add( new THREE.Mesh( geometry2, new THREE.MeshBasicMaterial( { side: THREE.BackSide, fog: false } ) ) );

  line.updateMatrixWorld = () => {

		line.scale.set( 0.5 * light.width, 0.5 * light.height, 1 );

		if ( color !== undefined ) {

			material.color.set( color );

      const mat = (line.children[ 0 ] as THREE.Mesh).material as THREE.MeshBasicMaterial
			mat.color.set( color );

		} else {

			material.color.copy( light.color ).multiplyScalar( light.intensity );

			// prevent hue shift
			const c = material.color;
			const max = Math.max( c.r, c.g, c.b );
			if ( max > 1 ) c.multiplyScalar( 1 / max );

      const child = line.children[ 0 ] as THREE.Mesh
			(child.material as THREE.MeshBasicMaterial).color.copy( material.color );

		}

		// ignore world scale on light
		line.matrixWorld.extractRotation( light.matrixWorld ).scale( line.scale ).copyPosition( light.matrixWorld );

		line.children[ 0 ].matrixWorld.copy( line.matrixWorld );

	}

  (line as unknown as { dispose: () => void }).dispose = () => {
		line.geometry.dispose();
		(line.material as THREE.MeshBasicMaterial).dispose();

    const child = line.children[ 0 ] as THREE.Mesh;
		child.geometry.dispose();
		(child.material as THREE.MeshBasicMaterial).dispose();
	}

  return line
}
