<template>
<div class='container'>
   <div class="tab-h">
    <p v-for='(item,index) in orderNav' :key='index' :class="currentTab==index?'active':''" @click="changeTab(index)">{{item}}</p>
  </div>
<scroll class="wrapper-search"
  :data='allList["list"+currentTab]'
	:pullup="pullup"
	@scrollToEnd="getList">
  <div class='tab-content'>
    <div v-if='allList["list"+currentTab]==null' class='shop-box'>
      <img class='loading-img' src='../../assets/img/loading.gif'/>
      <p class='tips-text'>数据加载中</p>
    </div>
    <div v-else-if='allList["list"+currentTab].length>0'>
      <div class='shop-list'>
        <div  v-for='(item,index) in allList["list"+currentTab]' :key='index' class='order-item'>
          <div class='order-top'>
            <span>{{item.time}}</span>
            <span v-if='item.status==1' class='red'>待付款</span>
            <span v-else-if='item.status==2' class='red'>待发货</span>
            <span v-else-if='item.status==3' class='red'>到收货</span>
            <span v-else-if='item.status==4' style='color:#999;'>已完成</span>
            <span v-else-if='item.status==8' style='color:#999;'>已取消</span>
          </div>
          <router-link class='shop-item-box' :to="{ name: 'orderDetail', params: { id:item.orderId}}">
            <shop-2 v-for='(item1,index1) in item.children' :key='index1' :shopInfo='item1'></shop-2>
          </router-link>
          <div class='order-bottom'>
            <p class='order-total'>共{{item.allCount}}件，应付金额： <span class='red'>¥{{item.total}}</span></p>
            <div v-if='item.status==1'>
              <button @click='cancel(item)'>取消订单</button>
              <button class='btn-red' @click='pay(item)'>去付款</button>
            </div>
            <div v-else-if='item.status==2'>
              <button class='btn-red' @click='commind(item)'>提醒发货</button>
            </div>
            <div v-else-if='item.status==3'>
              <button @click='wuliu(item.orderId)'>查看物流</button>
              <button class='btn-red' @click='confirm(item)'>确认收货</button>
            </div>
            <!-- <div v-else-if='item.status==3'>
              <button class='btn-red'>再次购买</button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <img class='no-shop-img' src='../../assets/img/no-order.png'/>
      <p class='tips-text'>暂无订单</p>
    </div>
  </div>
</scroll>
</div>
</template>

<script>
import Shop2 from '../../components/Shop2'
import {queryOrderList,updateOrderStatus,remindOrder,orderConfirm,wxPay,queryDeliveryInfo} from '../../api/api.js'
import BScroll from 'better-scroll'
import scroll from '../../components/scroll.vue'
import {unixTimestamp} from '../../utils.js'

