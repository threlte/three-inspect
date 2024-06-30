import{s as $e,Q as oe,R as we,p as K,S as Ee,B,u as Ae,l as b,m as y,i as T,v as Le,w as Ce,x as Pe,d as v,T as R,n as O}from"../chunks/scheduler.BmPgHBB7.js";import{S as ue,i as ie,c as l,b as g,m as c,a as p,t as _,d as h,f as D}from"../chunks/index.BAVD_YBS.js";import{C as Ge}from"../chunks/index.DltBFfc5.js";import{u as de,e as ze,a as M,g as ke,f as Ne,h as qe,i as Be,T as Ke,C as Ie,j as Re,k as De,V as Oe,l as Fe,m as He,n as Ue,o as Ve,R as Me}from"../chunks/Threlte.CLWpA3Np.js";import{u as Qe}from"../chunks/useLoader.UwCOlv0u.js";const X=(s,t)=>{const a=Qe(ze,t),{renderer:r}=de();return a.load(s,{...t,transform:f=>(f.colorSpace=r.outputColorSpace,f.needsUpdate=!0,t?.transform?.(f)??f)})},We=s=>({ref:s&4096}),Se=s=>({ref:s[12]});function Je(s){let t,a,r,f,e;t=new M.EdgesGeometry({props:{args:[s[2],s[0]]}}),r=new M.LineBasicMaterial({props:{color:s[1]}});const o=s[9].default,m=Ae(o,s,s[11],Se);return{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment),f=b(),m&&m.c()},l($){g(t.$$.fragment,$),a=y($),g(r.$$.fragment,$),f=y($),m&&m.l($)},m($,S){c(t,$,S),T($,a,S),c(r,$,S),T($,f,S),m&&m.m($,S),e=!0},p($,S){const L={};S&5&&(L.args=[$[2],$[0]]),t.$set(L);const E={};S&2&&(E.color=$[1]),r.$set(E),m&&m.p&&(!e||S&6144)&&Le(m,o,$,$[11],e?Pe(o,$[11],S,We):Ce($[11]),Se)},i($){e||(p(t.$$.fragment,$),p(r.$$.fragment,$),p(m,$),e=!0)},o($){_(t.$$.fragment,$),_(r.$$.fragment,$),_(m,$),e=!1},d($){$&&(v(a),v(f)),h(t,$),h(r,$),m&&m.d($)}}}function Xe(s){let t,a;const r=[s[6]];let f={$$slots:{default:[Je,({ref:e})=>({12:e}),({ref:e})=>e?4096:0]},$$scope:{ctx:s}};for(let e=0;e<r.length;e+=1)f=oe(f,r[e]);return t=new M.LineSegments({props:f}),s[10](t),{c(){l(t.$$.fragment)},l(e){g(t.$$.fragment,e)},m(e,o){c(t,e,o),a=!0},p(e,[o]){const m=o&64?ke(r,[Ne(e[6])]):{};o&6151&&(m.$$scope={dirty:o,ctx:e}),t.$set(m)},i(e){a||(p(t.$$.fragment,e),a=!0)},o(e){_(t.$$.fragment,e),a=!1},d(e){s[10](null),h(t,e)}}}function Ye(s,t,a){let r,f;const e=["thresholdAngle","color"];let o=we(t,e),m,$,{$$slots:S={},$$scope:L}=t,{thresholdAngle:E=void 0}=t,{color:k=void 0}=t;const w=qe();if(K(s,w,d=>a(8,m=d)),!m||m.type!=="Mesh")throw new Error("Edges: component must be a child of a Mesh");const j=Be();K(s,j,d=>a(3,$=d));function N(d){B[d?"unshift":"push"](()=>{$=d,j.set($)})}return s.$$set=d=>{t=oe(oe({},t),Ee(d)),a(6,o=we(t,e)),"thresholdAngle"in d&&a(0,E=d.thresholdAngle),"color"in d&&a(1,k=d.color),"$$scope"in d&&a(11,L=d.$$scope)},s.$$.update=()=>{s.$$.dirty&256&&a(7,r=m),s.$$.dirty&128&&a(2,f="clone"in r.geometry?r.geometry.clone():r.geometry)},[E,k,f,$,w,j,o,r,m,S,N,L]}class Ze extends ue{constructor(t){super(),ie(this,t,Ye,Xe,$e,{thresholdAngle:0,color:1})}}function xe(s){let t,a,r,f;return t=new M.BoxGeometry({props:{args:[20,5,.1]}}),r=new M.MeshPhysicalMaterial({props:{color:"lightslategrey",transparent:!0,opacity:.7,envMap:s[7],envMapIntensity:1,reflectivity:1,clearcoat:1,clearcoatRoughness:.08,transmission:1}}),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment)},l(e){g(t.$$.fragment,e),a=y(e),g(r.$$.fragment,e)},m(e,o){c(t,e,o),T(e,a,o),c(r,e,o),f=!0},p:O,i(e){f||(p(t.$$.fragment,e),p(r.$$.fragment,e),f=!0)},o(e){_(t.$$.fragment,e),_(r.$$.fragment,e),f=!1},d(e){e&&v(a),h(t,e),h(r,e)}}}function et(s){let t,a,r,f;return t=new M.BoxGeometry({}),r=new M.ShaderMaterial({props:{uniforms:{color1:{value:{x:1,y:1,z:0}},color2:{value:{x:0,y:1,z:1}}}}}),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment)},l(e){g(t.$$.fragment,e),a=y(e),g(r.$$.fragment,e)},m(e,o){c(t,e,o),T(e,a,o),c(r,e,o),f=!0},p:O,i(e){f||(p(t.$$.fragment,e),p(r.$$.fragment,e),f=!0)},o(e){_(t.$$.fragment,e),_(r.$$.fragment,e),f=!1},d(e){e&&v(a),h(t,e),h(r,e)}}}function tt(s){let t,a;return t=new M.Mesh({props:{name:"Box",castShadow:!0,receiveShadow:!0,$$slots:{default:[et]},$$scope:{ctx:s}}}),{c(){l(t.$$.fragment)},l(r){g(t.$$.fragment,r)},m(r,f){c(t,r,f),a=!0},p(r,f){const e={};f&33554432&&(e.$$scope={dirty:f,ctx:r}),t.$set(e)},i(r){a||(p(t.$$.fragment,r),a=!0)},o(r){_(t.$$.fragment,r),a=!1},d(r){h(t,r)}}}function rt(s){let t,a,r,f;return t=new M.ConeGeometry({props:{args:[.5,1,30,30]}}),r=new M.MeshToonMaterial({props:{color:"hotpink"}}),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment)},l(e){g(t.$$.fragment,e),a=y(e),g(r.$$.fragment,e)},m(e,o){c(t,e,o),T(e,a,o),c(r,e,o),f=!0},p:O,i(e){f||(p(t.$$.fragment,e),p(r.$$.fragment,e),f=!0)},o(e){_(t.$$.fragment,e),_(r.$$.fragment,e),f=!1},d(e){e&&v(a),h(t,e),h(r,e)}}}function nt(s){let t,a,r,f;return t=new M.SphereGeometry({props:{args:[.5,30,30]}}),r=new M.MeshStandardMaterial({props:{color:"lightblue",envMap:s[7],envMapIntensity:1,roughness:0,metalness:1}}),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment)},l(e){g(t.$$.fragment,e),a=y(e),g(r.$$.fragment,e)},m(e,o){c(t,e,o),T(e,a,o),c(r,e,o),f=!0},p:O,i(e){f||(p(t.$$.fragment,e),p(r.$$.fragment,e),f=!0)},o(e){_(t.$$.fragment,e),_(r.$$.fragment,e),f=!1},d(e){e&&v(a),h(t,e),h(r,e)}}}function st(s){let t,a,r,f;return t=new M.TorusKnotGeometry({props:{args:[.5,.2,70,70]}}),r=new M.MeshStandardMaterial({props:{color:"darksalmon",envMap:s[7],envMapIntensity:1,map:s[1],aoMap:s[2],displacementMap:s[3],displacementScale:.005,normalMap:s[4],roughnessMap:s[5],metalnessMap:s[6],roughness:.17,metalness:.95}}),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment)},l(e){g(t.$$.fragment,e),a=y(e),g(r.$$.fragment,e)},m(e,o){c(t,e,o),T(e,a,o),c(r,e,o),f=!0},p(e,o){const m={};o&2&&(m.map=e[1]),o&4&&(m.aoMap=e[2]),o&8&&(m.displacementMap=e[3]),o&16&&(m.normalMap=e[4]),o&32&&(m.roughnessMap=e[5]),o&64&&(m.metalnessMap=e[6]),r.$set(m)},i(e){f||(p(t.$$.fragment,e),p(r.$$.fragment,e),f=!0)},o(e){_(t.$$.fragment,e),_(r.$$.fragment,e),f=!1},d(e){e&&v(a),h(t,e),h(r,e)}}}function at(s){let t,a,r,f;return t=new M.TorusGeometry({props:{args:[.5,.2,10,20]}}),r=new M.MeshPhysicalMaterial({props:{envMap:s[7],envMapIntensity:1,roughness:.15,metalness:1}}),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment)},l(e){g(t.$$.fragment,e),a=y(e),g(r.$$.fragment,e)},m(e,o){c(t,e,o),T(e,a,o),c(r,e,o),f=!0},p:O,i(e){f||(p(t.$$.fragment,e),p(r.$$.fragment,e),f=!0)},o(e){_(t.$$.fragment,e),_(r.$$.fragment,e),f=!1},d(e){e&&v(a),h(t,e),h(r,e)}}}function ft(s){let t,a,r,f,e,o;return t=new M.CylinderGeometry({props:{args:[.5,.5,1,20]}}),r=new M.MeshToonMaterial({props:{color:"cyan"}}),e=new Ze({}),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment),f=b(),l(e.$$.fragment)},l(m){g(t.$$.fragment,m),a=y(m),g(r.$$.fragment,m),f=y(m),g(e.$$.fragment,m)},m(m,$){c(t,m,$),T(m,a,$),c(r,m,$),T(m,f,$),c(e,m,$),o=!0},p:O,i(m){o||(p(t.$$.fragment,m),p(r.$$.fragment,m),p(e.$$.fragment,m),o=!0)},o(m){_(t.$$.fragment,m),_(r.$$.fragment,m),_(e.$$.fragment,m),o=!1},d(m){m&&(v(a),v(f)),h(t,m),h(r,m),h(e,m)}}}function mt(s){let t,a,r,f;return t=new M.BoxGeometry({props:{args:[1,1,.01]}}),r=new M.MeshPhysicalMaterial({}),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment)},l(e){g(t.$$.fragment,e),a=y(e),g(r.$$.fragment,e)},m(e,o){c(t,e,o),T(e,a,o),c(r,e,o),f=!0},p:O,i(e){f||(p(t.$$.fragment,e),p(r.$$.fragment,e),f=!0)},o(e){_(t.$$.fragment,e),_(r.$$.fragment,e),f=!1},d(e){e&&v(a),h(t,e),h(r,e)}}}function ot(s){let t,a,r,f,e,o,m,$,S,L,E,k,w,j,N,d,C,F,I,P,Y,H,G,Z,U,z,x,u,A,V,Q;t=new Ke({props:{position:"draggable"}}),r=new M.AmbientLight({props:{intensity:.8}}),e=new M.PerspectiveCamera({props:{fov:80,far:300,position:[0,2,10],makeDefault:!0}}),m=new M.DirectionalLight({props:{castShadow:!0,intensity:1.5,position:[3,5,3],"shadow.mapSize.height":512,"shadow.mapSize.width":512,"shadow.camera.far":30}}),S=new M.Mesh({props:{name:"Floor","rotation.x":Math.PI/2,"position.y":-1,castShadow:!0,receiveShadow:!0,$$slots:{default:[xe]},$$scope:{ctx:s}}});function W(n){s[14](n)}let J={$$slots:{default:[tt]},$$scope:{ctx:s}};s[0][0]!==void 0&&(J.ref=s[0][0]),E=new M.Object3D({props:J}),B.push(()=>D(E,"ref",W));function ee(n){s[15](n)}let q={name:"Cone","position.x":2,castShadow:!0,receiveShadow:!0,$$slots:{default:[rt]},$$scope:{ctx:s}};s[0][1]!==void 0&&(q.ref=s[0][1]),j=new M.Mesh({props:q}),B.push(()=>D(j,"ref",ee));function be(n){s[16](n)}let pe={name:"Sphere","position.x":-2,castShadow:!0,receiveShadow:!0,$$slots:{default:[nt]},$$scope:{ctx:s}};s[0][2]!==void 0&&(pe.ref=s[0][2]),C=new M.Mesh({props:pe}),B.push(()=>D(C,"ref",be));function ye(n){s[17](n)}let _e={name:"Torus Knot","position.x":-4,castShadow:!0,receiveShadow:!0,$$slots:{default:[st]},$$scope:{ctx:s}};s[0][3]!==void 0&&(_e.ref=s[0][3]),P=new M.Mesh({props:_e}),B.push(()=>D(P,"ref",ye));function Te(n){s[18](n)}let le={name:"Donut","position.x":4,castShadow:!0,receiveShadow:!0,$$slots:{default:[at]},$$scope:{ctx:s}};s[0][4]!==void 0&&(le.ref=s[0][4]),G=new M.Mesh({props:le}),B.push(()=>D(G,"ref",Te));function ve(n){s[19](n)}let ge={name:"Cylinder","position.x":6,castShadow:!0,receiveShadow:!0,$$slots:{default:[ft]},$$scope:{ctx:s}};s[0][5]!==void 0&&(ge.ref=s[0][5]),z=new M.Mesh({props:ge}),B.push(()=>D(z,"ref",ve));function je(n){s[20](n)}let ce={name:"Plane","position.x":-6,castShadow:!0,receiveShadow:!0,$$slots:{default:[mt]},$$scope:{ctx:s}};return s[0][6]!==void 0&&(ce.ref=s[0][6]),A=new M.Mesh({props:ce}),B.push(()=>D(A,"ref",je)),{c(){l(t.$$.fragment),a=b(),l(r.$$.fragment),f=b(),l(e.$$.fragment),o=b(),l(m.$$.fragment),$=b(),l(S.$$.fragment),L=b(),l(E.$$.fragment),w=b(),l(j.$$.fragment),d=b(),l(C.$$.fragment),I=b(),l(P.$$.fragment),H=b(),l(G.$$.fragment),U=b(),l(z.$$.fragment),u=b(),l(A.$$.fragment)},l(n){g(t.$$.fragment,n),a=y(n),g(r.$$.fragment,n),f=y(n),g(e.$$.fragment,n),o=y(n),g(m.$$.fragment,n),$=y(n),g(S.$$.fragment,n),L=y(n),g(E.$$.fragment,n),w=y(n),g(j.$$.fragment,n),d=y(n),g(C.$$.fragment,n),I=y(n),g(P.$$.fragment,n),H=y(n),g(G.$$.fragment,n),U=y(n),g(z.$$.fragment,n),u=y(n),g(A.$$.fragment,n)},m(n,i){c(t,n,i),T(n,a,i),c(r,n,i),T(n,f,i),c(e,n,i),T(n,o,i),c(m,n,i),T(n,$,i),c(S,n,i),T(n,L,i),c(E,n,i),T(n,w,i),c(j,n,i),T(n,d,i),c(C,n,i),T(n,I,i),c(P,n,i),T(n,H,i),c(G,n,i),T(n,U,i),c(z,n,i),T(n,u,i),c(A,n,i),Q=!0},p(n,[i]){const he={};i&33554432&&(he.$$scope={dirty:i,ctx:n}),S.$set(he);const te={};i&33554432&&(te.$$scope={dirty:i,ctx:n}),!k&&i&1&&(k=!0,te.ref=n[0][0],R(()=>k=!1)),E.$set(te);const re={};i&33554432&&(re.$$scope={dirty:i,ctx:n}),!N&&i&1&&(N=!0,re.ref=n[0][1],R(()=>N=!1)),j.$set(re);const ne={};i&33554432&&(ne.$$scope={dirty:i,ctx:n}),!F&&i&1&&(F=!0,ne.ref=n[0][2],R(()=>F=!1)),C.$set(ne);const se={};i&33554558&&(se.$$scope={dirty:i,ctx:n}),!Y&&i&1&&(Y=!0,se.ref=n[0][3],R(()=>Y=!1)),P.$set(se);const ae={};i&33554432&&(ae.$$scope={dirty:i,ctx:n}),!Z&&i&1&&(Z=!0,ae.ref=n[0][4],R(()=>Z=!1)),G.$set(ae);const fe={};i&33554432&&(fe.$$scope={dirty:i,ctx:n}),!x&&i&1&&(x=!0,fe.ref=n[0][5],R(()=>x=!1)),z.$set(fe);const me={};i&33554432&&(me.$$scope={dirty:i,ctx:n}),!V&&i&1&&(V=!0,me.ref=n[0][6],R(()=>V=!1)),A.$set(me)},i(n){Q||(p(t.$$.fragment,n),p(r.$$.fragment,n),p(e.$$.fragment,n),p(m.$$.fragment,n),p(S.$$.fragment,n),p(E.$$.fragment,n),p(j.$$.fragment,n),p(C.$$.fragment,n),p(P.$$.fragment,n),p(G.$$.fragment,n),p(z.$$.fragment,n),p(A.$$.fragment,n),Q=!0)},o(n){_(t.$$.fragment,n),_(r.$$.fragment,n),_(e.$$.fragment,n),_(m.$$.fragment,n),_(S.$$.fragment,n),_(E.$$.fragment,n),_(j.$$.fragment,n),_(C.$$.fragment,n),_(P.$$.fragment,n),_(G.$$.fragment,n),_(z.$$.fragment,n),_(A.$$.fragment,n),Q=!1},d(n){n&&(v(a),v(f),v(o),v($),v(L),v(w),v(d),v(I),v(H),v(U),v(u)),h(t,n),h(r,n),h(e,n),h(m,n),h(S,n),h(E,n),h(j,n),h(C,n),h(P,n),h(G,n),h(z,n),h(A,n)}}}function $t(s,t,a){let r,f,e,o,m,$;const{scene:S,renderer:L}=de();S.background=new Ie("#222");const k=new Re().load(["/textures/environmentMaps/0/px.jpg","/textures/environmentMaps/0/nx.jpg","/textures/environmentMaps/0/py.jpg","/textures/environmentMaps/0/ny.jpg","/textures/environmentMaps/0/pz.jpg","/textures/environmentMaps/0/nz.jpg"]),w=[];{const u=new De,A=new Oe,V=1e4,Q=100,W=new Float32Array(V*3);for(let q=0;q<V*3;q+=3)A.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(Q),W[q+0]=A.x,W[q+1]=A.y,W[q+2]=A.z;u.setAttribute("position",new Fe(W,3)),u.translate(0,.5,0);const J=new He;J.size=.2,J.sizeAttenuation=!0;const ee=new Ue(u,J);ee.name="Stars",S.add(ee)}Ve(u=>{for(const A of w)A.rotation.y+=u});const j=u=>(u.wrapS=Me,u.wrapT=Me,u.repeat.x=10,u.anisotropy=L.capabilities.getMaxAnisotropy(),u),N=X("/textures/metal/weave_COL_1K_METALNESS.jpg",{transform:j});K(s,N,u=>a(1,r=u));const d=X("/textures/metal/weave_AO_1K_METALNESS.jpg",{transform:j});K(s,d,u=>a(2,f=u));const C=X("/textures/metal/weave_DISP_1K_METALNESS.jpg",{transform:j});K(s,C,u=>a(3,e=u));const F=X("/textures/metal/weave_NRM_1K_METALNESS.jpg",{transform:j});K(s,F,u=>a(4,o=u));const I=X("/textures/metal/weave_ROUGHNESS_1K_METALNESS.jpg",{transform:j});K(s,I,u=>a(5,m=u));const P=X("/textures/metal/weave_METALNESS_1K_METALNESS.jpg",{transform:j});K(s,P,u=>a(6,$=u));function Y(u){s.$$.not_equal(w[0],u)&&(w[0]=u,a(0,w))}function H(u){s.$$.not_equal(w[1],u)&&(w[1]=u,a(0,w))}function G(u){s.$$.not_equal(w[2],u)&&(w[2]=u,a(0,w))}function Z(u){s.$$.not_equal(w[3],u)&&(w[3]=u,a(0,w))}function U(u){s.$$.not_equal(w[4],u)&&(w[4]=u,a(0,w))}function z(u){s.$$.not_equal(w[5],u)&&(w[5]=u,a(0,w))}function x(u){s.$$.not_equal(w[6],u)&&(w[6]=u,a(0,w))}return[w,r,f,e,o,m,$,k,N,d,C,F,I,P,Y,H,G,Z,U,z,x]}class ut extends ue{constructor(t){super(),ie(this,t,$t,ot,$e,{})}}function it(s){let t,a;return t=new ut({}),{c(){l(t.$$.fragment)},l(r){g(t.$$.fragment,r)},m(r,f){c(t,r,f),a=!0},i(r){a||(p(t.$$.fragment,r),a=!0)},o(r){_(t.$$.fragment,r),a=!1},d(r){h(t,r)}}}function pt(s){let t,a;return t=new Ge({props:{$$slots:{default:[it]},$$scope:{ctx:s}}}),{c(){l(t.$$.fragment)},l(r){g(t.$$.fragment,r)},m(r,f){c(t,r,f),a=!0},p(r,[f]){const e={};f&1&&(e.$$scope={dirty:f,ctx:r}),t.$set(e)},i(r){a||(p(t.$$.fragment,r),a=!0)},o(r){_(t.$$.fragment,r),a=!1},d(r){h(t,r)}}}class wt extends ue{constructor(t){super(),ie(this,t,null,pt,$e,{})}}export{wt as component};