<template>
    <div>
        <banner :swiper="imgList"></banner>
        <div class='shop-header'>
            <div class='top'>
                <p class='title'>{{title}}</p>
                <p  class='price'><span>￥</span>{{price}}</p>
                <!-- <button class='share' >
                    <img src="../../assets/img/icon_share@2x.png" alt="">
                    <p>分享</p>
                </button> -->
            </div>
        </div>
        <div class='shop-content'>
            <p class="shop-content-title">商品详情</p>
            <div v-html="shopDetailImg" class="shop-detail-img"></div>
        </div>
        <div class='btn-box-bottom'>
            <button @click='showMask(1)'>加入购物车</button>
            <!-- <button @click='showMask(2)'>立即购买</button> -->
        </div>
        <div class="mask" v-if='isshowMask'>
          <div class="mask-box">
            <div class="mask-header">
              <img :src="img" alt="">
              <div class="right">
                <p>{{title}}</p>
                <span>¥{{price}}</span>
              </div>
            </div>
            <span class="closed" @click="close()">×</span>
            <div class="wrapper" ref="wrapper"> 
              <div>
                <div class="model-box" >
                  <p class="model-title">此商品包包含以下商品</p>
                  <div v-if='items.type==1' class="model-item-box">
                    <p v-for='(item,index) in sku_list' :key='index'>{{item.gov_price}}</p>
                  </div>
                </div>
              </div>
            </div>
            <button class="confirm" @click='confirm()'>确定</button>
          </div>
        </div>
    </div>
</template>
<script>
import Banner from '../../components/Banner.vue'
import BScroll from 'better-scroll'
import Count from '../../components/Count'
import {getGoodsdescList,addCart,getGoodsskuList} from '../../api/api.js'
import {checkPhone} from '../../utils.js'

