<template>
    <div>   
        <tab-bar :cur='cur'></tab-bar>
        <div class="shop-car-list">
            <div v-for='(item,index) in list' class="shop-car-item" :key='index' >
                <delete :id='item.id' @delete='deleteShop'>
                    <div class='shop-car-item-info'>
                        <div class='left' @click='changeSelect(item.id)'>
                            <img src='../../assets/img/icon_select_on@2x.png' v-if='item.select'/>
                            <img src='../../assets/img/icon_select_un@2x.png' v-else/>
                        </div>
                        <div class='center'><img :src='item.img'/></div>
                        <div class='right'>
                            <p class='title'>{{item.title}}</p>
                            <p class='price'><span>¥</span>{{item.price}}</p>
                            <div class='count'>
                                <count :count='item.count' :id='item.id' @getCount='shopCount'></count>
                            </div>
                        </div>
                    </div>
                </delete>  
            </div>
        </div>
        <div class='total-box'>
          <div class='total-left' @click='selectAll()'>
            <img src='../../assets/img/icon_select_on@2x.png' v-if='allSelect'/>
            <img src='../../assets/img/icon_select_un@2x.png' v-else/>
            <text>全选</text>
          </div>
          <div class='total-center'>
            <p>合计 <span style='color:#ff4e25;'>¥{{total}}</span></p>
            <p>不含运费</p>
          </div>
          <button class='total-right' @click='buy'>结算</button>
        </div>
    </div>
</template>

<script>
import TabBar from '../../components/TabBar.vue'
import Delete from '../../components/Delete.vue'
import Count from '../../components/Count.vue'
import {queryCart,deleteCart,updateCart} from '../../api/api.js'

export default {
    data(){return{
        cur:'shopCar',
        userInfo:null,
        list:[],
        allSelect:false,
        total:0.00
    }},
    created:function(){
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        this.userInfo=userInfo;
        this.getList();
    },
    methods:{
      buy:function(){
        var list=this.list.filter(function(val,index,arr){
          if(val.select){
            return val;
          }
        })
        console.log(list)
        if(list.length>0){
          this.$store.commit('buyShop',list);
          this.$store.commit('buyWay','cart');
          this.$router.push({name:'orderAccount'})
        }else{
          this.$layer.toast({
            icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
            content: '未选择任何商品',
            time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
          }) 
        }
      },
      selectAll:function(){
        this.allSelect=!this.allSelect;
        var selectLength=0;
        var total=0;
        this.list.forEach((item)=>{
          item.select=this.allSelect;
          if(item.select){
            selectLength+=1;
            total=((total*100+item.price*100*item.count)/100).toFixed(2);
          }
        })
        this.total=total;
      },
      changeSelect:function(id){
        console.log(id);
        var selectLength=0;
        var total=0;
        this.list.forEach((item) => {
          if(item.id==id){
            item.select=!item.select;
          }
          if(item.select){
            selectLength+=1;
            total=((total*100+item.price*100*item.count)/100).toFixed(2);
          }
        });
        this.total=total;
        this.allSelect= this.list.length==selectLength? true : false;
      },
      shopCount:function(data){
        console.log(data);
        var that=this;
        var total=0;
        var userInfo=this.userInfo;
        this.list.forEach((item)=>{
          if(item.id==data.id){
            item.count=data.count;
          }
          if(item.select){
            total=((total*100+item.price*100*item.count)/100).toFixed(2);
          }
        })
        updateCart({
          username: userInfo.phone,
          access_token: userInfo.access_token,
          sku_id:	data.id,
          buy_num: data.count,
          shop_type: 6,
        }).then(res=>{
          console.log(res)
          if(res.data.status='y'){
            that.total=total;
          }else{
            that.$layer.toast({
              icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
              content: res.data.info,
              time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
            })
          }
        })
        
      },
      deleteShop:function(id){
        var that=this;
        var userInfo=this.userInfo;
        deleteCart({
          username:userInfo.phone, 
          access_token: userInfo.access_token,
          sku_id:	id,
          shop_type: 6,
        }).then(res=>{
          if(res.data.status=='y'){
            that.getList();
          }
        })
      },
      getList:function(){
        var that=this;
        var userInfo=this.userInfo;
        queryCart({
          username: userInfo.phone,
          access_token: userInfo.access_token,
          shop_type: 6,
        }).then(res=>{
          console.log(res);
          if(res.data.status=='y'){
            var list=[];
            var listData=res.data.result.list;
            for(var key in listData){
              listData[key].sku_list.map(function(val,index,arr){
                var title=val.name.length>28?val.name.slice(0,28)+'...':val.name;
                var img=val.image;
                img= img.indexOf('http')==-1? 'https://sendheart.dreamer-inc.com' +img : img;
                list.push({
                  shop_id:val.shop_id,//商品所属店铺id
                  id:val.id,//商品id
                  goods_id:val.goods_id,   //## 商品ID （系统内部自动定义）
                  sku_no:val.sku_no,  //##商品SKU NO （系统内部自动定义）
                  value:val.value,  //## 商品SKU 属性信息
                  store_nums:val.store_nums,//库存
                  price:val.sell_price,//销售价格
                  weight:val.weight,//商品重量
                  discount:val.discount,//打折比率
                  sale:val.sale,//销售数量
                  title:title,//商品标题
                  name:val.name,
                  img:img,//商品主图
                  activity_image:val.activity_image,//活动展示图片
                  count:val.num,//加入购物车的数量
                  select: false,
                  left:0,
                  model:val.value[0].name
                })
              })
            }
            that.list=list;
          }
        })
      }
    },
    components:{
        'tab-bar':TabBar,
        'count':Count,
        'delete':Delete
    },
}
</script>

