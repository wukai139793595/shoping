<template>
    <div class='container'>
        <div class="tab-h">
            <p v-for='(item,index) in orderNav' :key='index' :class="currentTab==index?'active':''"  @click="changeTab(index)" >{{item}}</p>
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
                    <div @click="detail(item)" class='shop-item-box' v-for='(item,index) in allList["list"+currentTab]' :key='index'>
                        <shop-1 :shopInfo="item"></shop-1>
                    </div>
                </div>
                <p class='no-more-shop' >~没有更多了~</p>
            </div>
            <div v-else class="">
                <img class='no-shop-img' src='../../assets/img/no-order.png'/>
                <p class='tips-text'>暂无商品</p>
            </div>
        </div>
    </scroll>
    </div>
</template>

<script>
import Shop1 from '../../components/Shop1.vue'
import {getGoodsList} from '../../api/api.js'
import BScroll from 'better-scroll'
import scroll from '../../components/scroll.vue'

export default {
    data(){return{
        orderNav: ['体验区', '精英区', '会员区','特价区'],
        currentTab: 0,
        pages:[1,1,1,1],
        pageSizes:[10,10,10,10],
        allPages:[1,1,1,1],
        pullup:true,
        allList:{
            list0: [],
            list1: [],
            list2:[],
            list3: []
        }
    }},
    created:function(){
        this.currentTab=this.$route.params.id;
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        this.userInfo=userInfo;
        this.getList();
    },
    methods:{
        changeTab:function(val){
            this.currentTab=val;
            this.getList();
        },
        getList:function(){
            var id=this.currentTab;
            var userInfo=this.userInfo;
            var that=this;
            if(that.pages[id]>that.allPages[id]) return;
            console.log(id*1+8)
            getGoodsList({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                shop_type: 6,
                cash_cat_id:id*1+8,
                page: that.pages[id],
                pagesize: that.pageSizes[id]
            }).then(res=>{
                console.log(res);
                if(res.data.status=='y'){
                    var list=res.data.result;
                    list.map(function(val,index,arr){
                        var title=val.name.length>25? val.name.slice(0,20)+'...':val.name;
                        that.allList["list"+id].push({
                            shopId: val.id,
                            img: val.image,
                            title: title,
                            name:val.name,
                            price: val.sell_price,
                            cash_cat_id:val.cash_cat_id,
                            cash_sec_cat_id:val.cash_sec_cat_id,//二级分类，是否是礼包>0属于礼包分类
                        })
                    })
                    that.allPages[id]=res.data.all_rows;
                    that.pages[id]=that.pages[id]*1+1;
                }else{
                    console.log(res.data.info)
                }
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
        'shop-1':Shop1,
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
  box-sizing: border-box;
  padding:0 30px;
	height: 90px;
	background-color: #fff;
	line-height: 90px;
	border-bottom: 1px solid #efefef;
	position:  fixed;
	top:0;
	left:0;
  z-index:10;
}
.tab-h p{
  width: 90px;
  text-align: center;
}
.tab-h p.active{
	  color: #ff4e25;
  	position: relative;
  	border-bottom: 6px solid #ff4e25;
}
.tab-content{
	width: 750px;
  overflow: hidden;
	margin-top: 20px;
  /* text-align: center; */
}

.shop-list{
  width: 100%;
  box-sizing: border-box;
  padding:0 0 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.shop-item-box{
  margin-bottom: 20px;
  margin-right:20px;
}
.loading-img{
  width: 100px;
  height: 100px;
  margin:200px auto 20px;
}
.tips-text{
  font-size: 28px;
  color: #999;
  text-align: center;
}
.no-shop-img{
  width: 200px;
  height: 200px;
  margin:200px auto 20px;
  background-color: #999;
  border-radius: 50%;
  border: none;
  display: block;
}
.no-more-shop{
  font-size: 28px;
  color: #999;
  text-align: center;
}
.wrapper-search{
    position: fixed;
    width: 100%;
    top: 90px;
    bottom:0;
    left: 0;
    overflow: hidden;
}
</style>


