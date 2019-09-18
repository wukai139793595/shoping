<template>
<div class='container'>
  <div class='top'>
    <div class='row'>
      <input  v-model="name"  placeholder='请输入姓名'/>
    </div>
    <div class='row'>
      <input  v-model="phone"  placeholder='请输入手机号'/>
    </div>
    <div class='row'>
      <input  v-model="rphone"  placeholder='请输入推荐人的手机号'/>
    </div>
  </div>
  <button  class='login-btn2' @click='login()'>注册</button>
 
</div>
</template>

<script>
import {updateReferInfo,updateName} from '../api/api.js';
import {checkPhone} from '../utils.js';

export default {
    data(){return{
      name:'',
      phone: '',
      rphone:'',
      userInfo:null
    }},
    watch:{
      phone:function(){},
      name:function(){},
      rphone:function(){}
    },
    created:function(){
      var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      this.userInfo=userInfo;
    },
    methods:{
      login:function(){
        var that=this,
            name=this.name,
            rphone=this.rphone,
            phone=this.phone;
        var userInfo=this.userInfo;
        if(phone=='' || rphone==''){
          this.$layer.toast({
            icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
            content: '请输入手机号码',
            time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
          })
          return;
        }
        if(!checkPhone(phone) || !checkPhone(rphone)){
          this.$layer.toast({
            icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
            content: '手机号码格式有误',
            time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
          })
          return;
        }
        if(name==''){
          this.$layer.toast({
            icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
            content: '请输入姓名',
            time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
          })
          return;
        }
        updateReferInfo({
          username: userInfo.phone,
          access_token: userInfo.access_token,
          refer_username: rphone,
          shop_type: 6,
          type: 1
        }).then(res=>{
          console.log(res);
          if(res.data.status=='y'){
            console.log(phone,userInfo.openid)
            updateName({
              username:phone,
              openid: userInfo.openid, 
            }).then(res=>{
              console.log(res);
              if(res.data.status=='y'){
                that.$layer.toast({
                  icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                  content:'注册成功',
                  time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                })  
                userInfo.phone=phone;
                localStorage.setItem('userInfo',JSON.stringify(userInfo));
                that.$store.dispatch('userInfo');
                var j=setTimeout(function(){
                  that.$router.go(-1);
                  clearTimeout(j);
                },2000)
              }else{
                that.$layer.toast({
                  icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                  content: res.data.info,
                  time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                })
              }
            })
          }else{
            that.$layer.toast({
              icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
              content: res.data.info,
              time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
            })
          }
        })

      },
      
    },
}
</script>

<style scoped>
.container{
    font-size: 30px;
}
.top{
  width: 750px;
  background-color: #fff;
  margin:20px auto 60px;
}
.row{
  width: 100%;
  height: 120px;
  box-sizing: border-box;
  padding:0 30px;
  font-size: 36px;
  line-height: 120px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  border-top: 1px solid #f4f4f4;
}
.row input{
  height: 114px;
  width:100%;
  margin-left: 30px;
  font-size: 30px;/*px*/
  background-color: transparent;
}
.login-btn2{
  width: 650px;
  height: 98px;
  font-size: 36px;
  line-height: 98px;
  text-align: center;
  margin:0 auto 40px;
  background-color: #ff4e25;
  color: #fff;
  display:block;
  border-radius: 8px;
}

.no-button{
  background-color: transparent;
  border: none;
  outline: none;
}
.no-button::after{
  border: none;
  outline: none;
}
</style>


