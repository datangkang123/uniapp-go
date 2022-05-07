<template>
	<view>
		<view class="uni-header" v-if="userInfo.Role == 'admin' || userInfo.Role == 'cjsjgl'">
			<u-icon name="home" label="查询/填报项目" label-size="33" size="36" @click="gohome"></u-icon>
			<view class="u-row-left u-m-20">
				<button class="uni-button" type="primary" size="mini" @click="create">新建项目</button>
			</view>
		</view>
		<view class="uni-container" v-if="userInfo.Role == 'admin' || userInfo.Role == 'cjsjgl'">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th width="230" align="center">项目和创建日期</uni-th>
					<uni-th width="175" align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>
						<view class="u-font-sm" @click="views(item.ID)">{{ item.Xmmc }}
							{{ $u.timeFormat(item.CreatedAt, 'yyyy-mm-dd') }}
						</view>
					</uni-td>
					<uni-td>
						<view class="uni-group">
							<u-button size="mini" type="success" :custom-style="customStyle" plain
								@click="views(item.ID)">查看</u-button>
							<u-button size="mini" type="primary" :custom-style="customStyle" plain
								@click="edit(item.ID)">设置</u-button>
							<u-button size="mini" type="error" :custom-style="customStyle" plain @click="del(item.ID)">
								删除</u-button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<view class="uni-pagination-box">
			<picker class="select-picker" mode="selector" :value="pageSizeIndex" :range="pageSizeOption"
				@change="changeSize">
				<button type="default" size="mini" :plain="true">
					<text>{{pageSizeOption[pageSizeIndex]}} 条/页</text>
					<uni-icons class="select-picker-icon" type="arrowdown" size="12" color="#999"></uni-icons>
				</button>
			</picker>
			<uni-pagination :page-size="pageSize" v-model="pageCurrent" :total="total" @change="change" />
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				pageSize: 7, // 每页数据量
				pageCurrent: 1, // 当前页
				total: 0, // 数据总量
				selectedIndexs: [],
				pageSizeIndex: 0,
				pageSizeOption: [7, 10, 20, 50, 100, 200],
				loading: false,
				login: false,
				userInfo: {},
				customStyle: {
					margin: '10rpx'
				},
				url: ''
			}
		},
		onLoad() {
			this.url = getApp().globalData.url;
			try {
				var userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.userInfo = userInfo;
					this.login = true;
					this.selectedIndexs = [];
					if (userInfo.Role != 'admin' && userInfo.Role != 'cjsjgl') {
						this.$u.toast('无权进入');
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/cx/index'
							});
						}, 500);
					} else {
						this.getData(this.pageCurrent);
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

		//下拉刷新
		onPullDownRefresh() {
			this.getData(this.pageCurrent);
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},

		methods: {
			//返回首页
			gohome() {
				uni.switchTab({
					url: '/pages/cx/index'
				});
			},
			//每页条数切换
			changeSize(e) {
				this.pageSizeIndex = e.detail.value;
				this.pageSize = this.pageSizeOption[e.detail.value];
				this.getData(this.pageCurrent);
			},

			// 分页触发
			change(e) {
				this.selectedIndexs.length = 0;
				this.getData(e.current);
			},

			// 获取数据
			getData(pageCurrent, value = '') {
				this.loading = true;
				this.pageCurrent = pageCurrent;
				uni.request({
					url: this.url + '/admin/system/getAllBgsxList',
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + this.userInfo.token
					},
					data: {
						pageSize: this.pageSize,
						total: this.total,
						page: this.pageCurrent
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
							if (res.data.result) {
								this.tableData = res.data.result.items;
								this.total = res.data.result.total;
								this.loading = false;
							} else {
								return this.$u.toast("暂无数据");
							}
						}
					}
				});
			},

			//查看项目数据
			views(id) {
				uni.navigateTo({
					url: '/pages/admin/table?id=' + id
				})
			},

			//新建项目
			create() {
				uni.navigateTo({
					url: '/pages/admin/bgsxcreate'
				})
			},

			//编辑项目
			edit(id) {
				uni.navigateTo({
					url: '/pages/admin/bgsxedit?id=' + id
				})
			},

			//删除项目
			del(id) {
				uni.showModal({
					title: '确认删除？',
					content: '删除后无法恢复',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.url + '/admin/system/delbgsx',
								method: 'POST',
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
									Authorization: 'Bearer ' + this.userInfo.token
								},
								data: {
									ID: id,
									isdel: 0
								},
								success: (res) => {
									if (res.statusCode == 401) {
										uni.showToast({
											title: '登录已过期',
											success: (res) => {
												setTimeout(() => {
													uni.removeStorageSync(
														'userInfo');
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
											this.getData(this.pageCurrent);
										}
										return this.$u.toast(res.data.message);
									}
								}
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
</style>
