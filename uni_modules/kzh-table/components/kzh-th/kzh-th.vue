<template>
	<!-- #ifdef H5 -->
	<th class="kzh-table-th" :class="{ 'table--border': border }"
		style="width:35%;font-size:12px;background-color:#f6f7fd;">
		<view class="kzh-table-th-content">
			<slot></slot>
		</view>
	</th>
	<!-- #endif -->
	<!-- #ifndef H5 -->
	<view class="kzh-table-th" :class="{ 'table--border': border }"
		style="width:35%;font-size:12px;background-color:#f6f7fd;">
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
	/**
	 * Th 表头
	 * @description 表格内的表头单元格组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=
	 * @property {Number} 	width 						单元格宽度
	 * @property {Boolean} 	sortable 					是否启用排序
	 * @property {Number} 	align = [left|center|right]	单元格对齐方式
	 * @value left   	单元格文字左侧对齐
	 * @value center	单元格文字居中
	 * @value right		单元格文字右侧对齐
	 * @event {Function} sort-change 排序触发事件 
	 */

	export default {
		name: 'kzhTh2',
		options: {
			virtualHost: true
		},

		data() {
			return {
				border: false,
				ascending: false,
				descending: false
			}
		},
		computed: {},
		created() {},
		methods: {
			getTable(name) {
				let parent = this.$parent
				let parentName = parent.$options.name
				while (parentName !== name) {
					parent = parent.$parent
					if (!parent) return false
					parentName = parent.$options.name
				}
				return parent
			}
		}
	}
</script>

<style lang="scss">
	$border-color: #ebeef5;

	.kzh-table-th {
		padding: 12px 10px;
		/* #ifndef APP-NVUE */
		display: table-cell;
		box-sizing: border-box;
		/* #endif */
		font-size: 14px;
		font-weight: bold;
		color: #909399;
		border-bottom: 1px $border-color solid;
	}

	.table--border {
		border-right: 1px $border-color solid;
	}

	.kzh-table-th-content {
		display: flex;
		align-items: center;
	}

	.arrow-box {}

	.arrow {
		display: block;
		position: relative;
		width: 10px;
		height: 8px;
		// border: 1px red solid;
		left: 5px;
		overflow: hidden;
		cursor: pointer;
	}

	.down {
		top: 3px;

		::after {
			content: '';
			width: 8px;
			height: 8px;
			position: absolute;
			left: 2px;
			top: -5px;
			transform: rotate(45deg);
			background-color: #ccc;
		}

		&.active {
			::after {
				background-color: #007aff;
			}
		}
	}

	.up {
		::after {
			content: '';
			width: 8px;
			height: 8px;
			position: absolute;
			left: 2px;
			top: 5px;
			transform: rotate(45deg);
			background-color: #ccc;
		}

		&.active {
			::after {
				background-color: #007aff;
			}
		}
	}
</style>
