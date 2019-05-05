<template>
	<view class="logPage">
		<form @submit="formSubmit" @reset="formReset">
			<!-- 账户 -->
			<view>
				<view class="uni-list-cell">
					<input type="email" class="uni-input" name="email" placeholder="请填写您的账号" />
				</view>
			</view>
			<view>
				<view class="uni-list-cell">
					<input class="uni-input" password="true" name="psd" placeholder="请填写您的密码" />
				</view>
			</view>
			<view class="uni-btn-v uni-common-mt">
				<button class="btn-submit" formType="submit" type="primary">登录</button>
				<button type="default" formType="reset">Reset</button>
			</view>
		</form>
	</view>
</template>

<script>
	
	export default{
		data(){
			return{}
		},
		mounted() {
			
		},
		methods:{
			
			formSubmit(e){
				let res = e.detail.value
				uni.request({
					url:`http://47.93.100.190:3000/login?email=${res.email}&password=${res.psd}`,
					success: (res) => {
						console.log(res);
						if(res.data.code === 200){
							
						}else{
							uni.showToast({
								title:"请输入有效的账号密码",
								duration:2000,
								icon : "none"
							})
						}
						
					},
					fail: (res) => {
						console.log(res);
					}
				})
			},
			formReset(){
				console.log("清空");
			}
		}
	}
</script>

<style>
	.logPage{
		padding: 20upx ;
	}
</style>
