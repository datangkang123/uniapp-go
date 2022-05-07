<template>
	<view class="container" :style="{paddingBottom: showMoreTool ? '220rpx' : '120rpx'}">
		<view class="warp">
			<u-form :model="form" ref="uForm">
				<u-form-item label="标题" :border-bottom="false" required prop="title">
					<u-input v-model="form.title" :border="true" type="textarea" />
				</u-form-item>
				<u-form-item label="标签" :border-bottom="false" required prop="fl">
					<u-checkbox-group @change="checkboxGroupChange">
						<u-checkbox v-model="item.checked" v-for="(item, index) in list" :key="index" :name="item.name">
							{{item.name}}
						</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
			</u-form>
		</view>
		<editor class="ql-container" :placeholder="placeholder" :show-img-size="true" :show-img-toolbar="true"
			:show-img-resize="true" @ready="onEditorReady" id="editor" @statuschange="statuschange" @focus="editFocus"
			@blur="editBlur" ref="editot"></editor>
		<!-- 操作工具 -->
		<view class="tool-view">
			<view class="tool">
				<jinIcon class="single" type="&#xe6f3;" font-size="44rpx" title="插入图片" @click="insertImage"></jinIcon>
				<jinIcon class="single" type="&#xe6f9;" font-size="44rpx" title="修改文字样式" @click="showMore"
					:color="showMoreTool ? activeColor : '#666666'"></jinIcon>
				<jinIcon class="single" type="&#xe6eb;" font-size="44rpx" title="分割线" @click="insertDivider"></jinIcon>
				<jinIcon class="single" type="&#xe6e8;" font-size="44rpx" title="撤销" @click="undo"></jinIcon>
				<jinIcon class="single" type="&#xe705;" font-size="44rpx" title="重做" @click="redo"></jinIcon>
				<jinIcon class="single" type="&#xeb8a;" font-size="44rpx" title="设置" @click="showSetting"></jinIcon>
			</view>
			<!-- 文字相关操作 -->
			<view class="font-more" :style="{ height: showMoreTool ? '100rpx' : 0 }">
				<jinIcon class="single" type="&#xe6e7;" font-size="44rpx" title="加粗" @click="setBold"
					:color="showBold ? activeColor : '#666666'"></jinIcon>
				<jinIcon class="single" type="&#xe6fe;" font-size="44rpx" title="斜体" @click="setItalic"
					:color="showItalic ? activeColor : '#666666'"></jinIcon>
				<jinIcon class="single" type="&#xe6f8;" font-size="44rpx" title="分割线" @click="setIns"
					:color="showIns ? activeColor : '#666666'"></jinIcon>
				<jinIcon class="single" type="&#xe6e3;" font-size="44rpx" title="标题" @click="setHeader"
					:color="showHeader ? activeColor : '#666666'"></jinIcon>
				<jinIcon class="single" type="&#xe6f1;" font-size="44rpx" title="居中" @click="setCenter"
					:color="showCenter ? activeColor : '#666666'"></jinIcon>
				<jinIcon class="single" type="&#xe6ed;" font-size="44rpx" title="居右" @click="setRight"
					:color="showRight ? activeColor : '#666666'"></jinIcon>
			</view>
			<view class="setting-layer-mask" v-if="showSettingLayer" @click="showSetting"></view>
			<view class="setting-layer" v-if="showSettingLayer">
				<view class="single" @click="release(true)">
					<jinIcon class="icon" type="&#xe639;"></jinIcon>
					<view>公开发布</view>
				</view>
				<view class="single" @click="release(false)">
					<jinIcon class="icon" type="&#xe655;"></jinIcon>
					<view>私密保存</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import jinIcon from './jin-icons.vue';
	export default {
		computed: {},
		data() {
			return {
				id: '',
				form: {
					title: '',
					html: '',
					fl: ''
				},
				list: {},
				showMoreTool: false,
				showBold: false,
				showItalic: false,
				showIns: false,
				showHeader: false,
				showCenter: false,
				showRight: false,
				showSettingLayer: false,
				activeColor: '#F56C6C',
				showImgSize: false,
				showImgToolbar: false,
				showImgResize: false,
				placeholder: '输入内容...',
				action: getApp().globalData.url + '/api/imgupload', //后台上传
				userInfo: {},
				login: false
			};
		},
		components: {
			jinIcon
		},

		onLoad(option) {
			//获取分类
			uni.request({
				url: getApp().globalData.url + '/api/blogfl',
				method: 'post',
				success: (res) => {
					//console.log(res.data);
					this.list = res.data;
				}
			});
			if (option.id) {
				var id = option.id; //上个页面传递的id参数。
				this.id = id;
				try {
					var userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						this.userInfo = userInfo;
						this.login = true;
					} else {
						this.login = false;
					}
				} catch (e) {
					console.log('获取用户信息失败', e)
				}
				uni.request({
					url: getApp().globalData.url + '/api/views/' + id,
					method: 'post',
					success: (res) => {
						//console.log(res.data);
						this.form.title = res.data.title;
						this.form.html = res.data.content;
						this.form.fl = res.data.tags;
						for (let i in this.list) {
							if (res.data.tags.includes(this.list[i].name)) {
								this.list[i].checked = true; //选定
							}
						}
						uni.setNavigationBarTitle({
							title: res.data.title
						})
					}
				});
			}
		},

		methods: {
			onEditorReady(e) {
				uni.createSelectorQuery().in(this).select('.ql-container').fields({
					size: true,
					context: true
				}, res => {
					this.editorCtx = res.context;
					this.editorCtx.setContents({
						html: this.form.html
					})
				}).exec();
			},
			undo() {
				this.editorCtx.undo();
			},
			// 插入图片
			insertImage() {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: async (res) => {
						var tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '正在上传中...'
						})
						var token = this.userInfo.token;
						for (let temp of tempFilePaths) {
							// 图片上传服务器
							await uni.uploadFile({
								url: this.action,
								filePath: temp,
								name: 'photo',
								header: {
									Accept: 'application/json',
									Authorization: 'Bearer ' + token
								},
								success: res => {
									var data = JSON.parse(res.data);
									console.log(data);
									if (data.code == 200) {
										this.editorCtx.insertImage({
											src: data.path, // 此处需要将图片地址切换成服务器返回的真实图片地址
											alt: '图片',
											success: function(e) {}
										});
										uni.hideLoading()
									} else {
										console.log('上传失败');
										uni.hideLoading()
									}
								},

							});
						}
					}
				});
			},
			insertDivider() {
				this.editorCtx.insertDivider();
			},
			redo() {
				this.editorCtx.redo();
			},
			showMore() {
				this.showMoreTool = !this.showMoreTool;
				this.editorCtx.setContents()
			},
			setBold() {
				this.showBold = !this.showBold;
				this.editorCtx.format('bold');
			},
			setItalic() {
				this.showItalic = !this.showItalic;
				this.editorCtx.format('italic');
			},
			checkStatus(name, detail, obj) {
				if (detail.hasOwnProperty(name)) {
					this[obj] = true;
				} else {
					this[obj] = false;
				}
			},
			statuschange(e) {
				var detail = e.detail;
				this.checkStatus('bold', detail, 'showBold');
				this.checkStatus('italic', detail, 'showItalic');
				this.checkStatus('ins', detail, 'showIns');
				this.checkStatus('header', detail, 'showHeader');
				if (detail.hasOwnProperty('align')) {
					if (detail.align == 'center') {
						this.showCenter = true;
						this.showRight = false;
					} else if (detail.align == 'right') {
						this.showCenter = false;
						this.showRight = true;
					} else {
						this.showCenter = false;
						this.showRight = false;
					}
				} else {
					this.showCenter = false;
					this.showRight = false;
				}
			},
			setIns() {
				this.showIns = !this.showIns;
				this.editorCtx.format('ins');
			},
			setHeader() {
				this.showHeader = !this.showHeader;
				this.editorCtx.format('header', this.showHeader ? 'H2' : false);
			},
			setCenter() {
				this.showCenter = !this.showCenter;
				this.editorCtx.format('align', this.showCenter ? 'center' : false);
			},
			setRight() {
				this.showRight = !this.showRight;
				this.editorCtx.format('align', this.showRight ? 'right' : false);
			},
			showSetting() {
				this.showSettingLayer = !this.showSettingLayer;
			},
			async editFocus() {

			},
			editBlur() {

			},
			//标签多选框回调
			checkboxGroupChange(e) {
				this.form.fl = JSON.stringify(e); //要转json
			},
			//发布
			release(isPublic) {
				this.showSettingLayer = false; //公开否
				this.editorCtx.getContents({
					success: res => {
						var token = this.userInfo.token;
						var form = this.form;
						form.html = res.html;
						form.open = isPublic ? 1 : 0; //公开否
						//内容安全检测
						// if (getApp().globalData.xcxdata.nraqjc == 1) {
						// 	uni.request({
						// 		url: getApp().globalData.url + '/api/nrjc',
						// 		method: 'POST',
						// 		data: {
						// 			content: res.html
						// 		},
						// 		success: (res) => {
						// 			if (res.data.errcode !== 0) {
						// 				return this.$u.toast('内容含有敏感信息');
						// 			}
						// 		}
						// 	});
						// }
						uni.request({
							url: getApp().globalData.url + '/api/write',
							method: 'POST',
							header: {
								Accept: 'application/json',
								Authorization: 'Bearer ' + token
							},
							data: form,
							success: (res) => {
								if(res.data.code == 200){
									return this.$u.toast(res.data.msg);
								}else{
									return this.$u.toast(res.data.msg);
								}
							}
						});
					}
				})
			},
		}
	};
</script>

<style scoped>
	.warp {
		padding: 30rpx;
	}

	.container {
		box-sizing: border-box;
		padding-bottom: 120rpx;
	}

	.ql-container {
		line-height: 160%;
		font-size: 29rpx;
		width: calc(100% - 60rpx);
		height: auto;
		margin: 0 auto;
		border: 2rpx solid #efefef;
	}

	.tool-view {
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;

	}

	.tool {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		background: #eee;
	}

	.font-more {
		position: absolute;
		left: 0;
		bottom: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		background: rgb(235, 235, 235);
		overflow: hidden;
		transition: all 0.15s;
	}

	.setting-layer {
		position: absolute;
		bottom: 100rpx;
		background: #fff;
		width: 250rpx;
		right: 20rpx;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		border-radius: 8rpx;
	}

	.setting-layer .single {
		height: 80rpx;
		font-size: 32rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		line-height: 80rpx;
		flex-direction: row;
		color: #666;
	}

	.setting-layer .single .icon {
		margin-right: 20rpx;
	}

	.setting-layer-mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background: transparent;
	}
</style>
