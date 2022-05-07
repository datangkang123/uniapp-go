<template>
	<view class="wrap">
		<view class="u-bt" v-if="xmmc">{{xmmc}}</view>
		<view class="u-content" v-if="beizhu">
			<text>{{beizhu}}</text>
			<view class="wrap">
				<u-divider>输入相应内容查询</u-divider>
			</view>
		</view>
		<u-form :model="model" ref="uForm" v-if="cxtj && Object.keys(cxtj).length > 0">
			<block v-for="(item,k) in cxtj" :key="k">
				<u-form-item v-if="zdsz[item].i == 2" label-width="auto" :label="(zd[item] + '：')" :prop="item"
					:required="cxfs == 2">
					<u-radio-group v-model="model[item]">
						<u-radio shape="circle" v-for="(dxk,index) in zdsz[item].xx.split('/')" :key="index"
							:name="dxk">
							{{ dxk }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<!-- 单选下拉 -->
				<u-form-item v-else-if="zdsz[item].i == 4" label-width="auto" :label="(zd[item] + '：')" :prop="item"
					:required="cxfs == 2">
					<u-input v-model="model[item]" type="select" @click="selectShow[item] = true"
						:placeholder="('请选择'+ zd[item])" />
					<u-select v-model="selectShow[item]" mode="single-column" :list="dxselect(zdsz[item].xx,item)"
						@confirm="confirm">
					</u-select>
				</u-form-item>
				<u-form-item v-else-if="(texts.includes(Number(zdsz[item].i)))" :label="(zd[item] + '：')"
					label-width="auto" :prop="item" :required="cxfs == 2">
					<u-input :placeholder="('请输入'+ zd[item])" v-model="model[item]" type="text"></u-input>
				</u-form-item>
				<!--身份证号-->
				<u-form-item v-else-if="zdsz[item].i == 13" label-width="auto" :label="(zd[item] + '：')" :prop="item"
					:required="cxfs == 2">
					<u-input :placeholder="item.ts" v-model="model[item]" type="text"></u-input>
					<htz-image-upload :max="1" :quality="60" @uploadSuccess="zidingyiSuccess" v-model="image[item]" :action="action" 
					:formData="{'key': item}" v-if="item.name || item.sex || item.mz || item.day || item.ade || item.zmtp">
					</htz-image-upload>
				</u-form-item>
			</block>
		</u-form>
		<view class="wrap btn" v-if="cxtj && Object.keys(cxtj).length > 0">
			<u-button style="margin-right:30px" size="medium" :ripple="true" type="primary" @click="submit">查&nbsp;&nbsp;询
			</u-button>
			<u-button size="medium" :ripple="true" @click="reset">重&nbsp;&nbsp;置</u-button>
		</view>
		<view class="wrap" v-else>查询条件不存在，请联系管理员</view>

		<block v-if="(cxjgs && Object.keys(cxjgs).length > 0)" v-for="(item,index) in cxjgs" :key="index">
			<view class="wrap btn">查询结果{{index + 1}}</view>
			<kzh-table border>
				<kzh-tr v-for="key in cxjgkeys" :key="key" v-if="zdsz[key].yc != 2">
					<kzh-th width="100px" style="background-color:#f6f7fd;">{{zd[key]}}</kzh-th>
					<template v-if="(!item[key])">
						<kzh-td></kzh-td>
					</template>
					<template v-else>
						<!-- 文本显示 -->
						<kzh-td v-if="(texts.includes(Number(zdsz[key].i)))">
							<!-- #ifdef H5 -->
							<p v-clipboard:copy="zjxh(zdsz[key].i,zdsz[key].zjxh,item[key])" v-clipboard:success="onCopy">
								{{ zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]) }}
							</p>
							<!-- #endif -->
							<!-- #ifndef H5 -->
							<p @longpress="copyText(zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]))">
								{{ zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]) }}
							</p>
							<!-- #endif -->
						</kzh-td>
						<!-- 手机号 -->
						<kzh-td v-if="(Number(zdsz[key].i) == 12)">
							<!-- #ifdef H5 -->
							<p v-clipboard:copy="zjxh(zdsz[key].i,zdsz[key].zjxh,item[key])" v-clipboard:success="onCopy">
								{{ zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]) }}
							</p>
							<!-- #endif -->
							<!-- #ifndef H5 -->
							<p @longpress="copyText(zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]))">
								{{ zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]) }}
							</p>
							<!-- #endif -->
						</kzh-td>
						<!-- 身份证 -->
						<kzh-td v-if="(Number(zdsz[key].i) == 13)">
							<!-- #ifdef H5 -->
							<p v-clipboard:copy="zjxh(zdsz[key].i,zdsz[key].zjxh,item[key])" v-clipboard:success="onCopy">
								{{ zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]) }}
							</p>
							<!-- #endif -->
							<!-- #ifndef H5 -->
							<p @longpress="copyText(zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]))">
								{{ zjxh(zdsz[key].i,zdsz[key].zjxh,item[key]) }}
							</p>
							<!-- #endif -->
						</kzh-td>
						<!-- 多选数组json转换 -->
						<kzh-td v-if="(zdsz[key].i == 3 || zdsz[key].i == 5 || zdsz[key].i == 21)">
							{{JSON.parse(item[key]).toString()}}
						</kzh-td>
						<!-- 单图 -->
						<kzh-td v-if="(zdsz[key].i == 6)">
							<u-image mode="widthFix" :src="item[key] ? JSON.parse(item[key])[0] : ''"
								@click="previewImage(item[key])"></u-image>
						</kzh-td>
						<!-- 幻灯展示多图 -->
						<kzh-td v-if="(zdsz[key].i == 7 && isJSON(item[key]))">
							<u-swiper mode="number" :list="(JSON.parse(item[key]))" @click="previewImage(item[key])"></u-swiper>
						</kzh-td>
						<!-- 签名 -->
						<kzh-td v-if="(zdsz[key].i == 18)">
							<u-image mode="widthFix" width="100px" :src="item[key]" @click="previewImage(item[key])"></u-image>
						</kzh-td>
						<!-- 表中表 -->
						<kzh-td v-if="(zdsz[key].i == 19)">
							<view class="u-font-sm" style="line-height: 20rpx;overflow-x:scroll;">
								<view class="uni-container" v-show="item[key]">
									<uni-table ref="table" border stripe :loading="loading">
										<uni-tr>
											<uni-th width="20rpx" align="center" v-for="(item1,i) in zdsz[key].bzb" :key="i">{{item1}}
											</uni-th>
										</uni-tr>
										<uni-tr v-for="(item2, index1) in JSON.parse(item[key])" :key="index1">
											<uni-td v-for="(item3,index2) in item2" :key="index2">
												{{ item3 }}
											</uni-td>
										</uni-tr>
									</uni-table>
								</view>
							</view>
						</kzh-td>
						<!-- 网址-->
						<kzh-td v-if="(zdsz[key].i == 20)">
							<navigator :url="'/pages/form/webview?url='+encodeURIComponent(item[key])" open-type="navigate">查看</navigator>
						</kzh-td>
					</template>
				</kzh-tr>
				<kzh-tr v-if="wordfile && wordfile.length > 0">
					<kzh-td width="100" style="background-color:#f6f7fd;">word文档</kzh-td>
					<kzh-td>
						<!-- #ifndef MP-WEIXIN -->
						<u-button size="mini" type="primary" @click="scword(item)">查看/下载</u-button>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						小程序不支持
						<!-- #endif -->
					</kzh-td>
				</kzh-tr>
			</kzh-table>
			<!-- 如果开放了填报且如有审核，审核状态未禁止修改，则可以修改 -->
			<view class="wrap btn" v-if="xmmc">
				<template v-if="kftb == 2">
					<template v-if="shzd && jzxg">
						<u-button v-if="item[shzd] !== jzxg" style="margin:15px" size="medium" :ripple="true" type="error"
							@click="edit(item.ID)">修&nbsp;&nbsp;改</u-button>
					</template>
					<template v-else>
						<u-button v-if="kftb == 2" style="margin:15px" size="medium" :ripple="true" type="error"
							@click="edit(item.ID)">修&nbsp;&nbsp;改</u-button>
					</template>
					<u-button v-if="cftb == 2" style="margin:15px" size="medium" :ripple="true" type="primary"
							@click="create()">新建填报</u-button>
				</template>
				<u-button size="medium" :ripple="true" type="success" @click="fhsy">返&nbsp;&nbsp;回</u-button>
			</view>
		</block>
	</view>
