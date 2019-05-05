<template>
	<view>
		<view class="playMusic" v-if="detail.songs">
			
			<view class="controlMid">
				<!-- 播放模式-->
				<view class="songlist">
					<text class="iconfont" @click.stop="changeMode">
						{{ 	mode === 0 && "&#xe66d;" || 	mode === 1 && "&#xe623;" || mode === 2 && "&#xe622;"}}
					</text>
				</view>
				<!-- 上一首 -->
				<view class="songlist" @click.stop="prev">
					<text class="iconfont">&#xe619;</text>
				</view>
				<!-- 播放\暂停 -->
				<view class="control-if" @click.stop="isPaused?player():pause()">
					<text class="iconfont" >{{isPaused ? "&#xe667;":"&#xe61e;" }}</text>
				</view>
				<!-- 下一首 -->
				<view class="songlist" @click.stop="next">
					<text class="iconfont">&#xe61b;</text>
				</view>
				<!-- 下载歌曲 -->
				<view class="songlist">
					<text class="iconfont" @click.stop="download">&#xe70e;</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Vuex from "vuex"
	export default {
		data(){
			return{
				
			}
		},
		computed:{
			...Vuex.mapState(['detail','isPaused','mode','audio','musicIdx','history'])
		},
		methods:{
			...Vuex.mapMutations(['player','pause','changeMode','setSrc','setDetail','setlyric','setIndex','setPrev']),
			download(){
				// downloadFile  临时缓存
				uni.downloadFile({
					url:this.audio.src,
					success: (res) => {
						// 浏览器下载方式
						// let a = document.createElement('a')
						// a.href = res.tempFilePath
						// a.download = this.detail.songs[0].name +'.mp3'
						// a.click()
						uni.setStorage({
							key: 'songsName',
							data: this.detail.songs[0].name,
							success: function () {
								uni.showToast({
									title: '下载成功',
									duration: 2000
								});
							}
						});
						// 手机app方式 永久保存
						uni.saveFile({
							tempFilePath:res.tempFilePath
						})
					}
				})
			},
			next(){
				this.setIndex()
				this.setSrc(this.history[this.musicIdx].src)
				this.setDetail(this.history[this.musicIdx].detail)
				this.setlyric(this.history[this.musicIdx].lyric)
			},
			prev(){
				this.setPrev()
				this.setSrc(this.history[this.musicIdx].src)
				this.setDetail(this.history[this.musicIdx].detail)
				this.setlyric(this.history[this.musicIdx].lyric)
			}
		},
		mounted() {
			console.log(this.isPaused);
		}
	}
</script>
<style>
	.playMusic{
		display: flex;
		justify-content:space-between;
		align-items:center;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 55px;
		border-top: 1px solid #D4D4D4;
		background: rgba(255,255,255,.9);
		user-select:none;
	}
	.playMusic .detail-img{
		width: 45px;
		height: 45px;
		margin: auto;
		border-radius: 50%;
	}
	.songsCont{
		display: flex;
		justify-content:flex-start;
		margin: 0 10px;
	}
	.songsCont .songsMsg{
		margin-left: 5px;
		text-align: left;
	}
	.songsMsg .songName{
		width: 400upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.songsCont .songsMsg .songAuthor{
		font-size: 12px;
		color: #888;
	}
	.controlMid{
		display: flex;
		width: 100%;
		padding: 0 20upx;
		justify-content:space-between;
	}
	.control .iconfont{
		font-size: 30px;
	}
	.control .songlist{
		margin: 0 10px;
	}
</style>
