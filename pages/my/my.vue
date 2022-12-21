<template>
	<view>
		<view class="user">
			<view class="divHead">

				<u-avatar size="60" shape="circle" :src="user.avatarUrl"></u-avatar>

				<view class="divUserName" v-if="user">
					<u-text :text="user.nickName" bold="true"></u-text>
				</view>
				<view class="divLogin" v-else>
					<button style="background: #ffc200;margin-left: 0;padding-left: 0" @click="login"
						size="mini">登录</button>
				</view>
				<view class="userPhone" v-if="user">
					<u-text :text="user.phone"></u-text>
				</view>
				<u-modal :show="show" :content='content' @confirm='loginServer' :asyncClose="true" :closeOnClickOverlay="true" title="登录" @close="cancelLoginServer">
					<view class="loginModal">
						<view class="loginModalInput" style="font-size: 36rpx;text-align: center;">
							<u-input placeholder=" 请输入手机号码" v-model="form.phone" maxlength='20' />
							</u-input>
							<button class="getCode" @click="getCode" style="font-size: 16rpx;margin-left: 20rpx;">获取验证码</button>
						</view>
						<div class="divSplit"></div>
						<view class="loginModalInput" style="font-size: 36rpx;text-align: center;">
							<u-input placeholder=" 请输入验证码" v-model="form.code" maxlength='20' />
							</u-input>
						</view>
					</view>

				</u-modal>
				<!-- <u-modal :show="show" :content='content' @confirm='' :asyncClose="true">
				<view style="font-size: 36rpx;text-align: center;">绑定手机号
					<view style="color: lightgray; font-size: 28rpx;text-align: center">请先绑定手机号再进行此操作</view>
				</view>
				<u-button openType="getPhoneNumber" @getphonenumber="confirm" type="success" slot="confirmButton"
					shape="circle" text="微信用户一键绑定"></u-button>
				</u-modal> -->
			</view>
			<scroll-view scroll-y="true" :style="{height: wh-75 + 'px'}">


				<view class="divContent">
					<view class="divLinks">
						<view @click="toAddress" class="item">
							<image src="../../static/images/locations.png"></image>
							<text>我的地址</text>
							<view>
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
						<view class="divSplit"></view>
						<view @click="toOrder" class="item">
							<image src="../../static/images/orders.png"></image>
							<text>历史订单</text>
							<view>
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>


					</view>
					<view class="divOrders" v-if="flag && user">
						<view class="title">最新订单</view>
						<view class="timeStatus">
							<text>{{order[0].orderTime}}</text>
							<text>{{getStatus(order[0].status)}}</text>
							<!-- <text>正在派送</text> -->
						</view>
						<view class="dishList">
							<view v-for="(item,index) in order[0].orderDetails" :key="index" class="item">
								<text>{{item.name}}</text>
								<text>x{{item.number}}</text>
							</view>
						</view>
						<view class="result">
							<text>共{{order[0].sumNum}} 件商品,实付</text>
							<text class="price">￥{{order[0].amount}}</text>
						</view>
						<view class="btn" v-if="order[0].status === 4">
							<view class="btnAgain" @click="addOrderAgain">再来一单</view>
						</view>
					</view>
					<view v-if="user" class="foot">
						<view @click="logout" class="logout">
							退出登录
						</view>
					</view>
				</view>


			</scroll-view>
		</view>


	</view>

</template>

