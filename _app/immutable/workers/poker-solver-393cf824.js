(function(){"use strict";let s;const d=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});d.decode();let l=null;function f(){return(l===null||l.byteLength===0)&&(l=new Uint8Array(s.memory.buffer)),l}function y(e,t){return d.decode(f().subarray(e,e+t))}let _=0;const u=new TextEncoder("utf-8"),p=typeof u.encodeInto=="function"?function(e,t){return u.encodeInto(e,t)}:function(e,t){const n=u.encode(e);return t.set(n),{read:e.length,written:n.length}};function w(e,t,n){if(n===void 0){const i=u.encode(e),c=t(i.length);return f().subarray(c,c+i.length).set(i),_=i.length,c}let r=e.length,a=t(r);const b=f();let o=0;for(;o<r;o++){const i=e.charCodeAt(o);if(i>127)break;b[a+o]=i}if(o!==r){o!==0&&(e=e.slice(o)),a=n(a,r,r=o+e.length*3);const i=f().subarray(a+o,a+r),c=p(e,i);o+=c.written}return _=o,a}function h(e,t,n){const r=w(e,s.__wbindgen_malloc,s.__wbindgen_realloc),a=_,b=w(t,s.__wbindgen_malloc,s.__wbindgen_realloc),o=_,i=w(n,s.__wbindgen_malloc,s.__wbindgen_realloc),c=_,W=s.solve(r,a,b,o,i,c);return g.__wrap(W)}class g{static __wrap(t){const n=Object.create(g.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();s.__wbg_gameresult_free(t)}get win(){return s.__wbg_get_gameresult_win(this.ptr)>>>0}set win(t){s.__wbg_set_gameresult_win(this.ptr,t)}get lose(){return s.__wbg_get_gameresult_lose(this.ptr)>>>0}set lose(t){s.__wbg_set_gameresult_lose(this.ptr,t)}get tie(){return s.__wbg_get_gameresult_tie(this.ptr)>>>0}set tie(t){s.__wbg_set_gameresult_tie(this.ptr,t)}}async function R(e,t){if(typeof Response=="function"&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(e,t)}catch(r){if(e.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",r);else throw r}const n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}else{const n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}function A(){const e={};return e.wbg={},e.wbg.__wbindgen_throw=function(t,n){throw new Error(y(t,n))},e}function U(e,t){return s=e.exports,m.__wbindgen_wasm_module=t,l=null,s}async function m(e){typeof e>"u"&&(e=new URL(""+new URL("../../../assets/poker_solver_bg-3d7e0ef9.wasm",document.currentScript&&document.currentScript.src||document.baseURI).href,self.location));const t=A();(typeof e=="string"||typeof Request=="function"&&e instanceof Request||typeof URL=="function"&&e instanceof URL)&&(e=fetch(e));const{instance:n,module:r}=await R(await e,t);return U(n,r)}async function I(e){let t=new Date;await m();const n=h(e.handA,e.handB,e.community);let a=new Date().getTime()-t.getTime();self.postMessage({name:"ok",time:a,win:n.win,lose:n.lose,tie:n.tie})}self.addEventListener("message",e=>{e.data.name==="fixURI"&&(self.document={baseURI:e.data.baseURI})}),self.addEventListener("message",e=>{e.data.name==="start"&&I(e.data)})})();