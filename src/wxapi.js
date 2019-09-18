import wx from 'weixin-js-sdk'
import {getJsapiTicket} from './api/api.js'
const wxApi = {
 /**
 * [isweixin 判断是否微信浏览器]
 */
    isweixin () {
        const ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true
        } else {
            this.$router.push({path: '/wxkj/isnotWechat'})
            return false
        }
    },
    wxRegister (callback) {
        var params= {
            share_url:window.location.href.split('#')[0],
            appid: 'wx75f9456581dc96ec',
            appsecret: 'd0b051cc20e0a8871b95308d77abe08b',
            shop_type: 6,        
        }
        console.log(params);
        getJsapiTicket(params).then(res=>{
            console.log(res);
           wx.config({
            debug: false, // 开启调试模式
            appId: res.appid, // 必填，公众号的唯一标识
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名，见附录1
            jsApiList: [
               'onMenuShareAppMessage', // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
               'onMenuShareTimeline' // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
           })
           wx.ready((res) => {
                // 如果需要定制ready回调方法
                if (callback) {
                    callback()
                }
            })
        }).catch((error) => {
           console.log(error)
        })
        
    },
    ShareTimeline (opstion) {
        wx.onMenuShareTimeline({
         title: opstion.title, // 分享标题
         link: opstion.link, // 分享链接
         imgUrl: opstion.imgUrl, // 分享图标
         success () {
          // 用户成功分享后执行的回调函数
          opstion.success()
         },
         cancel () {
          // 用户取消分享后执行的回调函数
          opstion.error()
         }
       })
    },
    ShareAppMessage(option){
        wx.onMenuShareAppMessage({
            title: opstion.title, // 分享标题
            link: opstion.link, // 分享链接
            imgUrl: opstion.imgUrl, // 分享图标
            success () {
             // 用户成功分享后执行的回调函数
             opstion.success()
            },
            cancel () {
             // 用户取消分享后执行的回调函数
             opstion.error()
            }
          })
    }
}
export default wxApi