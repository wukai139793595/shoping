<template>
<div class='container'>
<scroll class="wrapper-search"
	:data="list"
	:pullup="pullup"
	@scrollToEnd="getList">
<div>
  <div class="yong-box">
    <p class="yong-title">我的收益(元)：合计：<span class="red">¥{{totalMoney}}</span></p>
    <p class="yong-item">佣金：<span class="red">¥{{money1}}</span></p>
    <p class="yong-item">津贴：<span class="red">¥{{money2}}</span></p>
    <p class="yong-item">分红：<span class="red">¥{{money3}}</span></p>
  </div>
  <div class="yong-box">
    <p class="yong-title">我的推荐人数：合计：<span class="red">{{totalNum}}</span></p>
    <p class="yong-item" >一级人数：<span class="red">{{num1}}</span></p>
    <p class="yong-item">二级人数：<span class="red">{{num2}}</span></p>
  </div>
  <div class='mingxi-box'>
    <p class='mingxi-title'><img src='../../assets/img/icon_zhangdan@2x.png'/><span>收益明细</span></p>
    <div v-for='(item,index) in list' :key='index' class='mingxi-item'>
      <span class='left'>{{item.time}}</span>
      <p class='right'>{{item.way}}： <span class='red'>¥{{item.money}}</span></p>
    </div>
  </div>
</div>
</scroll>
  <button class="ti" @click="withdraw()">提现</button>
</div>
</template>

<script>
import {getMemberAccountDetail,getMemberAccountBal} from '../../api/api.js'
import {unixTimestamp} from '../../utils.js'
import BScroll from 'better-scroll'
import scroll from '../../components/scroll.vue'

export default {
    data(){return{
        totalMoney:0,
        money1:0,
        money2:0,
        money3:0,
        totalNum:0,
        num1:0,
        num2:0,
        list:[],
        page:1,
        pagesize:10,
        allPages:1,
        pullup:true
    }},
    created:function(){
      var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      var that=this;
      this.userInfo=userInfo;
      this.getList();
      getMemberAccountBal({
        username: userInfo.phone,
        openid:userInfo.openid,
        access_token: userInfo.access_token,
        shop_type: 6,
      }).then(res=>{
        console.log(res)
        if(res.data.status=='y'){
          var data=res.data.result;
          that.totalMoney=(data.balance/100).toFixed(2) || 0;
          that.money1=(data.commission/100).toFixed(2) || 0;
          that.money2=(data.bonus/100).toFixed(2) || 0;
          that.money3=(data.profit/100).toFixed(2) || 0;
          console.log(that.money1)
        }
      })
    },
    methods:{
        withdraw:function(){
            var income=this.totalMoney*100;
            this.$router.push({name:'withdraw',params:{income:income}})
        },
        getList:function(){
          var that=this;
          var userInfo=this.userInfo;
          console.log(this.page,this.allPages)
          if(this.page>this.allPages) return;
          
          getMemberAccountDetail({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            openid:userInfo.openid,
            shop_type: 6,
            page:that.page,
            pagesize:that.pagesize
          }).then(res=>{
            console.log(res);
            if(res.data.status=='y'){
              res.data.result.map(function(val,index,arr){
                var way='';
                switch(val.event*1){
                  case 1:
                    way='充值';
                    break;
                  case 2:
                    way='提现';
                    break;
                  case 3:
                    way='支付订单';
                    break;
                  case 4:
                    way='订单退款';
                    break;
                  case 5:
                    way='提现退款';
                    break;
                  case 6:
                    way='推荐奖励';
                    break;
                  case 8:
                    way='订单余额支付';
                    break;
                  case 9:
                    way='佣金收入';
                    break;
                  case 10:
                    way='管理奖收入';
                    break;
                  case 11:
                    way='订单转充值';
                    break;
                  case 12:
                    way='分红收入';
                    break;
                }
                that.list.push({
                  time:unixTimestamp(val.addtime),
                  money:(val.amount/100).toFixed(2),
                  way:way
                })
              }) 
              that.page=that.page*1+1;
              that.allPages=res.data.all_rows;
            }
          })
        }
    },
    components:{
      'scroll':scroll
    }
}
</script>

<style scoped>
.yong-box{
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  box-sizing: border-box;
  margin-top: 20px;
}
.yong-title{
  padding:20px 30px;
  font-size: 30px;/*px*/
  border-bottom: 2px solid #f4f4f4;
}
.yong-item{
  height: 90px;
  line-height: 90px;
  border-bottom: 2px solid #f4f4f4;
  box-sizing: border-box;
  padding: 0 25px;
  font-size: 28px;
}
.mingxi-title{
  width: 100%;
  box-sizing: border-box;
  padding:20px 0 20px 30px;
  background-color: #fff;
  font-size: 30px;/*px*/
  border-bottom: 2px solid #f4f4f4;
  
}
.mingxi-title img{
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.mingxi-box{
  width:100%;
  background-color: #fff;
  margin-top: 20px;
  margin-bottom: 100px;
}
.mingxi-item{
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 25px;
  font-size: 28px;
  height: 90px;
  line-height: 90px;
  border-bottom: 2px solid #f4f4f4;
}
.red{
  color: #ff4e25;
}
.ti{
  width: 100%;
  height: 90px;
  background-color: #ff4e25;
  color: #fff;
  text-align: center;
  line-height: 90px;
  font-size: 30px;/*px*/
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
}
.wrapper-search{
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 100px;
  left: 0;
}
</style>



