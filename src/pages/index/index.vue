<template>
<div class="index-page">   
    <scroll class="wrapper-search"
	:data="shopList"
	:pullup="pullup"
	@scrollToEnd="getShopList">
    <div>
        <banner :swiper="bannerList"></banner>
        <div class='shop-type-list'>
            <router-link class='shop-type-item' :to='item.url' v-for='(item, index) in shopTypeList' :key='index'>
                <img :src='item.img'/>
                <p>{{item.title}}</p>
            </router-link>
        </div>
        <div class='guangao-pic'>
            <img :src='guangaoPic'/>
        </div>
        <div class='hot-box'>
            <div class='title'>热销榜单</div>
            <div class='hot-list'>
                <div class='hot-item' @click="detail(item)" v-for='(item, index) in hotList' :key='index'><img :src='item.img'/></div>
            </div>
        </div>
        <div class='shop-box'>
            <div class='title'>精品推荐</div>
            <div class='shop-list'>
            <div @click="detail(item)" class='shop-item-box' v-for='(item, index) in shopList' :key='index'>
                <shop-1 :shopInfo="item" ></shop-1>
            </div>
            </div>
            <div class="loading-wrapper" v-if="status == 1">数据加载中</div>
			<div class="loading-wrapper" v-if="status == 2">上拉加载更多</div>
			<div class="loading-wrapper" v-if="status == 3">没有更多数据了</div>
        </div>
    </div>
    </scroll>
    <tab-bar :cur='cur'></tab-bar>
</div>

</template>
<script>
import TabBar from '../../components/TabBar.vue'
import Banner from '../../components/Banner.vue'
import Shop1 from '../../components/Shop1.vue'
import BScroll from 'better-scroll'
import scroll from '../../components/scroll.vue'
import {getIndexGoods,addCart} from '../../api/api.js'

export default {
    data(){return{
        cur:'index',
        userInfo:null,
        shop_page:1,
        shop_pagesize:10,
        shop_allPages:1,
        pullup: true,
        status:1,
        bannerList:[],
        shopTypeList:[
            {
                img:require('../../assets/img/shopType1@2x.png'),
                title:'体验区',
                url:'/shopList/0'
            },
            {
                img: require('../../assets/img/shopType2@2x.png'),
                title: '精英区',
                url: '/shopList/1'
            },
            {
                img: require('../../assets/img/shopType4@2x.png'),
                title: '会员区',
                url: '/shopList/2'
            },
            {
                img: require('../../assets/img/shopType3@2x.png'),
                title: '特价区',
                url: '/shopList/3'
            },
            
        ],
        guangaoPic:require('../../assets/img/guangao@2x.jpg'),
        hotList:[],
        shopList:[]
    }},
    created:function(){
        var that=this;
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        this.userInfo=userInfo;
        getIndexGoods({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6, 
            banner_num:5,
            hot_page:1,
            hot_pagesize:2,
        }).then(res=>{
            console.log(res)
            if(res.data.status=='y'){
                var bannerList=[],hotList=[];
                var data=res.data.result;
                data.imgUrls.map(function(val,index,arr){
                    var reg=/\.(jpg|png|jpge)$/i;
                    if(reg.test(val.desc)){
                        bannerList.push({url: val.desc})
                    }
                })
                data.hotList.slice(0,2).map(function(val,index,arr){
                    hotList.push({
                        shopId:val.id,
                        img:val.image,
                        name:val.name,
                        title:val.name,
                        price: val.sell_price,
                        cash_cat_id:val.cash_cat_id,//一级分类，体验区，精英区，会员区，特价区
                        cash_sec_cat_id:val.cash_sec_cat_id,//二级分类，是否是礼包>0属于礼包分类
                    })
                })
                that.bannerList=bannerList;
                that.hotList=hotList;
            }else{
                that.$layer.toast({
                    icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                    content: res.data.info,
                    time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                })
            }
        }).catch(err=>{
            console.log(err)
        })
        this.getShopList();
    },
    methods:{
        getShopList:function(){
            console.log('我被调用了')
            var that=this;
            this.status = 1;
            var page=this.shop_page,
                pageSize=this.shop_pagesize;
            var userInfo=this.userInfo;
            getIndexGoods({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                shop_type: 6, 
                shop_page:page,
                shop_pagesize:pageSize
            }).then(res=>{
                console.log(res)
                if(res.data.status=='y'){
                    var list=res.data.result.shopList;
                    var rlist=[];
                    list.map(function(val,index,arr){
                        var name=val.name.length>25? val.name.slice(0,20)+'...':val.name;
                        rlist.push({
                            shopId: val.id,//商品id,不是商品sku的id,生成订单是需要商品sku 的id，在商品详情页获取商品sku 的id
                            img: val.image,
                            title: name,
                            name:val.name,
                            price: val.sell_price,
                            cash_cat_id:val.cash_cat_id,
                            cash_sec_cat_id:val.cash_sec_cat_id,//二级分类，是否是礼包>0属于礼包分类
                        })
                    })
                    that.shopList=that.shopList.concat(rlist);
                    that.status =2;
                    that.shop_page=that.shop_page*1+1;
                }else{
                    console.log(res.data.info)
                    that.status =3;
                    // that.$layer.toast({
                    //     icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                    //     content: res.data.info,
                    //     time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                    // })
                }
            }).catch(err=>{
                console.log(err)
            })
        },

        detail:function(data){
            console.log(data);
            this.$store.commit('shopDetail',data);
            if(data.cash_sec_cat_id && data.cash_sec_cat_id>0){
                this.$router.push({name:'shopDetail'})
            }else{
                this.$router.push({name:'shopDetail'})
            }
            
        },
    },
    components:{
        'tab-bar':TabBar,
        'banner':Banner,
        'shop-1':Shop1,
        'scroll':scroll
    },
}
</script>

<style lang="less" scoped>
.index-page{
    padding-bottom:120px; 
}
.shop-type-list{
  width: 100%;
  height: 190px;
  background-color: #fff;
  box-sizing: border-box;
  padding:30px 60px 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 10px;
}
.shop-type-item{
  text-align: center;
}
.shop-type-item img{
  width: 89px;
  height: 89px;
  margin-bottom: 10px;
}
.shop-type-item p{
  font-size: 24px;/*px*/
  color: #333;
}
.guangao-pic img{
  width: 750px;
  height: 200px;
}
.hot-box{
  width: 100%;
  box-sizing: border-box;
  padding:0 20px;
}
.shop-box{
  width: 100%;
  box-sizing: border-box;
  padding:0 0 120px 20px;
}
.hot-box .title,.shop-box .title{
  text-align: left;
  font-size: 28px;/*px*/
  color: #333;
  padding:30px 0 20px;
}
.hot-box .hot-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.shop-box .shop-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.hot-box .hot-item img{
  width: 344px;
  height: 169px;
  border-radius: 4px;
}
.shop-box .shop-item-box{
  margin-bottom: 20px;
  margin-right:20px;
}
.wrapper-search{
    position:fixed;
    width:100%;
    top:0 !important;
    left:0;
    bottom: 110px;
}
.loading-wrapper{
	margin-top:20px;
	margin-bottom: 100px;
	font-size: 24px; /*px*/
    color: #999;
    text-align: center;
}
</style>


