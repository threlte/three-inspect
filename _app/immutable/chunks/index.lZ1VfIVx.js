import{R as $,y as _,$ as m,h as S,d as b,a0 as E,M as w,a1 as C,S as x,a2 as I,a3 as M,a4 as p,a5 as O,a6 as R,a7 as j,a8 as B,a9 as L}from"./scheduler.9h8Gne0h.js";const o=new Set;let d;function D(){d={r:0,c:[],p:d}}function F(){d.r||$(d.c),d=d.p}function N(t,e){t&&t.i&&(o.delete(t),t.i(e))}function G(t,e,n,s){if(t&&t.o){if(o.has(t))return;o.add(t),d.c.push(()=>{o.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}else s&&s()}function H(t,e,n){const s=t.$$.props[e];s!==void 0&&(t.$$.bound[s]=n,n(t.$$.ctx[s]))}function J(t){t&&t.c()}function K(t,e){t&&t.l(e)}function P(t,e,n){const{fragment:s,after_update:i}=t.$$;s&&s.m(e,n),x(()=>{const f=t.$$.on_mount.map(O).filter(w);t.$$.on_destroy?t.$$.on_destroy.push(...f):$(f),t.$$.on_mount=[]}),i.forEach(x)}function U(t,e){const n=t.$$;n.fragment!==null&&(I(n.after_update),$(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function V(t,e){t.$$.dirty[0]===-1&&(R.push(t),j(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Q(t,e,n,s,i,f,c=null,v=[-1]){const u=M;p(t);const a=t.$$={fragment:null,ctx:[],props:f,update:_,not_equal:i,bound:m(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(u?u.$$.context:[])),callbacks:m(),dirty:v,skip_bound:!1,root:e.target||u.$$.root};c&&c(a.root);let h=!1;if(a.ctx=n?n(t,e.props||{},(r,l,...g)=>{const y=g.length?g[0]:l;return a.ctx&&i(a.ctx[r],a.ctx[r]=y)&&(!a.skip_bound&&a.bound[r]&&a.bound[r](y),h&&V(t,r)),l}):[],a.update(),h=!0,$(a.before_update),a.fragment=s?s(a.ctx):!1,e.target){if(e.hydrate){B();const r=S(e.target);a.fragment&&a.fragment.l(r),r.forEach(b)}else a.fragment&&a.fragment.c();e.intro&&N(t.$$.fragment),P(t,e.target,e.anchor),L(),E()}p(u)}class T{$$=void 0;$$set=void 0;$destroy(){U(this,1),this.$destroy=_}$on(e,n){if(!w(n))return _;const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(n),()=>{const i=s.indexOf(n);i!==-1&&s.splice(i,1)}}$set(e){this.$$set&&!C(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const z="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(z);export{T as S,N as a,J as b,F as c,K as d,U as e,H as f,D as g,Q as i,P as m,G as t};