export default {
    data(){return{
        userInfo:null,
        detail:null,
        imgList:[],
        id:'',
        img:'',
        title:'',
        price:'',
        shopDetailImg:'',
        sku_list:[],
        spec_select_list:[],
        sku_id:'',
        count:1,
        buy_type:1, //1-加入购物车，2-立即购买
        isshowMask:false,
        modelList:[]
    }},
    created:function(){
      var that=this;
      var detail=this.$store.state.shopDetail;
      this.detail=detail;
      var shopId=detail.shopId;
      this.title=detail.name;
      this.price=detail.price;
      this.img=detail.img;
      var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      this.userInfo=userInfo;
      var params={
        username: userInfo.phone,
        access_token: userInfo.access_token,
        goods_id:	shopId,
        shop_type: 6
      }
      console.log(params)
      getGoodsdescList(params).then(res=>{
        console.log(res);
        if(res.data.status=='y'){
          var data=res.data.result;
          console.log(data.image)
          that.imgList=data.image;
          that.id=data.desc.goods_id;
          that.shopDetailImg=data.desc.desc;
        }
      })
      getGoodsskuList(params).then(res=>{
        console.log(res);
        if(res.data.status=='y'){
          that.sku_list=res.data.result.sku_list;
          that.spec_select_list=res.data.result.spec_select_list;
          console.log(that.spec_select_list);
        }
      })
    },
    methods:{
        addShopCar:function(id){
            var that=this;
            var userInfo=this.userInfo;
            addCart({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                sku_id:	id,
                shop_type: 6
            }).then(res=>{
                console.log(res);
                if(res.data.status=='y'){
                   that.$layer.toast({
                        icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                        content: '成功加入购物车',
                        time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                    }) 
                    that.isshowMask=false;
                }else{
                  console.log(res.data.info)
                   that.$layer.toast({
                        icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                        content: res.data.info,
                        time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                    })  
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        buy:function(id){
          var detail=this.detail;
          detail.count=this.count;
          detail.id=id;
          detail.select=false;
          detail.left=0;
          this.$store.commit('buyShop',[detail]);
          this.$store.commit('buyWay','sku');
          this.$router.push({name:'orderAccount'});
        },
        showMask:function(val){
          var that=this;
          var member_group=this.userInfo.member_group;
          var cash_cat_id =this.detail.cash_cat_id;
          var userInfo=this.userInfo;
          if(!checkPhone(userInfo.phone) && (cash_cat_id==8 || cash_cat_id==9)){
            this.$layer.dialog({
              title: ['提示', 'color:red;'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
              content: '购买此区域的商品，需要您先去注册',
              contentClass: 'className',
              btn: ['返回','注册'],
            }).then(function (res){
              let position = res === 0 ? 'left' : 'right'
              console.log(position);
              if(position=='right'){
                that.$router.push({name:'login'});
              }
            })
            return;
          }else if(member_group<5 && cash_cat_id==10){
            this.$layer.dialog({
              title: ['提示', 'color:red;'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
              content: '购买此区域的商品，需要您先购买体验区或者精英区的产品成为会员',
              contentClass: 'className',
              btn: ['返回','注册'],
            }).then(function (res){
              let position = res === 0 ? 'left' : 'right'
              console.log(position);
              if(position=='right'){
                that.$router.push({name:'login'});
              }
            })
            return;
          }
          this.buy_type= val;
          this.isshowMask=true;
          console.log(this.isshowMask)
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.wrapper, {click: true,tap:true})
          })
        },
        close:function(){
          this.isshowMask=false;
        },
        confirm:function(){
          var sku_id='';
          this.sku_list.map(function(val,index,arr){
                sku_id= sku_id=='' ? val.id : sku_id+','+val.id;
          });
          console.log(sku_id)
          if(this.buy_type==1){
            this.addShopCar(sku_id);
          }else if(this.buy_type==2){
            //this.buy(sku_id);
          }
        },
    },
    components:{
        'banner':Banner,
        'count':Count
    }
}
</script>

<style>
.shop-header{
  width: 100%;
  background-color: #fff;  
}
.shop-header .top{
  position: relative;
  padding: 0 25px;
  padding-bottom: 20px;
}
.shop-header .top .title{
  font-size: 32px; /*px*/
  color: #333;
  width: 558px;
  padding:15px 0;
}
.shop-header .top .price{
  font-size: 48px; /*px*/
  color: #e41616;
}
.shop-header .top .price span{
  font-size: 32px;
}
.shop-header .top .oprice{
  font-size: 24px; /*px*/
  color: #bababa;
  text-decoration:line-through;
  margin-bottom: 10px;
}
.shop-header .top .share{
  position: absolute;
  top:10px;
  right: 25px;
  background-color:transparent;
  border:none;
  outline: none; 
  font-size: 24px; /*px*/
  padding:0;
}
.shop-header .top .share::after{
  border:none;
}
.shop-header .top .share img{
  width: 50px;
  height: 50px;
}
.shop-header .top .share p{
  position: relative;
  color: #999;
}

.shop-content{
  width: 750px;
  margin-top:20px;
  padding-bottom: 90px;
  overflow: hidden;
}
.shop-content img{
    width: 100%;
    display: block;
}
.shop-detail-img{
  width: 100%;
  overflow: hidden;
}
.shop-content-title{
  width: 100%;
  font-size: 28px; /*px*/
  color: #666;
  line-height: 80px;
  text-align: center;
  background-color: #fff;
}

.btn-box-bottom{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750px;
  height: 88px;
  background-color:transparent;
  color:#fff;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  text-align: center;
  line-height: 88px;
  font-size: 28px; /*px*/
  z-index: 10;
} 
.btn-box-bottom button{
  width: 100%;
  height: 100%;
  line-height: 88px;
  text-align: center;
  border-radius: 0;
  border:none;
  outline: none;
  background-color: #ff632a;
  color: #fff;
  font-size: 28px; /*px*/
}
.btn-box-bottom button::after{
  border:none;
  outline: none;
}

.mask{
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  top: 0;
  left: 0;
  z-index: 12;
}
.mask-box{
  position: absolute;
  width: 100%;
  height: 800px;
  background-color: #fff;
  bottom: 0;
  left: 0;
}
.mask-header{
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  position: absolute;
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  padding:0 30px;
}
.mask-header img{
  width: 150px;
  height: 150px;
  background-color: #f4f4f4;
  vertical-align: middle;
  position: relative;
  top: -20px;
  box-shadow: 3px 3px 3px rgba(0,0,0,0.1);
  border-radius: 8px;
}
.mask-header span{
  font-size: 30px;
  color: #e41616;
}
.mask-header .right{
  width: 480px;
  margin-left: 40px;
  padding-top: 20px;
  font-size: 28px;/*px*/
}
.wrapper{
  position:absolute;
  top: 150px;
  left: 0;
  bottom: 100px;
  overflow: hidden;
}
.confirm{
  position:absolute;
  left: 0;
  bottom: 0;
  width:100%;
  height: 80px;
  background-color: tomato;
  color: #fff;
  font-size: 30px;/*px*/
  text-align: center;
  line-height: 80px;
}
.model-box{
  width: 750px;
  padding:20px 30px;
  box-sizing: border-box;
  border-top: 2px solid #f4f4f4;
  border-bottom: 2px solid #f4f4f4;
}
.model-item-box{
  display:flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding:20px 0;
  width: 100%;
}
.model-item {
  padding:5px;
  border:2px solid #f4f4f4;
  margin-right: 10px;
  margin-bottom: 10px;
}
.model-item-box .active{
  color: #ff632a;
  padding:5px;
  border:2px solid #f4f4f4;
  margin-right: 10px;
  margin-bottom: 10px;
}
.num-box{
  width: 750px;
  padding:20px 30px;
  box-sizing: border-box;
  display:flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  border-bottom:2px solid #f4f4f4;
}
.num-box .title{
  height: 50px;
  line-height: 50px;
  display: inline-block;
}
.mask-box .closed{
  font-size: 50px;/*px*/
  position: absolute;
  top: -25px;
  right: 0px;
  color: #999;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.3);
  color: #fff;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.model-item-img{
  width: 30px;
  height: 30px;
}
</style>

