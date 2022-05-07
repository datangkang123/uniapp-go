<script>
	export default {
		// 全局变量，注意修改网址后面不要加/
		globalData: {
			url: 'http://cx.baixingxs.com/v1',
			data: {}
		},
		onLaunch() {
			let url = this.$options.globalData.url;
			uni.request({
				url: url + '/admin/getconfig',
				method: 'POST',
				success: (res) => {
					if (res.statusCode !== 200) {
						return this.$u.toast('服务器无法连接');
					}
					if (res.data.code == 0) {
						var config = {};
						for (let k in res.data.result) {
							if (['pictures', 'daohang1', 'daohang2', 'daohang3', 'daohang4', 'daohang5',
									'daohang6','logo'].includes(k)) {
								config[k] = JSON.parse(res.data.result[k]);
							}else{
								config[k] = res.data.result[k];
							}
						}
						this.globalData.data = config;
						uni.setNavigationBarTitle({
							title: config.zdmc
						});
					} else {
						return this.$u.toast('服务器参数不正确');
					}
				},
				fail: (res) => {
					return this.$u.toast('接口调用失败');
				}
			});
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "common/demo.scss";
	@import './components/jo-markdown/main.css';
</style>
