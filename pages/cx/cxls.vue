<template>
	<view>
		<u-divider style="margin:1rem 0 1rem 0;">我的查询记录</u-divider>
		<uni-list v-for="(item,index) in cxjg" :key="index">
			<uni-list-item :title="item.xmmc" :show-extra-icon="false" :extra-icon="icon1" :rightText="item.created_at"
				:note="('输入：'+JSON.stringify(item.cxsr))"></uni-list-item>
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
				uni.request({
					url: this.url + '/api/cxls',
					method: 'POST',
					header: {
						Accept: 'application/json',
						Authorization: 'Bearer ' + this.userInfo.token
					},
					success: (res) => {
						this.cxjg = res.data.cxjg
					}
				});
			}
		}
	}
</script>

<style>
</style>
