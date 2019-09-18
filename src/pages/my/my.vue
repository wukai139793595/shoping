<template>
    <div>   
        <tab-bar :cur='cur'></tab-bar>
        <div class='container'>
            <div class='header' v-if='userInfo!=null'>
                <!-- <img class='bg' src='../../assets/img/bg@2x.png'/> -->
                <div class="ava-name-box">
                    <p class="ava-box"><img class='ava' :src='userInfo.headimgurl'/></p>
                    <div>
                        <p class="name">{{userInfo.nickname}}</p>
                        <p class="grop-name">等级：{{userInfo.group_name}}</p>
                        <p class="dengji">
                            <img src="../../assets/img/wujiaoxing_yello@2x.png" alt="" v-for='(item,index) in (userInfo.member_group-4)' :key='index'>
                            <img src="../../assets/img/wujiaoxing_wihte@2x.png" alt="" v-for='(item,index) in (8-userInfo.member_group)' :key='index'>
                        </p>
                    </div>
                </div>
            </div>
            <div class='order'>
                <div class='order-top'>
                    <span>我的订单</span>
                    <router-link to="/order/0">全部订单</router-link>
                </div>
                <div class='order-bottom'>
                    <router-link to='/order/1' class="order-bottom-item">
                        <img src='../../assets/img/icon_dfk@2x.png'/>
                        <p>待付款({{record[0]}})</p>
                    </router-link>
                    <router-link to='/order/2' class="order-bottom-item">
                        <img src='../../assets/img/icon_dfh@2x.png'/>
                        <p>待发货({{record[1]}})</p>
                    </router-link>
                    <router-link to='/order/3' class="order-bottom-item">
                        <img src='../../assets/img/icon_dsh@2x.png'/>
                        <p>待收货({{record[2]}})</p>
                    </router-link>
                    <router-link to='/order/4' class="order-bottom-item">
                        <img src='../../assets/img/icon_ywc@2x.png'/>
                        <p>已完成({{record[3]}})</p>
                    </router-link>
                </div>
            </div>
            <div class='about' v-if='userInfo.member_group>4'>
                <router-link v-for='(item,index) in list1' :key='index' :to='item.url' class='row'>
                    <img :src='item.icon'/>
                    {{item.title}}
                    <img src='../../assets/img/icon_more@2x.png'/>
                </router-link>
            </div>
            <div class='about' v-else>
                <router-link v-for='(item,index) in list2' :key='index' :to='item.url' class='row'>
                    <img :src='item.icon'/>
                    {{item.title}}
                    <img src='../../assets/img/icon_more@2x.png'/>
                </router-link>
            </div>
            <button class="logout" @click="logout()">退出登录</button>
        </div>
    </div>
</template>

<script>
import TabBar from '../../components/TabBar.vue'
import {queryOrderList} from '../../api/api.js'
import {checkPhone} from '../../utils.js'
export default {
    data(){return{
        cur:'my',
        userInfo:null,
        phone:null,
        record:[0,0,0,0],
        list1:[
            {
                url:'/income',
                icon:require('../../assets/img/icon_qianbao@2x.png'),
                title:'我的收入'
            },
            {
                url: '/address',
                icon: require('../../assets/img/icon_dizhi@2x.png'),
                title: '我的地址'
            },
            {
                url: '/transfer',
                icon: require('../../assets/img/icon_yue@2x.png'),
                title: '余额转赠'
            },
            {
                url: '/qrCode',
                icon: require('../../assets/img/icon_erweima@2x.png'),
                title: '我的二维码'
            }
        ],
        list2:[
            {
                url: '/address',
                icon: require('../../assets/img/icon_dizhi@2x.png'),
                title: '我的地址'
            },
        ]
    }},
    created:function(){
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        var group_name='';
        switch(userInfo.member_group*1){
            case 4:
                group_name='游客';
                break;
            case 5:
                group_name='体验会员';
                break;
            case 6:
                group_name='精英俱乐部会员';
                break;
            case 7:
                group_name='富豪俱乐部会员';
                break;
            case 8:
                group_name='皇家俱乐部会员';
                break;
        }
        userInfo.group_name=group_name;
        this.userInfo=userInfo;
        if(checkPhone(userInfo.phone)){
            this.phoen=userInfo.phone;
        }
        console.log(this.userInfo)
        this.getrecord();
    },
    methods:{
        logout:function(){
            localStorage.clear();
            this.$layer.toast({
                icon: 'icon-check', 
                content: '退出登录',
                time: 1000 
            })
            var that=this;
            var j=setTimeout(function(){
                that.$router.push({name:'authorization'});
                clearTimeout(j)
            },1000)
        },
        getrecord:function(){
            var userInfo=this.userInfo;
            var that=this;
            queryOrderList({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                type:2,
                shop_type: 6,
                status:status
            }).then(res=>{
                console.log(res);
                if(res.data.status=='y'){
                    var data=res.data.result;
                    that.record=[data.wait_pay,data.wait_send,data.wait_sign,data.completed]
                }
            })
        }
    },
    components:{
        'tab-bar':TabBar
    },
}
</script>

<style scoped>
.header{
	height: 228px;
	width: 100%;
	position: relative;
    background-color: #fff;
    color: #333;
}
.header .bg{
  position: absolute;
  bottom:0;
  left: 0;
  width: 750px;
  height: 100%;
  z-index: -1;
}

.header .ava{
	width:130px;
	height: 130px;
  border-radius: 50%;
}
.header .ava-box{
    margin-right: 50px;
}
.header .ava-name-box{
    padding-top:40px;
    box-sizing: border-box;
    padding-left: 30px;
}
.header .ava-name-box .dengji{
    background-size: 100%;
    background-repeat: no-repeat;
    border-radius: 5px;
    color: #fff;
    margin-top: 10px;
}
.header .ava-name-box .dengji img{
    width: 30px; 
    height: 30px;
    margin-right: 10px;
    vertical-align:bottom;
}
.header .ava-name-box .dengji span{
    display:inline-block;
    margin-right: 20px;
}
.header .ava-name-box{
    display:flex;
    flex-wrap:nowrap;
    justify-content:flex-start;
}
.header .ava-name-box{
    font-size: 30px;/*px*/
}
.order{
	width: 100%;
	background-color: #fff;
}
.order-top{
	height: 75px;
	width: 100%;
	line-height: 80px;
	box-sizing: border-box;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	padding:0 25px;
	border-bottom: 1px solid #efefef;
	color:#666;
  font-size: 28px;
}
.order-bottom{
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-around;
	width: 100%;
	height: 150px;
  box-sizing: border-box;
  padding-top:20px;
}
.order-bottom .order-bottom-item{
  text-align: center;
}
.order-bottom .order-bottom-item img{
  width: 60px;
  height: 60px;
  display: inline-block;
}
.order-bottom p{
  text-align: center; 
  height: 100px;
  font-size: 24px;
}
.about{
  margin-top: 20px;
  width: 100%;
}
.about .row{
  width: 100%;
  display: block;
  height: 80px;
  line-height: 80px;
  box-sizing: border-box;
  padding: 0 25px;
  background-color: #fff;
  border-bottom:2px solid #e6e6e6; 
  position: relative;
}
.about .row img:first-child{
  width: 36px;
  height: 36px;
  vertical-align: middle;
  position: relative;
  top:-5px;
}
.about .row img:last-child{
  width: 30px;
  height: 30px;
  position: absolute;
  right: 25px;
  top: 25px;
}
.logout{
    height: 80px;
    width: 100%;
    text-align: center;
    line-height: 80px;
    font-size: 28px;
    color: #666;
    margin-top: 30px;
}
</style>
