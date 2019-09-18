<template>

<div>   
    <tab-bar :cur='cur'></tab-bar>
    <scroll class="wrapper-search"
            :data="list"
            :pullup="pullup"
            @scrollToEnd="getNews">
        <div class='news-all-box'>
            <div v-if='list.length>0'>
                <div class='news-item' v-for='(item,index) in list' :key='index'>
                    <p class='time'><span>{{item.type}}</span><span>{{item.time}}</span></p>
                    <p class='intro'>{{item.Introduction}}</p>
                    <p class='chakan' @click='toDetail(item)' >查看详情 <img src='../../assets/img/icon_more@2x.png'/></p>
                </div>
            </div>
            <div v-else class="no-news">
                <img src='../../assets/img/734239300542180869.png'/>
                <p>~暂无消息~</p>
            </div>
        </div>
    </scroll>
</div>
</template>

<script>
import TabBar from '../../components/TabBar.vue'
import {queryMemberMessage} from '../../api/api.js'
import BScroll from 'better-scroll'
import scroll from '../../components/scroll.vue'
import {unixTimestamp} from '../../utils.js'

export default {
    data(){return{
        cur:'news',
        pullup:true,
        page:1,
        allPage:1,
        pageSize:10,
        list:[]
    }},
    created:function(){
        var userInfo= JSON.parse(localStorage.getItem('userInfo')) || {};
        this.userInfo=userInfo;
        this.getNews();
    },
    methods:{
        toDetail:function(val){
            console.log(val);
            this.$store.commit('newsDetail',val.content);
            this.$router.push({ name:'newsDetail'});
        },
        getNews:function(){
            if(this.page>this.allPage) return;
            var that=this;
            var userInfo=this.userInfo;
            var page=this.page;
            var pageSize=this.pageSize;
            queryMemberMessage({
                username: userInfo.phone,
                access_token: userInfo.access_token,
                shop_type: 6,
                page: page,
                pagesize: pageSize,
            }).then(res=>{
                console.log(res);
                if(res.data.status=='y'){
                    res.data.result.map(function(val,index,arr){
                        var type='';
                        switch(val.type){
                            case '0':
                                type='系统消息';
                                break;
                            case '1':
                                type='项目关注';
                                break;
                            case '2':
                                type='项目报名';
                                break;
                            case '3':
                                type='项目点赞';
                                break;
                            case '4':
                                type='系统通知';
                                break;
                        }
                        that.list.push({
                            id: val.id,
                            type: type,
                            time: unixTimestamp(val.create_time),
                            Introduction: val.title,
                            content: val.content
                        })
                    })
                    this.page=this.page*1+1;
                    this.allPage=res.data.all_rows;
                }else{
                    that.$layer.toast({
                        icon: 'icon-check', // 图标clssName 如果为空 toast位置位于下方,否则居中 
                        content: res.data.info,
                        time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒 
                    }) 
                }
            })
        },
    },
    components:{
        'tab-bar':TabBar,
        'scroll':scroll
    },
}
</script>

<style scoped>
.news-all-box{
    padding-bottom: 120px;
}
.news-item{
  width:700px;
  background-color: #fff;
  border-radius: 8px;
  margin:20px auto 0;
}
.news-item .time{
  font-size: 24px;
  width: 100%;
  box-sizing: border-box;
  padding:20px 20px;
  color: #999;
  display:flex;
  flex-wrap:nowrap;
  justify-content: space-between;
  border-bottom: 2px solid #f4f4f4;
}

.news-item .intro{
  width: 100%;
  box-sizing: border-box;
  padding:30px 20px;
}
.news-item .chakan{
  width: 100%;
  box-sizing: border-box;
  padding:20px;
  color: #999;
  font-size: 24px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  border-top: 2px solid #f4f4f4;
}
.news-item .chakan img{
  width: 30px;
  height: 30px;
  display: block;
}
.news-item .chakan:hover{
  background-color: #f4f4f4;
}
.wrapper-search{
    position:fixed;
    width:100%;
    top:0;
    left:0;
    bottom:110px;
}
.no-news img{
  width: 257px;
  height: 245px;
  margin:200px auto 20px;

  border: none;
  display: block;
}
.no-news p{
    font-size: 28px;
  color: #999;
  text-align: center;
}
</style>
