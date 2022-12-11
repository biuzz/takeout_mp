import {getBaseUrl,requestUtil,getUserProfile,getWxLogin} from '../utils/requestUtils';
import regeneratorRuntime, { async } from '../lib/runtime/runtime';

export const addOrderApi = (data) =>{
	return new Promise((resolve, reject) => {
	    requestUtil({
	        url: 'mp/order/submit',
	        method: 'post',
	        data: data
	    }).then((res) => {
	        console.log(res.data)
	        resolve(res)
	    }).catch((err) => {
	        reject(err)
	    })
	});
}

export const orderListApi = () =>{
	return new Promise((resolve, reject) => {
	    requestUtil({
	        url: 'mp/order/list',
	        method: 'get',
	        
	    }).then((res) => {
	        console.log(res.data)
	        resolve(res)
	    }).catch((err) => {
	        reject(err)
	    })
	});
}
export const orderPagingApi = (data) =>{
	return new Promise((resolve, reject) => {
	    requestUtil({
	        url: 'mp/order/userPage',
	        method: 'get',
	        data:{...data}
	    }).then((res) => {
	        console.log(res.data)
	        resolve(res)
	    }).catch((err) => {
	        reject(err)
	    })
	});
}
export const orderAgainApi = (data) =>{
	return new Promise((resolve, reject) => {
	    requestUtil({
	        url: 'mp/order/again',
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
export const deleteOrderApi = (id) =>{
	return new Promise((resolve, reject) => {
	    requestUtil({
	        url: 'mp/orders',
	        method: 'delete',
	        data:id
	    }).then((res) => {
	        console.log(res.data)
	        resolve(res)
	    }).catch((err) => {
	        reject(err)
	    })
	});
}

