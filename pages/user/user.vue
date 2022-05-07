<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-t-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10" @click="useredit">
				<u-avatar :src="pic" size="135"></u-avatar>
			</view>
			<view class="u-flex-1" @click="useredit">
				<view class="u-font-18 u-p-b-20">{{login ? userInfo.Name : '您未登录'}}</view>
				<view class="u-font-14 u-tips-color">{{login ? userInfo.Mobile : '999999999'}}</view>
			</view>
			<view class="u-m-l-10 u-p-10" @click="san">
				<u-icon name="scan" color="#969799" size="39"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>

		<view class="u-m-t-20" v-if="userInfo && (userInfo.Role == 'admin' || userInfo.Role == 'cjsjgl')">
			<u-cell-group>
				<u-cell-item icon="setting" @click="admin" title="后台管理"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="查询记录" @click="cxls"></u-cell-item>
				<u-cell-item icon="zhuanfa" title="填报记录"  @click="tbls"></u-cell-item>
				<u-cell-item icon="play-circle" title="视频工具" @click="myvideo"></u-cell-item>
				<!-- #ifdef MP-WEIXIN -->
				<u-cell-item icon="chat" title="联系客服">
					<button class="contact-btn" open-type="contact">联系客服</button>
				</u-cell-item>
				<!--#endif-->
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="close" @click="outLogin" title="退出登录"></u-cell-item>
			</u-cell-group>
		</view>
		
		<u-modal v-model="show" content="您没有登录,跳转登录？" show-cancel-button 
		confirm-text="登录" cancel-text="返回" @confirm="confirm" @cancel="cancel"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pic: '',
				login: false,
				userInfo: '',
				show:false
			}
		},
		onLoad() {
		},
		//注意一定要用onShow才能刷新数据
		onShow() {
			try {
				var userInfo = uni.getStorageSync('userInfo');
				console.log(userInfo);
				if (userInfo) {
					this.userInfo = userInfo;
					this.login = true;
					this.pic = userInfo.avatar;
				} else {
					this.login = false;
					this.show = true;
				}
			} catch (e) {
				console.log('获取用户信息失败', e)
			}
		},
		methods: {
			confirm(){
				console.log('登录');
				uni.navigateTo({
					url: '/pages/user/login'
				})
			},
			//扫码登录
			//#ifdef MP-WEIXIN
			san(){
				uni.scanCode({
					scanType: ['qrCode'],
					success: (res) => {
						if(res.result){
							var index = res.result.lastIndexOf('?key=');
							var code = res.result.substring(index+5,res.result.length);
							uni.request({
								url: getApp().globalData.url + '/admin/smlogin',
								method: 'POST',
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
									Authorization: 'Bearer ' + this.userInfo.token
								},
								data: {
									token: this.userInfo.token,
									key: code
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
										return this.$u.toast(res.data.message);
									}
								},
							});
						}
					}
				});
			},
			//#endif
			admin(){
				console.log('后台管理');
				uni.navigateTo({
					url: '/pages/admin/bgsx'
				})
			},
			cancel(){
				console.log('返回首页');
				uni.switchTab({
					url: '/pages/cx/cx'
				})
			},
			//编辑用户信息
			useredit(){
				uni.navigateTo({
					url: '/pages/user/edit'
				})
			},
			//查询历史
			cxls(){
				uni.navigateTo({
					url: '/pages/cx/cxls'
				})
			},
			//填报历史
			tbls(){
				uni.navigateTo({
					url: '/pages/form/tbls'
				});
			},
			//视频去水印
			myvideo(){
				uni.navigateTo({
					url: '/pages/video/video'
				})
			},
			outLogin() {
				if (this.login) {
					uni.request({
						url: getApp().globalData.url + '/admin/logout',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization: 'Bearer ' + this.userInfo.token
						},
						method: 'GET',
						success: (res) => {
							uni.removeStorageSync('userInfo');
							this.login = false;
							this.userInfo = {};
							uni.navigateTo({
								url: '/pages/user/login'
							})
						},
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}
	
	.contact-btn {
		display: inline-block;
		position: absolute;
		height:85rpx;
		left:0rpx;
		z-index:200;
		top:15rpx;
		width: 100%;
		background: salmon;
		opacity: 0;
	}
</style>
