<template>
<div class='container'>
  <div class='row'>
    <span>收货人</span>
    <input v-model="name" placeholder="请输入收货人姓名"/>
  </div>
  <div class='row'>
    <span>手机号码</span>
    <input v-model="phone" placeholder="请输入手机号码"/>
  </div>
  <div class='area' @click='showCardList()'>
    <span>所在地区</span>
    <div id="trigger5" class="area-select">
        <span v-if='region.length==0' style="color:#757575;">请选择省、市、区</span>
        <span v-else>{{region | toStrings}}</span>
    </div>
    <img src="../../assets/img/icon_more@2x.png" alt="">
  </div>
  <div class='detail'>
    <span>详细地址</span>      
    <textarea v-model="detail" placeholder='请输入详细的地址信息，如道路、门牌号、小区、楼栋号、单元室等'></textarea>
  </div>
  <div class='default'>
    <span>设为默认</span>
    <my-switch v-model="isDefault"></my-switch>
  </div>
  <button class='submit-btn' @click='preserve'>保存</button>
  <div class="mask" v-if='showMask'>
    <div class="mask-box">
      <p class="mask-title">请选择地址</p>
      <p class="mask-select-item"><span v-for='(item,index) in region' :class='selectOn==index?"active":""' @click='changeSelect(index)' :key='index'>{{item.area_name}}</span></p>
      <div class="wrapper" ref="wrapper"> 
        <div v-if='selectOn==0' class="1">
          <p v-for='(item,index1) in prov' :key='index1' :class='item.area_id==ids[1]?"active":""' @click='getAddress(item.area_id,1,index1)'>{{item.area_name}}</p>
        </div>
        <div v-else-if='selectOn==1' class="2">
          <p v-for='(item,index2) in city'  :key='index2'  :class='item.area_id==ids[1]?"active":""' @click='getAddress(item.area_id,2,index2)'>{{item.area_name}}</p>
        </div>
        <div v-else-if='selectOn==2' class="3">
          <p v-for='(item,index3) in area'  :key='index3'  :class='item.area_id==ids[1]?"active":""' @click='getAddress(item.area_id,3,index3)'>{{item.area_name}}</p>
        </div>                   
      </div>
      <span class='close' @click='closeMask()'>×</span>
    </div>
  </div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import Switch from "../../components/Switch"
import {updateMemberAddress,getAreaList} from '../../api/api.js'
import {checkPhone} from '../../utils.js';