export default {
    data(){return{
        orderNav: ['全部', '待付款', '待发货', '待收货', '已完成'],
        currentTab: 0,
        pullup:true,
        pages:[1,1,1,1,1],
        pageSizes:[10,10,10,10,10],
        allPages:[1,1,1,1,1],
        allList:{
          list0:[],
          list1: [],
          list2: [],
          list3: [],
          list4: [],
        }
    }},
    created:function(){
      this.currentTab=this.$route.params.id || 0;
      var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      this.userInfo=userInfo;
      this.getList();
    },
    methods:{
        changeTab:function(val){
            this.currentTab=val;
            this.getList();
        },
        cancel:function(item){
          var userInfo=this.userInfo;
          var that=this;
          updateOrderStatus({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            order_no: item.orderId,
            status_info:'cancel'  
          }).then(res=>{
            if(res.data.status=='y'){
              that.$layer.toast({
                icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                content: '订单取消成功',
                time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
              })
              that.pages=[1,1,1,1,1];
              that.pageSizes=[10,10,10,10,10];
              that.allPages=[1,1,1,1,1];
              that.allList={
                list0:[],
                list1: [],
                list2: [],
                list3: [],
                list4: [],
              }
              that.getList();
            }
          })
        },
        confirm:function(item){
          var userInfo=this.userInfo;
          var that=this;
          orderConfirm({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            id: item.id
          }).then(res=>{
            if(res.data.status=='y'){
              that.$layer.toast({
                icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                content: '收货成功',
                time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
              })
              that.pages=[1,1,1,1,1];
              that.pageSizes=[10,10,10,10,10];
              that.allPages=[1,1,1,1,1];
              that.allList={
                list0:[],
                list1: [],
                list2: [],
                list3: [],
                list4: [],
              }
              that.getList();
            }
          })
        },
        pay:function(item){
          var userInfo=this.userInfo;
          this.$router.push({name:'pay',params:{order_no:item.orderId}});
        },
        commind:function(item){
          var userInfo=this.userInfo;
          var that=this;
          remindOrder({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            order_no: item.orderId
          }).then(res=>{
            console.log(res)
            if(res.data.status=='y'){
              that.$layer.toast({
                icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                content: '已通知卖家尽快发货',
                time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
              })
            }
          }).catch(err=>{
            console.log(err)
          })
        },
        getList:function(){
          console.log('我被调用了')
          var id=this.currentTab;
          var userInfo=this.userInfo;
          var that=this;
          if(this.pages[id]>this.allPages[id]) return;
          var params={
            username: userInfo.phone,
            access_token: userInfo.access_token,
            type:1,
            shop_type: 6,
            page:that.pages[id],
            pagesize:that.pageSizes[id]
          }
          if(id>0){
            params.status=id;
          }
          console.log(params)
          queryOrderList(params).then(res=>{
            console.log(res)
            if(res.data.status=='y'){
              var list=[];
              res.data.result.map(function(val1,index1,arr1){
                  list.push({
                    id:val1.id,
                    orderId:val1.order_no,
                    time:val1.addtime,
                    status:val1.status,
                    total:val1.order_price,
                    children:[],
                    allCount:0
                  })
                  console.log(list)
                  val1.order_sku.map(function(val2,index2,arr2){
                    var img=val2.sku_image;
                    img=img.indexOf('http')==-1? 'https://sendheart.dreamer-inc.com' +img :img;
                    console.log(img)
                    list[index1].children.push({
                      img: img,
                      title: val2.goods_name,
                      price: val2.sku_sell_price_real,
                      count: val2.sku_num
                    })
                    list[index1].allCount=list[index1].allCount+(val2.sku_num*1)
                  })
                  console.log(list)
              })
              that.allPages[id]=Math.ceil(res.data.all_rows/that.pageSizes[id]);
              that.pages[id]=that.pages[id]*1+1;
              that.allList["list"+id]=that.allList["list"+id].concat(list);
              console.log(that.allList)
            }else{
              console.log(res.data.info)
            }
          })
        },
        wuliu:function(order_no){
          this.$router.push({name:'wuliu',params:{order_no:order_no}})
        }
    },
    components:{
        'shop-2':Shop2,
        'scroll':scroll
    }
}
</script>

<style scoped>
.tab-h{
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	width:100%;
	height: 80px;
	background-color: #fff;
	line-height: 80px;
	border-bottom: 1px solid #efefef;
	position:  fixed;
	top:0;
	left:0;
  z-index:10;
}
.tab-h p{
    width:20%;
    text-align: center;
}
.tab-h p.active{
	color: #f43333;
  	position: relative;
  	border-bottom: 4px solid #f43333;
}
.tab-content{
	width: 100%;
	margin-top: 20px;
}
.loading-img{
  width: 100px;
  height: 100px;
  margin:200px auto 20px;
  display: block;
}
.tips-text{
  font-size: 28px;
  color: #999;
  text-align: center;
}
.no-shop-img{
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin:200px auto 20px;
  background-color: #999;
  display: block
}
.order-item{
  width: 720px;
  background-color: #fff;
  border-radius: 8px;
  margin:20px auto 0;
}
.order-top{
  width: 700;
  box-sizing: border-box;
  margin:0 auto;
  padding:0 20px;
  border-bottom: 2px solid #f4f4f4;
  height: 64px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  font-size: 26px;
  line-height: 64px;
}
.order-top text:first-child{
  color: #999;
}
.red{
  color: #ee4e25;
}
.shop-item-box{
  background-color: #fff;
}
.order-bottom{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  font-size: 26px;
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  padding:20px;
}
.order-bottom button{
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
.order-bottom button.btn-red{
  color: #ff4e25;
  border-color: #ff4e25;
}
.order-bottom .order-total{
  height: 100%;
  line-height: 54px;
}
.wrapper-search{
  position:fixed;
  top:80px;
  width:100%;
  bottom:0;
  left:0;
  overflow: hidden;
}
</style>


