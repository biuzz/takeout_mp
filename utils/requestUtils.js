const baseUrl = "http://localhost:8080/";
// const baseUrl = "http://192.168.65.100:8081/api/";

export const getBaseUrl = () => {
	return baseUrl;
}
export const getWxLogin = () => {
	return new Promise((resolve, reject) => {
		wx.login({
			timeout: 5000,
			success: (res) => {
				console.log(res)
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	});
}


export const getUserProfile = () => {
	return new Promise((resolve, reject) => {
		wx.getUserProfile({
			desc: '获取用户信息',
			success: (res) => {
				console.log(res)
				resolve(res)
				//wx.setStorageSync('userInfo', res.userInfo)
			},
			fail: (err) => {
				reject(err)
			}
		})
	});
}




let ajaxTimes = 0;

export const requestUtil = (params) => {
	const token = wx.getStorageSync('token')
	let header = {
		...params.header
	};
	console.log(params.url)
	if (params.url.includes("/")) {
		header["token"] = wx.getStorageSync('token')
	}
	if(params.url.includes("mp/")){
		params.url = params.url.replace("mp/" , "")
	}
	var start = new Date().getTime();
	console.log("ajaxTimes=" + ajaxTimes)
	ajaxTimes++;
	// 显示加载中 效果


	// while (true) if (new Date().getTime() - start > 1 * 1000) break;
	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			header,
			url: baseUrl + params.url,
			success: (res) => {
				if (res.data.code === 0 && res.data.msg === 'NOTLOGIN') { // 返回登录页面
					wx.clearStorageSync() //清除过期的token
					wx.reLaunch({
						url: '/pages/my/my'
					})
					uni.$showMsg('请先授权登录！')
				} else {
					resolve(res.data)
				}
			
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => {

			}
		})
	});
}
