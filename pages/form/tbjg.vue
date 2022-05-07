<template>
	<view class="wrap">
		<view class="u-bt" v-if="bgsx.Xmmc">{{bgsx.Xmmc}}</view>
		<block v-if="(cxjgs && Object.keys(cxjgs).length > 0)" v-for="(item,index) in cxjgs" :key="index">
			<view class="wrap btn">核对填报结果</view>
			<kzh-table border>
				<kzh-tr v-for="key in cxjgkeys" :key="key" v-if="(isedit == 0 || bgsx.Kfcx.includes(key))
				 && bgsx.Zdsz[key].yc != 2 && Number(bgsx.Zdsz[key].i) != 24">
					<kzh-th :style="'width:' + pmwidth * 0.4 + 'px'">{{bgsx.Zd[key]}}</kzh-th>
					<template v-if="(!item[key])">
						<kzh-td></kzh-td>
					</template>
					<template v-else>
						<!-- 文本显示 -->
						<kzh-td v-if="(texts.includes(Number(bgsx.Zdsz[key].i)))">{{ zjxh(bgsx.Zdsz[key].i,bgsx.Zdsz[key].zjxh,item[key])  }}</kzh-td>
						<!-- 身份证 -->
						<kzh-td v-if="(Number(bgsx.Zdsz[key].i) == 13)">{{ zjxh(bgsx.Zdsz[key].i,bgsx.Zdsz[key].zjxh,item[key])  }}</kzh-td>
						<!-- 手机号 -->
						<kzh-td v-if="(Number(bgsx.Zdsz[key].i) == 12)">{{ zjxh(bgsx.Zdsz[key].i,bgsx.Zdsz[key].zjxh,item[key])  }}</kzh-td>
						<!-- 多选json转换 -->
						<kzh-td v-if="(bgsx.Zdsz[key].i == 3 || bgsx.Zdsz[key].i == 5 || bgsx.Zdsz[key].i == 21)">
							{{JSON.parse(item[key]).toString()}}
						</kzh-td>
						<!-- 单图 -->
						<kzh-td v-if="(bgsx.Zdsz[key].i == 6)">
							<u-image mode="widthFix" :src="item[key] ? JSON.parse(item[key])[0] : ''"
								@click="previewImage(item[key])"></u-image>
						</kzh-td>
						<!-- 幻灯展示多图 -->
						<kzh-td v-if="(bgsx.Zdsz[key].i == 7 && isJSON(item[key]))">
							<u-swiper mode="number" :list="(JSON.parse(item[key]))" @click="previewImage(item[key])">
							</u-swiper>
						</kzh-td>
						<!-- 签名 -->
						<kzh-td v-if="(bgsx.Zdsz[key].i == 18)">
							<u-image mode="widthFix" width="150px" :src="item[key]" @click="previewImage(item[key])"></u-image>
						</kzh-td>
						<!-- 表中表 -->
						<kzh-td v-if="(bgsx.Zdsz[key].i == 19)">
							<view class="u-font-sm" :style="'width:' + pmwidth * 0.6 + 'px'">
								<view class="uni-container" v-if="item[key]">
									<uni-table ref="table" border stripe :loading="loading">
										<uni-tr>
											<uni-th align="center" v-for="(item1,i) in bgsx.Zdsz[key].bzb" :key="i">
												{{item1}}</uni-th>
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
						<kzh-td v-if="(bgsx.Zdsz[key].i == 20)">
							<navigator :url="'/pages/form/webview?url='+encodeURIComponent(item[key])" open-type="navigate">
								查看</navigator>
						</kzh-td>
					</template>
				</kzh-tr>
			</kzh-table>
		</block>
		<!-- 1返回首页2我要修改3继续填报4关闭页面5阻止返回 -->
		<view class="wrap btn" v-if="bgsx.Xmmc">
			<block v-for="(tz,key) in bgsx.Tbtz" :key="key">
				<u-button style="margin:15rpx;" v-if="tz == 1" size="medium" :ripple="true" type="primary"
					@click="submit(tz)">返回首页</u-button>
				<u-button style="margin:15rpx;" v-if="tz == 2" size="medium" :ripple="true" type="primary"
					@click="submit(tz)">我要修改</u-button>
				<u-button style="margin:15rpx;" v-if="tz == 3" size="medium" :ripple="true" type="primary"
					@click="submit(tz)">继续填报</u-button>
				<!-- #ifdef H5 -->
				<u-button style="margin:15rpx;" v-if="tz == 4" size="medium" :ripple="true" type="primary"
					@click="submit(tz)">关闭页面</u-button>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<navigator target="miniProgram" open-type="exit" v-if="tz == 4">
					<u-button style="margin:15rpx;" size="medium" :ripple="true" type="primary">关闭页面</u-button>
				</navigator>
				<!-- #endif -->
			</block>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				id: '',
				bgsx: {},
				jgid: '',
				title: '',
				selectShow: false,
				cxjgs: {},
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
				texts: [0, 1, 2, 4, 8, 9, 10, 11, 14, 15, 16, 17, 22, 23],
				cjz: 1,
				isedit: 0,
				loading: false,
				pmwidth: 1000,
			}
		},
		onLoad: function(option) {
			this.cxjgs = {};
			this.loading = true;
			if (!option.id || !option.jgid) {
				this.$u.toast('数据不存在');
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/form/tb'
					});
				}, 500);
			} else {
				this.id = option.id;
				this.jgid = option.jgid;
				this.cjz = option.cjz ? option.cjz : 1; //数据管理员id，如未指定则为总管理员id
				this.isedit = option.isedit ? option.isedit : 0;//是否从修改状态过来的
				//获取屏幕宽度
				uni.getSystemInfo({
					success: (res) => {	
						this.pmwidth = res.windowWidth;
					}
				});
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
			}
		},

		onShow() {
			uni.request({
				url: getApp().globalData.url + '/tb/tbjg',
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
				},
				data: {
					'id': this.id,
					'jgid': this.jgid
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
					if (res.data.code == 0) {
						this.cxjgs = res.data.result;
						this.bgsx = res.data.message;
						this.loading = false;
						if(!this.bgsx.Tbtz.includes(5)){
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
						let temp = [];//v-for遍历解决排序问题
						let old = Object.keys(this.cxjgs[0]);
						for(let k of this.keys){
							if(old.includes(k)){
								temp.push(k);
							}
						}
						this.cxjgkeys = temp;
					} else {
						this.$u.toast(res.data.message);
					}
				}
			});
		},

		mounted() {
			document.querySelector('.uni-page-head-hd').style.display = 'none'
		},

		//阻止返回
		onBackPress(e){
			if(!this.bgsx.Tbtz.includes(5)){
				return false;//阻止返回
			}
			return true;
		},

		methods: {
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
			//1返回首页 2我要修改 3继续填报 4关闭页面 5阻止返回
			submit(i) {
				if (i == 1) {
					uni.switchTab({
						url: '/pages/cx/index',
					})
				} else if (i == 2) {
					uni.navigateTo({
						url: '/pages/form/formedit?id=' + this.id + '&jgid=' + this.jgid,
					})
				} else if (i == 3) {
					uni.navigateTo({
						url: '/pages/form/form?zt=0&id=' + this.id + '&userid=' + this.cjz,
					})
				} else if (i == 4) {
					WeixinJSBridge.call('closeWindow');
				}
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
