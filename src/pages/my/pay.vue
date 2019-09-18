<template>
<div>
<div class='user-info'>
	<img class="icon-ding" src='../../assets/img/icon_dizhi@2x.png'/>
  <div  class="select-user">
    <div  class='info-right'>
      <div class='info-top'>
        <span>收货人：{{address.full_name}}</span>
        <span>{{address.tel}}</span>
      </div>
      <div class='info-bottom'>
          <p>收货地址：{{address.address}}</p> 
          <img class="icon-more" src="../../assets/img/icon_more@2x.png" alt="">
      </div>
    </div>
  </div>
</div>
<!--商品信息  -->
<div  class='order-list'>
  <div class='shop2-item' v-for='(item,index) in shopInfo' :key='index'>
    <div class='shop2-left'><img :src='item.img'/></div>
    <div class='shop2-right'>
      <p class='shop2-title'>{{item.title}}</p>
      <!-- <p class='shop2-model'>规格：{{item.model}}</p> -->
      <p class='shop2-price'>¥{{item.price}}</p>
      <div class='count'>
        <!-- <count :count='item.count' :id='item.id' @getCount='shopCount'></count> -->
        <span>X{{item.count}}</span>
      </div>
    </div>
  </div>
  <div class="select-fahuo">
    <span v-if='selectP && pick_up==1' >配送点：{{selectP.name}}</span>
    <button :class='pick_up==1?"active":""' >自提</button>
    <button :class="pick_up==2?'active':''" >快递</button>
  </div>
  <div class='buy-message'>
    <textarea placeholder='选填：买家留言（50字以内）' ></textarea>
  </div>
</div>

<!--商品总价，合计  -->
<div class='total'>
  <div class='total-price'>
    <span>商品总价(不含运费)</span>
    <span class='right'>¥{{totalPrice}}</span>
  </div>
  <!-- <div class='total-freight'>
    <span>运费</span>
    <span class='right'>¥{{freight}}</span>
  </div> -->
</div>
<div class="select-pay-way">
  <p class="title">支付方式</p>
  <p class="pay-row">
    <img src='../../assets/img/icon_select_on@2x.png' v-if='payment_id==2'/>
    <img src='../../assets/img/icon_select_un@2x.png' v-else/>
    <span>余额支付</span>
  </p>
  <p class="pay-row" >
    <img src='../../assets/img/icon_select_on@2x.png' v-if='payment_id==3'/>
    <img src='../../assets/img/icon_select_un@2x.png' v-else/>
    <span>微信支付</span>
  </p>
</div>
<!--点击付款  -->
<div class='account'>
   <span class='right'>总价：¥{{totalPrice}}(不含运费)</span>
  <button @click='pay()'>确认购买</button>
</div>
</div>
</template>