export default {
    data(){return{
        id:null,
        name:'',
        phone:'',
        prov:[],
        provIndex:0,
        cityIndex:0,
        areaIndex:0,
        city:[],
        area:[],
        region:[],
        detail:'',
        isDefault:0,
        chineseCities:null,
        ids:[0,0,0,0],
        indexs:[0,0,0,0],
        selectOn:0,
        userInfo:null,
        showMask:false
    }},
    watch:{
      region:function(){
        this.city=this.region[1];
        this.provice=this.region[0];
        this.area=this.region[2];
      },
      isDefault:function(){
        console.log(this.isDefault)
      },
      ids:function(){},
      selectOn:function(){}
    },
    filters:{
      toStrings:function(val){
        var a='';
        val.map(function(value,index,arr){
          a= a+' '+value.area_name
        })
        return a;
      }
    },
    created:function(){
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        this.userInfo=userInfo;
        this.getAddress(0,0,0);
        var item=this.$store.state.address;
        if(item!=null){
          console.log(item)
          document.title='修改地址';
          this.id=item.id;
          this.name=item.name;
          this.phone=item.phone;
          this.region=[
            {
              area_name:item.province,
              area_id:item.prov_n
            },
            {
              area_name:item.city,
              area_id:item.city_n
            },
            {
              area_name:item.area,
              area_id:item.area_n
            }
          ],
          this.detail=item.detailed;
          this.isDefault;
          this.$store.commit('address',null)
        }
    },
    methods:{
      showCardList:function(){
        this.showMask=true;
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.wrapper, {click: true,tap:true})
        })
      },
      closeMask:function(){
        this.showMask=false;  
      },
      changeSelect:function(index){
        this.selectOn=index;
        if(index==0){
        }else if(index==1){
          this.city=this.chineseCities[this.provIndex].child;
        }else if(index==2){
          this.city=this.chineseCities[this.provIndex].child;
          this.area=this.chineseCities[this.provIndex].child[this.cityIndex].child;
        }
      },
      getAddress:function(id,level,index){
        var that=this;
        this.ids[level]=id*1;
        this.indexs[level]=index*1;
        var ids=this.ids;
        var indexs=this.indexs;
        var userInfo=this.userInfo;
        if(level==1){
          this.region=[that.prov[indexs[1]]];
          this.provIndex=index;
        }else if(level==2){
          var region=that.region.slice(0,1);
          region.push(that.city[indexs[2]]);
          this.region=region;
          this.cityIndex=index;
        }else if(level==3){
          var region=that.region.slice(0,2);
          region.push(that.area[indexs[3]]);
          this.region=region;
          this.areaIndex=index;
          return;
        }
        getAreaList({
          username: userInfo.phone,
          access_token: userInfo.access_token,
          shop_type: 6,
          parent_id: id
        }).then(res=>{
          if(res.data.status=='y'){
            if(level==0){
              that.chineseCities=res.data.result;
              that.prov=res.data.result;
            }else if(level==1){
              that.chineseCities[indexs[1]].child=res.data.result;
              that.city=res.data.result;
            }else if(level==2){
              that.chineseCities[indexs[1]].child[indexs[2]].child=res.data.result;
              that.area=res.data.result;
            }
            that.selectOn=level;
          }else{
            that.$layer.toast({
              icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
              content: '请核对输入的信息',
              time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
            })
          }
        })
      },
      preserve:function(){
        var that=this;
        var userInfo=this.userInfo;
        var name=this.name,
            phone=this.phone,
            provice=this.region[0].area_id,
            city=this.region[1].area_id,
            area=this.region[2].area_id,
            detail=this.detail,
            isDefault=this.isDefault,
            id=this.id;
        if(name=='' || !checkPhone(phone) || provice=='' || city=='' || area=='' || detail==''){
          this.$layer.toast({
            icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
            content: '请核对输入的信息',
            time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
          })
          return;
        }
        var params={
          username: userInfo.phone,
          access_token: userInfo.access_token,
          shop_type: 6,
          full_name:name,
          tel:phone,
          prov:provice,
          city:city,
          area:area,
          address:detail,
          is_default:isDefault,
        };
        if(id!=null){
          params.id=id;
        }
        console.log(params)
        updateMemberAddress(params).then(res=>{
          console.log(res);
          if(res.data.status=='y'){
            that.$layer.toast({
              icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
              content: '数据提交成功',
              time: 1000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
            })
            var j=setTimeout(function(){
              that.$router.go(-1);
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
          console.log(err)
        })
      }
    },
    components:{
        'my-switch':Switch
    }
}
</script>
<style scoped>
.row{
  background-color: #fff;
  height: 80px;
  width:100%;
  box-sizing: border-box;
  border-bottom: 1px solid #efefef;
  line-height: 80px;
  padding:0 25px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.row input{
  width:550px;
  height: 98%;
}
.detail{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding:0 25px;
  background-color: #fff;
  border-bottom: 2px solid #efefef;
}
.area{
  height: 80px;
  width: 100%;
  line-height: 80px;
  background-color: #fff;
  box-sizing: border-box;
  padding:0 25px;
  border-bottom: 1px solid #efefef;
  display:flex;
  flex-wrap:nowrap;
  justify-content:space-between;
  position: relative;
}
.area img{
    width: 30px;
    height: 30px;
    position:absolute;
    right: 25px;
    top: 25px;
}
.area .area-select{
    width:550px;
  height: 98%;
}
.detail span{
  height: 80px;
  line-height: 80px;
  display: block;
  width: 140px;
}
.detail textarea{
  height:96px; 
  width:550px;
  padding-top: 10px;
}
.default{
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  padding:20px 25px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.submit-btn{
  height: 90px;
  width: 700px;
  background-color: #ff4e25;
  border-radius: 10px;
  display: block;
  margin:50px auto;
  color: #fff;
  line-height: 90px;
  font-size: 30px;
}
.mask{
  width: 100%;
  height: 100%;
  position:fixed;
  top:0;
  left:0;
  background-color:rgba(0,0,0,0.3);
}
.mask-box{
  position:absolute;
  width:100%;
  height:800px;
  background-color:#fff;
  bottom:0;
  left:0;
}
.mask .active{
  color: red;
}
.mask-title{
  width: 100%;
  box-sizing: border-box;
  height: 100px;
  line-height: 100px;
  padding:0 30px;
  font-size: 36px;
  border-bottom: 2px solid #f4f4f4;
}
.mask .close{
  position: absolute;
  width: 50px;
  height: 50px;
  font-size: 50px;
  color: #999;
  top: 20px;
  right: 10px;
  display: inline-block;
  text-align: center;
  line-height: 50px;
}
.mask-select-item{
  height: 80px;
  line-height: 80px;
  width: 100%;
  box-sizing: border-box;
  padding:0 30px;
  font-size: 30px;
}
.mask-select-item span{
  display: inline-block;
  margin-right: 10px;
}
.mask .wrapper{
  position:absolute;
  width:100%;
  left:0;
  top:180px;
  bottom:0;
  box-sizing: border-box;
  padding:0 30px;
  overflow: hidden;
}
.mask .wrapper p{
  height: 50px;
  line-height: 50px;
}
</style>

