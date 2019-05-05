<template>
	<view class="">
		<!-- 关键字搜索 -->
		<view>
			<scroll-view scroll-y v-show="isKeyword">
				<view  v-for="(item,idx) in searchList" :key="idx">
					<uni-list>
						<uni-list-item :title="item.name" 
						 show-arrow="false"
						 show-extra-icon="true"
						 :extra-icon="{color: '#cccccc',size: '22',type: 'search'}"
						 @click = "clickSearch(item.name)"
						 ></uni-list-item>
					</uni-list>
				</view>
			</scroll-view>
		</view>
		<!-- 历史搜索 -->
		<view class="paddingCon" v-show="isSearch">
			<view class="uni-tit margin-bottom">
				<p class="bold">历史搜索</p>
				<view class="icon-item">
					<uni-icon @tap="deleteKeys" type="trash" size="20" color="#ccc"></uni-icon>
				</view>
			</view>
			<view class="hotlist">
				<view class="hotTag" v-for="(item,index) in searchKeywords" :key="index">
					<uni-tag :text="item" circle="true" @click="clickSearch(item)"></uni-tag>
				</view>
			</view>
		</view> 
		<!-- 热门搜索 -->
		<view class="paddingCon">
			<view class="uni-tit margin-bottom"><p class="bold">热门搜索</p></view>
			<view class="hotlist">
				<view class="hotTag" v-for="item in hotTag" :key="item.first">
					<uni-tag :text="item.first" circle="true" @click="clickSearch(item.first)"></uni-tag>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem  from "@/components/uni-list-item/uni-list-item.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import uniIcon from '@/components/uni-icon/uni-icon.vue'
	export default {
		components:{
			uniList,
			uniListItem,
			uniTag,
			uniIcon
		},
		data(){
			return{
				searchList:[],
				hotTag:[],
				searchKeywords:[],	
				isKeyword:false,
				isSearch:false,
				eText:'',
			}
		},
		onLoad() {
			this.init();
			uni.request({
				url:"http://47.93.100.190:3000/search/hot",
				success: (res) => {
					this.hotTag = res.data.result.hots
				}
			})
		},
		onNavigationBarSearchInputChanged(e) {
			this.onChange(e.text)	//监听关键字搜索
			this.eText = e.text
			if(!e.text) return
			uni.request({
				url:`http://47.93.100.190:3000/search?keywords=${e.text}`,
				success:(res)=>{
					this.searchList = res.data.result.songs
				}
			})
		},
		onNavigationBarSearchInputConfirmed(e) {
				this.clickSearch(e.text)
		},
		methods:{
			//test
			iconlink(){
				uni.navigateTo({
					url:"/pages/icon/icon"
				})
			},
			//页面初始化
			init(){
				this.loadHistorykey()	//加载历史搜索,自动读取本地Storage
			},
			onChange(eText){
				if(!eText){
					this.isKeyword = false
					return
				}
				this.isKeyword = true
			},
			oniListItem(){
				console.log("搜索列表被点击了");
			},
			saveSearchHistory(keys){	//保存搜索的关键词
				let key = Array.from(new Set(keys))	//去重复
				uni.setStorage({
					key: 'OldKeys',
					data:JSON.stringify(key),
				});
				
				this.searchKeywords = key
			},
			loadHistorykey(){		//加载历史记录
				
				let OldKeys = []
				uni.getStorage({ 
					key: 'OldKeys',
					success: (res)=>{
						OldKeys = JSON.parse(res.data)
					}
				});
				this.searchKeywords = OldKeys
				this.isSearch = this.searchKeywords.length ? true : false
			},
			//删除搜索历史
			deleteKeys(){
				uni.showModal({
					content:"确定清除历史搜索记录?",
					success: (res) => {
						if (res.confirm) {
							this.searchKeywords = []
							this.isSearch = false
							uni.removeStorage({
								key:"OldKeys"
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
					fail:(err)=>{
						console.log(err);
					}
				})
			},
			//点击搜索并进入搜索结果页面
			clickSearch(item){
				//保存搜索 记录关键字
				this.searchKeywords.unshift(item)
				this.saveSearchHistory(this.searchKeywords)
				
				uni.setStorage({
					key:"searchKey",
					data:item
				})
				uni.navigateTo({
					url:"/pages/search/searchResult"
				})
			}
			
		}
	}
</script>

<style>
	.hotlist{
		display: flex;
		flex-wrap:wrap;
	}
	.hotlist .hotTag{
		margin-right: 20upx;
		margin-bottom: 20upx;
		font-size: 14upx;
	}
</style>