<style>
.shop-car-list{
  width: 100%;
  padding-bottom: 220px;
}
.shop-car-item{
    margin-bottom: 20px;
}
.shop-car-item-info{
  width: 100%;
  background-color: #fff;
  height: 200px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  box-sizing: border-box;
  padding:20px;
  z-index: 1;
}
.shop-car-item-info .left{
  padding-top: 62px;
  margin:0 20px 0 10px;
}
.shop-car-item-info .left img{
  width: 36px;
  height: 36px;
  display: inline-block;
}
.shop-car-item-info .center{
  margin-right: 15px;
}
.shop-car-item-info .center img{
  width: 160px;
  height: 160px;
  background-color: #f4f4f4;
}
.shop-car-item-info .right{
  width: 460px;
  position: relative;
  height: 100%;
  box-sizing: border-box;
  padding-top: 5px;
}
.shop-car-item-info .right .title{
  font-size: 28px;
 word-break: break-all; 
}
.shop-car-item-info .right .price{
  font-size: 28px;
  color: #fd454a;
  position: absolute;
  left: 0;
  bottom:10px;
}
.shop-car-item-info .right .count{
  display: inline-block;
  position: absolute;
  right: 0;
  bottom: 0;
}

.total-box{
  width: 100%;
  height: 100px;
  background-color: #fff;
  z-index: 10;
  position: fixed;
  bottom: 100px;
  left: 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.total-left{
  width: 170px;
  box-sizing: border-box;
  height: 100%;
  padding:30px 0 30px 30px;
  font-size: 28px;
}
.total-left img{
  width: 36px;
  height: 36px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 20px;
}
.total-center{
  width: 350px;
  text-align: right;
  height: 100%;
  box-sizing: border-box;
  padding:10px 20px 10px 0;
}
.total-center p:first-child{
  line-height: 50px;
  font-size: 28px;
}
.total-center p:last-child{
  line-height: 30px;
  color: #999;
  font-size: 24px;
}
.total-right{
  width: 230px;
  background-color: #fd4e25;
  color: #fff;
  font-size: 30px;
  text-align: center;
  height: 100%;
  line-height: 100px;
}
.no-car-shop img{
  width: 200px;
  height: 200px;
  margin:170px auto 40px;
  display: block;
}
.no-car-shop p{
  font-size: 28px;
  color: #999;
  text-align: center;
  margin-bottom: 50px;
}
.no-car-shop button{
  width: 270px;
  height: 68px;
  font-size: 32px;
  color: #fff;
  border-radius: 8px;
  background-color: #ff4e25;
  border:none;
  outline: none;
  line-height: 68px;
  margin:0 auto;
  padding: 0;

}
</style>
