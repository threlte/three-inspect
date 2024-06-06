import{U as P,W as F,V as G,s as V,e as q,c as H,a as U,d as L,h as X,i as D,X as J,p as K,z as Q,u as Y,v as Z,w as B,x,B as $}from"./scheduler.rZlTvhYX.js";import{S as ee,i as te,a as h,g as ne,t as M,e as re,c as se,b as ae,m as oe,d as ie}from"./index.fA07ugV4.js";import{w as z}from"./index.DOkN1X5P.js";import{y as ce,G as k,H as le,J as f,K as ue,L as O,W as de,c as fe,N as he,O as me,U as ge,X as pe}from"./Threlte.AiGXXdJu.js";const _e=()=>{const r=ce({width:0,height:0});if(!k)return{parentSize:r,parentSizeAction:()=>{}};const t={childList:!0,subtree:!1,attributes:!1};let a;const e=c=>{n.disconnect(),s.disconnect(),n.observe(c),s.observe(c,t)},n=new ResizeObserver(([c])=>{const{width:u,height:d}=c.contentRect;u===r.current.width&&d===r.current.height||r.set({width:u,height:d})}),s=new MutationObserver(c=>{for(const u of c)for(const d of u.removedNodes)if(a===d&&a.parentElement){e(a.parentElement);return}}),i=c=>{a=c;const u=a.parentElement;u&&(r.set({width:u.clientWidth,height:u.clientHeight}),e(u))};return P(()=>{n.disconnect(),s.disconnect()}),{parentSize:r,parentSizeAction:i}},E=(r,t)=>{if(r===t)return!0;if(!r||!t)return!1;const a=r.length;if(t.length!==a)return!1;for(let e=0;e<a;e++)if(r[e]!==t[e])return!1;return!0},be=()=>{F("threlte-cache",[])},Pe=()=>{const r=G("threlte-cache");if(!r)throw new Error("No cache found. The cache can only be used in a child component to <Canvas>.");return{remember:(e,n)=>{for(const i of r)if(E(n,i.keys)){if(i.error)throw i.error;if(i.promise)return i.promise}const s={promise:e(),keys:n,value:void 0};return r.push(s),s.promise.catch(i=>{s.error=i}),s.promise},clear:e=>{const n=r.findIndex(s=>E(e,s.keys));n!==-1&&r.splice(n,1)}}},we=le.replace("dev",""),Me=Number.parseInt(we),Se=r=>{const t=z(void 0),a=(e,n)=>{r.renderer=new de({powerPreference:"high-performance",canvas:e,antialias:!0,alpha:!0,...n}),t.set(r.renderer)};return f([r.colorManagementEnabled],([e])=>{ue.enabled=e}),f([t,r.colorSpace],([e,n])=>{e&&(e.outputColorSpace=n)}),f([t,r.dpr],([e,n])=>{e?.setPixelRatio(n)}),f([t,r.size],([e,n])=>{e?.xr?.isPresenting||e?.setSize(n.width,n.height)}),f([t,r.shadows],([e,n])=>{e&&(e.shadowMap.enabled=!!n,n&&n!==!0?e.shadowMap.type=n:n===!0&&(e.shadowMap.type=O))}),f([t,r.toneMapping],([e,n])=>{e&&(e.toneMapping=n)}),f([t,r.useLegacyLights],([e,n])=>{e&&n&&(e.useLegacyLights=n)}),{createRenderer:a}};function v(r){let t,a;return t=new me({props:{object:r[0].scene,$$slots:{default:[ye]},$$scope:{ctx:r}}}),{c(){se(t.$$.fragment)},l(e){ae(t.$$.fragment,e)},m(e,n){oe(t,e,n),a=!0},p(e,n){const s={};n&131072&&(s.$$scope={dirty:n,ctx:e}),t.$set(s)},i(e){a||(h(t.$$.fragment,e),a=!0)},o(e){M(t.$$.fragment,e),a=!1},d(e){ie(t,e)}}}function ye(r){let t;const a=r[15].default,e=Y(a,r,r[17],null);return{c(){e&&e.c()},l(n){e&&e.l(n)},m(n,s){e&&e.m(n,s),t=!0},p(n,s){e&&e.p&&(!t||s&131072)&&Z(e,a,n,n[17],t?x(a,n[17],s,null):B(n[17]),null)},i(n){t||(h(e,n),t=!0)},o(n){M(e,n),t=!1},d(n){e&&e.d(n)}}}function Re(r){let t,a,e,n,s=r[2]&&v(r);return{c(){t=q("canvas"),s&&s.c(),this.h()},l(i){t=H(i,"CANVAS",{class:!0});var c=U(t);s&&s.l(c),c.forEach(L),this.h()},h(){X(t,"class","svelte-o3oskp")},m(i,c){D(i,t,c),s&&s.m(t,null),r[16](t),a=!0,e||(n=J(r[4].call(null,t)),e=!0)},p(i,[c]){i[2]?s?(s.p(i,c),c&4&&h(s,1)):(s=v(i),s.c(),h(s,1),s.m(t,null)):s&&(ne(),M(s,1,1,()=>{s=null}),re())},i(i){a||(h(s),a=!0)},o(i){M(s),a=!1},d(i){i&&L(t),s&&s.d(),r[16](null),e=!1,n()}}}function ze(r,t,a){let e,{$$slots:n={},$$scope:s}=t,{colorManagementEnabled:i=!0}=t,{colorSpace:c="srgb"}=t,{dpr:u=k?window.devicePixelRatio:1}=t,{renderMode:d="on-demand"}=t,{rendererParameters:S=void 0}=t,{shadows:m=O}=t,{size:g=void 0}=t,{toneMapping:p=ge}=t,{useLegacyLights:y=!(Me>=155)}=t,{autoRender:_=!0}=t,b,w=z(!1);K(r,w,o=>a(2,e=o));const C=z(g),{parentSize:N,parentSizeAction:T}=_e(),I=fe({colorManagementEnabled:i,colorSpace:c,dpr:u,renderMode:d,parentSize:N,autoRender:_,shadows:m,toneMapping:p,useLegacyLights:y,userSize:C}),R=he(),l=I;f([w,l.autoRender],([o,j])=>(o&&j?l.autoRenderTask.start():l.autoRenderTask.stop(),()=>{l.autoRenderTask.stop()})),be();const{createRenderer:A}=Se(l);Q(()=>{A(b,S),l.renderer.setAnimationLoop(o=>{R.dispose(),l.scheduler.run(o),R.resetFrameInvalidation()}),w.set(!0)}),P(()=>{R.dispose(!0),l.scheduler.dispose(),l.renderer?.dispose()});function W(o){$[o?"unshift":"push"](()=>{b=o,a(1,b)})}return r.$$set=o=>{"colorManagementEnabled"in o&&a(5,i=o.colorManagementEnabled),"colorSpace"in o&&a(6,c=o.colorSpace),"dpr"in o&&a(7,u=o.dpr),"renderMode"in o&&a(8,d=o.renderMode),"rendererParameters"in o&&a(9,S=o.rendererParameters),"shadows"in o&&a(10,m=o.shadows),"size"in o&&a(11,g=o.size),"toneMapping"in o&&a(12,p=o.toneMapping),"useLegacyLights"in o&&a(13,y=o.useLegacyLights),"autoRender"in o&&a(14,_=o.autoRender),"$$scope"in o&&a(17,s=o.$$scope)},r.$$.update=()=>{r.$$.dirty&2048&&C.set(g),r.$$.dirty&64&&l.colorSpace.set(c),r.$$.dirty&128&&l.dpr.set(u),r.$$.dirty&256&&l.renderMode.set(d),r.$$.dirty&16384&&l.autoRender.set(_),r.$$.dirty&1024&&l.shadows.set(m),r.$$.dirty&4096&&l.toneMapping.set(p)},[l,b,e,w,T,i,c,u,d,S,m,g,p,y,_,n,W,s]}class ke extends ee{constructor(t){super(),te(this,t,ze,Re,V,{colorManagementEnabled:5,colorSpace:6,dpr:7,renderMode:8,rendererParameters:9,shadows:10,size:11,toneMapping:12,useLegacyLights:13,autoRender:14,ctx:0})}get ctx(){return this.$$.ctx[0]}}pe("three-inspect.");export{ke as C,Me as r,Pe as u};
