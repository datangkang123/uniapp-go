(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/jo-markdown/latex/latex"],{"0589":function(t,a,e){"use strict";(function(t){Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n=e("e3ca"),c={name:"Latex",options:{styleIsolation:"shared"},props:{latexData:{type:Object,value:{}}},data:function(){return{attr:{src:"",class:""},size:{w:0,h:0}}},onReady:function(){this.attached()},mounted:function(){this.attached()},methods:{attached:function(){var a=this,e=this.latexData.attr;a.attr={src:"".concat(n.latex.api,"=").concat(e.value,"&theme=").concat(t._theme),class:"".concat(e.class," ").concat(e.class,"--").concat(e.type)}},load:function(t){var a=this,e=18,n=t.detail.width/e,c=t.detail.height/e;a.size={w:n,h:c}}}};a.default=c}).call(this,e("c8ba"))},"8e7e":function(t,a,e){"use strict";var n;e.d(a,"b",(function(){return c})),e.d(a,"c",(function(){return o})),e.d(a,"a",(function(){return n}));var c=function(){var t=this,a=t.$createElement;t._self._c},o=[]},d533:function(t,a,e){"use strict";e.r(a);var n=e("8e7e"),c=e("f5bb");for(var o in c)"default"!==o&&function(t){e.d(a,t,(function(){return c[t]}))}(o);var u,r=e("f0c5"),i=Object(r["a"])(c["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],u);a["default"]=i.exports},f5bb:function(t,a,e){"use strict";e.r(a);var n=e("0589"),c=e.n(n);for(var o in n)"default"!==o&&function(t){e.d(a,t,(function(){return n[t]}))}(o);a["default"]=c.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/jo-markdown/latex/latex-create-component',
    {
        'components/jo-markdown/latex/latex-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("d533"))
        })
    },
    [['components/jo-markdown/latex/latex-create-component']]
]);