<script>
	import {
		addOrderApi,
		orderListApi,
		orderPagingApi,
		orderAgainApi,
		deleteOrderApi
	} from '../../api/orderList.js'
	import {
		loginServerApi,
		logoutApi
	} from "../../api/my.js"
	import {
		getBaseUrl,
		requestUtil,
		getWxLogin,
		getUserProfile,
	} from '../../utils/requestUtils.js';
	import regeneratorRuntime from '../../lib/runtime/runtime.js';
	export default {
		data() {
			return {
				userId: '',
				content: "微信用户快速登录",
				flag: false,
				phoneNumber: "",
				show: false,
				user: {},
				getPhoneParam: {},
				wh: 0,
				QiNiuYunUrl: getApp().globalData.QiNiuYunUrl,
				imageUrl: '',
				ruleForm: {
					'id': '',
					'phone': '',
					'gender': '男',
					'status': '',
					'avatar': '',
					'idNumber': '',
				},
				form: {
					phone: '',
					code: ''
				},
				msgFlag: false,
				order: [{
					orderTime: '', //下单时间
					status: undefined, //订单状态 1已结账，2未结账，3已退单，4已完成，5已取消
					orderDetails: [{
						name: '', //菜品名称
						number: undefined, //数量
					}], //明细
					amount: undefined, //实收金额
					sumNum: 0, //菜品总数
				}]

			};
		},
		created() {

		},
		onShow() {
			this.initData()
		},
		mounted() {
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight
			this.getUserInfo()
			this.initData()
		},
		methods: {
			initData() {
				console.log(this.user.id)
				if (this.user.id) {
					this.show = false
					this.getLatestOrder()
				}else{
					this.show = true
				}
			},
			getUserInfo() {
				this.user = wx.getStorageSync('userInfo')
				console.log('用户信息={}', this.user)
			},
			async login() {
				this.show = true;
			},
			async getCode() {
				this.form.code = ''
				//const regex = /^(13[0-9]{9})|(15[0-9]{9})|(17[0-9]{9})|(18[0-9]{9})|(19[0-9]{9})$/;
				const regex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				console.log(this.form.phone)
				if (regex.test(this.form.phone)) {
					uni.$showMsg('验证码已发送')
					const res = await requestUtil({
						url: "user/sendMsg",
						data: {
							phone: this.form.phone
						},
						method: "post"
					})
				} else {
					uni.$showMsg('请输入正确的手机号码')
				}
			},
			cancelLoginServer(){
				this.show = false
			},
			async loginServer() {
				if (this.form.phone && this.form.code) {
					this.loading = true
					Promise.all([loginServerApi(this.form), getUserProfile()]).then((res) => {
						if (res[0].code === 1) {
							this.show = false
							console.log(res[0])
							let allUserInfo = res[0].data.user;
							allUserInfo.nickName = res[1].userInfo.nickName;
							allUserInfo.avatarUrl = res[1].userInfo.avatarUrl;
							wx.setStorageSync("userInfo", allUserInfo)
							wx.setStorageSync("token", res[0].data.token)
							wx.reLaunch({
								url: '/pages/index/index'
							})
						} else {
							uni.$showMsg(res[0].msg)
						}
					})

				} else {
					this.show = false
					uni.$showMsg('请输入手机号码和验证码')
				}
			},
			// async wxLogin(loginParam) {
			// 	const res = await requestUtil({
			// 		url: "wxlogin",
			// 		data: loginParam,
			// 		method: "post"
			// 	});

			// 	if (res.code === 0) {
			// 		console.log(res.data.token)
			// 		wx.setStorageSync('token', res.data.token)
			// 		wx.setStorageSync('userId', res.data.userId)
			// 		if (res.data.phone == null) {
			// 			this.show = true
			// 			uni.hideTabBar({
			// 				animation: true
			// 			})
			// 		}
			// 		wx.setStorageSync('phoneNumber', res.data.phone)
			// 		this.getUserInfo()
			// 		this.initData()
			// 	}
			// },
			// async getPhoneNumber(param) {
			// 	let that = this
			// 	const res = await requestUtil({
			// 		url: "mp/wxGetPhone",
			// 		data: param,
			// 		method: "post"
			// 	})
			// 	if (res.code === 0) {
			// 		this.phone_info = res.data
			// 		console.log("手机号" + this.phone_info)
			// 		let phoneNumber = this.phone_info
			// 		console.log(phoneNumber, "手机号")
			// 		wx.setStorageSync('phoneNumber', phoneNumber)
			// 		this.show = false
			// 		this.getUserInfo()
			// 		uni.showTabBar({
			// 			animation: true
			// 		})
			// 		this.initData()

			// 	} else {
			// 		return uni.$showMsg()
			// 	}
			// },
			async logout() {
				console.log("userId={}", wx.getStorageSync('userInfo'))
				wx.clearStorageSync()
				this.getUserInfo()
				//const res = await logoutApi({})
				// if (res.code === 0) {
				// 	wx.clearStorageSync()
				// 	this.getUserInfo()
				// } else {
				// 	return uni.$showMsg()
				// }

			},
			async getLatestOrder() {
				const params = {
					// order: "desc",
					// orderField: "order_time",
					// page: 1,
					// limit: 1,
					page: 1,
					pageSize: 1
				}
				const res = await orderPagingApi(params)
				if (res.code === 1) {
					if (res.data.records.length != 0) {
						this.flag = true
					}
					this.order = res.data.records
					if (this.order && this.order[0].orderDetails) {
						let number = 0
						this.order[0].orderDetails.forEach(item => {
							number += item.number
						})
						this.order[0].sumNum = number
					}
				} else {
					return uni.$showMsg(res.msg)
				}
			},
			getStatus(status) {
				let str = ''
				switch (status) {
					case 1:
						str = '待付款'
						break;
					case 2:
						str = '正在派送'
						break;
					case 3:
						str = '已派送'
						break;
					case 4:
						str = '已完成'
						break;
					case 5:
						str = '已取消'
						break;

				}
				return str
			},
			async addOrderAgain() {
				const res = await orderAgainApi({
					id: this.order[0].id
				})
				if (res.code === 1) {
					wx.reLaunch({
						url: '/pages/index/index'
					})
				} else {
					return uni.$showMsg(res.msg)
				}
			},
			toAddress() {
				uni.navigateTo({
					url: '/pages/address/address'
				})
			},
			toOrder() {
				/* uni.navigateTo({
					url: '/pages/orderList/orderList'
				}) */
				uni.switchTab({
					url: '/pages/orderList/orderList'
				})
			},
			// confirm(e) {
			// 	console.log(e)
			// 	if (e.detail.errMsg == 'getPhoneNumber:ok') {

			// 		let param = {
			// 			code: e.detail.code,
			// 			encryptedData: this.getPhoneParam.encryptedData,
			// 			iv: this.getPhoneParam.iv
			// 		}
			// 		//this.getPhoneNumber(param)

			// 	} else {
			// 		return uni.$showMsg('请授权登录!')
			// 	}


			// }
		},

	}
</script>

<style>
	@import url(./my.css);
</style>
