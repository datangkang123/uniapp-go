<template>
	<view class="wrap">
		<view class="u-bt" v-if="bgsx.Xmmc">{{bgsx.Xmmc}}</view>
		<view class="u-content" v-if="bgsx.Beizhu">
			<text>{{bgsx.Beizhu}}</text>
		</view>
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<block v-for="(item,k) in bgsx.Zdsz" :key="k" v-if="item.yc != 2 && bgsx.Kfcx.includes(k)">
				<!--多行文本-->
				<u-form-item v-if="item.i == 1" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input auto-height :placeholder="item.ts" v-model="model[k]" type="textarea"
						:disabled="item.zd == 2">
					</u-input>
				</u-form-item>
				<!-- 单选框 -->
				<u-form-item v-else-if="item.i == 2" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-radio-group v-model="model[k]" :wrap="Number(item.dzyh) == 2" @change="radioGroupChange($event,k)">
						<u-radio shape="circle" :disabled="item.zd == 2" v-for="(dxk,index) in item.xx.split('/')"
							:key="index" :name="dxk">
							{{ dxk }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<!-- 多选框和多选下拉共用 -->
				<u-form-item v-else-if="item.i == 3 || item.i == 5" :label-position="labelPosition" :label="bgsx.Zd[k]"
					:prop="k" :required="(item.bt == 2)">
					<u-checkbox-group :wrap="Number(item.dzyh) == 2" @change="checkboxGroupChange($event,k)">
						<u-checkbox v-model="dxks.checked" :disabled="item.zd == 2" v-for="(dxks, index) in item.xx"
							:key="index" :name="dxks.name">
							{{ dxks.name }}
						</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
				<!-- 单选下拉 -->
				<u-form-item v-else-if="item.i == 4" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input v-model="model[k]" :disabled="item.zd == 2" type="select" @click="selectShow[k] = true" />
					<template v-if="item.zd != 2">
						<u-select v-model="selectShow[k]" mode="single-column" :list="dxselect(item.xx,k)"
							@confirm="confirm">
						</u-select>
					</template>
				</u-form-item>
				<!--身份证号-->
				<u-form-item v-else-if="item.i == 13" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input :placeholder="item.ts" v-model="model[k]" type="text"></u-input>
					<htz-image-upload :max="1" :quality="60" @uploadSuccess="zidingyiSuccess" v-model="image[k]" :action="action" 
					:formData="{'key': k}" v-if="item.name || item.sex || item.mz || item.day || item.ade || item.zmtp">
					</htz-image-upload>
				</u-form-item>
				<!-- 图片文件上传 -->
				<u-form-item v-else-if="item.i == 6 || item.i == 7" :label-position="labelPosition" :label="bgsx.Zd[k]"
					:prop="k" :required="(item.bt == 2)">
					<u-upload :ref="k" :action="action" :max-count="item.i == 7 ? item.sl : 1" :form-data="{key: k, imgwh: item.imgwh}"
						:max-size="20 * 1024 * 1024" :size-type="sizetype"
						:file-list="getimgurl(model[k])">
					</u-upload>
				</u-form-item>
				<!--日期-->
				<u-form-item v-else-if="item.i == 8" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input v-model="model[k]" :disabled="item.zd == 2" type="text" @click="pickerShow[k] = true"
						:placeholder="item.ts" />
					<u-picker v-model="pickerShow[k]" mode="time" @confirm="confirmdate($event,k)"></u-picker>
				</u-form-item>
				<!--时间-->
				<u-form-item v-else-if="item.i == 9" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input v-model="model[k]" :disabled="item.zd == 2" type="text" @click="pickerShow[k] = true"
						:placeholder="item.ts" />
					<u-picker v-model="pickerShow[k]" mode="time" :params="params" @confirm="confirmdate2($event,k)">
					</u-picker>
				</u-form-item>
				<!--日期时间-->
				<u-form-item v-else-if="item.i == 10" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input v-model="model[k]" :disabled="item.zd == 2" type="text" @click="pickerShow[k] = true"
						:placeholder="item.ts" />
					<u-picker v-model="pickerShow[k]" mode="time" :params="params2" @confirm="confirmdate3($event,k)">
					</u-picker>
				</u-form-item>
				<!-- 省市县区 -->
				<u-form-item v-else-if="item.i == 11" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input type="select" :select-open="dqrShow[k]" v-model="model[k]" :disabled="item.zd == 2"
						:placeholder="item.ts" @click="dqrShow[k] = true"></u-input>
					<u-picker mode="region" v-model="dqrShow[k]" @confirm="confirmdate4($event,k)"></u-picker>
				</u-form-item>
				<!-- 签名 -->
				<u-form-item v-else-if="item.i == 17 || item.i == 18" :label-position="labelPosition"
					:label="bgsx.Zd[k]" :prop="k" :required="(item.bt == 2)">
					<u-input type="text" v-model="model[k]" :disabled="true" :placeholder="item.ts"> </u-input>
				</u-form-item>
				<!-- 表中表-->
				<u-form-item v-else-if="item.i == 19" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)" style="line-height: 20rpx;overflow-x:scroll;">
					<view class="uni-container">
						<uni-table ref="table" border stripe :loading="loading" emptyText="请点击添加一行">
							<uni-tr>
								<uni-th align="center" v-for="(item,i) in item.bzb" :key="i">{{item}}</uni-th>
								<uni-th width="95" align="center">操作</uni-th>
							</uni-tr>
							<uni-tr v-for="(item2, index) in model[k]" :key="index">
								<uni-td v-for="(item3,index2) in item.bzb" :key="index2">
									<u-input :placeholder="`输入`+item3" type="text" v-model="model[k][index][item3]">
									</u-input>
								</uni-td>
								<uni-td>
									<u-button size="mini" type="error" plain @click="delline(k,index)">删除</u-button>
								</uni-td>
							</uni-tr>
						</uni-table>
						<view style="margin-top:20rpx;">
							<button class="uni-button" type="primary" size="mini" @click="addline(k)">添加一行</button>
						</view>
					</view>
				</u-form-item>
				<!-- tag数组 -->
				<u-form-item v-else-if="item.i == 21" :label-position="labelPosition" :label="bgsx.Zd[k] + `(多个用逗号分割)`" 
				:prop="k" :required="(item.bt == 2)">
					<u-input :placeholder="item.ts" v-model="model[k]" type="text" :disabled="item.zd == 2"></u-input>
				</u-form-item>
				<!-- 生成密钥 -->
				<u-form-item v-else-if="item.i == 23" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input :placeholder="item.ts" v-model="model[k]" type="text" :disabled="true"></u-input>
				</u-form-item>
				<!-- 数字 -->
				<u-form-item v-else-if="item.i == 15 || item.i == 16" :label-position="labelPosition" :label="bgsx.Zd[k]"
					:prop="k" :required="(item.bt == 2)">
					<u-input :placeholder="item.ts" v-model="model[k]" type="text" :disabled="item.zd == 2"  @input="jschange(k)"></u-input>
				</u-form-item>
				<!--行内计算-->
				<u-form-item v-else-if="item.i == 22" :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input :placeholder="item.ts" v-model="model[k]" type="text" :maxlength="item.sl"
						:disabled="true"></u-input>
				</u-form-item>
				<!--单行文本等-->
				<u-form-item v-else :label-position="labelPosition" :label="bgsx.Zd[k]" :prop="k"
					:required="(item.bt == 2)">
					<u-input :placeholder="item.ts" v-model="model[k]" type="text" :maxlength="item.sl"
						:disabled="item.zd == 2"></u-input>
				</u-form-item>
			</block>
		</u-form>
		<u-button :custom-style="customStyle" @click="submit" type="primary" v-if="bgsx.Xmmc">提交</u-button>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue'
	export default {
		data() {
			let that = this;
			return {
				id: '', //项目id
				jgid: '', //行id
				loading: false,
				bgsx: {},
				zdsz: {},
				model: {},
				rules: {},
				action: getApp().globalData.url + '/uploadimg', //后端上传文件
				actionbd: getApp().globalData.url + '/admin/idcardocr', //百度ai识别
				sizetype: ['compressed'], //压缩图
				image: {
					K0: [],
					K1: [],
					K2: [],
					K3: [],
					K4: [],
					K5: [],
					K6: [],
					K7: [],
					K8: [],
					K9: [],
					K10: [],
					K11: [],
					K12: [],
					K13: [],
					K14: [],
					K15: [],
					K16: [],
					K17: [],
					K18: [],
					K19: [],
					K20: [],
					K21: [],
					K22: [],
					K23: [],
					K24: [],
					K25: [],
					K26: [],
					K27: [],
					K28: [],
					K29: [],
					K30: [],
					K31: [],
					K32: [],
					K33: [],
					K34: [],
					K35: [],
					K36: [],
					K37: [],
					K38: [],
					K39: [],
					K40: [],
					K41: [],
					K42: [],
					K43: [],
					K44: [],
					K45: [],
					K46: [],
					K47: [],
					K48: [],
					K49: [],
					K50: [],
					K51: [],
					K52: [],
					K53: [],
					K54: [],
					K55: [],
					K56: [],
					K57: [],
					K58: [],
					K59: [],
					K60: []
				},//压缩上传预览
				selectShow: {
					K0: false,
					K1: false,
					K2: false,
					K3: false,
					K4: false,
					K5: false,
					K6: false,
					K7: false,
					K8: false,
					K9: false,
					K10: false,
					K11: false,
					K12: false,
					K13: false,
					K14: false,
					K15: false,
					K16: false,
					K17: false,
					K18: false,
					K19: false,
					K20: false,
					K21: false,
					K22: false,
					K23: false,
					K24: false,
					K25: false,
					K26: false,
					K27: false,
					K28: false,
					K29: false,
					K30: false,
					K31: false,
					K32: false,
					K33: false,
					K34: false,
					K35: false,
					K36: false,
					K37: false,
					K38: false,
					K39: false,
					K40: false,
					K41: false,
					K42: false,
					K43: false,
					K44: false,
					K45: false,
					K46: false,
					K47: false,
					K48: false,
					K49: false,
					K50: false,
					K51: false,
					K52: false,
					K53: false,
					K54: false,
					K55: false,
					K56: false,
					K57: false,
					K58: false,
					K59: false,
					K60: false,
				}, //单选下拉控制弹起，必须提前写好变量
				pickerShow: {
					K0: false,
					K1: false,
					K2: false,
					K3: false,
					K4: false,
					K5: false,
					K6: false,
					K7: false,
					K8: false,
					K9: false,
					K10: false,
					K11: false,
					K12: false,
					K13: false,
					K14: false,
					K15: false,
					K16: false,
					K17: false,
					K18: false,
					K19: false,
					K20: false,
					K21: false,
					K22: false,
					K23: false,
					K24: false,
					K25: false,
					K26: false,
					K27: false,
					K28: false,
					K29: false,
					K30: false,
					K31: false,
					K32: false,
					K33: false,
					K34: false,
					K35: false,
					K36: false,
					K37: false,
					K38: false,
					K39: false,
					K40: false,
					K41: false,
					K42: false,
					K43: false,
					K44: false,
					K45: false,
					K46: false,
					K47: false,
					K48: false,
					K49: false,
					K50: false,
					K51: false,
					K52: false,
					K53: false,
					K54: false,
					K55: false,
					K56: false,
					K57: false,
					K58: false,
					K59: false,
					K60: false,
				},
				labelPosition: 'top', //标题在顶部或left
				dqrShow: {
					K0: false,
					K1: false,
					K2: false,
					K3: false,
					K4: false,
					K5: false,
					K6: false,
					K7: false,
					K8: false,
					K9: false,
					K10: false,
					K11: false,
					K12: false,
					K13: false,
					K14: false,
					K15: false,
					K16: false,
					K17: false,
					K18: false,
					K19: false,
					K20: false,
					K21: false,
					K22: false,
					K23: false,
					K24: false,
					K25: false,
					K26: false,
					K27: false,
					K28: false,
					K29: false,
					K30: false,
					K31: false,
					K32: false,
					K33: false,
					K34: false,
					K35: false,
					K36: false,
					K37: false,
					K38: false,
					K39: false,
					K40: false,
					K41: false,
					K42: false,
					K43: false,
					K44: false,
					K45: false,
					K46: false,
					K47: false,
					K48: false,
					K49: false,
					K50: false,
					K51: false,
					K52: false,
					K53: false,
					K54: false,
					K55: false,
					K56: false,
					K57: false,
					K58: false,
					K59: false,
					K60: false,
				},
				errorType: ['message'], // 文字提示
				scrollTop: 0,
				customStyle: {
					marginTop: '20px'
				},
				params: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: true,
					timestamp: true
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
			};
		},
		onLoad: function(option) {
			if (!option.id || !option.jgid) {
				this.$u.toast('数据表不存在');
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/form/tb'
					});
				}, 500);
			} else {
				this.id = option.id; //项目id
				this.jgid = option.jgid; //行id
				this.zt = option.zt; //如果zt=1  ，填报完后就后退
			}
		},
		onReady() {
			this.syscsh(this.id, this.jgid); //初始化数据
		},
		components: {
			htzImageUpload,
		},
		//下拉刷新
		onPullDownRefresh() {
			this.syscsh(this.id, this.jgid); //初始化数据
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},

		methods: {
			//小程序不支持eval，自定义解决
			evalRpn(rpnQueue) {
				var outputStack = [];
				while (rpnQueue.length > 0) {
					var cur = rpnQueue.shift();
			 
					if (!this.isOperator(cur)) {
						outputStack.push(cur);
					} else {
						if (outputStack.length < 2) {
							throw "unvalid stack length";
						}
						var sec = outputStack.pop();
						var fir = outputStack.pop();
			 
						outputStack.push(this.getResult(fir, sec, cur));
					}
				}
				if (outputStack.length != 1) {
					throw "unvalid expression";
				} else {
					return outputStack[0];
				}
			},
			getResult(first, second, operator) {
				var result = 0;
				switch (operator) {
					case '+':
						result = first + second;
						break;
					case '-':
						result = first - second;
						break;
					case '*':
						result = first * second;
						break;
					case '/':
						result = first / second;
						break;
					default:
						return 0;
				}
				return this.formatFloat(result, 2);
			},
			//浮点数的小数位超过两位时，只保留两位小数点
			formatFloat(f, digit) {
				//pow(10,n) 为 10 的 n 次方
				var m = Math.pow(10, digit);
				return parseInt(f * m, 10) / m;
			},
			
			isOperator(value) {
				var operatorString = "+-*/()";
				return operatorString.indexOf(value) > -1
			},
			 
			getPrioraty(value) {
				switch (value) {
					case '+':
					case '-':
						return 1;
					case '*':
					case '/':
						return 2;
					default:
						return 0;
				}
			},
			 
			prioraty(o1, o2) {
				return this.getPrioraty(o1) <= this.getPrioraty(o2);
			},
			 
			dal2Rpn(exp) {
			  var inputStack = [];
				var outputStack = [];
				var outputQueue = [];
				let res = '';
				for (var i = 0, len = exp.length; i < len; i++) {
				  var cur = exp[i];
				  if (cur != ' ') {
					res = res + cur;
					if (i + 1 < exp.length) {
					  if (this.isOperator(exp[i])) {
						inputStack.push(res);
						res = ''
					  } else {
						if (this.isOperator(exp[i + 1])) {
						  inputStack.push(res);
						  res = ''
						}
					  }
					} else {
					  inputStack.push(res);
					  res = ''
					}
				  }
				}
				while (inputStack.length > 0) {
					var cur = inputStack.shift();
					if (this.isOperator(cur)) {
						if (cur == '(') {
							outputStack.push(cur);
						} else if (cur == ')') {
							var po = outputStack.pop();
							while (po != '(' && outputStack.length > 0) {
								outputQueue.push(po);
								po = outputStack.pop();
							}
							if (po != '(') {
								throw "error: unmatched ()";
							}
						} else {
							while (this.prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0) {
								outputQueue.push(outputStack.pop());
							}
							outputStack.push(cur);
						}
					} else {
						outputQueue.push(new Number(cur));
					}
				}
				if (outputStack.length > 0) {
					if (outputStack[outputStack.length - 1] == ')' || outputStack[outputStack.length - 1] == '(') {
						throw "error: unmatched ()";
					}
					while (outputStack.length > 0) {
						outputQueue.push(outputStack.pop());
					}
				}
				return outputQueue; 
			},
			
			//行内计算
			jschange(k){
				console.log(k,this.model[k]);
				for(let key in this.zdsz){
					if(this.zdsz[key].i == 22 && this.zdsz[key].hnjs){
						var jsgs = this.zdsz[key].hnjs;//计算公式
						jsgs = jsgs.replace(/\（/g, '(')
						jsgs = jsgs.replace(/\）/g, ')')
						jsgs = jsgs.replace(/\ /g, '')
						var t = 60;//从大到小替换
						for(let m=0;m<=60;m++){
							let key = "K"+t;
							jsgs = jsgs.replace(key,this.model[key] ? this.model[key] : 0);
							t--;
						}
						//this.model[key] = eval(jsgs).toFixed(2);
						this.model[key] = this.evalRpn(this.dal2Rpn(jsgs)).toFixed(2);
					}
				}
				this.$forceUpdate(); //强制刷新视图
			},
			//上传身份证图并识别
			zidingyiSuccess(res) {
				var _res = JSON.parse(res.data);
				if (_res.code == 0) {
					//上传成功
					let k = _res.message;
					let imgurl = _res.result;
					this.image[k].push(imgurl);//显示预览图
					uni.request({
						url: this.actionbd,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
						},
						data: {
							imgurl: imgurl
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
							} else {
								if (res.data.code != 0) {
									return this.$u.toast(res.data.message);
								}
								var sbjg = res.data.result.words_result; //识别结果{住址,公民身份号码,出生,姓名,性别,民族}
								if (!sbjg) {
									return this.$u.toast(res.data.result.error_msg);
								}
								var dx = {}; //赋值到这里
								dx.name = sbjg.姓名.words;
								dx.sex = sbjg.性别.words;
								dx.mz = sbjg.民族.words;
								let day = sbjg.出生.words;
								dx.day = day.substr(0, 4) + '-' + day.substr(4, 2) + '-' + day.substr(6, 2)
								dx.ade = sbjg.住址.words;
								dx.zmtp = JSON.stringify([imgurl]); //图片，需要标注让后面提交时不检测
								let number = sbjg.公民身份号码.words;
								//zdsz中是否绑定了要自动填写的字段
								//"K3": {mz:"K1",ade": "K4", "day": "K1", "sex": "K2", "name": "K0", "zmtp": "K6"},
								this.model[k] = number; //先填充身份证号码
								var zdsz = this.bgsx.Zdsz[k];
								for (let key in zdsz) {
									if (['ade', 'day', 'sex', 'name', 'zmtp', 'mz'].includes(key) && zdsz[key]) {
										this.model[zdsz[key]] = dx[key]
									}
								}
								this.$forceUpdate(); //强制刷新视图
								return this.$u.toast('上传识别成功');
							}
						},
					});
				} else {
					return this.$u.toast('图片上传失败');
				}
			},
			//显示图片
			getimgurl(url){
				if(!url)return [];
				if(this.$u.test.jsonString(url)){
					return JSON.parse(url).map(num => {return {url:num}});
				}else{
					return url;
				}
			},
			//添加一行
			addline(k) {
				this.loading = true;
				let data = {};
				for (let v of this.bgsx.Zdsz[k].bzb) {
					data[v] = '';
				}
				if (!this.model[k]) {
					this.model[k] = [data];
				} else {
					this.model[k].push(data);
				}
				this.loading = false;
			},
			//删除一行
			delline(k, index) {
				this.loading = true;
				this.model[k].splice(index, 1);
				this.loading = false;
			},
			//单选下拉数据转换
			dxselect(e, k) {
				if (!e) return [];
				return e.split('/').map(num => {
					return {
						value: k,
						label: num
					}
				});
			},
			//多选数据转换
			dxradio(e, value) {
				if (!e) return [];
				return e.split('/').map(num => {
					return {
						name: num,
						checked: value.includes(num) ? true : false,
						disabled: false
					}
				});
			},
			//初始化数据
			syscsh(id, jgid) {
				if (!id || !jgid) {
					return this.$u.toast('数据不存在');
				}
				uni.request({
					url: getApp().globalData.url + '/tb/tbjg',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
					},
					data: {
						id: id,
						jgid: jgid
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
						if (res.data.code == 0 && res.data.result) {
							this.bgsx = res.data.message;
							if (!this.bgsx.Zdsz) return this.$u.toast('字段设置错误');
							this.model = res.data.result[0]; //表单值
							this.zdsz = res.data.message.Zdsz;
							var rules = {};
							for (let k in this.bgsx.Zdsz) {
								var value = this.bgsx.Zdsz[k];
								var ts = '请输入' + this.bgsx.Zd[k];
								var bt = value['bt'] == 2;
								//处理数组tag
								if(value['i'] == 21){
									this.model[k] = this.model[k] ? JSON.parse(this.model[k]).toString() : '';
								}
								//处理表中表
								if(value['i'] == 19){
									this.model[k] = this.model[k] ? JSON.parse(this.model[k]) : [];
								}
								//单选要处理逻辑表单
								if(value['i'] == 2 || value['i'] == 4){
									this.dxview(k, this.model[k]);
								}
								//处理多选框
								if (value['i'] == 3 || value['i'] == 5) {
									let value = this.model[k] ? JSON.parse(this.model[k]) : []; //已选
									this.bgsx.Zdsz[k].xx = this.dxradio(this.bgsx.Zdsz[k].xx, value);
								}
								//表单验证
								if (value['i'] == 6 || value['i'] == 7) {
									if (bt) {
										rules[k] = [{
											validator: (rule, value, callback) => {
												return !this.$u.test.isEmpty(value);
											},
											message: '请上传' + this.zd[k],
											trigger: 'change'
										}];
									}
								} else if (value['i'] == 12) {
									if (bt) {
										rules[k] = [{
												required: bt,
												message: ts,
												trigger: ['change', 'blur'],
											},
											{
												validator: (rule, value, callback) => {
													return this.$u.test.mobile(value);
												},
												message: '手机号码不正确',
												trigger: ['change', 'blur'],
											}
										];
									}
								} else if (value['i'] == 13) {
									if (bt) {
										rules[k] = [{
												required: bt,
												message: ts,
												trigger: ['change', 'blur'],
											},
											{
												validator: (rule, value, callback) => {
													return this.$u.test.idCard(value);
												},
												message: '身份证号不正确',
												trigger: ['change', 'blur'],
											}
										];
									}
								} else if (value['i'] == 14) {
									if (bt) {
										rules[k] = [{
												required: bt,
												message: ts,
												trigger: ['change', 'blur'],
											},
											{
												validator: (rule, value, callback) => {
													return this.$u.test.carNo(value);
												},
												message: '车牌号不正确',
												trigger: ['change', 'blur'],
											}
										];
									}
								} else if (value['i'] == 15) {
									if (bt) {
										rules[k] = [{
												required: bt,
												message: ts,
												trigger: ['change', 'blur'],
											},
											{
												validator: (rule, value, callback) => {
													return this.$u.test.digits(value);
												},
												message: '请输入整数',
												trigger: ['change', 'blur'],
											}
										];
									}
								} else if (value['i'] == 16) {
									if (bt) {
										rules[k] = [{
												required: bt,
												message: ts,
												trigger: ['change', 'blur'],
											},
											{
												validator: (rule, value, callback) => {
													return this.$u.test.amount(value);
												},
												message: '请输入小数',
												trigger: ['change', 'blur'],
											}
										];
									}
								} else if (value['i'] == 18) {} else if (value['i'] == 19) {
									if (bt) {
										rules[k] = [{
											required: bt,
											message: ts,
											type: 'array',
											trigger: ['change', 'blur'],
										}];
									}
								} else {
									rules[k] = [{
										required: bt,
										message: ts,
										trigger: ['change', 'blur'],
									}];
								}
							}
							this.rules = rules;
							this.$refs.uForm.setRules(this.rules); //需要在onReady中，验证才生效
						} else {
							return this.$u.toast(res.data.message);
						}
					}
				});
			},

			onPageScroll(e) {
				this.scrollTop = e.scrollTop; //返回顶部
			},

			submit() {
				var temp = this.$refs;
				//先判断有没图片上传类
				for (let k in temp) {
					if (k == 'uForm' || k == 'table') continue;
					var i = this.bgsx.Zdsz[k].i;
					if (i == '6' || i == '7') {
						var files = [];
						var lists = [];
						//通过filter，筛选出上传进度为100的文件
						files = this.$refs[k][0].lists.filter(val => {
							return val.progress == 100;
						})
						//注意，编辑时，如果有旧图片，应该是files[key].url，新上传的是files[key].response.result
						if (files.length > 0) {
							for (let key in files) {
								if (files[key].response) {
									lists.push(files[key].response.result);
								} else {
									lists.push(files[key].url);
								}
							}
						}
						this.model[k] = JSON.stringify(lists);
					}
				}
				this.$refs.uForm.validate(valid => {
					//console.log('表单数据', this.model);return;
					if (valid) {
						for (let k in this.model) {
							//表中表需要转json
							if (k !== "ID" && this.bgsx.Zdsz[k].i == 19 && this.model[k] && this.$u.test.array(this.model[k])) {
								this.model[k] = JSON.stringify(this.model[k]);
							}
							//tag数组要分割逗号为数组json
							if (k !== "ID" && this.bgsx.Zdsz[k].i == 21 && this.model[k]) {
								this.model[k] = this.$u.test.jsonString(this.model[k]) ? this.model[k] : JSON.stringify(this.model[k].replace(/，/g, ",").split(','));
							}
						}
						uni.request({
							url: getApp().globalData.url + '/tb/edit',
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded',
								Authorization: 'Bearer ' + uni.getStorageSync('userInfo').token
							},
							data: {
								id: this.bgsx.ID,
								tid: this.jgid,
								data: JSON.stringify(this.model)
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
									uni.showToast({
										title: "修改成功!",
										duration: 1500
									});
									setTimeout(() => {
										if (this.zt == 1) {
											uni.navigateBack();
										} else {
											uni.navigateTo({
												url: '/pages/form/tbjg?id=' + this.id +
													'&jgid=' + this.jgid +
													'&cjz=' + this.cjz + '&isedit=1'//isedit记录是修改状态进入的，开放查询设置生效
											});
										}
									}, 500);
									//this.clearform(); //清空表单
								} else {
									uni.showToast({
										title: res.data.message,
										icon: ""
									});
								}
							}
						});
					}
				});
			},
			// checkbox多选框回调
			checkboxGroupChange(e, k) {
				this.model[k] = JSON.stringify(e); //要转json
			},
			// 下拉单选回调，取数组的第一个元素即可
			confirm(e) {
				var temp = e.shift();
				var k = temp.value;
				this.model[k] = temp.label;
				this.dxview(k, temp.label);
			},	
			//单选框回调
			radioGroupChange(e, k) {
				this.dxview(k, e);
			},
			//单选显示逻辑处理，如果view=v，那么yczd里的字段需要隐藏
			dxview(k, v) {
				console.log(k,v)
				let xx = this.bgsx.Zdsz[k].xx.split('/');
				if (xx.length < 1) {
					return this.$u.toast('选项为空');
				}
				//先遍历选项，将隐藏的key还原
				for (let v of xx) {
					if (this.bgsx.Zdsz[k]['view' + v]) {
						for (let key of this.bgsx.Zdsz[k]['yczd' + v]) {
							//console.log(v, key); //k3,小学
							this.bgsx.Zdsz[key].yc = 0; //默认不隐藏
						}
					}
				}
				if (this.bgsx.Zdsz[k]['view' + v] && this.bgsx.Zdsz[k]['view' + v] == v) {
					//隐藏对应选项的key
					for (let v of this.bgsx.Zdsz[k]['yczd' + v]) {
						this.bgsx.Zdsz[v].yc = 1; //隐藏
					}
				}
			},
			//日期回调
			confirmdate(e, k) {
				this.model[k] = e.year + '-' + e.month + '-' + e.day;
			},
			//时间回调
			confirmdate2(e, k) {
				this.model[k] = e.hour + ':' + e.minute + ':' + e.second;
			},
			//日期时间回调
			confirmdate3(e, k) {
				this.model[k] = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute +
					':' + e.second;
			},
			// 选择地区回调
			confirmdate4(e, k) {
				this.model[k] = e.province.label + '/' + e.city.label + '/' + e.area.label;
			},
		}
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
