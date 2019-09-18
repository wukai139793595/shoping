import Vue from 'vue'
import vuex from 'vuex'
import {getName} from '../api/api.js'
Vue.use(vuex);

export default new vuex.Store({
    state:{
        buyShop:null,
        shopDetail:null,
        state:null,
        userInfo:null,
        buyWay:'',
        newsDetail:''
    },
    getters:{},
    mutations: {
        buyShop:function(state,list){
            console.log(list)
            state.buyShop=list;
        },
        shopDetail:function(state,data){
            console.log(data)
            state.shopDetail=data;
        },
        address:function(state,data){
            console.log(data);
            state.address=data;
        },
        userInfo:function(state,data){
            console.log(data);
            state.userInfo=data;
        },
        buyWay:function(state,data){
            state.buyWay=data;
        },
        newsDetail:function(state,data){
            state.newsDetail=data;
        }
    },  
    actions:{
        userInfo:function(context){
            var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
            getName({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                shop_type: 6,
                openid:userInfo.openid
            }).then(res=>{
                console.log(res);
                if(res.data.status=='y'){
                    var group_id=res.data.result.group_id;
                    var username=res.data.result.username;
                    userInfo.member_group=group_id;
                    userInfo.phone=username;
                    context.commit('userInfo',userInfo); 
                    localStorage.setItem('userInfo',JSON.stringify(userInfo));
                }
            })  
        }
    }
})