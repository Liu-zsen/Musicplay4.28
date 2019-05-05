<template>
	<view class="">
		<uni-list>
			<uni-list-item @click="removePath(item.filePath)" v-for="(item,idx) in list" :key="idx" :title="downName" :note="item.filePath"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import Vuex from "vuex"
	export default{
		components: {uniList,uniListItem},
		data(){
			return{
				list:[],
				downName:""
			}
		},
		mounted() {
			uni.getSavedFileList({
				success: (res) => {
						// console.log(JSON.stringify(res))
						this.list = res.fileList
				}
			}),
			uni.getStorage({
				key:"songsName",
				success: (res) => {
					this.downName = res.data
				}
			})
		},
		methods:{
			...Vuex.mapMutations(['setSrc']),
			removePath(filePath){
				// 删除本地存储的文件
				uni.removeSavedFile({
					filePath:filePath,
					complete:(res)=>{
						console.log(JSON.stringify(res));
					}
				})
			}
		}
	}
</script>

<style>
</style>
