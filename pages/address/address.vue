<template>
	<view>
		<view class="address">
			<view class="divContent">
				<u-empty :show="show" text="地址为空" mode="data" marginTop="50%"
					icon="http://cdn.uviewui.com/uview/empty/data.png">
				</u-empty>
				<view class="divItem" v-for="(item,index) in addressList" :key="index" @click="itemClick(item)">
					<view class="divAddress">
						<text
							:class="{spanCompany:item.label === '公司',spanHome:item.label === '家',spanSchool:item.label === '学校'}">{{item.label}}</text>
						{{item.detail}}
					</view>
					<view class="divUserPhone">
						<text>{{item.consignee}}</text>
						<text>{{item.sex === '0' ? '女士' : '先生'}}</text>
						<text>{{item.phone}}</text>
					</view>
					<image src="../../static/images/edit.png" @tap.stop.prevent="toAddressEditPage(item)" />
					<view class="divSplit"></view>
					<view class="divDefault">
						<image src="../../static/images/checked_true.png" v-if="item.isDefault === 1"
							@tap.stop.prevent="setDefaultAddress(item)">
							<image src="../../static/images/checked_false.png"
								@tap.stop.prevent="setDefaultAddress(item)" v-else>设为默认地址
					</view>
				</view>
			</view>
			<view class="divBottom" @click="toAddressCreatePage">+ 添加收货地址</view>

		</view>

		</u-empty>
	</view>
</template>

<script>
	import {
		getBaseUrl,
		requestUtil,
		getWxLogin,
		getUserProfile
	} from '../../utils/requestUtils';
	import regeneratorRuntime, {
		async
	} from '../../lib/runtime/runtime';
	import {
		setDefaultAddressApi,
		addressFindOneApi,
		updateAddressApi,
		addAddressApi,
		deleteAddressApi,
		addressListApi
	} from '../../api/address.js'
	export default {
		data() {
			return {
				show: false,
				addressList: [

				],
			}
		},
		computed: {},
		created() {

		},
		mounted() {},
		onShow() {
			this.initData()
		},
		methods: {
			goBack() {
				history.go(-1)
			},
			toAddressEditPage(item) {
				uni.navigateTo({
					url: "/pages/addressEdit/addressEdit?id=" + item.id,

				})
			},
			toAddressCreatePage() {
				uni.navigateTo({
					url: '/pages/addressCreate/addressCreate'
				})

			},
			async initData() {
				const res = await addressListApi()
				if (res.code === 1) {
					this.addressList = res.data
					this.show = false
					if (this.addressList.length < 1) {
						this.show = true
					}
				} else {
					this.$message.error(res.msg)
				}
			},
			async setDefaultAddress(item) {
				if (item.id) {
					const res = await setDefaultAddressApi({
						id: item.id
					})
					if (res.code === 1) {
						this.initData()
					} else {
						this.$message.error(res.msg)
					}
				}
			},
			itemClick(item) {

				let pages = getCurrentPages()
				let prevPage = pages[pages.length - 2]
				console.log(prevPage)
				prevPage.setData({
					address: item
				})
				// prevPage.data.address.consignee = item.consignee
				// prevPage.data.address.detail = item.detail
				// prevPage.data.address.phone = item.phone
				// prevPage.data.address.gender = item.gender
				//prevPage.data.address = item
				//表示是从订单页面跳转过来的

				uni.navigateBack()
			}

		}
	}
</script>

<style>
	@import url(./address.css);
</style>
