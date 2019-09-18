import axios from 'axios';
import Qs from 'qs';
axios.defaults.withCredentials=true;//让ajax携带cookie
// 环境的切换
if (process.env.NODE_ENV == 'development') { 
 axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') { 
 axios.defaults.baseURL = "http://mjy.qinjini.com";
}

let get = function(url, params){ 
    return new Promise((resolve, reject) =>{  
     axios.get(url, {   
      params: params  
     })  
     .then(res => {  
      resolve(res);  
     })  
     .catch(err => {   
      reject(err)  
     }) 
    })
}

let post = function(url, params) { 
    return new Promise((resolve, reject) => {   
     axios({
       method:'post',
       url:url,
       data:Qs.stringify(params),
       header:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}
     }).then(res => {
      resolve(res); 
     }).catch(err => {   
      reject(err)  
     }) 
    })
}

export const getIndexGoods = params => { return post('/api/client/get_index_goods', params);};//获取首页商品信息
export const queryMemberMessage = params => { return post('/api/client/query_member_message', params);};//获取消息列表
export const queryCart = params => { return post('/api/client/query_cart', params);};//获取购物车列表
export const addCart = params => { return post('/api/client/add_cart', params);};//加入购物车
export const deleteCart = params => { return post('/api/client/delete_cart', params);};//删除购物车
export const updateCart = params => { return post('/api/client/update_cart', params);};//更新购物车数量
export const loginSmsSend = params => { return post('/api/web/user/login/login_sms_send', params);};//登录验证码接口
export const userXcxLogin = params => { return post('/api/web/user/login/user_xcx_login', params);};//登录接口
export const getGoodsList = params => { return post('/api/client/get_goods_list', params);};//商品列表的查询
export const getGoodsdescList = params => { return post('/api/client/get_goodsdesc_list', params);};//商品详情的查询
export const queryOrderList = params => { return post('/api/client/query_order_list', params);};//订单列表的查询
export const queryOrder = params => { return post('/api/client/query_order', params);};//订单详情的查询
export const addOrder = params => { return post('/api/client/add_order', params);};//订单生成
export const wxPay = params => { return post('/api/WXPay', params);};//订单支付
export const queryDeliveryInfo = params => { return post('/api/client/query_delivery_info', params);};//订单物流
export const updateOrderStatus = params => { return post('/api/client/update_order_status', params);};//订单取消
export const remindOrder = params => { return post('/api/client/remind_order', params);};//提醒发货
export const orderConfirm = params => { return post('/api/client/order_confirm', params);};//确认收货
export const updateMemberAddress = params => { return post('/api/client/update_member_address', params);};//添加/修改/设置默认地址改
export const getMemberAddress = params => { return post('/api/client/get_member_address', params);};//查询地址
export const deleteMemberAddress = params => { return post('/api/client/delete_member_address', params);};//删除地址
export const getMemberAccountBal = params => { return post('/api/client/get_member_account_bal', params);};//我的账户余额
export const getMemberAccountDetail = params => { return post('/api/client/get_member_account_detail', params);};//我的收入明细
export const getBankinfo = params => { return post('/api/client/get_bankinfo', params);};//开户银行信息查询
export const getMemberBankcardinfo = params => { return post('/api/client/get_member_bankcardinfo', params);};//银行卡信息查询
export const updateMemberBankcardinfo = params => { return post('/api/client/update_member_bankcardinfo', params);};//银行卡信息更新
export const withdrawMemberAccount = params => { return post('/api/client/withdraw_member_account', params);};//提现
export const getAreaList = params => { return post('/api/client/get_area_list', params);};//获取所有的=地址信息
export const getOpenidAction = params => { return post('/api/WXPay/getOpenidAction', params);};//获取openid

export const getAccessToken = params => { return post('/api/WXPay/getAccessToken', params);};//获取access_token
export const getShop4sSddress = params => { return post('/api/client/get_shop4s_address', params);};//获取配送点信息
export const getGoodsskuList = params => { return post('/api/client/get_goodssku_list', params);};//商品sku的查询

export const updateReferInfo = (params) =>{ return post('/api/client/update_refer_info',params);};//绑定推荐人关系
export const getName = (params) =>{ return post('/api/client/get_name',params);};//个人信息查询
export const payByBal = (params) =>{ return post('/api/client/pay_by_bal',params);};//余额支付
export const transMemberAccountBal = (params) =>{ return post('/api/client/trans_member_account_bal',params);};//余额转赠

export const updateName = (params) =>{ return post('/api/client/update_name',params);};//更新用户信息

export const getJsapiTicket = (params) =>{ return post('/api/WXPay/get_jsapi_ticket',params);};//获取分享参数
