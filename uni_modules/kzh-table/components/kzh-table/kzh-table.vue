<template>
	<view class="kzh-table-scroll" :class="{ 'table--border': border, 'border-none': !noData }">
		<!-- #ifdef H5 -->
		<table class="kzh-table" border="0" cellpadding="0" cellspacing="0" :class="{ 'table--stripe': stripe }">
			<slot></slot>

			<view v-if="loading" class="kzh-table-mask" :class="{ 'empty-border': border }"><div class="kzh-table--loader"></div></view>
		</table>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="kzh-table" :style="{ 'min-width': minWidth + 'px' }" :class="{ 'table--stripe': stripe }">
			<slot></slot>
			<view v-if="loading" class="kzh-table-mask" :class="{ 'empty-border': border }"><div class="kzh-table--loader"></div></view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
/**
 * Table 表格
 * @description 用于展示多条结构类似的数据
 * @tutorial https://ext.dcloud.net.cn/plugin?id=
 * @property {Boolean} 	border 				是否带有纵向边框
 * @property {Boolean} 	stripe 				是否显示斑马线
 * @property {Boolean} 	type 					是否开启多选
 * @property {String} 	emptyText 			空数据时显示的文本内容
 * @property {Boolean} 	loading 			显示加载中
 * @event {Function} 	selection-change 	开启多选时，当选择项发生变化时会触发该事件
 */
export default {
	name: 'cxtable',
	options: {
		virtualHost: true
	},
	props: {
		data: {
			type: Array,
			default() {
				return []
			}
		},
		// 是否有竖线
		border: {
			type: Boolean,
			default: false
		},
		// 是否显示斑马线
		stripe: {
			type: Boolean,
			default: false
		},
		// 多选
		type: {
			type: String,
			default: ''
		},
		// 没有更多数据
		emptyText: {
			type: String,
			default: '没有更多数据'
		},
		loading: {
			type: Boolean,
			default: false
		},
		rowKey: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			noData: true,
			minWidth: 0,
			multiTableHeads: []
		}
	},
	watch: {
		loading(val) {},
		data(newVal) {
			let theadChildren = this.theadChildren
			let rowspan = 1
			if (this.theadChildren) {
				rowspan = this.theadChildren.rowspan
			}
			
			// this.trChildren.length - rowspan
			this.noData = false
			// this.noData = newVal.length === 0 
		}
	},
	created() {
		// 定义tr的实例数组
		this.trChildren = []
		this.thChildren = []
		this.theadChildren = null
		this.backData = []
		this.backIndexData = []
	},

	methods: {
		isNodata() {
			let theadChildren = this.theadChildren
			let rowspan = 1
			if (this.theadChildren) {
				rowspan = this.theadChildren.rowspan
			}
			this.noData = this.trChildren.length - rowspan <= 0
		},
	}
}
</script>

<style lang="scss">
$border-color: #ebeef5;

.kzh-table-scroll {
	width: 100%;
	/* #ifndef APP-NVUE */
	overflow-x: auto;
	/* #endif */
}

.kzh-table {
	position: relative;
	width: 100%;
	border-radius: 5px;
	// box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.1);
	background-color: #fff;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	display: table;
	overflow-x: auto;
	::v-deep .kzh-table-tr:nth-child(n + 2) {
		&:hover {
			background-color: #f5f7fa;
		}
	}
	::v-deep .kzh-table-thead {
		.kzh-table-tr {
			// background-color: #f5f7fa;
			&:hover {
				background-color:#fafafa;
			}
		}
	}
	/* #endif */
}

.table--border {
	border: 1px $border-color solid;
	border-right: none;
}

.border-none {
	/* #ifndef APP-NVUE */
	border-bottom: none;
	/* #endif */
}

.table--stripe {
	/* #ifndef APP-NVUE */
	::v-deep .kzh-table-tr:nth-child(2n + 3) {
		background-color: #fafafa;
	}
	/* #endif */
}

/* 表格加载、无数据样式 */
.kzh-table-loading {
	position: relative;
	/* #ifndef APP-NVUE */
	display: table-row;
	/* #endif */
	height: 50px;
	line-height: 50px;
	overflow: hidden;
	box-sizing: border-box;
}
.empty-border {
	border-right: 1px $border-color solid;
}
.kzh-table-text {
	position: absolute;
	right: 0;
	left: 0;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.kzh-table-mask {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(255, 255, 255, 0.8);
	z-index: 99;
	/* #ifndef APP-NVUE */
	display: flex;
	margin: auto;
	transition: all 0.5s;
	/* #endif */
	justify-content: center;
	align-items: center;
}

.kzh-table--loader {
	width: 30px;
	height: 30px;
	border: 2px solid #aaa;
	// border-bottom-color: transparent;
	border-radius: 50%;
	/* #ifndef APP-NVUE */
	animation: 2s kzh-table--loader linear infinite;
	/* #endif */
	position: relative;
}

@keyframes kzh-table--loader {
	0% {
		transform: rotate(360deg);
	}

	10% {
		border-left-color: transparent;
	}

	20% {
		border-bottom-color: transparent;
	}

	30% {
		border-right-color: transparent;
	}

	40% {
		border-top-color: transparent;
	}

	50% {
		transform: rotate(0deg);
	}

	60% {
		border-top-color: transparent;
	}

	70% {
		border-left-color: transparent;
	}

	80% {
		border-bottom-color: transparent;
	}

	90% {
		border-right-color: transparent;
	}

	100% {
		transform: rotate(-360deg);
	}
}
</style>
