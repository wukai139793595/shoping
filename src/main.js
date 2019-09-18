// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible'
import './assets/style/common.css'
import 'vue-layer-mobile/need/layer.css'
import layer from 'vue-layer-mobile'

Vue.use(layer)

Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  if(!localStorage.getItem('userInfo') && to.path!='/authorization'){
    //首次登录，或者本地个人信息清除了
    console.log('登录授权');
    router.push({path:'/authorization'})
  }else if(localStorage.getItem('userInfo') && !store.state.userInfo){
    //已经登录授权，需要更新获取用户信息
    console.log('重新获取用户信息');
    store.dispatch('userInfo');
  }else{
    console.log('已经登录，也不需要获取用户信息');
  }
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
	   document.title = to.meta.title
	}
	next();  
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
