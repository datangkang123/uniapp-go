(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-form-tb"],{"0c89":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={data:function(){return{data:{},url:"",xmlist:{},scrollTop:0}},onPageScroll:function(t){this.scrollTop=t.scrollTop},onPullDownRefresh:function(){this.csh(),setTimeout((function(){uni.stopPullDownRefresh()}),500)},onLoad:function(){this.data=getApp().globalData.data;var t=wx.getUpdateManager();t.onCheckForUpdate((function(t){console.log(t.hasUpdate)})),t.onUpdateReady((function(){wx.showModal({title:"更新提示",content:"新版本已经准备好，是否重启应用？",success:function(e){e.confirm&&t.applyUpdate()}})})),t.onUpdateFailed((function(){console.log("下载失败")})),this.csh()},methods:{csh:function(){var t=this;this.url=getApp().globalData.url,uni.request({url:this.url+"/tb/tblist",method:"POST",header:{"Content-Type":"application/x-www-form-urlencoded",Authorization:"Bearer "+uni.getStorageSync("userInfo").token},success:function(e){if(401!=e.statusCode||"2"!=getApp().globalData.data.islogin)return 200!==e.statusCode?t.$u.toast("服务器无法连接"):0!=e.data.code?t.$u.toast("暂无可填报的项目"):void(t.xmlist=e.data.result);uni.showToast({title:"登录已过期",success:function(t){setTimeout((function(){uni.removeStorageSync("userInfo"),uni.navigateTo({url:"/pages/user/login"})}),600)}})}})}}};e.default=o},4337:function(t,e,n){"use strict";var o=n("9cd0"),i=n.n(o);i.a},"4e72":function(t,e,n){"use strict";n("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={name:"u-back-top",props:{mode:{type:String,default:"circle"},icon:{type:String,default:"arrow-upward"},tips:{type:String,default:""},duration:{type:[Number,String],default:100},scrollTop:{type:[Number,String],default:0},top:{type:[Number,String],default:400},bottom:{type:[Number,String],default:200},right:{type:[Number,String],default:40},zIndex:{type:[Number,String],default:"9"},iconStyle:{type:Object,default:function(){return{color:"#909399",fontSize:"38rpx"}}},customStyle:{type:Object,default:function(){return{}}}},watch:{showBackTop:function(t,e){t?(this.uZIndex=this.zIndex,this.opacity=1):(this.uZIndex=-1,this.opacity=0)}},computed:{showBackTop:function(){return this.scrollTop>uni.upx2px(this.top)}},data:function(){return{opacity:0,uZIndex:-1}},methods:{backToTop:function(){uni.pageScrollTo({scrollTop:0,duration:this.duration})}}};e.default=o},"7b2d":function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return o}));var o={uIcon:n("0f2d").default},i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"u-back-top",class:["u-back-top--mode--"+t.mode],style:[{bottom:t.bottom+"rpx",right:t.right+"rpx",borderRadius:"circle"==t.mode?"10000rpx":"8rpx",zIndex:t.uZIndex,opacity:t.opacity},t.customStyle],on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.backToTop.apply(void 0,arguments)}}},[t.$slots.default||t.$slots.$default?t._t("default"):n("v-uni-view",{staticClass:"u-back-top__content"},[n("u-icon",{attrs:{name:t.icon,"custom-style":t.iconStyle},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.backToTop.apply(void 0,arguments)}}}),n("v-uni-view",{staticClass:"u-back-top__content__tips"},[t._v(t._s(t.tips))])],1)],2)},a=[]},"8ca3":function(t,e,n){"use strict";n.r(e);var o=n("cfa3"),i=n("fad8");for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);var u,r=n("f0c5"),c=Object(r["a"])(i["default"],o["b"],o["c"],!1,null,"dc0ade00",null,!1,o["a"],u);e["default"]=c.exports},"9cd0":function(t,e,n){var o=n("ade7");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var i=n("4f06").default;i("b05787fa",o,!0,{sourceMap:!1,shadowMode:!1})},a999:function(t,e,n){"use strict";n.r(e);var o=n("7b2d"),i=n("e6c4");for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);n("4337");var u,r=n("f0c5"),c=Object(r["a"])(i["default"],o["b"],o["c"],!1,null,"feb04766",null,!1,o["a"],u);e["default"]=c.exports},ade7:function(t,e,n){var o=n("24fb");e=o(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 下方引入的为uView UI的集成样式文件，为scss预处理器，其中包含了一些"u-"开头的自定义变量\n * 使用的时候，请将下面的一行复制到您的uniapp项目根目录的uni.scss中即可\n * uView自定义的css类名和scss变量，均以"u-"开头，不会造成冲突，请放心使用 \n */.uni-group[data-v-feb04766]{display:flex;align-items:center}.uni-header[data-v-feb04766]{padding:0 15px;display:flex;height:55px;align-items:center;justify-content:space-between;border-bottom:1px #f5f5f5 solid}.uni-container[data-v-feb04766]{padding:15px;box-sizing:border-box}.uni-pagination-box[data-v-feb04766]{display:flex;align-items:center;justify-content:center}.uni-pagination-box[data-v-feb04766]{margin-top:20px}.u-back-top[data-v-feb04766]{width:%?80?%;height:%?80?%;position:fixed;z-index:9;display:flex;flex-direction:row;flex-direction:column;justify-content:center;background-color:#e1e1e1;color:#606266;align-items:center;transition:opacity .4s}.u-back-top__content[data-v-feb04766]{display:flex;flex-direction:row;flex-direction:column;align-items:center}.u-back-top__content__tips[data-v-feb04766]{font-size:%?24?%;-webkit-transform:scale(.8);transform:scale(.8);line-height:1}',""]),t.exports=e},cfa3:function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return o}));var o={uniList:n("0fe0").default,uniListItem:n("571b").default,uBackTop:n("a999").default},i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",[t._l(t.xmlist,(function(e,o){return n("uni-list",{key:o},[e.Cxtj&&e.Cxtj.length>0?n("uni-list-item",{attrs:{title:e.Xmmc,link:!0,to:"/pages/cx/cxtj?id="+e.ID,rightText:t.$u.timeFormat(e.CreatedAt,"yyyy-mm-dd")}}):n("uni-list-item",{attrs:{title:e.Xmmc,link:!0,to:"/pages/form/form?zt=0&id="+e.ID+"&userid=1",rightText:t.$u.timeFormat(e.CreatedAt,"yyyy-mm-dd")}})],1)})),n("u-back-top",{attrs:{"scroll-top":t.scrollTop}})],2)},a=[]},e6c4:function(t,e,n){"use strict";n.r(e);var o=n("4e72"),i=n.n(o);for(var a in o)"default"!==a&&function(t){n.d(e,t,(function(){return o[t]}))}(a);e["default"]=i.a},fad8:function(t,e,n){"use strict";n.r(e);var o=n("0c89"),i=n.n(o);for(var a in o)"default"!==a&&function(t){n.d(e,t,(function(){return o[t]}))}(a);e["default"]=i.a}}]);