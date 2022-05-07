(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/uni-badge/components/uni-badge/uni-badge"],{"3c09":function(t,e,n){"use strict";var u;n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return u}));var i=function(){var t=this,e=t.$createElement;t._self._c},a=[]},4846:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var u={name:"UniBadge",props:{type:{type:String,default:"default"},inverted:{type:Boolean,default:!1},text:{type:[String,Number],default:""},size:{type:String,default:"normal"}},data:function(){return{badgeStyle:""}},watch:{text:function(){this.setStyle()}},mounted:function(){this.setStyle()},methods:{setStyle:function(){this.badgeStyle="width: ".concat(8*String(this.text).length+12,"px")},onClick:function(){this.$emit("click")}}};e.default=u},"4e30":function(t,e,n){"use strict";n.r(e);var u=n("4846"),i=n.n(u);for(var a in u)"default"!==a&&function(t){n.d(e,t,(function(){return u[t]}))}(a);e["default"]=i.a},6782:function(t,e,n){"use strict";var u=n("e5b8"),i=n.n(u);i.a},e5b8:function(t,e,n){},fc22:function(t,e,n){"use strict";n.r(e);var u=n("3c09"),i=n("4e30");for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);n("6782");var c,r=n("f0c5"),o=Object(r["a"])(i["default"],u["b"],u["c"],!1,null,"8a8cfeb4",null,!1,u["a"],c);e["default"]=o.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uni-badge/components/uni-badge/uni-badge-create-component',
    {
        'uni_modules/uni-badge/components/uni-badge/uni-badge-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("fc22"))
        })
    },
    [['uni_modules/uni-badge/components/uni-badge/uni-badge-create-component']]
]);
