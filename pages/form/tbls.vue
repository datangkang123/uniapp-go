<template>
	<view>
		<u-divider style="margin:1rem 0 1rem 0;">我的填报记录</u-divider>
		<uni-list v-for="(item,index) in cxjg" :key="index">
			<block v-for="(item2,index2) in item" :key="index2">
				<uni-list-item :title="item2.xmmc" :show-extra-icon="false" :extra-icon="icon1"
					:rightText="item2.created_at" link :to="('/pages/form/tbjg?id='+item2.id + '&jgid=' + item2.jgid)"
					:note="('ip：'+item2.tbip)"></uni-list-item>
			</block>
		</uni-list>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				url: '',
				userInfo: '',
				login: '',
				scrollTop: 0,
				cxjg: {},
				icon1: {
					color: '#4cd964',
					size: '22',
					type: 'search'
				}
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
			this.csh();
		},

		methods: {
			//初始化
			csh() {
				this.url = getApp().globalData.url;
				try {
					var userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						this.userInfo = userInfo;
						this.login = true;
						uni.request({
							url: this.url + '/api/tbls',
							method: 'POST',
							header: {
								Accept: 'application/json',
								Authorization: 'Bearer ' + this.userInfo.token
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
								this.cxjg = res.data.cxjg
							}
						});
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
		}
	}
</script>

<style>
</style>
