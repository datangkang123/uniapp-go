<template>
	<view>
		<!-- <uni-notice-bar showIcon scrollable single v-if="data.gg" :text="data.gg"></uni-notice-bar> -->
		<uni-list v-for="(item,index) in xmlist" :key="index">
			<uni-list-item :title="item.Xmmc" link :to="('/pages/cx/cxtj?id='+item.ID)"
				:rightText="$u.timeFormat(item.CreatedAt, 'yyyy-mm-dd')" 
				v-if="item.Cxtj && item.Cxtj.length > 0"></uni-list-item>
		</uni-list>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				data: {},
				xmlist: {},
				scrollTop: 0,
			}
		},

		//返回顶部
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},

		//下拉刷新
		onPullDownRefresh() {
			this.csh();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},

		onLoad() {
			//自动更新
			this.data = getApp().globalData.data;
			const updateManager = wx.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				//请求完新版本信息的回调
				console.log(res.hasUpdate)
			});
			updateManager.onUpdateReady(function() {
				wx.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			});
			updateManager.onUpdateFailed(function() {
				console.log('下载失败');
			});
			this.csh();
		},

		methods: {
			//初始化
			csh() {
				uni.request({
					url: getApp().globalData.url + '/cx/cxlist',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
					},
					success: (res) => {
						console.log(res.statusCode);
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
							this.xmlist = res.data.result;
						} else {
							return this.$u.toast('暂无可查询的项目');
						}
					}
				});
			},
		}
	}
</script>

<style>
</style>
