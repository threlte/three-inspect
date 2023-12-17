import{s as oe,B as N,C as K,z as Q,D as ye,p as Ee,r as ae,u as se,v as ie,w as re,F as Pt,G as Mt,a as Ke,c as Fe,i as Ze,d as Xe,E as Tt,H as Ot}from"./scheduler.9h8Gne0h.js";import{S as le,i as ce,b as F,d as Z,m as X,a as R,t as I,e as W,f as wt}from"./index.lZ1VfIVx.js";import{aO as At,aP as Ct,$ as jt,aQ as Dt,V as O,aR as H,aS as x,a6 as _e,aT as We,v as j,a as v,g as Pe,d as Me,e as Rt,u as It,k as tt,f as Te,aU as St,aV as Ve,aW as Be,M as ge,aX as Ge,I as Lt,aY as Nt}from"./index.po5c1ZWt.js";const qe={type:"change"},be={type:"start"},Qe={type:"end"},ne=new At,ve=new Ct,kt=Math.cos(70*jt.DEG2RAD);let Yt=class extends Dt{constructor(o,r){super(),this.object=o,this.domElement=r,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:H.ROTATE,MIDDLE:H.DOLLY,RIGHT:H.PAN},this.touches={ONE:x.ROTATE,TWO:x.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return i.phi},this.getAzimuthalAngle=function(){return i.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(t){t.addEventListener("keydown",me),this._domElementKeyEvents=t},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",me),this._domElementKeyEvents=null},this.saveState=function(){e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=function(){e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(qe),e.update(),a=n.NONE},this.update=function(){const t=new O,u=new _e().setFromUnitVectors(o.up,new O(0,1,0)),b=u.clone().invert(),y=new O,A=new _e,z=new O,k=2*Math.PI;return function(Et=null){const xe=e.object.position;t.copy(xe).sub(e.target),t.applyQuaternion(u),i.setFromVector3(t),e.autoRotate&&a===n.NONE&&V(ot(Et)),e.enableDamping?(i.theta+=l.theta*e.dampingFactor,i.phi+=l.phi*e.dampingFactor):(i.theta+=l.theta,i.phi+=l.phi);let S=e.minAzimuthAngle,L=e.maxAzimuthAngle;isFinite(S)&&isFinite(L)&&(S<-Math.PI?S+=k:S>Math.PI&&(S-=k),L<-Math.PI?L+=k:L>Math.PI&&(L-=k),S<=L?i.theta=Math.max(S,Math.min(L,i.theta)):i.theta=i.theta>(S+L)/2?Math.max(S,i.theta):Math.min(L,i.theta)),i.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,i.phi)),i.makeSafe(),e.enableDamping===!0?e.target.addScaledVector(P,e.dampingFactor):e.target.add(P),e.target.sub(e.cursor),e.target.clampLength(e.minTargetRadius,e.maxTargetRadius),e.target.add(e.cursor),e.zoomToCursor&&Y||e.object.isOrthographicCamera?i.radius=fe(i.radius):i.radius=fe(i.radius*m),t.setFromSpherical(i),t.applyQuaternion(b),xe.copy(e.target).add(t),e.object.lookAt(e.target),e.enableDamping===!0?(l.theta*=1-e.dampingFactor,l.phi*=1-e.dampingFactor,P.multiplyScalar(1-e.dampingFactor)):(l.set(0,0,0),P.set(0,0,0));let he=!1;if(e.zoomToCursor&&Y){let G=null;if(e.object.isPerspectiveCamera){const q=t.length();G=fe(q*m);const te=q-G;e.object.position.addScaledVector(g,te),e.object.updateMatrixWorld()}else if(e.object.isOrthographicCamera){const q=new O(f.x,f.y,0);q.unproject(e.object),e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/m)),e.object.updateProjectionMatrix(),he=!0;const te=new O(f.x,f.y,0);te.unproject(e.object),e.object.position.sub(te).add(q),e.object.updateMatrixWorld(),G=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),e.zoomToCursor=!1;G!==null&&(this.screenSpacePanning?e.target.set(0,0,-1).transformDirection(e.object.matrix).multiplyScalar(G).add(e.object.position):(ne.origin.copy(e.object.position),ne.direction.set(0,0,-1).transformDirection(e.object.matrix),Math.abs(e.object.up.dot(ne.direction))<kt?o.lookAt(e.target):(ve.setFromNormalAndCoplanarPoint(e.object.up,e.target),ne.intersectPlane(ve,e.target))))}else e.object.isOrthographicCamera&&(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/m)),e.object.updateProjectionMatrix(),he=!0);return m=1,Y=!1,he||y.distanceToSquared(e.object.position)>c||8*(1-A.dot(e.object.quaternion))>c||z.distanceToSquared(e.target)>0?(e.dispatchEvent(qe),y.copy(e.object.position),A.copy(e.object.quaternion),z.copy(e.target),!0):!1}}(),this.dispose=function(){e.domElement.removeEventListener("contextmenu",ze),e.domElement.removeEventListener("pointerdown",Ye),e.domElement.removeEventListener("pointercancel",B),e.domElement.removeEventListener("wheel",Ue),e.domElement.removeEventListener("pointermove",de),e.domElement.removeEventListener("pointerup",B),e._domElementKeyEvents!==null&&(e._domElementKeyEvents.removeEventListener("keydown",me),e._domElementKeyEvents=null)};const e=this,n={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let a=n.NONE;const c=1e-6,i=new We,l=new We;let m=1;const P=new O,_=new j,T=new j,h=new j,E=new j,M=new j,d=new j,w=new j,C=new j,D=new j,g=new O,f=new j;let Y=!1;const p=[],J={};function ot(t){return t!==null?2*Math.PI/60*e.autoRotateSpeed*t:2*Math.PI/60/60*e.autoRotateSpeed}function $(){return Math.pow(.95,e.zoomSpeed)}function V(t){l.theta-=t}function ee(t){l.phi-=t}const Oe=function(){const t=new O;return function(b,y){t.setFromMatrixColumn(y,0),t.multiplyScalar(-b),P.add(t)}}(),we=function(){const t=new O;return function(b,y){e.screenSpacePanning===!0?t.setFromMatrixColumn(y,1):(t.setFromMatrixColumn(y,0),t.crossVectors(e.object.up,t)),t.multiplyScalar(b),P.add(t)}}(),U=function(){const t=new O;return function(b,y){const A=e.domElement;if(e.object.isPerspectiveCamera){const z=e.object.position;t.copy(z).sub(e.target);let k=t.length();k*=Math.tan(e.object.fov/2*Math.PI/180),Oe(2*b*k/A.clientHeight,e.object.matrix),we(2*y*k/A.clientHeight,e.object.matrix)}else e.object.isOrthographicCamera?(Oe(b*(e.object.right-e.object.left)/e.object.zoom/A.clientWidth,e.object.matrix),we(y*(e.object.top-e.object.bottom)/e.object.zoom/A.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}}();function ue(t){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?m/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function Ae(t){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?m*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function Ce(t){if(!e.zoomToCursor)return;Y=!0;const u=e.domElement.getBoundingClientRect(),b=t.clientX-u.left,y=t.clientY-u.top,A=u.width,z=u.height;f.x=b/A*2-1,f.y=-(y/z)*2+1,g.set(f.x,f.y,1).unproject(e.object).sub(e.object.position).normalize()}function fe(t){return Math.max(e.minDistance,Math.min(e.maxDistance,t))}function je(t){_.set(t.clientX,t.clientY)}function at(t){Ce(t),w.set(t.clientX,t.clientY)}function De(t){E.set(t.clientX,t.clientY)}function st(t){T.set(t.clientX,t.clientY),h.subVectors(T,_).multiplyScalar(e.rotateSpeed);const u=e.domElement;V(2*Math.PI*h.x/u.clientHeight),ee(2*Math.PI*h.y/u.clientHeight),_.copy(T),e.update()}function it(t){C.set(t.clientX,t.clientY),D.subVectors(C,w),D.y>0?ue($()):D.y<0&&Ae($()),w.copy(C),e.update()}function rt(t){M.set(t.clientX,t.clientY),d.subVectors(M,E).multiplyScalar(e.panSpeed),U(d.x,d.y),E.copy(M),e.update()}function lt(t){Ce(t),t.deltaY<0?Ae($()):t.deltaY>0&&ue($()),e.update()}function ct(t){let u=!1;switch(t.code){case e.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?ee(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(0,e.keyPanSpeed),u=!0;break;case e.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?ee(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(0,-e.keyPanSpeed),u=!0;break;case e.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?V(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(e.keyPanSpeed,0),u=!0;break;case e.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?V(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(-e.keyPanSpeed,0),u=!0;break}u&&(t.preventDefault(),e.update())}function Re(){if(p.length===1)_.set(p[0].pageX,p[0].pageY);else{const t=.5*(p[0].pageX+p[1].pageX),u=.5*(p[0].pageY+p[1].pageY);_.set(t,u)}}function Ie(){if(p.length===1)E.set(p[0].pageX,p[0].pageY);else{const t=.5*(p[0].pageX+p[1].pageX),u=.5*(p[0].pageY+p[1].pageY);E.set(t,u)}}function Se(){const t=p[0].pageX-p[1].pageX,u=p[0].pageY-p[1].pageY,b=Math.sqrt(t*t+u*u);w.set(0,b)}function ut(){e.enableZoom&&Se(),e.enablePan&&Ie()}function ft(){e.enableZoom&&Se(),e.enableRotate&&Re()}function Le(t){if(p.length==1)T.set(t.pageX,t.pageY);else{const b=pe(t),y=.5*(t.pageX+b.x),A=.5*(t.pageY+b.y);T.set(y,A)}h.subVectors(T,_).multiplyScalar(e.rotateSpeed);const u=e.domElement;V(2*Math.PI*h.x/u.clientHeight),ee(2*Math.PI*h.y/u.clientHeight),_.copy(T)}function Ne(t){if(p.length===1)M.set(t.pageX,t.pageY);else{const u=pe(t),b=.5*(t.pageX+u.x),y=.5*(t.pageY+u.y);M.set(b,y)}d.subVectors(M,E).multiplyScalar(e.panSpeed),U(d.x,d.y),E.copy(M)}function ke(t){const u=pe(t),b=t.pageX-u.x,y=t.pageY-u.y,A=Math.sqrt(b*b+y*y);C.set(0,A),D.set(0,Math.pow(C.y/w.y,e.zoomSpeed)),ue(D.y),w.copy(C)}function dt(t){e.enableZoom&&ke(t),e.enablePan&&Ne(t)}function mt(t){e.enableZoom&&ke(t),e.enableRotate&&Le(t)}function Ye(t){e.enabled!==!1&&(p.length===0&&(e.domElement.setPointerCapture(t.pointerId),e.domElement.addEventListener("pointermove",de),e.domElement.addEventListener("pointerup",B)),_t(t),t.pointerType==="touch"?gt(t):pt(t))}function de(t){e.enabled!==!1&&(t.pointerType==="touch"?bt(t):ht(t))}function B(t){yt(t),p.length===0&&(e.domElement.releasePointerCapture(t.pointerId),e.domElement.removeEventListener("pointermove",de),e.domElement.removeEventListener("pointerup",B)),e.dispatchEvent(Qe),a=n.NONE}function pt(t){let u;switch(t.button){case 0:u=e.mouseButtons.LEFT;break;case 1:u=e.mouseButtons.MIDDLE;break;case 2:u=e.mouseButtons.RIGHT;break;default:u=-1}switch(u){case H.DOLLY:if(e.enableZoom===!1)return;at(t),a=n.DOLLY;break;case H.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enablePan===!1)return;De(t),a=n.PAN}else{if(e.enableRotate===!1)return;je(t),a=n.ROTATE}break;case H.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enableRotate===!1)return;je(t),a=n.ROTATE}else{if(e.enablePan===!1)return;De(t),a=n.PAN}break;default:a=n.NONE}a!==n.NONE&&e.dispatchEvent(be)}function ht(t){switch(a){case n.ROTATE:if(e.enableRotate===!1)return;st(t);break;case n.DOLLY:if(e.enableZoom===!1)return;it(t);break;case n.PAN:if(e.enablePan===!1)return;rt(t);break}}function Ue(t){e.enabled===!1||e.enableZoom===!1||a!==n.NONE||(t.preventDefault(),e.dispatchEvent(be),lt(t),e.dispatchEvent(Qe))}function me(t){e.enabled===!1||e.enablePan===!1||ct(t)}function gt(t){switch(He(t),p.length){case 1:switch(e.touches.ONE){case x.ROTATE:if(e.enableRotate===!1)return;Re(),a=n.TOUCH_ROTATE;break;case x.PAN:if(e.enablePan===!1)return;Ie(),a=n.TOUCH_PAN;break;default:a=n.NONE}break;case 2:switch(e.touches.TWO){case x.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;ut(),a=n.TOUCH_DOLLY_PAN;break;case x.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;ft(),a=n.TOUCH_DOLLY_ROTATE;break;default:a=n.NONE}break;default:a=n.NONE}a!==n.NONE&&e.dispatchEvent(be)}function bt(t){switch(He(t),a){case n.TOUCH_ROTATE:if(e.enableRotate===!1)return;Le(t),e.update();break;case n.TOUCH_PAN:if(e.enablePan===!1)return;Ne(t),e.update();break;case n.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;dt(t),e.update();break;case n.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;mt(t),e.update();break;default:a=n.NONE}}function ze(t){e.enabled!==!1&&t.preventDefault()}function _t(t){p.push(t)}function yt(t){delete J[t.pointerId];for(let u=0;u<p.length;u++)if(p[u].pointerId==t.pointerId){p.splice(u,1);return}}function He(t){let u=J[t.pointerId];u===void 0&&(u=new j,J[t.pointerId]=u),u.set(t.pageX,t.pageY)}function pe(t){const u=t.pointerId===p[0].pointerId?p[1]:p[0];return J[u.pointerId]}e.domElement.addEventListener("contextmenu",ze),e.domElement.addEventListener("pointerdown",Ye),e.domElement.addEventListener("pointercancel",B),e.domElement.addEventListener("wheel",Ue,{passive:!1}),this.update()}};const Ut=s=>({ref:s&1}),Je=s=>({ref:s[0]});function zt(s){let o;const r=s[7].default,e=ae(r,s,s[10],Je);return{c(){e&&e.c()},l(n){e&&e.l(n)},m(n,a){e&&e.m(n,a),o=!0},p(n,a){e&&e.p&&(!o||a&1025)&&se(e,r,n,n[10],o?re(r,n[10],a,Ut):ie(n[10]),Je)},i(n){o||(R(e,n),o=!0)},o(n){I(e,n),o=!1},d(n){e&&e.d(n)}}}function Ht(s){let o,r;const e=[{is:s[0]},s[6]];let n={$$slots:{default:[zt,({ref:a})=>({0:a}),({ref:a})=>a?1:0]},$$scope:{ctx:s}};for(let a=0;a<e.length;a+=1)n=N(n,e[a]);return o=new v({props:n}),s[8](o),o.$on("change",s[3]),o.$on("create",s[9]),{c(){F(o.$$.fragment)},l(a){Z(o.$$.fragment,a)},m(a,c){X(o,a,c),r=!0},p(a,[c]){const i=c&65?Pe(e,[c&1&&{is:a[0]},c&64&&Me(a[6])]):{};c&1025&&(i.$$scope={dirty:c,ctx:a}),o.$set(i)},i(a){r||(R(o.$$.fragment,a),r=!0)},o(a){I(o.$$.fragment,a),r=!1},d(a){s[8](null),W(o,a)}}}function xt(s,o,r){const e=["ref"];let n=K(o,e),a,c,{$$slots:i={},$$scope:l}=o;const m=Rt();Q(s,m,g=>r(11,a=g));const P=g=>g.isCamera,{renderer:_,invalidate:T}=It();if(!P(a))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const h=new Yt(a,_.domElement),{start:E,stop:M}=tt(()=>h.update(),{autoStart:!1}),d=Te();Q(s,d,g=>r(1,c=g));const{orbitControls:w}=St();function C(g){Ee[g?"unshift":"push"](()=>{c=g,d.set(c)})}const D=({ref:g,cleanup:f})=>{w.set(g),g.update(),f(()=>{w.set(void 0)})};return s.$$set=g=>{o=N(N({},o),ye(g)),r(6,n=K(o,e)),"$$scope"in g&&r(10,l=g.$$scope)},s.$$.update=()=>{n.autoRotate||n.enableDamping?E():M()},[h,c,m,T,d,w,n,i,C,D,l]}class ln extends le{constructor(o){super(),ce(this,o,xt,Ht,oe,{ref:0})}get ref(){return this.$$.ctx[0]}}const nt=s=>`threlte-instanced-mesh-${s}`,Kt=(s,o)=>{const r={instancedMesh:Ve(s),addInstance(e){r.instances.update(n=>(n.push(e),n))},removeInstance(e){r.instances.update(n=>{const a=n.indexOf(e);return a>-1&&n.splice(a,1),n})},instances:Ve([])};return Mt(nt(o),r),r},Ft=s=>{const o=Pt(nt(s));if(!o)throw new Error(`No <InstancedMesh> component found for id ${s}`);return o};function Zt(s){let o,r,e,n,a;o=new v.InstancedBufferAttribute({props:{attach:"instanceMatrix",count:s[1].length/16,array:s[1],itemSize:16,usage:Be}}),e=new v.InstancedBufferAttribute({props:{attach:"instanceColor",count:s[2].length/3,array:s[2],itemSize:3,usage:Be}});const c=s[10].default,i=ae(c,s,s[9],null);return{c(){F(o.$$.fragment),r=Ke(),F(e.$$.fragment),n=Ke(),i&&i.c()},l(l){Z(o.$$.fragment,l),r=Fe(l),Z(e.$$.fragment,l),n=Fe(l),i&&i.l(l)},m(l,m){X(o,l,m),Ze(l,r,m),X(e,l,m),Ze(l,n,m),i&&i.m(l,m),a=!0},p(l,[m]){i&&i.p&&(!a||m&512)&&se(i,c,l,l[9],a?re(c,l[9],m,null):ie(l[9]),null)},i(l){a||(R(o.$$.fragment,l),R(e.$$.fragment,l),R(i,l),a=!0)},o(l){I(o.$$.fragment,l),I(e.$$.fragment,l),I(i,l),a=!1},d(l){l&&(Xe(r),Xe(n)),W(o,l),W(e,l),i&&i.d(l)}}}function Xt(s,o,r){let e,{$$slots:n={},$$scope:a}=o,{instancedMesh:c}=o,{id:i}=o,{limit:l}=o,{range:m}=o,{update:P}=o;const{instances:_}=Kt(c,i);Q(s,_,f=>r(8,e=f));const T=new ge,h=new Float32Array(l*16);for(let f=0;f<l;f++)T.identity().toArray(h,f*16);const E=new Float32Array(l*3).fill(1),M=new ge,d=new ge,w=new O,C=new _e,D=new O;let g=!1;return tt(()=>{if(c.updateMatrix(),P||!g){c.updateMatrixWorld(),M.copy(c.matrixWorld).invert(),c.instanceColor&&r(3,c.instanceColor.needsUpdate=!0,c),r(3,c.instanceMatrix.needsUpdate=!0,c);for(let f=0;f<_.current.length;f++){const Y=_.current[f];Y.matrixWorld.decompose(w,C,D),d.compose(w,C,D).premultiply(M),d.toArray(h,f*16),Y.color.toArray(E,f*3)}g=!0}}),s.$$set=f=>{"instancedMesh"in f&&r(3,c=f.instancedMesh),"id"in f&&r(4,i=f.id),"limit"in f&&r(5,l=f.limit),"range"in f&&r(6,m=f.range),"update"in f&&r(7,P=f.update),"$$scope"in f&&r(9,a=f.$$scope)},s.$$.update=()=>{if(s.$$.dirty&360){const f=Math.min(l,m!==void 0?m:l,e.length);r(3,c.count=f,c),Ge>=159?(c.instanceMatrix.clearUpdateRanges(),c.instanceMatrix.addUpdateRange(0,f*16)):r(3,c.instanceMatrix.updateRange.count=f*16,c),c.instanceColor&&(Ge>=159?(c.instanceColor.clearUpdateRanges(),c.instanceColor.addUpdateRange(0,f*3)):r(3,c.instanceColor.updateRange.count=f*3,c))}},[_,h,E,c,i,l,m,P,e,a,n]}class Wt extends le{constructor(o){super(),ce(this,o,Xt,Zt,oe,{instancedMesh:3,id:4,limit:5,range:6,update:7})}}const Vt=s=>({}),$e=s=>({ref:s[4]});function Bt(s){let o;const r=s[9].default,e=ae(r,s,s[11],$e);return{c(){e&&e.c()},l(n){e&&e.l(n)},m(n,a){e&&e.m(n,a),o=!0},p(n,a){e&&e.p&&(!o||a&2048)&&se(e,r,n,n[11],o?re(r,n[11],a,Vt):ie(n[11]),$e)},i(n){o||(R(e,n),o=!0)},o(n){I(e,n),o=!1},d(n){e&&e.d(n)}}}function Gt(s){let o,r;return o=new Wt({props:{instancedMesh:s[4],id:s[0],limit:s[1],range:s[2],update:s[3],$$slots:{default:[Bt]},$$scope:{ctx:s}}}),{c(){F(o.$$.fragment)},l(e){Z(o.$$.fragment,e)},m(e,n){X(o,e,n),r=!0},p(e,n){const a={};n&1&&(a.id=e[0]),n&2&&(a.limit=e[1]),n&4&&(a.range=e[2]),n&8&&(a.update=e[3]),n&2048&&(a.$$scope={dirty:n,ctx:e}),o.$set(a)},i(e){r||(R(o.$$.fragment,e),r=!0)},o(e){I(o.$$.fragment,e),r=!1},d(e){W(o,e)}}}function qt(s){let o,r,e;const n=[{is:s[4]},{raycast:Qt},{matrixAutoUpdate:!1},{args:s[7]},s[8]];function a(i){s[10](i)}let c={$$slots:{default:[Gt]},$$scope:{ctx:s}};for(let i=0;i<n.length;i+=1)c=N(c,n[i]);return s[5]!==void 0&&(c.bind=s[5]),o=new v({props:c}),Ee.push(()=>wt(o,"bind",a)),{c(){F(o.$$.fragment)},l(i){Z(o.$$.fragment,i)},m(i,l){X(o,i,l),e=!0},p(i,[l]){const m=l&400?Pe(n,[l&16&&{is:i[4]},n[1],n[2],l&128&&{args:i[7]},l&256&&Me(i[8])]):{};l&2063&&(m.$$scope={dirty:l,ctx:i}),!r&&l&32&&(r=!0,m.bind=i[5],Tt(()=>r=!1)),o.$set(m)},i(i){e||(R(o.$$.fragment,i),e=!0)},o(i){I(o.$$.fragment,i),e=!1},d(i){W(o,i)}}}const Qt=()=>null;function vt(s,o,r){const e=["id","limit","range","update","ref"];let n=K(o,e),a,{$$slots:c={},$$scope:i}=o,{id:l="default"}=o,{limit:m=1e3}=o,{range:P=1e3}=o,{update:_=!0}=o;const T=new Lt(null,null,0),h=Te();Q(s,h,d=>r(5,a=d));const E=[null,null,0];function M(d){a=d,h.set(a)}return s.$$set=d=>{o=N(N({},o),ye(d)),r(8,n=K(o,e)),"id"in d&&r(0,l=d.id),"limit"in d&&r(1,m=d.limit),"range"in d&&r(2,P=d.range),"update"in d&&r(3,_=d.update),"$$scope"in d&&r(11,i=d.$$scope)},[l,m,P,_,T,a,h,E,n,c,M,i]}class cn extends le{constructor(o){super(),ce(this,o,vt,qt,oe,{id:0,limit:1,range:2,update:3,ref:4})}get ref(){return this.$$.ctx[4]}}const Jt=s=>({}),et=s=>({ref:s[0]});function $t(s){let o;const r=s[5].default,e=ae(r,s,s[7],et);return{c(){e&&e.c()},l(n){e&&e.l(n)},m(n,a){e&&e.m(n,a),o=!0},p(n,a){e&&e.p&&(!o||a&128)&&se(e,r,n,n[7],o?re(r,n[7],a,Jt):ie(n[7]),et)},i(n){o||(R(e,n),o=!0)},o(n){I(e,n),o=!1},d(n){e&&e.d(n)}}}function en(s){let o,r;const e=[{is:s[0]},s[3]];let n={$$slots:{default:[$t]},$$scope:{ctx:s}};for(let a=0;a<e.length;a+=1)n=N(n,e[a]);return o=new v({props:n}),s[6](o),{c(){F(o.$$.fragment)},l(a){Z(o.$$.fragment,a)},m(a,c){X(o,a,c),r=!0},p(a,[c]){const i=c&9?Pe(e,[c&1&&{is:a[0]},c&8&&Me(a[3])]):{};c&128&&(i.$$scope={dirty:c,ctx:a}),o.$set(i)},i(a){r||(R(o.$$.fragment,a),r=!0)},o(a){I(o.$$.fragment,a),r=!1},d(a){s[6](null),W(o,a)}}}function tn(s,o,r){const e=["id","ref"];let n=K(o,e),a,{$$slots:c={},$$scope:i}=o,{id:l="default"}=o;const{addInstance:m,removeInstance:P,instancedMesh:_,instances:T}=Ft(l),h=new Nt(_,T);m(h),Ot(()=>{P(h)});const E=Te();Q(s,E,d=>r(1,a=d));function M(d){Ee[d?"unshift":"push"](()=>{a=d,E.set(a)})}return s.$$set=d=>{o=N(N({},o),ye(d)),r(3,n=K(o,e)),"id"in d&&r(4,l=d.id),"$$scope"in d&&r(7,i=d.$$scope)},[h,a,E,n,l,c,M,i]}class un extends le{constructor(o){super(),ce(this,o,tn,en,oe,{id:4,ref:0})}get ref(){return this.$$.ctx[0]}}export{cn as I,ln as O,un as a};