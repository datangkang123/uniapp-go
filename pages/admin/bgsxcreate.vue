<template>
	<view class="wrap">
		<view class="u-bt">新建填报项目</view>
		<u-form :model="model" ref="uForm" :errorType="errorType">
			<u-form-item :label-position="labelPosition" label="项目分类" prop="xmbs" :required="true">
				<u-input v-if="fldata" v-model="model.xmbs" type="select" @click="selectShowfl = true" placeholder="选择项目分类" />
				<u-select v-model="selectShowfl" mode="single-column" :list="fldata" @confirm="confirm"></u-select>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="项目名称" prop="xmmc" :required="true">
				<u-input placeholder="查询或填报的项目名称" v-model="model.xmmc" type="text"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" :border-bottom="false" label="字段" :required="true">
			</u-form-item>
			<block v-for="(item,k) in model.zd" :key="k">
				<u-field v-model="model.zd[k]" :label="'字段' + k" placeholder="输入字段名称">
					<u-button size="mini" type="error" slot="right" @click="delzd(k)">删除</u-button>
				</u-field>
			</block>

			<u-form-item>
				<u-button size="mini" type="primary" @click="addzd()">添加字段</u-button>
			</u-form-item>

			<u-form-item :label-position="labelPosition" label="备注" prop="beizhu">
				<u-input auto-height placeholder="输入备注内容" v-model="model.beizhu" type="textarea">
				</u-input>
			</u-form-item>
		</u-form>
		<u-button :custom-style="customStyle" @click="submit" type="primary">提交</u-button>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				model: {
					xmbs: '',
					xmmc: '',
					zd: [],
					zdsz: {},
					beizhu: '',
				},
				labelPosition: 'top', //标题在顶部或left
				errorType: ['message'], // 文字提示
				scrollTop: 0,
				customStyle: {
					marginTop: '20px'
				},
				login: false,
				userInfo: '',
				fldata: [],//分类
				selectShowfl:false,
			};
		},
		onLoad: function(option) {},

		onReady() {
			this.syscsh(); //初始化数据
		},

		//下拉刷新
		onPullDownRefresh() {
			this.syscsh(); //初始化数据
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},

		methods: {
			//初始化数据
			syscsh(id) {
				try {
					var userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						this.userInfo = userInfo;
						this.login = true;
						//获取项目分类
						if(getApp().globalData.data.xmfl){
							let xmfl = getApp().globalData.data.xmfl.split(',');
							for (let v of xmfl) {
								this.fldata.push({
									value: v,
									label: v
								});
							}
						}
					} else {
						this.login = false;
						uni.navigateTo({
							url: '/pages/user/login'
						});
						return this.$u.toast('请先登录');
					}
				} catch (e) {
					console.log('获取用户信息失败', e);
				}

			},

			onPageScroll(e) {
				this.scrollTop = e.scrollTop; //返回顶部
			},

			submit() {
				if (this.$u.test.isEmpty(this.model.xmmc) || this.$u.test.isEmpty(this.model.xmbs)) {
					return this.$u.toast('项目名称和标识为空');
				}
				var zdsz = {};//必须用对象{}，否则转json会变空值
				var zd = {};
				var temp = this.model.zd;
				for (let s = 0; s < temp.length; s++) {
					if (!this.$u.test.isEmpty(temp[s])) {
						zd["K" + s] = temp[s];
						zdsz['K' + s] = {
							i: 0,
							bt: 1,
							zd: 1,
							wy: 1,
							yc: 0,
							sl: 200,
							xx:'',
							moren:'',
							ts: '请输入' + temp[s],
							width:100
						}; //默认字段类型为文本，初始设置
					}
				}
				if (Object.keys(zd).length < 1) {
					return this.$u.toast('字段未设置');
				}
				uni.request({
					url: getApp().globalData.url + '/admin/system/addbgsx',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + this.userInfo.token
					},
					data: {
						xmbs: this.model.xmbs,
						xmmc: this.model.xmmc,
						zd: JSON.stringify(zd),
						zdsz: JSON.stringify(zdsz),
						beizhu: this.model.beizhu,
						tbtz:JSON.stringify([1,2]),
					},
					success: (res) => {
						if (res.statusCode == 401) {
							uni.showToast({
								title: '登录已过期',
								success: (res) => {
									setTimeout(() => {
										uni.removeStorageSync('userInfo');
										this.login = false;
										this.userInfo = {};
										uni.navigateTo({
											url: '/pages/user/login'
										})
									}, 600);
								}
							});
						} else {
							if (res.data.code == 0) {
								uni.showToast({
									title: res.data.message,
									success: (res) => {
										setTimeout(() => {
											uni.navigateTo({
												url: '/pages/admin/bgsx',
											})
										}, 600);
									}
								});
							} else {
								return this.$u.toast(res.data.message);
							}
						}
					}
				});
			},

			//添加字段
			addzd() {
				this.model.zd.push('');
			},

			//字段删除
			delzd(k) {
				this.model.zd.splice(k, 1);
			},
			
			confirm(e){
				this.model.xmbs = e.shift().value;
			},
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}

	.u-content {
		margin-top: 30rpx;
	}

	.u-bt {
		text-align: center;
		font-size: medium;
		margin: 2px;
	}
</style>
