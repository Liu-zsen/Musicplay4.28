<template>
	<view class="content">
		<!-- banner -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,idx) in banner" :key='idx'>
				<view class="swiper-item">
					<image :src="item.imageUrl" mode="widthFix"></image>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="box-flex">
			<div @click="toRecommend"><div class="shape"><text class="iconfont">&#xe636;</text></div><p>每日推荐</p></div>
			<div><div class="shape"><text class="iconfont">&#xe61f;</text></div><p>歌单</p></div>
			<div @click="toRanking"><div class="shape"><text class="iconfont">&#xe7bc;</text></div><p>排行榜</p></div>
			<div><div class="shape"><text class="iconfont">&#xe61c;</text></div><p>电台</p></div>
			<div><div class="shape"><text class="iconfont">&#xe65b;</text></div><p>直播</p></div>
		</view>
		<view style="border-bottom: 1px solid #ccc;margin: 0 25upx;"></view>
		<!-- 推荐歌单 -->
		<view class="marginTop">
			<view class="uni-tit paddingCon">
				<p class="bold">推荐歌单</p><div class="more">歌单广场</div>
			</view>
			<view>
				<view class="uni-product-list">
					<view @click="playlist(item)" class="uni-product" v-for="(item ,index) in songList" :key="index">
						<view class="image-view">
							<image class="uni-product-image" :src="item.picUrl+'?param=200y200'"></image>
						</view>
						<view class="uni-product-title">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 左侧抽屉 -->
		<view>
			<uni-drawer @close="closeDrawer" mode="left" :visible="visible">
			<uni-list>
				<uni-list-item @click="togglePopup"  title="立即登录" show-arrow="false"></uni-list-item>
				<uni-list-item title="历史记录" show-arrow="false" @click="his"></uni-list-item>
				<uni-list-item title="下载歌曲" show-arrow="false" @click="down"></uni-list-item>
			</uni-list>
			</uni-drawer>
		</view>
		<view>
			<player></player>
		</view>
	</view>
</template>

<script>
	import Vuex from "vuex"
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem  from "@/components/uni-list-item/uni-list-item.vue"
	import player from "@/components/player/player.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components:{
			uniDrawer,
			uniList,
			uniListItem,
			player,
			uniPopup
		},
		data() {
			return {
				title: 'Hello',
				banner:[],
				songList:[],
				visible : false,
				type: '',
				bottomData:[]
			}
		},
		onLoad() {
			//banner图
			uni.request({
				url:"http://47.93.100.190:3000/banner",
				success:(res)=>{
					this.banner = res.data.banners
				}
			})
			//推荐歌单
			uni.request({
				url:"http://47.93.100.190:3000/personalized",
				success:(res)=>{
					this.songList = res.data.result
				}
			})
			//登录状态
			uni.request({
				url:`http://47.93.100.190:3000/login/status`,
				success: (res) => {
					console.log(res);
				}
			})
		},
		computed:{
			...Vuex.mapState(['isLogin'])
		},
		onNavigationBarButtonTap(e) {
			this[e.index]();
		},
		methods: {
			0(){
				this.visible = true
			},
			1(){
				uni.navigateTo({
					url:"/pages/search/search"
				})
			},
			closeDrawer(){
				this.visible = false
			},
			his(){
				uni.navigateTo({
					url:"/pages/history/history"
				})
			},
			down(){
				uni.navigateTo({
					url:"/pages/download/download"
				})
			},
			playlist(item) {
				// console.log(item)
				uni.navigateTo({
					url: `/pages/playerdetail/playerdetail?id=${item.id}`
				})
			},
			toRecommend(){
				uni.navigateTo({
					url: `/pages/personalized/personalized`
				})
			},
			toRanking(){
				uni.navigateTo({
					url: `/pages/ranking/ranking`
				})
			},
			togglePopup() {
				if(this.isLogin){
					this.type = type;
				}else{
					uni.navigateTo({
						url: `/pages/login/login`
					})
				}
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}
	.box-flex{
		display: flex;
		justify-content: space-between;
		margin: 15px 25px;
	}
	.box-flex div p{
		font-size: 14px;
	}
	.swiper-item{
		border-radius: 10px;
	}
	.bottom-title {
		line-height: 60upx;
		font-size: 24upx;
		padding: 15upx 0;
	}	
	.bottom-btn {
		height: 90upx;
		line-height: 90upx;
		border-top: 1px #f5f5f5 solid;
	}
	.uni-list-item__container{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
