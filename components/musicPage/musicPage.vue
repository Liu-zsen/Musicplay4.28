<template>
	<view class="content" >
		<view class="paddingTop" >
			<p class="ifLyc" v-show="ifLyc">{{lycNull}}</p>
			<!-- 歌词滚动 -->
			 <view >
				 <scroll-view ref="eleheigt"  :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll">
					 <div>
						 <view v-for="(item,idx) in lrc.text" :key="idx" :style="Index === idx && 'color:red' " ref="current">
						   {{item}}
						 </view>
					 </div>
				 </scroll-view>
			 </view>
		</view>
		<view class="controlPro">
			<view class="progressBar">
				<p>{{ startTime }}</p>
				<view style="width:80%">
					<slider @changing="sliderChing" @change="sliderChange" :value="Timevalue" block-size="8"/>
				</view>
				<p>{{ endTime }}</p>
			</view>
		</view>
		
		<player></player>
	</view>
</template>

<script>
	import Vuex from "vuex"
	import player from "@/components/player/player.vue"
	export default{
		components:{
			player
		},
		data(){
			return{
				startTime:"",
				endTime:"",
				Timevalue:0,
				ifUpdate:true,
				lrc:{},
				Index:-1,		//记录配对的歌词索引
				lycNull:"",
				ifLyc:false,
				halfHeight:"",
				scrollTop: 0,
				old: {
					scrollTop: 0
				}
			}
		},
		mounted(){
			uni.setNavigationBarTitle({
				title:this.detail.songs[0].name
			})
			//监听audio时间变化
			this.audio.onTimeUpdate(this.progress)
			// 

			//格式化歌词
			if(this.lyric.lrc){
				let arr = [],arr2 = []  
				// a 被切割对象本身 ； $1 时间  ； $2 歌词
				this.lyric.lrc.lyric.replace(/\[([\d:.]+)\](.+)/g,function(a,$1,$2){
					arr.push($1.substring(0,$1.length-4)),
					arr2.push($2)
				})
				
				this.lrc.time = arr
				this.lrc.text = arr2
			}else{
				this.ifLyc = true
				this.lycNull = "纯音乐，请欣赏"
			}
			
			//设置滚动歌词的高度
			//获取screenHeight屏幕高度  （windowHeight窗口高）
			uni.getSystemInfo({
				success: (res) => {
					// console.log(res.screenHeight,res.screenHeight*0.8);
					this.$refs.eleheigt.$el.style.height = res.windowHeight*0.8 + "px"
					this.halfHeight = res.windowHeight*0.8 
					// console.log(this.$refs.eleheigt.$el);
				}
			})
		},
		methods:{
			//计算播放时间
			progress (){
				//实时时长
				let minute = Math.floor(this.audio.currentTime / 60)
				minute = minute.toString().length === 1 ? ("0"+minute) : minute
				let Sec = Math.round(this.audio.currentTime %60)
				Sec = Sec.toString().length === 1 ? ("0"+Sec) : Sec
				
				//总时长
				let TMin = Math.floor(this.audio.duration / 60)
				TMin = TMin.toString().length === 1 ? ("0"+TMin) : TMin
				let TSec = Math.round(this.audio.duration % 60)
				TSec = TSec.toString().length === 1 ? ("0"+TSec) : TSec
				
				this.startTime = `${minute}:${Sec}`		//当前播放时长
				this.endTime = `${TMin}:${TSec}`		//总时长
				
				//利用ifUpdate判断是否更新进度条
				if(this.ifUpdate){
					//更新(计算)进度条百分比 (播放的当前时长/总时长)
					this.Timevalue = this.audio.currentTime / this.audio.duration *100	
				}
				
				//记录高亮歌词索引
				if(this.startTime>this.lrc.time[this.Index +1]){
					this.Index++
				}
				//获取高亮歌词的offsetTOp
			},
			// 控制滑块拖动长度	
			sliderChange(e){
				let This = this
				//滑块长 = 当前进度百分比*总时间 /100
				this.audio.seek(e.detail.value * this.audio.duration / 100)			
				this.ifUpdate = true
				 //将Index清0
				this.Index = 0
				//重新计算播放的实时时长
				let minute = Math.floor(this.audio.currentTime / 60)
				minute = minute.toString().length === 1 ? ("0"+minute) : minute
				let Sec = Math.round(this.audio.currentTime %60)
				Sec = Sec.toString().length === 1 ? ("0"+Sec) : Sec
				let s = `${minute}:${Sec}`		
				;(function d(){
					if(s > This.lrc.time[This.Index + 1]){
						This.Index++
						d()
					}
				})()
			},
			//正在拖动时触发
			sliderChing(){
				this.ifUpdate = false
			},
			// swiper
			scroll: function(e) {
				console.log(e)
				
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				uni.showToast({
					icon:"none",
					title:"纵向滚动 scrollTop 值已被修改为 0"
				})
			}
		},
		computed:{
			...Vuex.mapState(['detail','audio','lyric'])
		}
	}
</script>

<style>
	*{-webkit-overflow-scrolling : touch;}
	uni-page-wrapper{
		background: url();
	}
	.content{
		-ms-overflow-style: none;
		overflow: -moz-scrollbars-none;
	}
	.lyrList{
		/* overflow: scroll; */
		text-align: center;
		padding: 0;
		width: 80%;
		margin: auto;
		-ms-overflow-style: none;
		overflow: -moz-scrollbars-none;
	}
	.theScroll{
		text-align: center;
	}
	.lyrList::-webkit-scrollbar { width: 0 !important }
	.content::-webkit-scrollbar { width: 0 !important }
	.controlPro{
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.progressBar{
		position: relative;
		top: -50px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2px 5px;
	}
	.progressBar p{
		font-size: 10px;
	}	
	.ifLyc{
		position: absolute;
		top:50%;
		left: 50%;
		text-align: center;
		transform: translate(-50%,-50%);
	}
	.scroll-Y{
		text-align: center;
	}
</style>
