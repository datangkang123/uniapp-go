<template>
	<view v-if="blogs">
		<uni-list>
			<uni-list :border="true">
				<uni-list-chat :title="item.Title" v-for="(item,index) in blogs" :key="index" :avatar="item.Photo ? item.Photo[0] : ''" link
					to="" @click="goview(item.ID)" :note="item.Cjz" :time="$u.timeFormat(item.CreatedAt, 'yyyy-mm-dd')"
					:badge-text="(item.IsRead + '')">
				</uni-list-chat>
			</uni-list>
		</uni-list>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<u-loadmore :status="status" />
	</view>
	<view v-else>暂无内容</view>
</template>

<script>
	export default {
		data() {
			return {
				blogs: [],
				scrollTop: 0,
				pageSize: 9, // 每页数据量
				pageCurrent: 1, // 当前页
				total: 0, // 数据总量
				status: 'loadmore',
			}
		},

		onLoad() {
			this.index();
		},

		//上拉加载更多
		onReachBottom() {
			this.pageloding();
		},
		//手动点击加载更多
		loadmore() {
			console.log('加载更多');
			this.pageloding();
		},

		//下拉刷新
		onPullDownRefresh() {
			this.index();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},
		methods: {
			index() {
				uni.request({
					url: getApp().globalData.url + '/blog/index',
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					data: {
						isopen: 1,
						total: this.total,
						page: this.pageCurrent,
						pageSize: this.pageSize,
					},
					success: (res) => {
						if (res.data.result) {
							this.blogs = res.data.result.items;
							this.total = res.data.result.total;
						} else {
							return this.$u.toast("暂无数据");
						}
					}
				});
			},
			goview(id) {
				if (!id) return;
				uni.navigateTo({
					url: '/pages/blog/view?id=' + id
				});
			},
			//分页加载
			pageloding() {
				this.pageCurrent++;
				setTimeout(() => {
					if(this.total <= Object.keys(this.blogs).length)return;
					this.status = 'loading';
					uni.request({
						url: getApp().globalData.url + '/blog/index',
						method: 'GET',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						data: {
							isopen: 1,
							pageSize: this.pageSize,
							total: this.total,
							page: this.pageCurrent
						},
						success: (res) => {
							if (res.data.code == 0) {
								this.blogs = this.blogs.concat(res.data.result.items); //追加数据
								this.total = res.data.result.total;
								this.status = this.total > Object.keys(this.blogs).length ? 'loading' : 'nomore';
							} else {
								return this.$u.toast('没有更多数据');
							}
						}
					})
				}, 500)
			}
		}
	}
</script>

<style>
	.chat-custom-right {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}

	.chat-custom-text {
		font-size: 12px;
		color: #999;
	}

	.top {
		margin: 1rem 0 1rem 0;
	}
</style>
