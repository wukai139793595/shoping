<template>
	<div class="tab-bar">
		<ul class="tab-list">
			<li class="tab-item" v-for='(item,index) in list' :key='index'>
				<router-link :to="item.url">
					<img :src="item.select" v-if='cur==item.text' alt="">
					<img :src="item.unselect" v-else alt="">
					<p :class='item.text==cur?"active":""'>{{item.title}}</p>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
  export default{
	props:{
		cur:{
			type:String,
			default:'index'
		}
	},
	data(){return{
		list:[
			{
				title:'首页',
				text:'index',
				select:require('../assets/img/icon_index_on@2x.png'),
				unselect:require('../assets/img/icon_index_un@2x.png'),
				url:'/index'
			},
			{
				title:'购物车',
				text:'shopCar',
				select:require('../assets/img/icon_shop_car_on@2x.png'),
				unselect:require('../assets/img/icon_shop_car_un@2x.png'),
				url:'/shopCar'
			},
			{
				title:'消息',
				text:'news',
				select:require('../assets/img/icon_news_on@2x.png'),
				unselect:require('../assets/img/icon_news_un@2x.png'),
				url:'/news'
			},
			{
				title:'我的',
				text:'my',
				select:require('../assets/img/icon_my_on@2x.png'),
				unselect:require('../assets/img/icon_my_un@2x.png'),
				url:'/my'
			}
		]
	}},
	methods:{
		toMy:function(){
			//从本地获取userId，查看是否登录
			console.log('toMy被调用')
			var userID =localStorage.getItem("userID");
			if(userID!=null && userID !=undefined){
				this.$router.push({path:'/My'})
			}else{
				this.$router.push({path:'Login'})
			}
		}
	}
  }
</script>

<style scoped>
	.tab-bar{
		position: fixed;
		bottom:0;
		left: 0;
		width: 100%;
		height: 100px;
		border-top:1px solid #bababa;
		box-sizing: border-box;
		padding-top: 10px;
		background-color: #fff;
		z-index: 100;
	}
	.tab-list{
		width:600px;
		margin:0 auto;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
	}
	.tab-item p{
		font-size: 24px; /*px*/
		color: #bababa;
	}
	.tab-item img{
		width: 50px;
		height: 50px;
		margin:0 auto;
		display: block;
	}
	p.active{
		color: #ff4e25;
	}
</style>
