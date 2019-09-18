<template>
<div>
<div class='container row-box'>
  <div class='row0'>
    <span class='left'>账号类型</span>
    <div class='right'>
      <span>银行卡</span> 
      <img src="../../assets/img/icon_select_on@2x.png" alt="">
    </div>
  </div>
  <div class='row'>
    <span class='left'>姓名</span>
    <input v-model="name" placeholder='请输入开户人姓名'/>
  </div>
  <!-- <div class='row'>
    <span class='left'>手机号码</span>
    <input placeholder='请输入手机号码'/>
  </div> -->
  <!-- <div class='rowx'>
    <span class='left'>验证码</span>
    <input placeholder='请输入验证码'/>
    <button>获取验证码</button>
  </div> -->
  <div class='row'>
    <span class='left'>账号</span>
    <input v-model="card" placeholder='请输入银行卡账号'/>
  </div>
  <div class='row'>
    <span class='left'>确认账号</span>
    <input v-model="rcard" placeholder='请再次输入银行卡账号'/>
  </div>
  <!-- <div class='area'>
    <span class="left">所在地区</span>
    <div id="trigger5" class="area-select">
        <span v-if='region.length==0' style="color:#757575;">请选择省、市、区</span>
        <span v-else>{{region}}</span>
    </div>
  </div> -->
  <div class='row' @click='isShowMask()'>
    <span class="left">开户银行</span>
    <input type="text" v-model="bank.bank_name" placeholder="请选择开户银行" disabled>
  </div>

  <!-- <div class='row'>
    <span class='left'>开户支行</span>
    <input placeholder-class='ccc' placeholder='例：杭州滨江支行'/>
  </div> -->
</div>

<button class='bind-btn' @click='bind()'>绑定</button>
<div class="mask" v-if='showMask'>
  <div class="mask-box">
    <p class="title">选择开户银行</p>
    <span class="close" @click="close()">×</span>
    <scroll class="wrapper-search"
    :pullup="pullup"
    @scrollToEnd="getBankList">
      <div class="card-box">
        <p v-for='(item,index) in bankList' :class='bankIndex==index?"active":""' :key='index' @click='selectBank(index)'>{{item.bank_name}}</p>
      </div>
    </scroll>
  </div>
</div>
</div>
</template>

<script>
import MobileSelect from 'mobile-select'
import cityData from '../../assets/cityData.js'
import {getBankinfo,updateMemberBankcardinfo} from '../../api/api.js'
import BScroll from 'better-scroll'
import scroll from '../../components/scroll.vue'
export default {
    data(){return{
        bankList: [], 
        bankIndex:'',
        name:'',
        card:'', 
        rcard:'',
        bank:{},
        page:1,
        pagesize:30,
        allPages:1,
        pullup:true,
        showMask:false
    }},
    created:function(){
        this.chineseCities=cityData.chineseCities;
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        this.userInfo=userInfo;  
        this.getBankList();    
    },
    mounted:function(){
  
    },
    methods:{
      getBankList:function(){
        var that=this;
        var userInfo=this.userInfo;
        var page=this.page,pagesize=this.pagesize,allPages=this.allPages;
        if(page>allPages) return;
        getBankinfo({
          username: userInfo.phone,
          access_token: userInfo.access_token,
          shop_type: 6,
          page:page,
          pagesize:pagesize,
        }).then(res=>{
          console.log(res);
          if(res.data.status=='y'){
            that.bankList=that.bankList.concat(res.data.result);
            that.page=that.page*1+1;
            that.allPages=res.data.all_rows;
          }
        })
      },
      isShowMask:function(){
        this.showMask=true;
      },
      close:function(){
        this.showMask=false;
      },
      selectBank:function(index){
        this.bankIndex=index;
        this.bank=this.bankList[index];
      },
      bind:function(){
        var that=this;
        var userInfo=this.userInfo;
        var name=this.name,
        bankList=this.bankList,
        bankIndex=this.bankIndex,
        card=this.card,
        rcard=this.rcard;
        if(name=='' || card=='' || card!=rcard || bankIndex=='') return;
        updateMemberBankcardinfo({
          username: userInfo.phone,
          access_token: userInfo.access_token,
          shop_type: 6,
          bank_id:bankList[bankIndex].id,
          bank_cardno:card,
          bank_cardname:name
        }).then(res=>{
          console.log(res);
          if(res.data.status=='y'){
            that.$layer.toast({
              icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
              content: '银行卡添加成功',
              time: 1000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
            })
            var j=setTimeout(function(){
              that.$router.go(-1);
              clearTimeout(j);
            },1000)
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
    components:{
      'scroll':scroll
    }
}
</script>

<style scoped>
.row-box{
  background-color: #fff;
  width:100%;
  box-sizing: border-box;
  margin-top: 20px;
  padding:30px;
}
.row,.row0{
  width: 690px;
  height: 100px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.row .left,.row0 .left{
  display: inline-block;
  width: 160px;
  font-size: 32px;
}
.row input{
    width: 500px;
    height: 60px;
    border-radius: 8px;
    border:2px solid #f4f4f4;
    text-align: center;
}
.row0 .right img{
  vertical-align: baseline;
  width: 36px;
  height: 36px;
}
.row0 .right span{
  display: inline-block;
  margin-right:20px; 
  font-size: 30px;/*px*/
}
.ccc{
  color: #999;
}
.bind-btn{
  width: 700px;
  height: 90px;
  line-height: 90px;
  font-size: 36px;
  color: #fff;
  text-align: center;
  background-color: #ff4e25;
  margin: 60px auto;
  display: block;
  border-radius: 8px;
}
.mask{
  position:fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  z-index: 12;
  top: 0;
  left: 0;
}
.mask-box{
  position:absolute;
  width: 100%;
  height: 800px;
  background-color: #fff;
  left: 0;
  bottom: 0;
}
.mask-box .title{
  height: 80px;
  width: 100%;
  line-height: 80px;
  box-sizing: border-box;
  padding:0 30px;
  font-size: 30px;/*px*/
  border-bottom: 2px solid #f4f4f4;
}
.mask-box .close{
  font-size: 50px;
  position: absolute;
  top: 0px;
  right: 30px;
  background-color: transparent;
  color: #999;
}
.mask-box .wrapper-search{
  position: absolute;
  width: 100%;
  top: 100px;
  bottom:20px;
  left: 0;
  overflow: hidden;
}
.card-box{
  width: 100%;
}
.card-box p{
  width: 100%;
  height: 80px;
  line-height: 80px;
  box-sizing: border-box;
  padding:0 30px;
  border-bottom: 2px solid #f4f4f4;
}
.card-box p.active{
  color: #ff4e25;
}
</style>


