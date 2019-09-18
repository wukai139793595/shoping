<template>
    <div></div>
</template>
<script>
import {userXcxLogin,getOpenidAction,getWxInfo,getAccessToken} from '../api/api.js';

function getUrlKey(name){//获取url 参数
   return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
  }
  
function getCodeApi(state){//获取code   
     let urlNow=encodeURIComponent(window.location.href);
     let scope='snsapi_userinfo';   
     let appid='wx75f9456581dc96ec';
     let url=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlNow}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
     window.location.replace(url);
}

export default {
    data(){return{
        wxInfo:null
    }},
    created:function(){
      let that=this;
      let code=getUrlKey("code");
      let appid='wx75f9456581dc96ec';
      let secret='d0b051cc20e0a8871b95308d77abe08b';
	  if(code){
		getAccessToken({
          	js_code: code,
            appid: appid,
            appsecret: secret,
            shop_type: 6,
        }).then(res=>{
            if(res.status==200){
                that.wxInfo=res.data;
                that.login();
            }
        })
	  }else{
		getCodeApi("1");
	  }
    },
    methods:{
    login:function(){
        var that=this;
        var wxInfo=this.wxInfo;
        var nickname=wxInfo.nickname;
        var headimgurl=wxInfo.headimgurl;
        var openid=wxInfo.openid;
        if(!wxInfo){
          this.$layer.toast({
            icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
            content: '微信授权失败，请重新进入',
            time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
          })
          return;
        }
        userXcxLogin({
          username:openid,
          wx_nickname: nickname,
          wx_headimg: headimgurl,
          openid: openid,
          shop_type: 6,
        }).then(res=>{
          console.log(res);
          if(res.data.status=='y'){
            var data=res.data.result;
            var obj={
              "nickname":nickname,
              "headimgurl":headimgurl,
              "phone":res.data.result.username,
              "openid":openid,
              "access_token":data.token,
              "member_group":data.member_group
            };
            that.$store.commit('userInfo',obj);
            console.log(that.$store.state.userInfo);
            obj=JSON.stringify(obj);
            localStorage.setItem("userInfo", obj);
            console.log(localStorage.getItem('userInfo'))
            that.$store.commit('userInfo',obj);
            that.$layer.toast({
              icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
              content: '授权成功',
              time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
            })
            that.$store.dispatch('userInfo');
            var j=setTimeout(function(){
              console.log('页面跳转')
              window.location.replace('http://mjy.qinjini.com/#/index');
              clearTimeout(j);
            },1000)
          }else{
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
    }
}
</script>

