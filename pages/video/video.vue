<template>
	<view class="wrap">
		<view class="u-bt">抖音去水印</view>
		<u-alert-tips type="warning" title="抖音内点击分享->复制链接, 粘贴到下面的输入框中提交. 如果解析成功, 会显示视频并自动复制无水印下载链接, 粘贴到浏览器即可下载">
		</u-alert-tips>
		<u-form :model="form" ref="uForm">
			<u-form-item label="链接" prop="url" required>
				<u-input v-model="form.url" type="textarea" :auto-height="true" :border="true" placeholder="抖音的视频分享链接"/>
			</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
		<view v-if="video.title" class="top">
			<u-divider>解析结果</u-divider>
			<view class="top">{{video.title}}}</view>
			<uni-td>
				<video :src="video.video" controls></video>
			</uni-td>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					url: '',
				},
				video:{},
				userInfo:{},
				login:false,
				rules: {
					url: [{
						required: true,
						message: '请粘贴抖音的视频分享链接',
						trigger: ['change', 'blur'],
					}]
				}
			};
		},
		methods: {
			submit() {
				this.video = {};
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.request({
							url: getApp().globalData.url + '/api/qsy',
							method: 'POST',
							header: {
								Accept: 'application/json',
								Authorization: 'Bearer ' + this.userInfo.token
							},
							data: {
								url: this.form.url
							},
							success: (res) => {
								if(res.data.code == 200){
									this.video = res.data.data;
									uni.setClipboardData({
									    data: this.video.video,
									});
									return this.$u.toast('去水印成功，链接已复制');
								}else{
									return this.$u.toast(res.data.msg);
								}
							}
						});
					} else {
						console.log('验证失败');
					}
				});
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			try {
				var userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.userInfo = userInfo;
					this.login = true;
					var token = this.userInfo.token;
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
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}
	.u-bt {
		text-align: center;
		font-size: medium;
		margin: 2px;
	}
	.top{
		margin-top: 30rpx;
	}
</style>
