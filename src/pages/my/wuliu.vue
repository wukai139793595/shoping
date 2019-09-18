<template>
    <div>
        <div class="wuliu-header">
            <p>快递公司：{{express_company.name}} ({{express_company.code}})</p>
            <p>快递单号：{{order_delivery_doc.delivery_code}} </p>
        </div>
        <ol class="wuliu-body">
            <li class="wuliu-item" v-for="(item,index) in status_list" :key="index">
                <p>时间：{{item.AcceptTime}}</p>
                <p>状态：{{item.AcceptStation}}</p>
            </li>
        </ol>
    </div>
</template>
<script>
import {queryDeliveryInfo} from '../../api/api.js'
export default {
    data(){return{
       express_company:null,
       userInfo:null,
       status_list:null 
    }},
    created:function(){
        var order_no=this.$route.params.order_no;
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        this.userInfo=userInfo;
        var that=this;
        queryDeliveryInfo({
            username: userInfo.phone,
            access_token: userInfo.access_token,
            shop_type: 6,
            order_no: order_no
        }).then(res=>{
            console.log(res);
            if(res.data.status=='y'){
                that.express_company=res.data.result.express_company;
                that.status_list=res.data.result.status_list;
                that.order_delivery_doc=res.data.result.order_delivery_doc;
            }
        })
    },
    methods:{
    }
}
</script>

<style scoped>
.wuliu-header{
    width: 100%;
    box-sizing: border-box;
    padding: 20px 30px;
    font-size: 30px;
    background-color: #fff;
    margin-bottom: 20px;
}
.wuliu-header p{
    margin-bottom: 10px;
}
.wuliu-body{
    width: 100%;
    box-sizing: border-box;
    padding: 20px 30px;
    background-color: #fff;
    margin-bottom: 20px;
}
.wuliu-body .wuliu-item{
    font-size: 28px;
    padding-bottom: 20px;
    border-left: 2px dashed #999;
}
</style>


