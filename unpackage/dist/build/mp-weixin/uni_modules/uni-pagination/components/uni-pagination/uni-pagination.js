(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/uni-pagination/components/uni-pagination/uni-pagination"],{"03bb":function(t,n,e){"use strict";e.r(n);var r=e("cb53"),u=e.n(r);for(var i in r)"default"!==i&&function(t){e.d(n,t,(function(){return r[t]}))}(i);n["default"]=u.a},"2d8e":function(t,n,e){},"4fa9":function(t,n,e){"use strict";e.d(n,"b",(function(){return u})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return r}));var r={uniIcons:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uni-icons/components/uni-icons/uni-icons")]).then(e.bind(null,"f5ae"))}},u=function(){var t=this,n=t.$createElement;t._self._c},i=[]},"607b":function(t,n,e){"use strict";e.r(n);var r=e("4fa9"),u=e("03bb");for(var i in u)"default"!==i&&function(t){e.d(n,t,(function(){return u[t]}))}(i);e("d324");var c,a=e("f0c5"),o=Object(a["a"])(u["default"],r["b"],r["c"],!1,null,"51271d3c",null,!1,r["a"],c);n["default"]=o.exports},cb53:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r={name:"UniPagination",props:{value:{type:[Number,String],default:1},prevText:{type:String,default:"上一页"},nextText:{type:String,default:"下一页"},current:{type:[Number,String],default:1},total:{type:[Number,String],default:0},pageSize:{type:[Number,String],default:10},showIcon:{type:[Boolean,String],default:!1},pagerCount:{type:Number,default:7}},data:function(){return{currentIndex:1,paperData:[]}},computed:{maxPage:function(){var t=1,n=Number(this.total),e=Number(this.pageSize);return n&&e&&(t=Math.ceil(n/e)),t},paper:function(){for(var t=this.currentIndex,n=this.pagerCount,e=this.total,r=this.pageSize,u=[],i=[],c=Math.ceil(e/r),a=0;a<c;a++)u.push(a+1);i.push(1);var o=u[u.length-(n+1)/2];return u.forEach((function(e,r){(n+1)/2>=t?e<n+1&&e>1&&i.push(e):t+2<=o?e>t-(n+1)/2&&e<t+(n+1)/2&&i.push(e):(e>t-(n+1)/2||c-n<e)&&e<u[u.length-1]&&i.push(e)})),c>n?((n+1)/2>=t?i[i.length-1]="...":t+2<=o?(i[1]="...",i[i.length-1]="..."):i[1]="...",i.push(u[u.length-1])):(n+1)/2>=t||t+2<=o||(i.shift(),i.push(u[u.length-1])),i}},watch:{current:function(t){this.currentIndex=t},value:function(t){this.currentIndex=t<1?1:t}},created:function(){this.currentIndex=+this.value},methods:{selectPage:function(t,n){if(parseInt(t))this.currentIndex=t,this.change("current");else{var e=Math.ceil(this.total/this.pageSize);if(n<=1)return void(this.currentIndex-5>1?this.currentIndex-=5:this.currentIndex=1);if(n>=6)return void(this.currentIndex+5>e?this.currentIndex=e:this.currentIndex+=5)}},clickLeft:function(){1!==Number(this.currentIndex)&&(this.currentIndex-=1,this.change("prev"))},clickRight:function(){Number(this.currentIndex)>=this.maxPage||(this.currentIndex+=1,this.change("next"))},change:function(t){this.$emit("input",this.currentIndex),this.$emit("change",{type:t,current:this.currentIndex})}}};n.default=r},d324:function(t,n,e){"use strict";var r=e("2d8e"),u=e.n(r);u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uni-pagination/components/uni-pagination/uni-pagination-create-component',
    {
        'uni_modules/uni-pagination/components/uni-pagination/uni-pagination-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("607b"))
        })
    },
    [['uni_modules/uni-pagination/components/uni-pagination/uni-pagination-create-component']]
]);
