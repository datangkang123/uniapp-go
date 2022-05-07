<template>
	<view class="wrap">
		<u-form :model="bgsx" :errorType="errorType">
			<u-form-item :label-position="labelPosition" label="分类" prop="Xmbs" :required="true">
				<u-input v-if="fldata" v-model="bgsx.Xmbs" type="select" @click="selectShowfl = true" placeholder="选择项目分类" />
				<u-select v-model="selectShowfl" mode="single-column" :list="fldata" @confirm="confirm"></u-select>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="项目名称" prop="Xmmc" :required="true">
				<u-input placeholder="查询或填报的项目名称" v-model="bgsx.Xmmc" type="text"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="查询条件" prop="Cxtj">
				<u-checkbox-group :wrap="radioCheckWrap" @change="checkboxGroupChange($event,'Cxtj')">
					<u-checkbox v-model="dxks.checked" v-for="(dxks, index) in zds" :key="index" :name="dxks.value">
						{{ dxks.name }}
					</u-checkbox>
				</u-checkbox-group>
			</u-form-item>
			<u-row gutter="16">
				<u-col span="4">
					<u-form-item :label-position="labelPosition" label="模糊查询" prop="Cxfs">
						<u-switch v-model.number="bgsx.Cxfs"></u-switch>
					</u-form-item>
				</u-col>
				<u-col span="4">
					<u-form-item :label-position="labelPosition" label="开放填报" prop="Kftb">
						<u-switch v-model.number="bgsx.Kftb"></u-switch>
					</u-form-item>
				</u-col>
				<u-col span="4">
					<u-form-item :label-position="labelPosition" label="重复填报" prop="Cftb">
						<u-switch v-model.number="bgsx.Cftb"></u-switch>
					</u-form-item>
				</u-col>
			</u-row>
			<u-form-item :label-position="labelPosition" label="开始时间" prop="Kssj" :required="true">
				<u-input v-model="bgsx.Kssj" type="select" @click="pickerShowkssj = true" placeholder="开始查询/填报的时间" />
				<u-picker v-model="pickerShowkssj" mode="time" :params="params2" @confirm="confirmdate($event,'Kssj')">
				</u-picker>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="结束时间" prop="Jssj" :required="true">
				<u-input v-model="bgsx.Jssj" type="select" @click="pickerShowjssj = true" placeholder="结束查询/填报的时间" />
				<u-picker v-model="pickerShowjssj" mode="time" :params="params2" @confirm="confirmdate($event,'Jssj')">
				</u-picker>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="限制数量" prop="Xzsl" :required="true">
				<u-input placeholder="表数量达到多少停止填报,0不限制" v-model="bgsx.Xzsl" type="number"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="自动清理(几天前)" prop="Zdql" :required="true">
				<u-input placeholder="自动删除多少天前数据,0不清理" v-model="bgsx.Zdql" type="number"></u-input>
			</u-form-item>
			
			<u-form-item :label-position="labelPosition" :border-bottom="false" label="字段名称" :required="true">
			</u-form-item>
			<!-- 字段修改 -->
			<block v-for="(item,k) in bgsx.Zd" :key="k">
				<u-field v-model="bgsx.Zd[k]" :label="k" placeholder="输入字段名"></u-field>
			</block>
			<!-- 字段属性修改 -->
			<view class="wrap u-bt">字段属性设置</view>
			<view class="u-font-12">
				先选择字段，再选择类型修改属性，全部字段修改完成后点击提交。注意逻辑关系，比如必填和只读只能二选一。
			</view>
			<u-form-item :label-position="labelPosition" label="字段" :required="true">
				<u-input v-if="bgsx.Zd" v-model="bgsx.Zd[xzzd]" type="select" @click="selectShowzd = true" placeholder="选择字段" />
				<u-select v-model="selectShowzd" mode="single-column" :list="zddata" @confirm="xzzdsz"></u-select>
			</u-form-item>
			<block v-if="xzzd">
				<!-- 类型-->
				<u-form-item :label-position="labelPosition" label="类型" :required="true">
					<u-radio-group :disabled="xzzd == ''" v-model.number="bgsx.Zdsz[xzzd].i" :wrap="radioCheckWrap">
						<u-radio shape="circle" v-for="(lx,index) in zdlx" :key="index" :name="index">{{ lx }}</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="提示">
					<u-input placeholder="提示性文字" v-model="bgsx.Zdsz[xzzd].ts" type="text"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="默认值">
					<u-input placeholder="输入默认值" v-model="bgsx.Zdsz[xzzd].moren" type="text"></u-input>
				</u-form-item>
				<u-row gutter="16">
					<u-col span="4">
						<u-form-item :label-position="labelPosition" label="必填">
							<u-switch v-model="bgsx.Zdsz[xzzd].bt"></u-switch>
						</u-form-item>
					</u-col>
					<u-col span="4">
						<u-form-item :label-position="labelPosition" label="只读">
							<u-switch v-model="bgsx.Zdsz[xzzd].zd"></u-switch>
						</u-form-item>
					</u-col>
					<u-col span="4">
						<u-form-item :label-position="labelPosition" label="惟一">
							<u-switch v-model="bgsx.Zdsz[xzzd].wy"></u-switch>
						</u-form-item>
					</u-col>
					<u-col span="4">
						<u-form-item :label-position="labelPosition" label="中间星号">
							<u-switch v-model="bgsx.Zdsz[xzzd].zjxh"></u-switch>
						</u-form-item>
					</u-col>
					<u-col span="4">
						<u-form-item :label-position="labelPosition" label="隐藏">
							<u-switch v-model="bgsx.Zdsz[xzzd].yc"></u-switch>
						</u-form-item>
					</u-col>
				</u-row>
				<u-form-item v-if="([0,1,7].includes(Number(bgsx.Zdsz[xzzd].i)))" :label-position="labelPosition"
					label="限制数量">
					<u-input placeholder="限制数量" v-model.number="bgsx.Zdsz[xzzd].sl" type="number"></u-input>
				</u-form-item>
				<u-form-item v-if="([2,3,4,5].includes(Number(bgsx.Zdsz[xzzd].i)))" :label-position="labelPosition"
					label="选项">
					<u-input auto-height placeholder="选项之间用/分割" v-model="bgsx.Zdsz[xzzd].xx" type="textarea"></u-input>
				</u-form-item>
				<u-form-item v-if="([2,4].includes(Number(bgsx.Zdsz[xzzd].i)))" :label-position="labelPosition"
					label="默认选项">
					<u-input placeholder="默认选项" v-model="bgsx.Zdsz[xzzd].moren" type="text"></u-input>
				</u-form-item>
			</block>
			<u-form-item :label-position="labelPosition" label="填报跳转" prop="Tbtz">
				<u-checkbox-group :wrap="radioCheckWrap" @change="checkboxGroupChange($event,'Tbtz')">
					<u-checkbox v-model="dxks.checked" v-for="(dxks, index) in tbtzdata" :key="index" :name="dxks.value">
						{{ dxks.name }}
					</u-checkbox>
				</u-checkbox-group>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="数据管理员" prop="Sjgl">
				<u-checkbox-group :wrap="radioCheckWrap" @change="checkboxGroupChange($event,'Sjgl')">
					<u-checkbox v-model="dxks.checked" v-for="(dxks, index) in sjgly" :key="index" :name="dxks.value">
						{{ dxks.name }}
					</u-checkbox>
				</u-checkbox-group>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="审核员" prop="Shy">
				<u-checkbox-group :wrap="radioCheckWrap" @change="checkboxGroupChange($event,'Shy')">
					<u-checkbox v-model="dxks.checked" v-for="(dxks, index) in shy" :key="index" :name="dxks.value">
						{{ dxks.name }}
					</u-checkbox>
				</u-checkbox-group>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="备注" prop="Beizhu">
				<u-input auto-height placeholder="输入备注内容" v-model="bgsx.Beizhu" type="textarea">
				</u-input>
			</u-form-item>
		</u-form>
		<u-button :custom-style="customStyle" shape="circle" @click="submit" type="primary" v-if="bgsx.Xmmc">
			提&nbsp;&nbsp;交
		</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				id: '', //项目id
				zdlx: {
					0: '单行文本',
					1: '多行文本',
					2: '单选框',
					3: '多选框',
					4: '单选下拉',
					5: '多选下拉',
					6: '单图上传',
					7: '多图上传',
					8: '日期',
					9: '时间',
					10: '日期时间',
					11: '省市县区',
					12:'手机号',
					13:'身份证号',
					14:'车牌号',
					15:'整数',
					16:'小数',
					17:'审核',
					18:'签名',
					19:'表中表',
					20:'网址',
					21:'数组',
				},
				bgsx: {},
				zds: [], //查询条件编辑
				sjgly: [], //数据管理员
				shy: [], //审核员
				zddata: [], //下拉选择字段
				fldata: [],//分类
				tbtzdata: [],//填报跳转
				selectShow: false,
				selectShowfl:false,
				selectShowzd: false, //选择字段，设置属性
				pickerShowkssj:false,
				pickerShowjssj:false,
				xzzd: '', //当前选择的字段
				radioCheckWrap: false,
				labelPosition: 'top', //标题在顶部或left
				errorType: ['message'], // 文字提示
				customStyle: {
					width: '600rpx',
					marginTop: '20px'
				},
				params2: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true,
					timestamp: true
				},
				login: false,
				userInfo: '',
			};
		},
		onLoad: function(option) {
			if (!option.id) {
				uni.showToast({
					title: '项目不存在',
					success: (res) => {
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/admin/bgsx'
							})
						}, 600);
					}
				});
			} else {
				this.id = option.id;
				this.syscsh(this.id); //初始化数据
			}
		},

		//下拉刷新
		onPullDownRefresh() {
			this.syscsh(this.id); //初始化数据
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},

		methods: {
			//初始化数据
			syscsh(id) {
				var userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					if (userInfo.Role !== 'admin' && userInfo.Role !== 'cjsjgl') return this.$u.toast('无权进入');
					this.userInfo = userInfo;
					this.login = true;
					//获取项目分类
					if(getApp().globalData.data.xmfl){
						let xmfl = getApp().globalData.data.xmfl.split(',');
						for (let v of xmfl) {
							this.fldata.push({
								value: v,
								label: v
							});
						}
					}
					uni.request({
						url: getApp().globalData.url + '/admin/system/getBgsx',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization: 'Bearer ' + this.userInfo.token
						},
						data: {
							ID: id
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
									var zd = this.bgsx.Zd;
									var cxtj = this.bgsx.Cxtj;
									var sjgl = this.bgsx.Sjgl;
									var shy = this.bgsx.Shy;
									var tbtz = this.bgsx.Tbtz;
									for (let k in this.bgsx.Zd) {
										this.zds.push({
											value: k,
											name: zd[k],
											checked: cxtj && cxtj.includes(k)
										}); //查询条件
										this.zddata.push({
											value: k,
											label: zd[k]
										}); //下拉选择字段
									}
									//获取填报跳转
									let tbtzlist = {1:'返回首页',2:'我要修改',3:'继续填报',4:'关闭页面',5:'阻止返回'};
									for (let key in tbtzlist){
										this.tbtzdata.push({
											value: Number(key),
											name: tbtzlist[key],
											checked: tbtz && tbtz.includes(Number(key))
										});
									}
									this.getsjgly(sjgl,shy);//获取数据管理员和审核员
									//格式化时间
									this.bgsx.Kssj = this.$u.timeFormat(this.bgsx.Kssj,'yyyy-mm-dd hh:MM:ss');
									this.bgsx.Jssj = this.$u.timeFormat(this.bgsx.Jssj,'yyyy-mm-dd hh:MM:ss');
								}
							}
						}
					})
				} else {
					this.login = false;
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return this.$u.toast('请先登录');
				}
			},

			//获取数据管理员
			getsjgly(sjgl,shy) {
				uni.request({
					url: getApp().globalData.url + '/admin/system/userpluck',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + this.userInfo.token
					},
					success: (res) => {
						if (res.data.code !== 0) {
							return false;
						} else {
							for (let v of res.data.result) {
								if(v.Role == "sjgl"){
									this.sjgly.push({
										value: v.ID.toString(),
										name: v.Username,
										checked: sjgl && sjgl.includes(v.ID.toString())
									});
								} else if(v.Role == "shy"){
									this.shy.push({
										value: v.ID.toString(),
										name: v.Username,
										checked: shy && shy.includes(v.ID.toString())
									});
								}
							}
						}
					},
				});
			},

			submit() {
				//Xmbs，Xmmc，Kftb，Cxfs不得为空
				if (!this.bgsx.Xmbs || !this.bgsx.Xmmc || !this.bgsx.Kftb || !this.bgsx.Cxfs) {
					return this.$u.toast('项目标识、名称为空');
				}
				console.log(this.bgsx);
				//时间转换回来 2022-04-07T10:08:10.959+08:00
				this.bgsx.Kssj = this.$u.timeFormat(this.bgsx.Kssj,'yyyy-mm-ddThh:MM:ss.959+08:00');
				this.bgsx.Jssj = this.$u.timeFormat(this.bgsx.Jssj,'yyyy-mm-ddThh:MM:ss.959+08:00');
				uni.request({
					url: getApp().globalData.url + '/admin/system/updatebgsx',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + this.userInfo.token
					},
					data: {
						id: this.id,
						data: JSON.stringify(this.bgsx)
					},
					success: (res) => {
						if (res.data.code == 0) {
							uni.showToast({
								title: res.data.message,
								success: (res) => {
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/admin/bgsx',
										})
									}, 600);
								}
							});
						} else {
							return this.$u.toast(res.data.message);
						}
					}
				});
			},
			// checkbox多选框回调
			checkboxGroupChange(e, k) {
				this.bgsx[k] = e;
			},
			//日期时间回调
			confirmdate(e, k) {
				this.bgsx[k] = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute +
					':' + e.second;
			},
			//选择字段设置属性
			xzzdsz(e) {
				var temp = e.shift();
				var k = temp.value;
				this.xzzd = k;
			},
			//选择分类
			confirm(e){
				this.bgsx.Xmbs = e.shift().value;
			},
		},
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}

	.u-content {
		margin-top: 30rpx;
	}

	.u-bt {
		text-align: center;
		font-size: medium;
		margin: 2px;
	}
</style>
