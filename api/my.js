import {getBaseUrl,requestUtil,getUserProfile,getWxLogin} from '../utils/requestUtils';
import regeneratorRuntime, { async } from '../lib/runtime/runtime';

export const loginServerApi = (data) =>{
	return new Promise((resolve, reject) => {
	    requestUtil({
	        url: 'user/wxlogin',
	        method: 'post',
	        data:data
	    }).then((res) => {
	        resolve(res)
	    }).catch((err) => {
	        reject(err)
	    })
	});
}

export const logoutApi = (data) =>{
	return new Promise((resolve, reject) => {
	    requestUtil({
	        url: 'mp/logout',
	        method: 'post',
	        data:data
	    }).then((res) => {
	        console.log(res.data)
	        resolve(res)
	    }).catch((err) => {
	        reject(err)
	    })
	});
}

