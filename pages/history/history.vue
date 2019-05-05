<template>
	<view>
		<uni-list>
			<uni-list-item @click="all(item)" v-for="(item,i) in history" 
			:title="item.detail.songs[0].name" 
			:note="item.detail.songs[0].ar[0].name" 
			:key="i"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import Vuex from "vuex"
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem  from "@/components/uni-list-item/uni-list-item.vue"
	export default{
		components:{
			uniList,uniListItem
		},
		computed:{
			...Vuex.mapState(['history'])
		},
		methods:{
			//点击历史记录需要切换歌曲，把请求音乐所需的方法引入进来
			...Vuex.mapMutations(['setSrc','setDetail','setlyric']),
			//执行引入的3个函数
			all(item){
				this.setSrc(item.src)
				this.setDetail(item.detail)
				this.setlyric(item.lyric)
			},
		},
		mounted() {
			uni.setNavigationBarTitle({
				title:"历史记录"
			})
		}
	}
</script>

<style>
</style>
