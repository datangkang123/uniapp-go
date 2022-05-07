<template>
	<!-- #ifdef H5 -->
	<tr class="kzh-table-tr">
		<th v-if="selection === 'selection' && ishead" class="checkbox" :class="{ 'tr-table--border': border }">
			<table-checkbox></table-checkbox>
		</th>
		<slot></slot>
		<!-- <kzh-th class="th-fixed">123</kzh-th> -->
	</tr>
	<!-- #endif -->
	<!-- #ifndef H5 -->
	<view class="kzh-table-tr">
		<view v-if="selection === 'selection' " class="checkbox" :class="{ 'tr-table--border': border }">
			<table-checkbox></table-checkbox>
		</view>
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
export default {
	name: 'kzhTr2',
	options: {
		virtualHost: true
	},
	data() {
		return {
			value: false,
			border: false,
			selection: false,
			widthThArr: [],
			ishead: true
		}
	},

}
</script>

<style lang="scss">
$border-color: #ebeef5;

.kzh-table-tr {
	/* #ifndef APP-NVUE */
	display: table-row;
	transition: all 0.3s;
	box-sizing: border-box;
	/* #endif */
}

.checkbox {
	padding: 0 8px;
	width: 26px;
	padding-left: 12px;
	/* #ifndef APP-NVUE */
	display: table-cell;
	vertical-align: middle;
	/* #endif */
	color: #333;
	font-weight: 500;
	border-bottom: 1px $border-color solid;
	font-size: 14px;
	// text-align: center;
}

.tr-table--border {
	border-right: 1px $border-color solid;
}

/* #ifndef APP-NVUE */
.kzh-table-tr {
	::v-deep .kzh-table-th {
		&.table--border:last-child {
			// border-right: none;
		}
	}

	::v-deep .kzh-table-td {
		&.table--border:last-child {
			// border-right: none;
		}
	}
}

/* #endif */
</style>
