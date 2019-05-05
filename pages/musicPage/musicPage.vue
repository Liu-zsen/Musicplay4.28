<template>
	<view class="content" >
		<view class="songbg">
			<div class="filter"></div>
			<img :src="detail.songs[0].al.picUrl+ '?param=1200y1200'" alt="">
		</view>
		<view class="paddingTop detail-song"  @click="handover">
			<!-- 专辑封面 -->
			<div class="cd-wrapper">
				<div :class=" iscoveShow ? 'show'+ ' middle-l ':'hide'+ ' middle-l '" ref="middlel" >
					<div :class="isPaused ?'middle-cover coverplay coverpaused':'middle-cover coverplay'">
						<img :src="detail.songs[0].al.picUrl+ '?param=500y500'" alt="">
					</div>
				</div>
			</div>
			<!-- 歌词滚动 -->
			 <div :class="iscoveShow ? 'hide'+' middle-R ':'show'+' middle-R '" ref="middleR">
				 <p class="ifLyc" v-show="ifLyc">{{lycNull}}</p>
				 <scroll-view ref="eleheigt"  :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll">
									 <div :style="'margin-top:-' + 22*Index +'px;transition:margin 1.5s'">
										 <view v-for="(item,idx) in lrc.text" :key="idx" :style="Index === idx && 'color:#ecd65f' " ref="current">
										   {{item}}
										 </view>
									 </div>
				 </scroll-view>
			 </div>
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
		
		<playing></playing>
	</view>
</template>

<script>
	import Vuex from "vuex"
	import playing from "@/components/player/playing.vue"
	export default{
		components:{
			playing
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
				animationData:{},
				iscoveShow:true,		//控制界面淡入淡出
				// isPaused:true,			//控制专辑旋转
			}
		},
		mounted(){
			//创建动画实例
			
			//标题名
			uni.setNavigationBarTitle({
				title:this.detail.songs[0].name
			})
			//监听播放结束	,让索引归为初始值
			this.audio.onEnded(()=>{
				this.Index = -1;
				uni.setNavigationBarTitle({
					title:this.detail.songs[0].name
				})
				this.formatLyc();
			})
			//监听播放 
			this.audio.onPlay(()=>{
				this.Index = -1;
				uni.setNavigationBarTitle({
					title:this.detail.songs[0].name
				})
				this.formatLyc();		
			})
			//监听audio时间变化
			this.audio.onTimeUpdate(this.progress)

			//格式化歌词
			this.formatLyc()
			
			//设置滚动歌词的高度
			//获取screenHeight屏幕高度  （windowHeight窗口高）
			uni.getSystemInfo({
				success: (res) => {
					// this.$refs.eleheigt.$el.style.height = res.windowHeight*0.8 + "px"
					// this.halfHeight = res.windowHeight*0.8 
				}
			})
		},
		methods:{
			//
			handover(){
				this.iscoveShow = !this.iscoveShow
			},
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
				// console.log(e)
			},
			//
			formatLyc(){
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
			}
		},
		computed:{
			...Vuex.mapState(['detail','audio','lyric','isPaused'])
		}
	}
</script>

<style>
	*{-webkit-overflow-scrolling : touch;}
	.content{    
		position: fixed;
		height: 100%;
		width: 100%;
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
		color: #fff;
	}	
	.ifLyc{
		position: absolute;
		top:50%;
		left: 50%;
		text-align: center;
		transform: translate(-50%,-50%);
		color: #fff;
	}
	.detail-song{
		position: fixed;
		width: 100%;
		top: 80px;
		bottom: 105px;
		white-space: nowrap;
		font-size: 0;
	}
	.detail-song .scroll-Y{		
		position: fixed;
		width: 100%;
		top: 50px;
		bottom: 105px;
		text-align: center;
		color: #fff;
	}
	.cd-wrapper{
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 80%;
	}
	.detail-song .middle-l{
		position: absolute;
		top:0;
		left: 10%;
		width: 80%;
		height: 100%;
	}
	.detail-song .middle-cover{
		position: relative;
		width: 100%;
		height: 100%;  
		top: 10%;
		left: -2%;
		border:10px solid hsla(0,0%,100%,.1);
		border-radius: 50%;
		line-height: 1;  
	}
	.coverplay{
		animation: covebg 20s linear infinite;
	}	
	.coverpaused{
		animation-play-state: paused;
	}
	.detail-song .middle-cover img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.songbg,.songbg img{
		position: absolute;
		width: 200%;
		height: 100%;
	}
	.songbg{    
		left: -10%;
		top: -10%;
		z-index: -1;
		opacity: .8;
		filter: blur(20px);
	}
	.filter{
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.7);
		opacity: .6;
		z-index: 1;
	}
	@keyframes covebg{
		from{
			transform:rotate(0deg)
		}
		to{
			transform:rotate(360deg)
		}
	}
	
	/* 点击淡入淡出*/
	.hide{
		visibility:hidden;
		opacity: 0;
		transition: .8s;
	}
	.show{
		visibility:visible;
		opacity: 1;
		transition: .8s;
	}
</style>
