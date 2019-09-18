<template>
<div>
<div class='container'>
  <div class='balance'>当前账号余额： <span>{{balance}}</span></div>
  <div class='row'>
    <span>用户名：</span>
    <input v-model='phone'  placeholder='请输入赠与用户的手机号'/>
  </div>
  <div class='row'>
    <span>转赠金额(元)：</span>
    <input v-model="money" placeholder='请输入赠与的金额'/>
  </div>
  <button class='zhuanzeng' @click='zhuanzeng'>转赠</button>
</div>
<div class='mask' v-if='showMask'>
  <div class='mask-box'>
    <p class='title'>转赠信息</p>
    <p class='phone'>用户名：{{phone}}</p>
    <p class='money'>转赠金额(元)： <span >¥{{money}}</span></p>
    <div class='btn-box'>
      <button @click='cancel()'>取消</button>
      <button @click="confirm()">确定</button>
    </div>
  </div>
</div>
</div>
</template>

<script>
import {getMemberAccountBal,transMemberAccountBal} from '../../api/api.js'
import {checkPhone} from '../../utils.js'
export default {
    data(){return{
        balance:'',
        phone:'',
        money:'',
        showMask:false
    }},
    created:function(){
      var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      this.userInfo=userInfo;
      getMemberAccountBal({
        username: userInfo.phone,
        access_token: userInfo.access_token,
        shop_type: 6,
      }).then(res=>{
        console.log(res)
        if(res.data.status=='y'){
          this.balance=(res.data.result.balance/100).toFixed(2) || 0;
        }
      })
    },
    methods:{
        zhuanzeng:function(){
            this.showMask=true;
        },
        cancel:function(){
            this.showMask= false;
            this.phone= '';
            this.money= '';
        },
        confirm:function(){
          this.$layer.loading('数据提交中...')
          var that=this;
          var userInfo=this.userInfo;
          if(this.money=='') return;
          var money=this.money*100,phone=this.phone;
          if(!checkPhone(phone)){
            that.$layer.toast({
              icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
              content: '请确认填写手机号',
              time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
            })
            return;
          }
          transMemberAccountBal({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            amount:money,
            to_username:phone
          }).then(res=>{
            console.log(res);
            that.$layer.close();
            if(res.data.status=='y'){
              that.$layer.toast({
                icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                content: '转赠成功',
                time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
              })
            }else{
              that.$layer.toast({
                icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                content: res.data.info,
                time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
              })
            }
          })
        }
    }
}
</script>

<style scoped>
.balance,.row{
  width: 100%;
  height: 80px;
  background-color: #fff;
  line-height: 80px;
  box-sizing: border-box;
  padding:0 25px;
  font-size: 28px;
}
.balance span{
  font-size: 32px;
  color: #ff4e25;
}
.row{
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  margin-top: 20px;
}
.row span{
  font-size: 28px;
  display: inline-block;
  width: 200px;
}
.row input{
  width: 500px;
  font-size: 28px;
  height: 100%;
}
.zhuanzeng{
  width: 700px;
  height: 85px;
  background-color: #ff4e25;
  color: #fff;
  font-size: 32px;
  line-height: 85px;
  text-align: center;
  margin:60px auto;
  display: block;
  border-radius: 8px;
}
.mask{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 10;
}
.mask-box{
  background-color: #fff;
  position: absolute;
  width: 560px;
  height: 346px;
  box-sizing: border-box;
  border-radius: 8px;
  padding:30px 0;
  top: 210px;
  left: 95px;
}
.mask-box .title{
  font-size: 32px;
  font-weight: 700;
  width: 100%;
  text-align: center;
  margin-bottom: 50px;
}
.mask-box .phone,.mask-box .money{
  width: 315px;
  font-size: 28px;
  margin:0 auto 30px;
}
.btn-box{
  width: 346px;
  margin:40px auto 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.btn-box button{
  width: 130px;
  height: 46px;
  background-color: #999;
  color: #fff;
  text-align: center;
  line-height: 46px;
  padding:0;
  font-size: 28px;
  border:none;
  outline: none;
  border-radius: 4px;
}
.btn-box button:last-child{
  background-color: #ff4e25;
}
</style>


