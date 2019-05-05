<template>
	<view class="">
		<uni-list v-for="(item,idx) in resultList" :key="idx">
			<uni-list-item 
			:title="item.name" 
			:note="item.artists[0].name"
			show-extra-icon="true" 
			:extra-icon="{color: '#4cd964',size: '22',type: 'videocam'}"
			@click= "getSrc(item)"
			></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem  from "@/components/uni-list-item/uni-list-item.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import Vuex from "vuex"
	export default {
		components:{
			uniList,uniListItem,uniTag
		},
		data(){
			return{
				resultList: '',
			}
		},
		onLoad() {
			this.init(),
			uni.setNavigationBarTitle({
				title:"搜索"
			})
		},
		onNavigationBarButtonTap(e){
			this[e.index]()
		},
		methods:{
			...Vuex.mapActions(['getSrc']),
			0(){
				//返回到首页
				uni.navigateBack({
					delta:2
				})
			},
			init(){
				let This = this
				uni.getStorage({
					key: 'searchKey',
					success: function (res) {
						This.keysResult = res.data
						// console.log(1);
					}
				});
				//搜索结果
				uni.request({
					url:`http://47.93.100.190:3000/search?keywords=${This.keysResult}`,
					success: (res) => {
						this.resultList = res.data.result.songs
						// console.log(2);
					}
				})
			}
		}
	}
</script>

<style>
	.uni-list-item__content-title{
		color:#0366d6
	}
</style>
