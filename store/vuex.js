//配置文件
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const MusicApi = "http://47.93.100.190:3000"
export default new Vuex.Store({
	//定义全局audio
	state:{
		audio:uni.createInnerAudioContext(),
		detail:{},
		isLogin:false,
		isPaused:true,		//是否为暂停
		lyric:{},			//歌词
		history:[],			//历史记录
		mode : 0,			//播放模式: 0.单曲循环,1.顺序播放,2随机播放
		musicIdx: 0			//记录当前播放哪一首歌曲的索引
	},
	mutations:{
		//同步
		setSrc(state,src){
			state.audio.src = src
			state.audio.play()
			state.isPaused = false
		},
		setDetail(state,detail){
			state.detail = detail
		},
		player(state){
			state.audio.play()
			state.isPaused = false
		},
		pause(state){
			state.audio.pause()
			state.isPaused = true
		},
		setlyric(state,lyric){
			state.lyric = lyric
		},
		setHistory(state,data){
			//用findIndex()方法判断歌曲是否重复添加  (不存在 -1)
			let numId = state.history.findIndex((item)=>{
				return item.id === data[3]
			})
			if(numId === -1){
				state.history.unshift({
					src:data[0],
					detail:data[1],
					lyric:data[2],
					id:data[3]
				})				
			}

		},
		setIndex(state){
			state.musicIdx++
			if(state.musicIdx >= state.history.length){
				state.musicIdx = 0
			} 
			console.log(state.musicIdx,state.history.length );
		},
		setPrev(state){
			if(state.musicIdx <= 0){
				state.musicIdx = state.history.length
			} 
			if(state.musicIdx <= -1){
				state.musicIdx = state.history.length -1
			} 
			state.musicIdx --
		},
		changeMode(state){
			state.mode++
			state.mode %= 3
		}
	},
	actions:{
		//异步
		//获取音乐 url 、id
		getSrc({commit,dispatch},item){
			// 等待ajax全部请求完再执行setHistory
			Promise.all([
				new Promise((next,err)=>{
					//第一个参数是固定的，自己传的参数在从第二个开始
					//commit 用来执行mutations 里函数的方法
					//dispatch 用来执行action里的其他函数的方法
					uni.request({
						url: MusicApi + `/song/url?id=${item.id}`,	
						success:(res)=>{
							commit("setSrc",res.data.data[0].url)
							next(res.data.data[0].url)
						}
					});
				}),
				new Promise((next,err)=>{
					//获取音乐详情
					uni.request({
						url: MusicApi +  `/song/detail?ids=${item.id}`,	
						success: (res) => {
							commit("setDetail",res.data)
							next(res.data)
						}
					});
				}),
				new Promise((next,err)=>{
					uni.request({
						url: `https://api.wulv5.com/music/lyric?id=${item.id}`,	
						success: (res) => {
							commit("setlyric",res.data)
							next(res.data)
						}
					});
				})
			]).then(data=>{
				data[3] = item.id
				commit("setHistory",data)
				console.log(data);
			})
		}
	}
})
