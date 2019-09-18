<template>
<div>
<div v-if='addressList!=null && addressList.length>0' class='address-list container'>
  <div  v-for='(item,index) in addressList' :key='index' class='address-item'>
    <div class='address-top'>
      <div class='address-user'>
        <span>{{item.name}}</span>
        <span>{{item.phone}}</span>
      </div>
      <p class='address-detail'>{{item.province}}{{item.city}}{{item.area}}{{item.detailed}}</p>
    </div>
    <div class='address-bottom'>
      <div class='address-default' @click='changDefault(item)' >
        <img v-if='item.isDefault==1' src="../../assets/img/icon_select_on@2x.png" alt=""/>
        <img v-else src="../../assets/img/icon_select_un@2x.png" alt=""/>
        <span >默认地址</span>
      </div>
      <div class='address-right'>
        <div class='edit' @click='editAddress(item)'>
          <img src="../../assets/img/icon_edit@2x.png" alt="">
          <span class='zk'>编辑</span>
        </div>
        <div class='delete' @click='deleteAddress(item)'>
          <img src="../../assets/img/icon_delet@2x.png" alt="">
          <span class='zk'>删除</span>
        </div>
      </div>
    </div>
  </div>
</div>
<div class='no-address-box' v-else>
  <img class='no-address-img' src='../../assets/img/no-address.png'/>
  <p>您还未添加地址</p>
</div>
<router-link to='/addAddress'  class='add'>新增地址</router-link>

</div>
</template>

<script>
import {getMemberAddress,updateMemberAddress,deleteMemberAddress} from '../../api/api.js'

export default {
    data(){return{
        addressList: []
    }},
    created:function(){
      var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
      var that=this;
      this.userInfo=userInfo;
      this.getList();
    },
    methods:{
      changDefault:function(item){
        console.log(item);
        var that=this;
        var userInfo=this.userInfo;
        if(item.isDefault==1){
          return;
        }else{
          var params={
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            full_name:item.name,
            tel:item.phone,
            prov:item.prov_n,
            city:item.city_n,
            area:item.area_n,
            address:item.detailed,
            is_default:1,
            id:item.id
          }
          updateMemberAddress(params).then(res=>{
            console.log(res);
            if(res.data.status=='y'){
              that.getList();
            }  
          }).catch(err=>{
            console.log(err)
          })
        }
      },
      editAddress:function(item){
        this.$store.commit('address',item);
        this.$router.push({path:'/addAddress'})
      },
      deleteAddress:function(item){
        var that=this;
        var userInfo=this.userInfo;
        this.$layer.dialog({
          title: ['提示'], // 第一个是标题内容  第二个是标题栏的style(可以为空) 
          content: '确定要删除该记录吗？',
          contentClass: 'className',
          btn: ['取消','确定'],
          })
            // 如果有btn 
       .then(function (res){
          let position = res === 0 ? false : true
          console.log(position);
          if(position){
            deleteMemberAddress({
              username: userInfo.phone,
              access_token: userInfo.access_token,
              shop_type: 6,
              address_id: item.id
            }).then(res=>{
              if(res.data.status=='y'){
                that.getList();
                that.$layer.toast({
                  icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                  content: '删除成功',
                  time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                })
              }
            })
          }
        })
        return; 
      },
      getList:function(){
        var userInfo=this.userInfo;
        var that=this;
        getMemberAddress({
          username: userInfo.phone,
          access_token: userInfo.access_token,
          shop_type: 6,
        }).then(res=>{
          console.log(res)
          if(res.data.status=='y'){
            var list=[];
            res.data.result.map(function(val,index,arr){
              list.push({
                id: val.id,
                name: val.full_name,
                phone: val.tel,
                province:val.prov_str,
                city:val.city_str,
                area:val.area_str,
                town:val.town_str,
                detailed: val.address,
                isDefault: val.is_default,
                prov_n:val.prov,
                city_n:val.city,
                area_n:val.area,
                town_n:val.town
              })
            })
            that.addressList=list;
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
.address-list{
  padding-bottom: 120px;
}
.address-item{
  background-color: #fff;
  width: 100%;
  margin-top:20px;
}
.address-top{
  width: 100%;
  box-sizing: border-box;
  padding:25px;
  border-bottom: 1px solid #efefef;
}
.address-user{
  width:700px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  font-size: 35px;
}
.address-detail{
  width: 700px;
  font-size: 30px;
  color: #666;
  padding:10px 0;
}
.address-bottom{
  width: 100%;
  padding:0 25px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 90px;
}
.address-default img{
  width: 36px;
  height: 36px;
  vertical-align: middle;
}
.address-right{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 280px;
}
.address-right img{
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.address-bottom span{
  height: 90px;
  line-height: 90px;
}
.zk{
  display: inline-block;
  margin-left: 10px;
}
.add{
  background-color: #ff4e25;
  width:700px;
  height: 90px;
  border-radius: 10px;
  color:#fff;
  font-size: 30px;
  position: fixed;
  bottom:20px;
  left:25px;
  line-height: 90px;
  text-align: center;
}
.no-address-box img{
  width:200px;
  height:200px;
  margin:170px auto 0;
  display: block;
}
.no-address-box p{
  text-align:center;
  color:#666;
  font-size:30px;
  margin-top: 50px;
}
</style>



