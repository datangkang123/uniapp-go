<template>
	<view class="fix-top-window">
		<view class="uni-header" v-if="bgsx.Xmmc">
			<view class="u-item-title u-m-20">{{bgsx.Xmmc}}</view>
		</view>
		<view class="wrap">
			<button class="uni-button" type="primary" size="mini" @click="create">新增</button>
		</view>
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="center" v-for="(item,k) in bgsx.Zd" :key="k">{{item}}</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-if="bgsx.Xmmc" v-for="(item, index) in tableData" :key="index">
					<uni-td v-for="(zd,key) in bgsx.Zd" :key="key">
						<!-- 多选json转换 -->
						<view class="u-font-sm" v-if="(bgsx.Zdsz[key].i == 3 || bgsx.Zdsz[key].i == 5)">
							{{JSON.parse(item[key]).toString()}}
						</view>
						<!-- 单图 -->
						<view class="u-font-sm" v-else-if="(bgsx.Zdsz[key].i == 6)">
							<u-image mode="widthFix" width="100px" :src="JSON.parse(item[key])[0]" @click="previewImage(item[key])">
							</u-image>
						</view>
						<!-- 幻灯展示多图 -->
						<view class="u-font-sm" v-else-if="(bgsx.Zdsz[key].i == 7)">
							<u-swiper mode="number" :list="isJSON(item[key]) ? JSON.parse(item[key]) : []" @click="previewImage(item[key])">
							</u-swiper>
						</view>
						<!-- 签名 -->
						<view class="u-font-sm" v-else-if="(bgsx.Zdsz[key].i == 18)">
							<u-image mode="widthFix" width="100px" v-if="item[key]" :src="item[key]" @click="previewImage(item[key])">
							</u-image>
						</view>
						<!-- 表中表 -->
						<view class="u-font-sm" v-else-if="(bgsx.Zdsz[key].i == 19)">
							<view class="uni-container" v-if="item[key]">
								<uni-table ref="table" border stripe :loading="loading">
									<uni-tr>
										<uni-th align="center" v-for="(item1,i) in bgsx.Zdsz[key].bzb" :key="i">{{item1}}</uni-th>
									</uni-tr>
									<uni-tr v-for="(item2, index1) in JSON.parse(item[key])" :key="index1">
										<uni-td v-for="(item3,index2) in item2" :key="index2">
											{{ item3 }}
										</uni-td>
									</uni-tr>
								</uni-table>
							</view>
						</view>
						<!-- 网址 -->
						<view class="u-font-sm" v-else-if="(bgsx.Zdsz[key].i == 20)">
							<navigator :url="'/pages/form/webview?url='+encodeURIComponent(item[key])" open-type="navigate">查看</navigator>
						</view>
						<!-- 其他 -->
						<view class="u-font-sm" v-else>{{item[key]}}</view>
					</uni-td>
					<uni-td>
						<view class="uni-group">
							<u-button size="mini" type="primary" :custom-style="customStyle" plain
								@click="edit(item.ID)">修改</u-button>
							<u-button size="mini" type="error" :custom-style="customStyle" plain @click="del(item.ID)">
								删除</u-button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<view class="uni-pagination-box" v-if="bgsx.Xmmc">
			<picker class="select-picker" mode="selector" :value="pageSizeIndex" :range="pageSizeOption"
				@change="changeSize">
				<button type="default" size="mini" :plain="true">
					<text>{{pageSizeOption[pageSizeIndex]}} 条/页</text>
					<uni-icons class="select-picker-icon" type="arrowdown" size="12" color="#999"></uni-icons>
				</button>
			</picker>
			<uni-pagination :page-size="pageSize" v-model="pageCurrent" :total="total" @change="change" />
		</view>
		<view v-else>数据为空</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				pageSize: 10, // 每页数据量
				pageCurrent: 1, // 当前页
				total: 0, // 数据总量
				selectedIndexs: [],
				texts: [0, 1, 2, 4, 8, 9, 10],
				pageSizeIndex: 0,
				pageSizeOption: [10, 20, 50, 100, 200],
				loading: false,
				login: false,
				userInfo: {},
				id: '',
				bgsx: {},
				customStyle: {
					margin: '10rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				},
			}
		},
		onLoad(option) {
			if (!option.id) {
				this.$u.toast('数据传递不正确');
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/admin/bgsx'
					});
				}, 500);
			} else {
				this.id = option.id;
				try {
					var userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						this.userInfo = userInfo;
						this.login = true;
						this.selectedIndexs = [];
						if (userInfo.Role !== 'admin' && userInfo.Role != 'cjsjgl') {
							this.$u.toast('无权进入');
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/admin/bgsx'
								});
							}, 500);
						} else {
							this.getbgsx(); //获取项目数据
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
			//获取项目属性
			getbgsx() {
				uni.request({
					url: getApp().globalData.url + '/admin/system/getBgsx',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + this.userInfo.token
					},
					data: {
						ID: this.id
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
							if (res.data.code !== 0) {
								return this.$u.toast('参数获取失败');
							} else {
								this.bgsx = res.data.result;
								if (this.bgsx.Bm) this.getData(this.pageCurrent);
							}
						}
					}
				})
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
					url: getApp().globalData.url + '/admin/system/getTabel',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + this.userInfo.token
					},
					data: {
						id: this.bgsx.ID,
						isdel: 0,
						pageSize: this.pageSize,
						total: this.total,
						page: this.pageCurrent,
						search: '{}'
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

			//新建
			create() {
				uni.navigateTo({
					url: '/pages/form/form?zt=1&id=' + this.id +'&userid=1'
				});
			},

			//编辑
			edit(id) {
				uni.navigateTo({
					url: '/pages/form/formedit?id=' + this.id + '&jgid=' + id +'&userid=1&zt=1'
				});
			},

			//删除
			del(id) {
				uni.showModal({
					title: '确认删除？',
					content: '删除后无法恢复',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: getApp().globalData.url + '/admin/system/deltable',
								method: 'POST',
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
									Authorization: 'Bearer ' + this.userInfo.token
								},
								data: {
									id: this.bgsx.ID,
									tid: id, //行id
									del: 0
								},
								success: (res) => {
									if (res.data.code == 0) {
										this.getData(this.pageCurrent);
									}
									return this.$u.toast(res.data.message);
								}
							});
						}
					}
				});
			},

			//预览图片
			previewImage: function(img) {
				var img = this.isJSON(img) ? JSON.parse(img) : [img];
				uni.previewImage({
					urls: img
				})
			},
			isJSON: function(str) {
				if (typeof str == 'string') {
					try {
						var obj = JSON.parse(str);
						if (typeof obj == 'object' && obj) {
							return true;
						} else {
							return false;
						}
					} catch (e) {
						return false;
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef H5 */
	page {
		padding-top: 85px;
	}

	/* #endif */
	.wrap {
		padding-left: 39rpx;
	}

	.slot-content {
		font-size: 28rpx;
		color: $u-content-color;
		padding-left: 30rpx;
	}
</style>
