<template>
	<view class="content">
		<view class="header">
			<!-- <image :src="logo"></image> -->
			<u-avatar :src="logo" size="161"></u-avatar>
		</view>

		<view class="list">
			<view class="list-call">
				<image class="img" src="/static/shilu-login/1.png"></image>
				<input class="sl-input" v-model="username" type="text" maxlength="32" placeholder="输入账号" />
			</view>
			<view class="list-call">
				<image class="img" src="/static/shilu-login/2.png"></image>
				<input class="sl-input" v-model="password" type="text" maxlength="32" placeholder="输入密码"
					password="true" />
			</view>
		</view>

		<view class="button-login" hover-class="button-hover" @tap="bindLogin()">
			<text>登 录</text>
		</view>

		<view class="agreenment" v-if="data.openreg == 2">
			<navigator url="forget" open-type="navigate">忘记密码</navigator>
			<text>|</text>
			<navigator url="reg" open-type="navigate">注册账户</navigator>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="wechat item wxdl">
			<view class="icon">
				<u-icon size="70" name="weixin-fill" @click="wxlogin()" color="rgb(83,194,64)"></u-icon>
			</view>
			微信登录
		</view>
		<!-- #endif-->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				//logo: '../../static/shilu-login/logo.png',
				logo:'',
				username: 'admin',
				password: '123456',
				userInfo: '',
				session_key: '',
				openid: '',
				data: '',
			};
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: getApp().globalData.data.title
			});
			try {
				var userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					uni.switchTab({
						url: '/pages/user/user',
					})
				}
				this.data = getApp().globalData.data;
			} catch (e) {
				uni.navigateTo({
					url: '/pages/user/login'
				})
			}
			//#ifdef MP-WEIXIN
			//this.wxlogin();//自动登录，为了方便测试不同账号，取消
			//#endif
		},

		methods: {
			//#ifdef MP-WEIXIN
			//获取小程序登录code,session_key后端用redis保存，提升安全性
			wxlogin() {
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						var code = loginRes.code;
						if (code) {
							uni.request({
								url: getApp().globalData.url + '/wxlogin',
								method: 'POST',
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
								data: {
									code: code
								},
								success: (res) => {
									console.log('小程序登录', res.data);
									//如果用户是不存在则自动注册，存在则登录，返回token
									if (res.data.code == 0) {
										this.getUserInfo(res.data.result.access_token)
									} else {
										return this.$u.toast(res.data.message);
									}
								},
							});
						}
					},
				});
			},
			//#endif

			bindLogin() {
				if (this.username.length < 2) {
					uni.showToast({
						icon: 'none',
						title: '账号不正确'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码不正确'
					});
					return;
				}
				uni.request({
					url: getApp().globalData.url + '/admin/login',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					data: {
						username: this.username,
						password: this.password
					},
					method: 'POST',
					success: (res) => {
						if (res.data.code !== 0) {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});
						} else {
							this.getUserInfo(res.data.result.access_token);
						}
					}
				});

			},

			//获取用户信息
			getUserInfo(token) {
				if(!token)return;
				uni.request({
					url: getApp().globalData.url + '/admin/getUserInfo',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + token
					},
					method: 'GET',
					success: (res) => {
						if (res.data.code == 0) {
							this.userInfo = res.data.result;
							this.userInfo.token = token;
							try {
								uni.setStorageSync('userInfo', this.userInfo);
								uni.showToast({
									title: '登录成功',
									success: (res) => {
										setTimeout(() => {
											uni.switchTab({
												url: '/pages/user/user',
											})
										}, 600);
									}
								});
							} catch (e) {
								console.log('缓存用户信息失败', e);
							}
						}
					},
				});
			}

		}
	}
</script>

<style>
	.wxdl {
		margin-top: 80rpx;
		text-align: center;
	}
	
	.show {
		color: #FFFFFF;
		font-size: 30rpx;
		width: 200rpx;
		height: 80rpx;
		background: #53c240;
		border-radius: 50rpx;
		line-height: 80rpx;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.header {
		width: 161rpx;
		height: 161rpx;
/* 		background: rgba(63, 205, 235, 1);
		box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47); */
		border-radius: 50%;
		margin-top: 100rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.list {
		display: flex;
		flex-direction: column;
		padding-top: 50rpx;
		padding-left: 70rpx;
		padding-right: 70rpx;
	}

	.list-call {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		color: #333333;
		border-bottom: 0.5px solid #e2e2e2;
	}

	.list-call .img {
		width: 40rpx;
		height: 40rpx;
	}

	.list-call .sl-input {
		flex: 1;
		text-align: left;
		font-size: 32rpx;
		margin-left: 16rpx;
	}

	.button-login {
		color: #FFFFFF;
		font-size: 34rpx;
		width: 470rpx;
		height: 100rpx;
		background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
		box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
		border-radius: 50rpx;
		line-height: 100rpx;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		margin-top: 100rpx;
	}

	.button-hover {
		background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
	}

	.agreenment {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		margin-top: 80rpx;
		color: #FFA800;
		text-align: center;
		height: 40rpx;
		line-height: 40rpx;
	}

	.agreenment text {
		font-size: 24rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
	}
</style>
