<template>
	<view class="article">
		<template v-if="views.Title">
			<view class="article-title">{{views.Title}}</view>
			<uni-list :border="false">
				<uni-list-item thumbSize="lg" :thumb="views.pic">
					<!-- 通过body插槽定义作者信息内容 -->
					<view slot="body" class="header-content">
						<view class="uni-title">{{views.Cjz}}</view>
						<view class="uni-note">更新于{{$u.timeFormat(views.CreatedAt, 'yyyy-mm-dd')}} </view>
					</view>
					<view slot="footer" class="footer">
						<button class="footer-button">{{views.Tags.toString()}}</button>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="banner">
				<image class="banner-img" :src="views.Photo ? views.Photo[0] : ''" mode="widthFix"></image>
				<view class="banner-title">
					<text class="uni-ellipsis">{{views.Title}}</text>
				</view>
			</view>
			<view class="article-content">
				<joMarkdown :nodes="views.Content"></joMarkdown>
			</view>
			<view class="footer">
				<button class="footer-button">阅读：{{views.IsRead}}</button>
			</view>
		</template>
		<template v-else>
			<view class="article-title">详情加载中...</view>
		</template>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import joMarkdown from '@/components/jo-markdown/decode.vue';
	import markdownFunc from '@/components/jo-markdown/index.js';
	export default {
		components: {
			joMarkdown
		},
		data() {
			return {
				views: {},
				scrollTop: 0,
			}
		},
		onLoad(option) {
			if (!option.id) return false;
			uni.request({
				url: getApp().globalData.url + '/blog/view',
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				data:{
					isopen: 1,
					ID:option.id
				},
				success: (res) => {
					console.log(res.data);
					if(res.data.code == 0){
						this.views = res.data.result;
						this.views.Content =  markdownFunc(this.views.Content, 'markdown')
						uni.setNavigationBarTitle({
							title: this.views.Title
						})
					}else{
						return this.$u.toast("暂无数据");
					}
				}
			});
		},

		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},

		methods: {}
	}
</script>

<style>
	.header-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 14px;
	}

	/* 标题 */
	.uni-title {
		display: flex;
		margin-bottom: 6px;
		font-size: 14px;
		font-weight: bold;
		color: #3b4144;
	}

	/* 描述 额外文本 */
	.uni-note {
		color: #999;
		font-size: 12px;
	}

	.footer {
		display: flex;
		align-items: center;
		margin: 1rem;
	}

	.footer-button {
		display: flex;
		align-items: center;
		font-size: 12px;
		height: 26px;
		color: #fff;
		background-color: #4295ff;
	}

	.banner {
		position: relative;
		margin: 0 15px;
		height: 150px;
		overflow: hidden;
	}

	.banner-img {
		position: absolute;
		width: 100%;
	}

	.banner-title {
		display: flex;
		align-items: center;
		position: absolute;
		padding: 0 15px;
		width: 100%;
		bottom: 0;
		height: 30px;
		font-size: 14px;
		color: #fff;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		box-sizing: border-box;
	}

	.uni-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.article-title {
		padding: 15px 15px;
		font-size: 15px;
		padding-bottom: 0;
	}

	.article-content {
		padding: 3px 15px;
		overflow: hidden;
	}
</style>