<script>
import {queryOrder,payByBal,wxPay} from '../../api/api.js';
export default {
    data(){return{
        address:null,
        shopInfo: [],
        totalPrice:0,
        total:0,
        freight:0.00,
        message:'',
        payment_id:2,
        pick_up:2,//1-自提单 2-快递单
        userInfo:null,
        order_no:'',
        confi:null
    }},
    created:function(){
        var that=this;
        var order_no=this.$route.params.order_no;
        this.order_no=order_no;
        console.log(order_no);
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        this.userInfo=userInfo;
        queryOrder({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            order_no:order_no
        }).then(res=>{
            if(res.data.status=='y'){
                var data=res.data.result[0];
                that.address={
                    full_name:data.full_name,
                    tel:data.tel,
                    address:data.address
                }
                that.totalPrice=(data.order_price/100).toFixed(2);
                that.freight=(data.delivery_price_real/100).toFixed(2);
                that.message=data.m_desc;
                that.payment_id=data.payment_id;
                that.pick_up=data.type;
                data.order_sku.map(function(val,index,arr){
                    var img=val.sku_image;
                    img= img.indexOf('http')==-1? 'https://sendheart.dreamer-inc.com' +img : img;
                    that.shopInfo.push({
                        img: img,
                        title: val.goods_name,
                        price: val.sku_sell_price_real,
                        count: val.sku_num
                    })
                    //that.orderInfo.allCount=that.orderInfo.allCount+(val.sku_num*1);
                })
            }
        })
    },
    methods:{
        pay:function(){
            var that=this;
            var userInfo=this.userInfo;
            var order_no=this.order_no;
            var totalFee=this.totalPrice;
            if(this.payment_id==2){
            //余额支付
            payByBal({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                shop_type: 6,
                order_no: order_no,
                totalFee: totalFee,
              }).then(res=>{
                console.log(res);
                if(res.data.status=='y'){
                  that.$layer.toast({
                    icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                    content: '使用余额支付成功',
                    time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                  })
                  that.$router.go(-1);
                }else{
                  that.$layer.toast({
                    icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                    content: res.data.info,
                    time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                  })
                }
              })
          }else{
            //微信支付
            wxPay({
              openid: userInfo.openid,
              shop_type: 6,
              body: '商城',
              order_no: order_no,
              totalFee: totalFee,
            }).then(res=>{
              if(res.data.status=='y' || res.status==200){
                  that.confi={
                    appId:res.data.appId,
                    nonceStr:res.data.nonceStr,
                    package:res.data.package,
                    signType:res.data.signType,
                    timeStamp:res.data.timeStamp,
                    paySign:res.data.paySign,
                  }
                  console.log(that.confi)
                  that.callpay();
                }else{
                  that.$layer.toast({
                    icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                    content: res.data.info,
                    time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                  })
                }
              
            })
          }
        },
        onBridgeReady: function () {
        var that=this;
        var confi=this.confi;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
          'appId': confi.appId,
          'timeStamp': confi.timeStamp,
          'nonceStr': confi.nonceStr,
          'package': confi.package,
          'signType':confi.signType,
          'paySign': confi.paySign
          },
          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              that.$layer.toast({
                icon: 'icon-check',
                content: '订单支付成功，等待卖家发货',
                time: 2000  
              })
              that.$router.go(-1);
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              that.$layer.toast({
                icon: 'icon-check', 
                content: '取消支付',
                time: 2000 
              })
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              that.$layer.toast({
                icon: 'icon-check', 
                content: '网络异常，请重试',
                time: 2000 
              })
            }
          }
        )
      },
      callpay: function () {
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady())
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady())
          }
        } else {
          this.onBridgeReady()
        }
      }
    }
}
</script>

