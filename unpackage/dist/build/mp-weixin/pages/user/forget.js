(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/user/forget"],{"0b02":function(e,t,n){"use strict";n.r(t);var o=n("a2bc"),a=n.n(o);for(var s in o)"default"!==s&&function(e){n.d(t,e,(function(){return o[e]}))}(s);t["default"]=a.a},"18ee":function(e,t,n){"use strict";(function(e){n("98dd");o(n("66fd"));var t=o(n("578b"));function o(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=n,e(t.default)}).call(this,n("543d")["createPage"])},"1d3e":function(e,t,n){},"578b":function(e,t,n){"use strict";n.r(t);var o=n("d9a7"),a=n("0b02");for(var s in a)"default"!==s&&function(e){n.d(t,e,(function(){return a[e]}))}(s);n("e891");var i,c=n("f0c5"),r=Object(c["a"])(a["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],i);t["default"]=r.exports},a2bc:function(e,t,n){"use strict";(function(e){var n,o,a;function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=(n={onLoad:function(){o=this},onUnload:function(){clearInterval(a),this.second=0},data:function(){return{phone:"",password:"",code:"",agreement:!0,showPassword:!1,second:0,verification_code:""}},computed:{yanzhengma:function(){return 0==this.second?"获取验证码":this.second<10?"重新获取0"+this.second:"重新获取"+this.second}}},s(n,"onUnload",(function(){this.clear()})),s(n,"methods",{clear:function(){clearInterval(a),a=null,this.second=0},display:function(){this.showPassword=!this.showPassword},agreementSuccess:function(){this.agreement=!this.agreement},getcode:function(){var t=this;11==this.phone.length?this.second>0||(this.second=60,a=setInterval((function(){o.second--,0==o.second&&o.clear()}),1e3),e.request({url:getApp().globalData.url+"/api/phone_code",data:{phone:this.phone,type:"forget"},method:"POST",dataType:"json",success:function(n){t.verification_code=n.data.verification_code,200!==n.data.code?e.showToast({title:n.data.msg,icon:"none"}):(e.showToast({title:n.data.msg}),a=setInterval((function(){o.second--,0==o.second&&o.clear()}),1e3))},fail:function(){this.second}})):e.showToast({icon:"none",title:"手机号不正确"})},bindLogin:function(){11==this.phone.length?this.password.length<6?e.showToast({icon:"none",title:"密码不得少于6位"}):6===this.code.length?e.request({url:getApp().globalData.url+"/api/forget",data:{phone:this.phone,password:this.password,code:this.code,verification_code:this.verification_code},method:"POST",dataType:"json",success:function(t){200!==t.data.code?e.showToast({title:t.data.msg,icon:"none"}):(e.showToast({title:t.data.msg}),setTimeout((function(){e.redirectTo({url:"/pages/blog/login"})}),1500))}}):e.showToast({icon:"none",title:"验证码不正确"}):e.showToast({icon:"none",title:"手机号不正确"})}}),n);t.default=i}).call(this,n("543d")["default"])},d9a7:function(e,t,n){"use strict";var o;n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return s})),n.d(t,"a",(function(){return o}));var a=function(){var e=this,t=e.$createElement;e._self._c},s=[]},e891:function(e,t,n){"use strict";var o=n("1d3e"),a=n.n(o);a.a}},[["18ee","common/runtime","common/vendor"]]]);