</template>
<script>
	//#ifndef MP-WEIXIN
	import Docxtemplater from "docxtemplater";
	import ImageModule from "docxtemplater-image-module-free";
	import PizZip from "pizzip";
	import PizZipUtils from "pizzip/utils/index.js";
	import { saveAs } from "file-saver";

	function loadFile(url, callback) {
		PizZipUtils.getBinaryContent(url, callback);
	}
	//word图片参数
	const imageOpts = {
		getImage(dataURL) {
			const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
			if (typeof dataURL !== "string" || !base64Regex.test(dataURL)) {
				return false;
			}
			const stringBase64 = dataURL.replace(base64Regex, "");
			// For nodejs
			if (typeof Buffer !== "undefined" && Buffer.from) {
				return Buffer.from(stringBase64, "base64");
			}
			// For browsers :
			const binaryString = window.atob(stringBase64);
			const len = binaryString.length;
			const bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) {
				const ascii = binaryString.charCodeAt(i);
				bytes[i] = ascii;
			}
			return bytes.buffer;
		},
		getSize(img, tagValue, tagName) {
			return [100, 100];
		},
	};
	//#endif
	import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue'
	export default {
      //处理columns{0:'单行文本',1:'多行文本',2:'单选框',3:'多选框',4:'单选下拉',5:'多选下拉',6:'单图上传',7:'多图上传',8:'日期',9:'时间',10:'日期时间',
      //11:'省市县联动',12:'手机号',13:'身份证号',14:'车牌号',15:'整数',16:'小数',17:'审核',18:'签名',19:'表中表',20:'网址',21:'数组',22:'行内计算'
      //23:'随机密钥',24:'关联用户'};
		data() {
			return {
				id: '',
				bm: '',
				xmmc: '',
				userid: 1,//扫码进入的数据管理员
				title: '',
				beizhu: '',
				zdsz: {},
				zd: {},
				cxtj: {},
				cxfs: 1,
				kftb: 1,
				cftb: 2,
				tbtz: [1,2],//填报跳转:1返回首页2我要修改3继续填报4关闭页面5阻止返回
				cxjgkeys: [],
				keys: [
					'K0',
					'K1',
					'K2',
					'K3',
					'K4',
					'K5',
					'K6',
					'K7',
					'K8',
					'K9',
					'K10',
					'K11',
					'K12',
					'K13',
					'K14',
					'K15',
					'K16',
					'K17',
					'K18',
					'K19',
					'K20',
					'K21',
					'K22',
					'K23',
					'K24',
					'K25',
					'K26',
					'K27',
					'K28',
					'K29',
					'K30',
					'K31',
					'K32',
					'K33',
					'K34',
					'K35',
					'K36',
					'K37',
					'K38',
					'K39',
					'K40',
					'K41',
					'K42',
					'K43',
					'K44',
					'K45',
					'K46',
					'K47',
					'K48',
					'K49',
					'K50',
					'K51',
					'K52',
					'K53',
					'K54',
					'K55',
					'K56',
					'K57',
					'K58',
					'K59',
					'K60',
				],//遍历顺序
				cxjgs: {},
				texts: [0, 1, 2, 4, 8, 9, 10, 11, 14, 15, 16, 17, 22],
				image: {
					K0: [],
					K1: [],
					K2: [],
					K3: [],
					K4: [],
					K5: [],
					K6: [],
					K7: [],
					K8: [],
					K9: [],
					K10: [],
					K11: [],
					K12: [],
					K13: [],
					K14: [],
					K15: [],
					K16: [],
					K17: [],
					K18: [],
					K19: [],
					K20: [],
					K21: [],
					K22: [],
					K23: [],
					K24: [],
					K25: [],
					K26: [],
					K27: [],
					K28: [],
					K29: [],
					K30: [],
					K31: [],
					K32: [],
					K33: [],
					K34: [],
					K35: [],
					K36: [],
					K37: [],
					K38: [],
					K39: [],
					K40: [],
					K41: [],
					K42: [],
					K43: [],
					K44: [],
					K45: [],
					K46: [],
					K47: [],
					K48: [],
					K49: [],
					K50: [],
					K51: [],
					K52: [],
					K53: [],
					K54: [],
					K55: [],
					K56: [],
					K57: [],
					K58: [],
					K59: [],
					K60: []
				},//压缩上传预览
				shzd: '',//审核字段
				jzxg: '',//审核禁止修改
				shtz: '',//审核通过跳转
				model: {},
				input: {},//用户输入内容
				wordfile: [],
				selectShow: {
					K0: false,
					K1: false,
					K2: false,
					K3: false,
					K4: false,
					K5: false,
					K6: false,
					K7: false,
					K8: false,
					K9: false,
					K10: false,
					K11: false,
					K12: false,
					K13: false,
					K14: false,
					K15: false,
					K16: false,
					K17: false,
					K18: false,
					K19: false,
					K20: false,
					K21: false,
					K22: false,
					K23: false,
					K24: false,
					K25: false,
					K26: false,
					K27: false,
					K28: false,
					K29: false,
					K30: false,
					K31: false,
					K32: false,
					K33: false,
					K34: false,
					K35: false,
					K36: false,
					K37: false,
					K38: false,
					K39: false,
					K40: false,
					K41: false,
					K42: false,
					K43: false,
					K44: false,
					K45: false,
					K46: false,
					K47: false,
					K48: false,
					K49: false,
					K50: false,
					K51: false,
					K52: false,
					K53: false,
					K54: false,
					K55: false,
					K56: false,
					K57: false,
					K58: false,
					K59: false,
					K60: false,
				}, //单选下拉控制弹起，必须提前写好变量
				customStyle: {
					margin: '10rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				},
				style: {
					p: 'line-height:1.6;'
				},
				login: false,
				userInfo: {},
				loading: false,
				bzb: '',
				action: getApp().globalData.url + '/uploadimg', //后端上传文件
				actionbd: getApp().globalData.url + '/admin/idcardocr', //百度ai识别
				sizetype: ['compressed'], //压缩图
				pmwidth: 1000,
			}
		},
		onBackPress(e){
			if(!this.tbtz.includes(5)){
				return false;//阻止返回
			}
			return true;
		},
		onLoad: function(option) {
			// #ifdef APP-PLUS
			let webView = this.$scope.$getAppWebview();
			webView.setStyle({
				titleNView:{
					autoBackButton:false
				}
			})
			// #endif
			// #ifdef H5
			var webH5 = document.getElementsByClassName('uni-page-head-btn')[0];
			webH5.style.display = 'none';
			// #endif
			if (!option.id) {
				this.$u.toast('参数错误');
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/cx/cx'
					});
				}, 500);
			} else {
				this.id = option.id;
				this.userid = option.userid ? option.userid : 1;
				this.loading = true;
				//获取屏幕宽度
				uni.getSystemInfo({
					success: (res) => {	
						this.pmwidth = res.windowWidth;
					}
				});
				uni.request({
					url: getApp().globalData.url + '/cx/cxtj',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
					},
					data: {
						ID: this.id
					},
					success: (res) => {
						if (res.statusCode == 401 && getApp().globalData.data.islogin == '2') {
							uni.showToast({
								title: '登录已过期',
								success: (res) => {
									setTimeout(() => {
										uni.removeStorageSync('userInfo');
										uni.navigateTo({
											url: '/pages/user/login'
										})
									}, 600);
								}
							});
							return;
						} else if(res.statusCode !== 200){
							return this.$u.toast('服务器无法连接');
						}
						if (res.data.code == 1) {
							return this.$u.toast(res.data.message);
						} else if (res.data.result) {
							this.cxtj = res.data.result.Cxtj;
							this.zd = res.data.result.Zd;
							this.bm = res.data.result.Bm;
							this.xmmc = res.data.result.Xmmc;
							this.beizhu = res.data.result.Beizhu;
							this.zdsz = res.data.result.Zdsz;
							this.cxfs = res.data.result.Cxfs;
							this.kftb = res.data.result.Kftb;
							this.cftb = res.data.result.Cftb;
							this.tbtz = res.data.result.Tbtz;
							this.wordfile = res.data.result.Word;
							for(let k in this.zdsz){
								if(this.zdsz[k].i == 19){
									this.bzb = k;//表中表字段
								}
								if(this.zdsz[k].i == 17){
									this.shzd = k;//审核字段
									this.jzxg = this.zdsz[k].jzxg ? this.zdsz[k].jzxg : '';
									this.shtz = this.zdsz[k].tz ? this.zdsz[k].tz : '';
								}
							}
							if(!this.tbtz.includes(5)){
								//填报跳转:1返回首页2我要修改3继续填报4关闭页面5阻止返回
								// #ifdef APP-PLUS
								let webView = this.$scope.$getAppWebview();
								webView.setStyle({
									titleNView:{
										autoBackButton:true
									}
								})
								// #endif
								// #ifdef H5
								var webH5 = document.getElementsByClassName('uni-page-head-btn')[0];
								webH5.style.display = '';
								// #endif
							}
							this.loading = false;
						}
					}
				});
			}
		},
		
		components: {
			htzImageUpload,
		},
		
		methods: {
			//长按复制
			 // #ifdef H5
			 onCopy(e) {
			   uni.showToast({
			   	title:'复制成功',
			   	icon:'none',
			   	position:'top'
			   })
			 },
			// #endif
			// #ifndef H5
			copyText(txt) {
				txt = String(txt) + "";
				console.log(txt);
				uni.setClipboardData({
					data:String(txt),
					success() {
						uni.showToast({
							title:'复制成功',
							icon:'none',
							position:'top'
						})
					}
				})
			},
			// #endif
			//实现任意字符中间星号
			zjxh(i,zjxh,str){
				if(!str)return '';
				if(zjxh != 2)return str;
				if(i == 13){
					return str.replace(/^(.{6})(?:\w+)(.{4})$/, "\$1********\$2")
				} else if(i == 12){
					return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
				}
				let newStr;//姓名
				let name = str;
				if (name.length === 2) {
				newStr = name.substr(0, 1) + '*';
				} else if (name.length > 2) {
				  let char = '';
				  for (let i = 0, len = name.length - 2; i < len; i++) {
					char += '*';
				  }
				  newStr = name.substr(0, 1) + char + name.substr(-1, 1);
				} else {
				  newStr = name;
				}
				return newStr;
			},
			//上传身份证图并识别
			zidingyiSuccess(res) {
				var _res = JSON.parse(res.data);
				if (_res.code == 0) {
					//上传成功
					let k = _res.message;
					let imgurl = _res.result;
					this.image[k].push(imgurl);//显示预览图
					uni.request({
						url: this.actionbd,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
						},
						data: {
							imgurl: imgurl
						},
						success: (res) => {
							if (res.statusCode == 401 && getApp().globalData.data.islogin == '2') {
								uni.showToast({
									title: '登录已过期',
									success: (res) => {
										setTimeout(() => {
											uni.removeStorageSync('userInfo');
											uni.navigateTo({
												url: '/pages/user/login'
											})
										}, 600);
									}
								});
								return;
							} else {
								if (res.data.code != 0) {
									return this.$u.toast(res.data.message);
								}
								var sbjg = res.data.result.words_result; //识别结果{住址,公民身份号码,出生,姓名,性别,民族}
								if (!sbjg) {
									return this.$u.toast(res.data.result.error_msg);
								}
								var dx = {}; //赋值到这里
								dx.name = sbjg.姓名.words;
								dx.sex = sbjg.性别.words;
								dx.mz = sbjg.民族.words;
								let day = sbjg.出生.words;
								dx.day = day.substr(0, 4) + '-' + day.substr(4, 2) + '-' + day.substr(6, 2)
								dx.ade = sbjg.住址.words;
								dx.zmtp = JSON.stringify([imgurl]); //图片，需要标注让后面提交时不检测
								let number = sbjg.公民身份号码.words;
								//zdsz中是否绑定了要自动填写的字段
								//"K3": {mz:"K1",ade": "K4", "day": "K1", "sex": "K2", "name": "K0", "zmtp": "K6"},
								this.model[k] = number; //先填充身份证号码
								var zdsz = this.zdsz[k];
								for(let key in zdsz){
									if(['ade','day','sex','name','zmtp','mz'].includes(key) && zdsz[key] && this.cxtj.includes(zdsz[key])){
										this.model[zdsz[key]] = dx[key]
									}
								}
								this.$forceUpdate(); //强制刷新视图
							}
						},
					});
				} else {
					return this.$u.toast('图片上传失败');
				}
			},
			//读取word模板并生成
			//#ifndef MP-WEIXIN
			scword(item) {
				let bzb = this.bzb;
				let u = this.$u.test;
				let xmmc = this.xmmc;
				let file = this.wordfile;
				//let file = "./static/moban.docx";
				if (!file) return;
				loadFile(file, function(error, content) {
					if (error) {
						throw error;
					}
					const zip = new PizZip(content);
					console.log(zip);
					const doc = new Docxtemplater(zip, {
						paragraphLoop: true,
						linebreaks: true,
						modules: [new ImageModule(imageOpts)]
					});
					try {
						//这一行数据的数组，需要判断有无表中表字段，如有需要将其转为数组
						if (bzb) {
							for (let k in item) {
								if (k && k == bzb && item[k] && !u.array(item[k])) {
									item[k] = JSON.parse(item[k]);
								}
							}
						}
						doc.render(item); // 替换{K1:张三}
					} catch (error) {
						// The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
						function replaceErrors(key, value) {
							if (value instanceof Error) {
								return Object.getOwnPropertyNames(value).reduce(function(error, key) {
									error[key] = value[key];
									return error;
								}, {});
							}
							return value;
						}
						console.log(JSON.stringify({
							error: error
						}, replaceErrors));
						if (error.properties && error.properties.errors instanceof Array) {
							const errorMessages = error.properties.errors.map(function(error) {
								return error.properties.explanation;
							}).join("\n");
							console.log("errorMessages", errorMessages);
						}
						throw error;
					}
					const out = doc.getZip().generate({
						type: "blob",
						mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					});
					saveAs(out, xmmc + ".docx");
				});
			},
			//#endif

			//单选下拉数据转换
			dxselect(e, k) {
				if (!e) return [];
				return e.split('/').map(num => {
					return {
						value: k,
						label: num
					}
				});
			},

			// 下拉单选回调，取数组的第一个元素即可
			confirm(e) {
				var temp = e.shift();
				var k = temp.value;
				this.model[k] = temp.label;
			},
			submit: function(e) {
				//console.log('表单数据', this.model);return;
				this.cxjgs = {};
				this.cxjgkeys = [];
				//进行表单检查
				var formData = this.model;
				var isnull = true;
				var input = {};
				//精准查询必须全部填写
				for (var i in formData) {
					if (!formData[i]) {
						if (this.cxfs == 2) var isnull = false;
					} else {
						input[i] = formData[i];
					}
				}
				if (this.$u.test.isEmpty(input)) {
					var isnull = false; //模糊查询必须有一个填写
				}
				console.log('验证', isnull);
				if (isnull) {
					for(let k in input){
						//校验身份证和手机号
						if(this.zdsz[k].i == 12){
							if(!this.$u.test.mobile(input[k])){
								return this.$u.toast("手机号格式不正确！");
							}
						}
						if(this.zdsz[k].i == 13){
							if(!this.$u.test.idCard(input[k])){
								return this.$u.toast("身份证号格式不正确！");
							}
						}
					}
					this.input = input;
					uni.request({
						url: getApp().globalData.url + '/cx/cxjg',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
						},
						data: {
							id: this.id,
							zd: JSON.stringify(this.zd),
							input: JSON.stringify(this.input)
						},
						success: (res) => {
							if (res.statusCode == 401 && getApp().globalData.data.islogin == '2') {
								uni.showToast({
									title: '登录已过期',
									success: (res) => {
										setTimeout(() => {
											uni.removeStorageSync('userInfo');
											uni.navigateTo({
												url: '/pages/user/login'
											})
										}, 600);
									}
								});
								return;
							} else if(res.statusCode !== 200){
								return this.$u.toast('服务器无法连接');
							}
							if (res.data.code == 1) {
								return this.$u.toast(res.data.message);
							} else if (res.data.code == 2) {
								//没有找到，如果开放了填报且开放重复填报，则进入填报
								if (this.kftb == 2 && this.cftb == 2) {
									uni.navigateTo({
										url: '/pages/form/form?zt=0&id=' + this.id + '&oldform=' +
											JSON.stringify(this.input) + '&userid=' + this.userid
									});
								} else {
									return this.$u.toast(res.data.message);
								}
							} else {
								this.cxjgs = res.data.result;
								if(!this.cxjgs)return this.$u.toast(res.data.message);
								let temp = [];//v-for遍历解决排序问题
								let old = Object.keys(this.cxjgs[0]);
								for(let k of this.keys){
									if(old.includes(k)){
										temp.push(k);
									}
									//判断如果审核通过设置jzxg，且有跳转url，需要跳转，只支持第一个结果
									if(this.shzd && this.shzd == k && this.jzxg && this.cxjgs[0][k] == this.jzxg && this.shtz && this.$u.test.url(this.shtz)){
										uni.navigateTo({
											url: '/pages/form/webview?url='+encodeURIComponent(this.shtz)
										});
									}
								}
								this.cxjgkeys = temp;
							}
						}
					});
				} else {
					uni.showToast({
						title: '请填写完整！',
						icon: "none"
					});
				}
			},

			//返回页面刷新数据
			onShow() {
				this.cxjgs = {};
			},
			//重置
			reset: function() {
				this.cxjgs = {};
				this.$refs.uForm.resetFields()
			},
			//修改
			edit(jgid) {
				uni.navigateTo({
					url: '/pages/form/formedit?id=' + this.id + '&jgid=' + jgid
				});
			},
			//新建填报
			create() {
				uni.navigateTo({
					url: '/pages/form/form?zt=0&id=' + this.id + '&oldform=' +
						JSON.stringify(this.input) + '&userid=' + this.userid
				});
			},
			//返回
			fhsy() {
				uni.navigateBack();
			},

			//预览图片
			previewImage: function(img) {
				var img = this.isJSON(img) ? JSON.parse(img) : [img];
				uni.previewImage({
					urls: img
				})
			},
			isJSON: function(str) {
				if (typeof str == 'string') {
					try {
						var obj = JSON.parse(str);
						if (typeof obj == 'object' && obj) {
							return true;
						} else {
							return false;
						}
					} catch (e) {
						return false;
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}

	.btn {
		text-align: center;
	}

	.zwf {
		visibility: hidden;
	}

	.video {
		width: 100%;
	}

	.u-content {
		margin-top: 30rpx;
	}

	.u-bt {
		text-align: center;
		font-size: medium;
		margin: 2px;
	}

	audio {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
