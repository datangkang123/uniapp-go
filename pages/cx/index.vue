<template>
	<view>
		<view class="wrap">
			<u-swiper v-if="data" :list="data.pictures"></u-swiper>
		</view>
		<u-gap height="20" bg-color="#f3f3f3"></u-gap>
		<u-grid :col="3" :border="false">
			<u-grid-item v-if="data.daohang1 && data.daohang1[0]" @click="dh(data.daohang1[0],data.daohang1[2])">
				<u-icon name="search" :size="46"></u-icon>
				<view class="grid-text">{{ data.daohang1[1] }}</view>
			</u-grid-item>
			<u-grid-item v-if="data.daohang2 && data.daohang3[0]" @click="dh(data.daohang2[0],data.daohang2[2])">
				<u-icon name="zhuanfa" :size="46"></u-icon>
				<view class="grid-text">{{ data.daohang2[1] }}</view>
			</u-grid-item>
			<u-grid-item v-if="data.daohang3 && data.daohang3[0]" @click="dh(data.daohang3[0],data.daohang3[2])">
				<u-icon name="email" :size="46"></u-icon>
				<view class="grid-text">{{ data.daohang3[1] }}</view>
			</u-grid-item>
			<!-- 备用可选 -->
			<u-grid-item v-if="data.daohang4 && data.daohang4[0]" @click="dh(data.daohang4[0],data.daohang4[2])">
				<u-icon name="order" :size="46"></u-icon>
				<view class="grid-text">{{ data.daohang4[1] }}</view>
			</u-grid-item>
			<u-grid-item v-if="data.daohang5 && data.daohang5[0]" @click="dh(data.daohang5[0],data.daohang5[2])">
				<u-icon name="plus-circle" :size="46"></u-icon>
				<view class="grid-text">{{ data.daohang5[1] }}</view>
			</u-grid-item>
			<u-grid-item v-if="data.daohang6 && data.daohang6[0]" @click="dh(data.daohang6[0],data.daohang6[2])">
				<u-icon name="baidu" :size="46"></u-icon>
				<view class="grid-text">{{ data.daohang6[1] }}</view>
			</u-grid-item>
		</u-grid>

		<view v-if="gglist && Object.keys(gglist).length > 0">
			<u-gap height="20" bg-color="#f3f3f3"></u-gap>
			<view class="wrap">
				<u-section title="通知公告" type="line" font-size="33" :right="true" sub-title="查看更多" @click="bloglist">
				</u-section>
			</view>
			<uni-list v-for="(item,index) in gglist" :key="index">
				<uni-list-item clickable :title="item.Title" @click="goview(item.ID)" :thumb="item.Photo ? item.Photo[0] : ''" thumb-size="lg"
					:note="item.Cjz" :rightText="$u.timeFormat(item.CreatedAt, 'yyyy-mm-dd')">
				</uni-list-item>
			</uni-list>
		</view>

		<view v-if="cxlist && Object.keys(cxlist).length > 0">
			<u-gap height="20" bg-color="#f3f3f3"></u-gap>
			<view class="wrap">
				<u-section title="查询项目" type="line" font-size="33" :right="true" sub-title="查看更多" @click="cx"></u-section>
			</view>
			<uni-list v-for="(item,index) in cxlist" :key="item.Xmmc">
				<uni-list-item clickable :show-extra-icon="true" :extra-icon="cxicon" :title="item.Xmmc"
					@click="gocxtb(item.ID,item.Kftb,item.Cxtj)" :rightText="$u.timeFormat(item.CreatedAt, 'yyyy-mm-dd')">
				</uni-list-item>
			</uni-list>
		</view>
		
		<view v-if="tblist && Object.keys(tblist).length > 0">
			<view style="height:20rpx;background-color: #f3f3f3;"></view>
			<view class="wrap">
				<u-section title="填报项目" type="line" font-size="33" :right="true" sub-title="查看更多" @click="tb"></u-section>
			</view>
			<uni-list v-for="(item2,index2) in tblist" :key="item2.ID">
				<uni-list-item clickable :show-extra-icon="true" :extra-icon="tbicon" :title="item2.Xmmc"
					@click="gocxtb(item2.ID,item2.Kftb,item2.Cxtj)" :rightText="$u.timeFormat(item2.CreatedAt, 'yyyy-mm-dd')">
				</uni-list-item>
			</uni-list>
		</view>

		<u-gap height="30" bg-color="#f3f3f3"></u-gap>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				data: {},
				tblist: {},
				cxlist: {},
				gglist: {},
				cxicon: {
					color: '#4cd964',
					size: '19',
					type: 'search'
				},
				tbicon: {
					color: '#4cd964',
					size: '19',
					type: 'compose'
				},
			}
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

		onShow() {
			uni.setNavigationBarTitle({
				title: this.data.zdmc
			});
		},

		methods: {
			//初始化
			csh() {
				uni.request({
					url: getApp().globalData.url + '/cx/index',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
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
							this.data = getApp().globalData.data;
							this.gglist = res.data.result.blog;
							this.cxlist = res.data.result.cxlist;
							this.tblist = res.data.result.tblist;
						} else {
							return this.$u.toast('暂无可查询的项目');
						}
					}
				});
			},
			gocxtb(id, kftb, cxtj) {
				if (!id) {
					return this.$u.toast('参数错误！');
				}
				//查询
				if (kftb == 1) {
					if (!cxtj || Object.keys(cxtj).length == 0) {
						return this.$u.toast('查询条件为空！');
					}
					uni.navigateTo({
						url: '/pages/cx/cxtj?id=' + id
					});
				} else {
					//填报项目，判断有无查询条件，有条件先查询，无则填报
					if (cxtj && Object.keys(cxtj).length > 0) {
						uni.navigateTo({
							url: '/pages/cx/cxtj?id=' + id
						});
					} else {
						uni.navigateTo({
							url: '/pages/form/form?zt=0&id=' + id + '&userid=1'
						});
					}
				}
			},
			//导航
			dh(lx, url) {
				console.log(lx, url);
				if (lx == 'n') {
					uni.navigateTo({
						url: url
					});
				} else {
					let newurl = encodeURIComponent(url)
					uni.navigateTo({
						url: '/pages/form/webview?url=' + newurl
					})
				}
			},

			goview(id) {
				if (!id) {
					return this.$u.toast('参数错误！');
				}
				uni.navigateTo({
					url: '/pages/blog/view?id=' + id
				});
			},
			cx() {
				uni.navigateTo({
					url: '/pages/cx/cx'
				});
			},
			tb() {
				uni.navigateTo({
					url: '/pages/form/tb'
				});
			},
			bloglist() {
				uni.navigateTo({
					url: '/pages/blog/blog'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}
</style>
