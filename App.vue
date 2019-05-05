<script>
	import Vuex from "vuex"
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.audio.onEnded(()=>{
				if(this.mode === 0){
					//单曲循环
					this.audio.play()
				}else if(this.mode === 1){
					//根据历史记录顺序播放
					this.setIndex()
					this.setSrc(this.history[this.musicIdx].src)
					this.setDetail(this.history[this.musicIdx].detail)
					this.setlyric(this.history[this.musicIdx].lyric)
				} else if(this.mode === 2){
					const index = Math.floor(Math.random() * this.history.length)
					this.setSrc(this.history[index].src)
					this.setDetail(this.history[index].detail)
					this.setlyric(this.history[index].lyric)
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		computed:{
			...Vuex.mapState(['audio','mode','history','musicIdx'])
		},
		methods:{
			...Vuex.mapMutations(['setSrc','setDetail','setlyric','setIndex'])
		}
	}
</script>

<style>

	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import "./common/uni.css";
	@import "./common/iconfont.css";	

	/*每个页面公共css */
	@font-face {
	  font-family: 'iconfont';  /* project id 1160985 */
	  src: url('https://at.alicdn.com/t/font_1160985_gqpjviurdsm.eot');
	  src: url('https://at.alicdn.com/t/font_1160985_gqpjviurdsm.eot?#iefix') format('embedded-opentype'),
	  url('https://at.alicdn.com/t/font_1160985_gqpjviurdsm.woff2') format('woff2'),
	  url('https://at.alicdn.com/t/font_1160985_gqpjviurdsm.woff') format('woff'),
	  url('https://at.alicdn.com/t/font_1160985_gqpjviurdsm.ttf') format('truetype'),
	  url('https://at.alicdn.com/t/font_1160985_gqpjviurdsm.svg#iconfont') format('svg');
	}
	.iconfont {
	  font-family:"iconfont" !important;
	  font-size:25px;
	  font-style:normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	.icon {
      font-size: 24px;
      color: #000000;
      font-family: iconfont;
    }
	ul,li{list-style: none;}
	.marginTop{
		margin-top : 30px;
	}
	.uni-tit{
		display: flex;
		justify-content:space-between;
		align-items: center;
	}	
	.uni-tit .bold{
		font-weight: bold;
	}
	.uni-tit .more{
		padding: 3px 12px;
		border:1px solid #ccc;
		border-radius: 25px;
		font-size: 12px;
	}
	.paddingCon{
		padding-left:25upx;
		padding-right:25upx;
	}
	.margin-bottom{
		margin-bottom: 5px;
	}
	.margin-top{
		margin-top: 25px;
	}
	.paddingTop{
		padding-top: 15px;
	}
</style>
