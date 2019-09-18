import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index/index'
import my from '@/pages/my/my'
import news from '@/pages/news/news'
import shopCar from '@/pages/shopCar/shopCar'
import shopList from '@/pages/index/shopList'
import shopDetail from '@/pages/index/shopDetail'
import order from '@/pages/my/order'
import income from '@/pages/my/income'
import withdraw from '@/pages/my/withdraw'
import address from '@/pages/my/address'
import addAddress from '@/pages/my/addAddress'
import selectAddress from '@/pages/my/selectAddress'
import transfer from '@/pages/my/transfer'
import qrCode from '@/pages/my/qrCode'
import orderDetail from '@/pages/my/orderDetail'
import orderAccount from '@/pages/my/orderAccount'
import addCard from '@/pages/my/addCard'
import login from '@/pages/login'
import pay from '@/pages/my/pay'
import newsDetail from '@/pages/news/newsDetail'
import authorization from '@/pages/authorization'
import shopDetail2 from '@/pages/index/shopDetail2'
import wuliu from '@/pages/my/wuliu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      component:index,
      meta:{
        title:'首页'
      }
    },
    {
      path:'/index',
      component:index,
      meta:{
        title:'首页'
      }
    },
    {
      path:'/shopCar',
      component:shopCar,
      meta:{
        title:'购物车'
      }
    },
    {
      path:'/news',
      component:news,
      meta:{
        title:'消息'
      }
    },
    {
      path:'/my',
      component:my,
      meta:{
        title:'我的'
      }
    },
    {
      path:'/shopList/:id',
      name:'shopList',
      component:shopList,
      meta:{
        title:'商品列表'
      }
    },
    {
      path:'/shopDetail',
      name:'shopDetail',
      component:shopDetail,
      meta:{
        title:'商品详情'
      }
    },
    {
      path:'/shopDetail2',
      name:'shopDetail2',
      component:shopDetail2,
      meta:{
        title:'商品详情'
      }
    },
    {
      path:'/order/:id',
      name:'order',
      component:order,
      meta:{
        title:'我的订单'
      }
    },
    {
      path:'/income',
      name:'income',
      component:income,
      meta:{
        title:'我的收入'
      }
    },
    {
      path:'/withdraw',
      name:'withdraw',
      component:withdraw,
      meta:{
        title:'提现'
      }
    },
    {
      path:'/address',
      name:'address',
      component:address,
      meta:{
        title:'我的地址'
      }
    },
    {
      path:'/addAddress',
      name:'addAddress',
      component:addAddress,
      meta:{
        title:'新增地址'
      }
    },
    {
      path:'/selectAddress',
      name:'selectAddress',
      component:selectAddress,
      meta:{
        title:'选择地址'
      }
    },
    {
      path:'/transfer',
      name:'transfer',
      component:transfer,
      meta:{
        title:'转赠'
      }
    },
    {
      path:'/qrCode',
      name:'qrCode',
      component:qrCode,
      meta:{
        title:'我的二维码'
      }
    },
    {
      path:'/orderDetail/:id',
      name:'orderDetail',
      component:orderDetail,
      meta:{
        title:'订单详情'
      }
    },
    {
      path:'/orderAccount',
      name:'orderAccount',
      component:orderAccount,
      meta:{
        title:'订单确认'
      }
    },
    {
      path:'/addCard',
      name:'addCard',
      component:addCard,
      meta:{
        title:'添加银行卡'
      }
    },
    {
      path:'/login',
      name:'login',
      component:login,
      meta:{
        title:'绑定手机号'
      }
    },
    {
      path:'/pay',
      name:'pay',
      component:pay,
      meta:{
        title:'订单支付'
      }
    },
    {
      path:'/newsDetail',
      name:'newsDetail',
      component:newsDetail,
      meta:{
        title:'消息详情'
      }
    },
    {
      path:'/authorization',
      name:'authorization',
      component:authorization,
      meta:{
        title:'微信授权'
      }
    },
    {
      path:'/wuliu',
      name:'wuliu',
      component:wuliu,
      meta:{
        title:'订单物流'
      }
    }
  ]
})
