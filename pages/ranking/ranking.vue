<template>
	<view>
		<div class="toplist">
			<ul>
				<li class="item" @click="toPage(ranklist)" >
					<div class="icon">
						<img :src="ranklist.coverImgUrl + '?param=150y150'" alt="">
					</div>
					<ul class="songlist">
						<li v-for="(item,idx) in ranklistTracks" :key="idx">{{idx+1}}.{{item.name}}</li>
					</ul>
				</li>
				<li class="item" @click="toPage(hotSonglist)">
					<div class="icon">
						<img :src="hotSonglist.coverImgUrl + '?param=150y150'" alt="">
					</div>
					<ul class="songlist">
						<li v-for="(item,idx) in hotSonglistTracks" :key="idx">{{idx+1}}.{{item.name}}</li>
					</ul>
				</li>
				<li class="item" @click="toPage(topList)">
					<div class="icon">
						<img :src="topList.coverImgUrl + '?param=150y150'" alt="">
					</div>
					<ul class="songlist">
						<li v-for="(item,idx) in topListTracks" :key="idx">{{idx+1}}.{{item.name}}</li>
					</ul>
				</li>
				<li class="item" @click="toPage(Electriclist)">
					<div class="icon">
						<img :src="Electriclist.coverImgUrl + '?param=150y150'" alt="">
					</div>
					<ul class="songlist">
						<li v-for="(item,idx) in ElectriclistTracks" :key="idx">{{idx+1}}.{{item.name}}</li>
					</ul>
				</li>
			</ul>
		</div>
	</view>
</template>

<script>
	import Vuex from 'vuex'
	export default {
		data() {
			return {
				ranklist: {},
				ranklistTracks:[],
				hotSonglist:{},
				hotSonglistTracks:[],
				topList:{},
				topListTracks:[],
				Electriclist:{},
				ElectriclistTracks:[]
			}
		},
		onLoad(params) {
			
			// 美国Billboard周榜
			uni.request({
				url: `http://47.93.100.190:3000/top/list?idx=6`,
				success: (res) => {
					console.log(res);
					this.ranklist = res.data.playlist
					this.ranklistTracks = res.data.playlist.tracks.slice(0, 3)
				}
			})
			// 云音乐热歌榜
			uni.request({
				url: `http://47.93.100.190:3000/top/list?idx=1`,
				success: (res) => {
					this.hotSonglist = res.data.playlist
					this.hotSonglistTracks = res.data.playlist.tracks.slice(0, 3)
				}
			})
			//中国TOP排行榜(内地榜)
			uni.request({
				url: `http://47.93.100.190:3000/top/list?idx=18`,
				success: (res) => {
					this.topList = res.data.playlist
					this.topListTracks = res.data.playlist.tracks.slice(0, 3)
				}
			})
			// 云音乐电音
			uni.request({
				url: `http://47.93.100.190:3000/top/list?idx=4`,
				success: (res) => {
					this.Electriclist = res.data.playlist
					this.ElectriclistTracks = res.data.playlist.tracks.slice(0, 3)
				}
			})
		},
		mounted() {
		},
		methods: {
			...Vuex.mapActions(['getSrc']),
			toPage(list){
				uni.setStorage({
					key:"rankList",
					data:list
				})
				uni.navigateTo({
					url:"/pages/ranking/rankingPage"
				})
			}
		}
	}
</script>

<style>
	ul,li{margin: 0; padding: 0;}
	.toplist{  
		height: 100%;
		overflow: hidden;
		padding-top: 5px;
	}
	.toplist .item{
		display: flex;
		margin: 0 10px;
		padding: 3px 0;
		height: 100px;
		border-bottom: 1px solid #e4e4e4;
	}
	.toplist .item .icon{
		flex: 0 0 100px;
		width: 100px;
		height: 100px;
	}
	.toplist .item .icon img{
		border-radius: 5px;
		width: 100%;
	    height: 100%;	
	}
	.toplist .item .songlist{
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 20px;
		height: 100px;
		overflow: hidden;
		color: #2e3030;
		font-size: 12px;
	}
	.toplist .item .songlist li{
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		line-height: 30px;
		height: 30px;
	}
</style>
