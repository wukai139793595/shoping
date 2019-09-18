<template>
<div class='container'>
<div v-if='orderInfo'>
  <div class='user-info'>
    <img src='../../assets/img/icon_dizhi@2x.png'/>
    <div class='info-right'>
      <div class='info-top'>
        <span>收货人：{{orderInfo.name}}</span>
        <span>{{orderInfo.phone}}</span>
      </div>
      <p class='info-bottom'>收货地址：{{orderInfo.address}}</p>
    </div>
  </div>
  <!-- 商品的展示相同 -->
  <div class='order-info'>
    <div class="order-middle" >
        <!-- <template is='shop2' wx:for='{{orderInfo.children}}' data='{{...item}}'/> -->
        <shop-2 v-for='(item,index) in orderInfo.children' :shopInfo='item' :key='index'></shop-2>
    </div>
    <div class='order-bottom'>
      <div>
        <span >商品总价</span>
        <span>¥{{orderInfo.total}}</span>
      </div>
      <div>
        <span>运费</span>
        <span>¥{{orderInfo.freight}}</span>
      </div>
      <div class='total-pay'>
        <span>实付款</span>
        <span>¥{{orderInfo.pay}}</span>
      </div>
    </div>
    <div class='btn-box'>
      <div v-if='orderInfo.status==1'>
        <button  @click='cancel()'>取消订单</button>
        <button class='btn-red' @click='pay()'>去付款</button>
      </div>
      <div v-else-if='orderInfo.status==2'>
        <button class='btn-red' @click='commind()'>提醒发货</button>
      </div>
      <div v-else-if='orderInfo.status==3'>
        <button @click='wuliu(item)'>查看物流</button>
        <button class='btn-red' @click='confirm()'>确认收货</button>
      </div>
      <!-- <div v-else-if='orderInfo.status==3'>
        <button class='btn-red'>再次购买</button>
      </div> -->
    </div>
  </div>

  <div class='time-info'>
    <p>订单信息</p>
    <p>订单编号：{{orderInfo.orderId}}</p>
    <p>创建时间：{{orderInfo.orderTime01}}</p>
    <p v-if='orderInfo.status>1 && orderInfo.status<5'>付款时间：{{orderInfo.orderTime02}}</p>
    <p v-if='orderInfo.status>2 && orderInfo.status<5'>发货时间：{{orderInfo.orderTime03}}</p>
    <p v-if='orderInfo.status>3 && orderInfo.status<5'>成交时间：{{orderInfo.orderTime04}}</p>
  </div>
</div>
</div>
</template>

<script>
import Shop2 from '../../components/Shop2'
import {queryOrder,updateOrderStatus,remindOrder,orderConfirm,wxPay,queryDeliveryInfo,payByBal} from '../../api/api.js'

export default {
    data(){return{
      orderId:'',
      orderInfo: null
    }},
    created:function(){
      var that=this;
      this.orderId=this.$route.params.id;
      var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      this.userInfo=userInfo;
      this.getList();
    },
    methods:{
      cancel:function(){
          var userInfo=this.userInfo;
          var that=this;
          updateOrderStatus({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            order_no: that.orderInfo.orderId,
            status_info:'cancel'  
          }).then(res=>{
            if(res.data.status=='y'){
              that.$layer.toast({
                icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                content: '订单取消成功',
                time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
              })
              that.pages[that.currentTab]=1;
              that.allPages[that.currentTab]=1;
              that.allList['list'+that.currentTab]=[];
              that.getList();
            }
          })
        },
        confirm:function(){
          var userInfo=this.userInfo;
          var that=this;
          orderConfirm({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            id: that.orderInfo.id
          }).then(res=>{
            if(res.data.status=='y'){
              that.$layer.toast({
                icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                content: '收货成功',
                time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
              })
              that.pages[that.currentTab]=1;
              that.allPages[that.currentTab]=1;
              that.allList['list'+that.currentTab]=[];
              that.getList();
            }
          })
        },
        pay:function(){
          var userInfo=this.userInfo;
          var orderId=this.orderId;
          this.$router.push({name:'pay',params:{order_no:orderId}});     
        },
        commind:function(item){
          var userInfo=this.userInfo;
          var that=this;
          remindOrder({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            order_no: that.orderInfo.orderId
          }).then(res=>{
            if(res.data.status=='y'){
              that.$layer.toast({
                icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                content: '已通知卖家尽快发货',
                time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
              })
            }
          })
        },
        getList:function(){
          var that=this;
          var userInfo=this.userInfo;
          queryOrder({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            order_no:that.orderId
          }).then(res=>{
            if(res.data.status=='y'){
              var data=res.data.result[0];
              console.log(res)
              that.orderInfo={
                name: data.full_name,
                phone: data.tel,
                address: data.address,
                orderId: data.order_no,
                time: data.addtime,
                status: data.status,
                type:data.type,//## 订单类型 1送货单 2自提单
                total: data.order_price,
                pay:data.order_price,
                allCount: 0,
                freight:data.delivery_price_real,
                children:[],
                orderTime01:data.addtime,
                orderTime02:data.paytime,
                orderTime03:data.sendtime,
                orderTime04:data.completetime,
                payment_id:data.payment_id
              }
              data.order_sku.map(function(val,index,arr){
                var img=val.sku_image;
                img=img.indexOf('http')==-1? 'https://sendheart.dreamer-inc.com' +img :img;
                that.orderInfo.children.push({
                  img: img,
                  title: val.goods_name,
                  price: val.sku_sell_price_real,
                  count: val.sku_num
                })
                that.orderInfo.allCount=that.orderInfo.allCount+(val.sku_num*1);
              })
            }
          })
        }
    },
    components:{
        'shop-2':Shop2
    }
}
</script>

<style scoped>
.order-top{
	height: 75px;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	line-height: 75px;
	background-color: #fff;
	padding:0 20px;
}
.green{
	color:#f43333;
}
.user-info{
	background-color: #fff;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	padding:30px 20px;
	margin: 20px auto;
  width: 720px;
  box-sizing: border-box;
}
.user-info img{
	width: 36px;
	height: 36px;
}
.info-right{
	width: 630px;
}
.info-top{
	width:100%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
}
.info-bottom{
	color:#666;
}
.order-bottom{
	background-color: #fff;
	padding:20px 0;
}
.order-bottom div{
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	color:#666;
	padding:0 20px;
  font-size: 26px;
}
.order-bottom div.total-pay{
	color:red;
	font-size: 30px;
}
.order-info{
	margin-bottom:20px;
  width: 720px;
  box-sizing: border-box;
  background-color: #fff;
  margin:0 auto;
}
.time-info{
	background-color: #fff;
	padding:20px;
	color:#666;
  width: 720px;
  box-sizing: border-box;
  font-size: 28px;
  margin:20px auto 0px;
}
.time-info p:first-child{
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 10px;
}
.btn-box{
  text-align: right;
  width: 100%;
  box-sizing: border-box;
  padding:20px;
}
.btn-box button{
  width: 146px;
  height: 54px;
  border-radius: 8px;
  border:2px solid #999;
  text-align: center;
  line-height: 54px;
  font-size: 26px;
  color: #999;
  display: inline-block;
  margin-left: 20px;
  background-color: #fff;
  padding:0;
}
.btn-box button.btn-red{
  color: #ff4e25;
  border-color: #ff4e25;
}

</style>


