<template>
	<view class="wrap">
		<view class="u-bt">
			<u-avatar :src="userInfo.avatar" show-sex :sex-icon="(userInfo.sex == 1 ? 'man' : 'women')"></u-avatar>
			<view class="bt">修改个人信息</view>
		</view>
		<u-form :model="userInfo" ref="uForm">
			<u-form-item label="姓名" prop="Name" label-width="120" required placeholder="请输入姓名">
				<u-input v-model="userInfo.Name" />
			</u-form-item>
			<u-form-item label="手机号" prop="Mobile" label-width="120" required placeholder="请输入手机号">
				<u-input v-model="userInfo.Mobile" />
			</u-form-item>
			<u-form-item label="邮箱" prop="Email" label-width="120" required placeholder="请输入邮箱">
				<u-input v-model="userInfo.Email" />
			</u-form-item>
			<u-form-item label="密码" prop="NewPassword">
				<u-input v-model="userInfo.NewPassword" type="password" label-width="120" placeholder="如果不修改密码,就不要输入" />
			</u-form-item>
			<u-form-item label="简介" prop="Remark" label-width="120" placeholder="请输入个人简介">
				<u-input v-model="userInfo.Remark" type="textarea" height="150" :auto-height="true" />
			</u-form-item>
		</u-form>
		<u-button :custom-style="customStyle" @click="submit" type="primary">提交修改</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: '',
				login: '',
				customStyle: {
					marginTop: '20px',
					width: '300rpx',
				},
				rules: {
					Name: [{
						required: true,
						message: '请输入姓名',
						trigger: ['change', 'blur'],
					}],
					Email: [{
						min: 5,
						message: '简介不能少于5个字',
						trigger: 'change'
					}],
					Mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}],
				}
			};
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if (this.userInfo.NewPassword) {
							this.userInfo.Password = this.userInfo.NewPassword;
						}else{
							this.userInfo.Password = '';//没输入密码时，不更改
						}
						uni.request({
							url: getApp().globalData.url + '/admin/system/updateuser',
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded',
								Authorization: 'Bearer ' + this.userInfo.token
							},
							data: this.userInfo,
							success: (res) => {
								if(res.statusCode == 401){
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
								}else{
									if (res.data.code == 0) {
										delete this.userInfo.NewPassword;
										uni.setStorageSync('userInfo', this.userInfo);
									}
									uni.showToast({
										title: res.data.message,
										duration: 1500,
										success: (res) => {
											setTimeout(() => {
												uni.switchTab({
													url: '/pages/user/user',
												})
											}, 600);
										}
									});
								}
							}
						});
					} else {
						console.log('验证失败');
					}
				});
			}
		},
		//注意一定要用onShow才能刷新数据
		onShow() {
			try {
				var userInfo = uni.getStorageSync('userInfo');
				//console.log(userInfo);
				if (userInfo) {
					this.userInfo = userInfo;
					this.login = true;
				} else {
					this.login = false;
					uni.navigateTo({
						url: '/pages/user/login'
					})
				}
			} catch (e) {
				console.log('获取用户信息失败', e)
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
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

		.bt {
			margin: 2rpx 0 20rpx 0
		}
	}
</style>