<style>
.user-info{
	background-color: #fff;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	padding:30px 20px;
	margin-bottom: 20px;
  font-size: 30px;/*px*/
}
.user-info .icon-ding{
  width: 36px;
  height: 36px;
}
.user-info .icon-more{
  width: 30px;
  height: 30px;
}
.user-info .select-user{
  display: block;
  width: 652px;
}
.info-right{
	width: 100%;
}
.info-top{
	width:100%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
}
.info-bottom{
	color:#666;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.info-bottom p{
  width: 600px;
  display: inline-block;
  vertical-align: middle;
}
.no-address{
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.order-list{
  background-color:#fff;
  margin-bottom:20px;
}

.shop2-item{
  width: 700px;
  margin:20px auto;
  height: 200px;
  background-color: #fff;
  box-sizing: border-box;
  padding:20px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  position: relative;
}
.shop2-item .shop2-left{
  width: 180px; 
  height: 160px;
}
.shop2-item .shop2-left img{
  width: 160px;
  height: 160px;
  background-color: #f4f4f4;
}
.shop2-item .shop2-right{
  width: 470px;
  position: relative;
  height: 100%;
}
.shop2-item .shop2-title{
  font-size: 30px;/*px*/
  padding-top: 5px;
}
.shop2-item .shop2-model{
  font-size: 24px;/*px*/
  color: #999;
}
.shop2-item .shop2-price{
  font-size: 30px;/*px*/
  position: absolute;
  bottom: 0;
  left: 0;
}
.shop2-item .shop2-count{
  font-size: 30px;/*px*/
  color: #999;
  position: absolute;
  bottom: 0;
  right: 0;
}

.shop2-item {
  padding-right: 0;
}
.shop2-item .shop2-right{
  width: 490px;
}
.shop2-item .count{
  position: absolute;
  bottom: 0px;
  right: 0px;
}
.buy-message{
  color:#666;
  padding:25px;
}
.buy-message textarea{
  width:100%;
  height: 50px;
  font-size: 28px;
}
.total{
  background-color: #fff;
  width:100%;
  padding:25px;
  box-sizing: border-box;
  font-size: 30px;/*px*/
}
.total-price,.total-freight{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.total-price .right{
  color:red;
}
.total-freight .right{
  color:#666;
}
.account{
  width:100%;
  height: 90px;
  position: fixed;
  left: 0;
  bottom:0;
  background-color: #fff;
  display: flex;
  flex-wrap:nowrap;
  justify-content: flex-end; 
}
.account button{
  margin:0;
  background-color: #ff2132;
  color: #fff;
  height: 100%;
  width: 270px;
  border-radius: 0;
  border:none;
}
.account span{
  height: 100%;
  line-height: 90px;
  padding-right: 20px;
  color: red;
  font-size: 30px;/*px*/
}
.account .left{
  height: 100%;
  padding-right: 20px;
  color: red;
  line-height: 90px;
}
.select-fahuo{
  width: 100%;
  box-sizing: border-box;
  padding:10px 30px;
  text-align: right;
  border-top: 2px solid #f4f4f4;
  border-bottom: 2px solid #f4f4f4;
}
.select-fahuo span{
  display: inline-block;
  width: 400px;
  text-align: left;
}
.select-fahuo button{
  width: 100px;
  height: 50px;
  margin:0;
  padding: 0;
  margin-left: 30px;
  font-size: 28px;
  text-align: center;
  line-height: 46px;
  border:2px solid #f4f4f4;
  border-radius: 8px;
}
.select-fahuo button.active{
  color: #fff;
  background-color: #25cca1;
}
.select-pay-way{
  width: 100%;
  background-color: #fff;
  margin-top: 20px;
  box-sizing: border-box;
}
.select-pay-way .title{
  height: 80px;
  line-height: 80px;
  font-size: 30px; /*px*/
  box-sizing: border-box;
  padding:0 30px;
  border-bottom: 2px solid #f4f4f4;
}
.pay-row{
  height: 100px;
  line-height: 100px;
  box-sizing: border-box;
  padding:0 30px;
  font-size: 26px;/*px*/
}
.pay-row img{
  width: 36px;
  height: 36px;
  vertical-align:middle;
  margin-right: 50px;
}
.mask{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 12;
  background-color: rgba(0,0,0,0.3);
  top: 0;
  left: 0;
}
.mask-box{
  background-color: #fff;
  height: 1000px;
  position:absolute;
  width: 100%;
  bottom:0;
  left: 0;
  box-sizing: border-box;
  padding:0 30px;
}
.mask-box .title{
  height: 80px;
  line-height: 80px;
  font-size: 30px;/*px*/
  border-bottom: 2px solid #f4f4f4;
}
.mask-box .search-box{
  height: 80px;
  padding-top: 10px;
}
.mask-box .search-box input{
  width: 560px;
  height: 60px;
  border:2px solid #f4f4f4;
  box-sizing: border-box;
  padding:0 20px;
  border-radius: 8px;
  
}
.mask-box .search-box button{
  height: 60px;
  width: 100px;
  background-color: #25cca1;
  color: #fff;
  line-height: 60px;
  border-radius: 8px;
  margin-left: 20px;
}
.mask-box .wrapper-search{
  position: absolute;
  width: 100%;
  left: 0;
  top: 160px;
  bottom: 20px;
  box-sizing: border-box;
  padding:0 30px;
}
.mask-box .wrapper-search p{
  height: 60px;
  line-height: 60px;
}
.mask-box .close{
  font-size: 50px;/*px*/
  position: absolute;
  top: 10px;
  right: 30px;
  color: #999;
  background-color: transparent;
}
.address-list .active{
  color: #ff2132;
}
.mask-1{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 12;
  background-color: rgba(0,0,0,0.3);
  top: 0;
  left: 0;
}
.mask-1-box{
  width: 500px;
  height: 300px;
  background-color: #fff;
  position:absolute;
  top: 500px;
  left: 125px;
  border-radius: 10px;
  box-sizing: border-box;
  padding:50px;
}
.mask-1-box input{
  width: 100%;
  height: 60px;
  border:2px solid #f4f4f4;
  border-radius: 10px;
  box-sizing: border-box;
  padding:0 20px;
  margin-bottom: 50px;
}
.mask-1-box button{
  width: 100px;
  height: 50px;
  border:2px solid #f4f4f4;
  text-align: center;
  line-height: 50px;
  font-size: 26px;/*px*/
  border-radius: 8px;
  margin:0 50px;
}
.mask-1-box button.cancel-btn{
  background-color: #f4f4f4;
}
.mask-1-box button.confirm-btn{
  background-color: #25cca1;
  color: #fff;
}
</style>


