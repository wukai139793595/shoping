<template>
<div>
    <div class='container card-box'>
        <div class='card-box-top' @click='showCardList()'>
            <p class='left'>储蓄卡</p>
            <div class='right'>
                <p v-if='bankCardList.length>0 && bankCardIndex!=null'>{{bankCardList[bankCardIndex].title}} {{bankCardList[bankCardIndex].card}}</p>
                <p v-else>请选择提现银行卡</p>
                <p>单日交易限额¥5000.00</p>
            </div>
            <img src='../../assets/img/icon_more@2x.png'/>
        </div>
        <div class='card-box-bottom'>
            <p class='title'>提现金额(元)</p>
            <div class='center'>
                <span>¥</span>
                <input type='number' v-model="money"  placeholder='请输入提现金额'/>
            </div>
        </div>
        <button class='next'  @click='next()'>下一步</button>
    </div>
    <div class='mask' v-if='showMask'>
        <div class='mask-box'>
            <p class='title'>请选择到账银行卡</p>

            <scroll class="wrapper-search"
                :pullup="pullup"
                @scrollToEnd="getCarList">
                <div class="content">
                    <div v-for='(item,index) in bankCardList' :key='index' class='card-item' @click='selectCard(index)'>
                        <p>{{item.title}} {{item.card}}</p>
                        <p>1-3个工作日内到账</p>
                    </div>
                    <p class='add-btn' @click='addCard()'>添加银行卡</p>
                </div>
            </scroll>
            <span class='close' @click='closeMask()'>×</span>
        </div>
    </div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import scroll from '../../components/scroll.vue'
import {getMemberBankcardinfo,withdrawMemberAccount} from '../../api/api.js'
export default {
    data(){return{
        bankCardList:[],
        money:'',
        totalMoney:'',
        bankCardIndex:null,
        showMask:false,
        page:1,
        allPages:1,
        pagesize:10,
        pullup:true
    }},
    created:function(){
    var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      this.userInfo=userInfo;
      this.getCarList();
      this.totalMoney=this.$route.params.income;
    },
    mounted:function(){
        
    },
    methods:{
        showCardList:function(){
            console.log(1000)
            this.showMask=true;
        },
        closeMask:function(){
           this.showMask=false; 
        },
        selectCard:function(val){
            console.log(val)
            this.showMask=false; 
            this.bankCardIndex=val;
        },
        addCard:function(){
            this.$router.push({
                name:'addCard'
            })
        },
        getCarList:function(){
            var userInfo=this.userInfo;
            var that=this;
            if(this.page>this.allPages) return;
            getMemberBankcardinfo({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                shop_type: 6,
                page:that.page,
                pagesize:that.pagesize
            }).then(res=>{
                console.log(res);
                if(res.data.status=='y'){
                    res.data.result.map(function(val,index,arr){
                        that.bankCardList.push({
                            card:val.bank_cardno,
                            title:val.bank_name,
                            id:val.id,//账户记录id
                            bank_id:val.bank_id,//银行id
                            bank_cardname:val.bank_cardname
                        })
                    })
                    that.page=that.page*1+1;
                    that.allPages=res.data.result.all_rows
                }
            })
        },
        next:function(){
            var that=this;
            var userInfo=this.userInfo;
            if(this.bankCardIndex==null){
                this.$layer.toast({
                    icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                    content: '请选择提现账户',
                    time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                })
                return;
            }

            var data=this.bankCardList[this.bankCardIndex];
            var money=this.money*100;
            if(money>this.totalMoney){
                this.$layer.toast({
                    icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                    content: '输入金额大于账户总金额',
                    time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                })
                return;
            }
            withdrawMemberAccount({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                shop_type: 6,
                bank_id:data.bank_id,
                bank_cardno:data.card,
                bank_cardname:data.bank_cardname,
                amount:money
            }).then(res=>{
                console.log(res);
                if(res.data.status=='y'){
                    that.$layer.dialog({
                        title: ['提示'], // 第一个是标题内容  第二个是标题栏的style(可以为空)
                        content: '提现信息已经提交成功，后台管理员将在1-3个工作日内处理此订单，请耐心等待~',
                        contentClass: 'className',
                        btn: ['知道了'],
                        //time: 2000
                    }).then(function (res){
                        that.$router.go(-1);
                    })
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
.card-box{
  width: 690px;
  background-color: #fff;
  margin:40px auto;
  padding-bottom: 30px;
}
.card-box-top{
  width: 100%;
  height: 160px;
  background-color: #fbfbfb;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  box-sizing: border-box;
  padding:45px 60px 20px;
}
.card-box-top .left{
  font-size: 28px;
  color: #141414;
  width: 100px;
  display: block;
}
.card-box-top .right{
  width: 440px;
}
.card-box-top .right p:first-child{
  font-size: 28px;
  color: #141414;
  margin-bottom: 20px;
}
.card-box-top .right :last-child{
  font-size: 28px;
  color: #999;
}
.card-box-top img{
  width: 30px;
  height: 30px;
  display: inline-block;
}
.card-box-bottom{
  width: 100%;
  box-sizing: border-box;
  padding:40px 60px;
}
.card-box-bottom .title{
  font-size: 28px;
  color: #141414;
  margin-bottom: 40px;
}
.card-box-bottom .center{
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  border-bottom: 2px solid #f4f4f4;
  width: 100%;
  padding-bottom: 40px;
  padding-top:20px;
}
.card-box-bottom .center span{
  font-size: 72px;
  color: #141414;
  display: inline-block;
  margin-right: 40px;
}
.card-box-bottom .center input{
  height: 60px;
  line-height: 60px;
  margin-top: 20px;
}
.next{
  width: 658px;
  height: 88px;
  background-color: #ff4e25;
  color: #fff;
  border-radius: 8px;
  font-size: 36px;
  text-align: center;
  line-height: 88px;
  display: block;
  margin:20px auto 0;
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 10;
}
.mask-box{
  position: absolute;
  width:100%;
  background-color: #fff;
  height: 600px;
  bottom: 0;
  left: 0;
}
.mask-box .title{
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 32px;
  color: #141414;
  text-align: center;
  border-bottom: 2px solid #f4f4f4;
}
.mask-box .card-item{
  height: 90px;
  width: 100%;
  box-sizing: border-box;
  padding:10px 100px;
  border-bottom: 2px solid #f4f4f4;
}
.mask-box .card-item p:first-child{
  font-size: 26px;
  color: #141414;
}
.mask-box .card-item p:last-child{
  font-size: 20px;
  color: #666;
}
.mask-box .add-btn{
  border-bottom: 2px solid #f4f4f4;
  height: 90px;
  box-sizing: border-box;
  padding:0 100px;
  line-height: 90px;
  font-size: 26px;
  color: #141414;
}
.mask-box .close{
  position: absolute;
  width: 50px;
  height: 50px;
  font-size: 50px;
  color: #999;
  top: 30px;
  left: 10px;
  display: inline-block;
  text-align: center;
  line-height: 50px;
}
.mask-box .wrapper-search{
    height: 450px;
    overflow: hidden;
}


</style>


