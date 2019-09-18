<template>
<div class='container'>
  <div class='erweima'>
    <div class='top' v-if="userInfo!=null">
      <img :src='userInfo.headimgurl'/>
      <span>{{userInfo.nickname}}</span>
    </div>
    <div class="qrcode-box">
      <div class='center' ref="qrCodeUrl"></div>
    </div>
    <p class='bottom'>心系健康，一心为您</p>
  </div>
  <p class="bottom-text">分享二维码截图，成为我的家人</p>
</div>
</template>

<script>
import QRCode from 'qrcodejs2'

export default {
    data(){return{
        userInfo:{
          avatarUrl:require('../../assets/img/pic_personal_mag.png'),
          nickName:'可爱多'
        },
        //qrCodeImg:require('../../assets/img/qr_code_img@2x.png')
    }},
    created:function(){
      var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      this.userInfo=userInfo;
    },
    mounted:function(){
      this.qrcode();
    },
    methods:{
      qrcode() {  
        var that=this;
        var width=document.body.clientWidth/2;
         var qrcode = new QRCode(that.$refs.qrCodeUrl, {
              text: 'http://mjy.qinjini.com/?registered=1#/index',
              width: width,
              height: width,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
        })
      }
    }
}
</script>

<style scoped>
.erweima{
  width: 680px;
  height: 900px;
  background-color: #fff;
  margin:150px auto 20px;
  box-sizing: border-box;
  padding:30px;
}
.erweima .top{
  width: 100%;
}
.erweima .top img{
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 30px;
  vertical-align: middle;
}
.erweima .top text{
  font-size: 32px;
}
.qrcode-box{
  text-align: center;
}
.erweima .center{
  display: inline-block;
  text-align: center;
  margin:40px auto;
}
.erweima .center img{
  width: 580px !important;
  height: 580px !important;
}
.erweima .bottom{
  font-size: 40px;
  color: red;
  width: 100%;
  text-align: center;
}
.bottom-text{
  font-size: 32px;
  text-align: center;
}
</style>


