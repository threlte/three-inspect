function A(){}function M(t,e){for(const n in e)t[n]=e[n];return t}function T(t){return t()}function tt(){return Object.create(null)}function W(t){t.forEach(T)}function B(t){return typeof t=="function"}function et(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function nt(t){return Object.keys(t).length===0}function I(t,...e){if(t==null){for(const i of e)i(void 0);return A}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function it(t,e,n){t.$$.on_destroy.push(I(e,n))}function rt(t,e,n,i){if(t){const r=j(t,e,n,i);return t[0](r)}}function j(t,e,n,i){return t[1]&&i?M(n.ctx.slice(),t[1](i(e))):n.ctx}function ct(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const o=[],c=Math.max(e.dirty.length,r.length);for(let l=0;l<c;l+=1)o[l]=e.dirty[l]|r[l];return o}return e.dirty|r}return e.dirty}function st(t,e,n,i,r,o){if(r){const c=j(e,n,i,o);t.p(c,r)}}function ot(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function lt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function at(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function ut(t){const e={};for(const n in t)e[n]=!0;return e}function ft(t,e,n){return t.set(n),e}function _t(t){return t&&B(t.destroy)?t.destroy:A}let y=!1;function dt(){y=!0}function ht(){y=!1}function L(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function q(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const s=[];for(let a=0;a<e.length;a++){const u=e[a];u.claim_order!==void 0&&s.push(u)}e=s}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let s=0;s<e.length;s++){const a=e[s].claim_order,u=(r>0&&e[n[r]].claim_order<=a?r+1:L(1,r,D=>e[n[D]].claim_order,a))-1;i[s]=n[u]+1;const k=u+1;n[k]=s,r=Math.max(k,r)}const o=[],c=[];let l=e.length-1;for(let s=n[r]+1;s!=0;s=i[s-1]){for(o.push(e[s-1]);l>=s;l--)c.push(e[l]);l--}for(;l>=0;l--)c.push(e[l]);o.reverse(),c.sort((s,a)=>s.claim_order-a.claim_order);for(let s=0,a=0;s<c.length;s++){for(;a<o.length&&c[s].claim_order>=o[a].claim_order;)a++;const u=a<o.length?o[a]:null;t.insertBefore(c[s],u)}}function U(t,e){t.appendChild(e)}function F(t,e){if(y){for(q(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function pt(t,e,n){y&&!n?F(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function H(t){t.parentNode&&t.parentNode.removeChild(t)}function mt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function C(t){return document.createElement(t)}function G(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function v(t){return document.createTextNode(t)}function yt(){return v(" ")}function bt(){return v("")}function E(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function S(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const J=["width","height"];function gt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&J.indexOf(i)===-1?t[i]=e[i]:S(t,i,e[i])}function xt(t,e){for(const n in e)S(t,n,e[n])}function wt(t){return Array.from(t.childNodes)}function K(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function O(t,e,n,i,r=!1){K(t);const o=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const l=t[c];if(e(l)){const s=n(l);return s===void 0?t.splice(c,1):t[c]=s,r||(t.claim_info.last_index=c),l}}for(let c=t.claim_info.last_index-1;c>=0;c--){const l=t[c];if(e(l)){const s=n(l);return s===void 0?t.splice(c,1):t[c]=s,r?s===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,l}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function z(t,e,n,i){return O(t,r=>r.nodeName===e,r=>{const o=[];for(let c=0;c<r.attributes.length;c++){const l=r.attributes[c];n[l.name]||o.push(l.name)}o.forEach(c=>r.removeAttribute(c))},()=>i(e))}function vt(t,e,n){return z(t,e,n,C)}function kt(t,e,n){return z(t,e,n,G)}function Q(t,e){return O(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>v(e),!0)}function Et(t){return Q(t," ")}function Nt(t,e){e=""+e,t.data!==e&&(t.data=e)}function At(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let p;function R(){if(p===void 0){p=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{p=!0}}return p}function jt(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=C("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const r=R();let o;return r?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",o=E(window,"message",c=>{c.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{o=E(i.contentWindow,"resize",e),e()}),U(t,i),()=>{(r||o&&i.contentWindow)&&o(),H(i)}}function Ct(t,e,n){t.classList.toggle(e,!!n)}function V(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function St(t,e){return new t(e)}let m;function b(t){m=t}function f(){if(!m)throw new Error("Function called outside component initialization");return m}function Ot(t){f().$$.before_update.push(t)}function zt(t){f().$$.on_mount.push(t)}function Pt(t){f().$$.after_update.push(t)}function Dt(t){f().$$.on_destroy.push(t)}function Mt(){const t=f();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const o=V(e,n,{cancelable:i});return r.slice().forEach(c=>{c.call(t,o)}),!o.defaultPrevented}return!0}}function Tt(t,e){return f().$$.context.set(t,e),e}function Wt(t){return f().$$.context.get(t)}function Bt(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const h=[],N=[];let d=[];const x=[],P=Promise.resolve();let w=!1;function X(){w||(w=!0,P.then(Z))}function It(){return X(),P}function Y(t){d.push(t)}function Lt(t){x.push(t)}const g=new Set;let _=0;function Z(){if(_!==0)return;const t=m;do{try{for(;_<h.length;){const e=h[_];_++,b(e),$(e.$$)}}catch(e){throw h.length=0,_=0,e}for(b(null),h.length=0,_=0;N.length;)N.pop()();for(let e=0;e<d.length;e+=1){const n=d[e];g.has(n)||(g.add(n),n())}d.length=0}while(h.length);for(;x.length;)x.pop()();w=!1,g.clear(),b(t)}function $(t){if(t.fragment!==null){t.update(),W(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(Y)}}function qt(t){const e=[],n=[];d.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),d=e}export{Ct as $,At as A,N as B,St as C,It as D,tt as E,Z as F,nt as G,Y as H,qt as I,m as J,b as K,T as L,h as M,X as N,dt as O,ht as P,M as Q,at as R,lt as S,Lt as T,Dt as U,Wt as V,Tt as W,_t as X,f as Y,gt as Z,E as _,wt as a,Mt as a0,ft as a1,Bt as a2,jt as a3,Ot as a4,G as a5,kt as a6,xt as a7,ut as a8,F as b,vt as c,H as d,C as e,mt as f,Q as g,S as h,pt as i,I as j,B as k,yt as l,Et as m,A as n,Nt as o,it as p,bt as q,W as r,et as s,v as t,rt as u,st as v,ot as w,ct as x,Pt as y,zt as z};
