<template>
	<view>
		<view @click="ToMusicPage" class="playMusic" v-if="detail.songs">
			<view class="songsCont">
				<!-- 歌曲图 -->
				<img class="detail-img" :src="detail.songs[0].al.picUrl + '?param=65y65'" mode=""></img>
				<!-- 歌曲信息 -->
				<view class="songsMsg">
					<p class="songName">{{ detail.songs[0].name }}</p>
					<p class="songAuthor">{{ detail.songs[0].ar[0].name }}</p>
				</view>
			</view>
			<view class="control">
				<!-- 播放\暂停 -->
				<view class="control-if" @click.stop="isPaused?player():pause()">
					<text class="iconfont" >{{isPaused ? "&#xe667;":"&#xe61e;" }}</text>
				</view>
				<!-- 播放列表 -->
				<view class="songlist">
					<!-- <text class="iconfont" >&#xe60b;</text> -->
					<text class="iconfont" @click.stop="changeMode">
						{{ 	mode === 0 && "&#xe66d;" || 	mode === 1 && "&#xe623;" || mode === 2 && "&#xe622;"}}
					</text>
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
			...Vuex.mapState(['detail','isPaused','mode'])
		},
		methods:{
			...Vuex.mapMutations(['player','pause','changeMode']),
			ToMusicPage(){
				uni.navigateTo({
					url:"/pages/musicPage/musicPage"
				})
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
	.control{
		display: flex;
		justify-content:flex-start;
	}
	.control .iconfont{
		font-size: 30px;
	}
	.control .songlist{
		margin: 0 10px;
	}
</style>
