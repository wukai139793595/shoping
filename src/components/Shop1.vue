<template>
    <div class='shop-item'>
        <div class='shop-top'>
            <img :src='shopInfo.img'/>
        </div>
        <div class='shop-bottom'>
            <p class='shop-title'>{{shopInfo.title}}</p>
            <p class='shop-price'><span>¥</span>{{shopInfo.price}}</p>
            <!-- <button class='shop-btn' @click.prevent.stop='addCar()'><img src='../assets/img/icon_shop_car@2x.png'/></button> -->
        </div>
    </div>
</template>

<script>
export default {
    props:['shopInfo'],
    methods:{
        addCar:function(){
            var id=this.shopInfo.id;
            this.$emit('indexAddCar',id);
        },
    }
}
</script>

<style scoped>
.shop-item{
  width: 344px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 4px;
  padding:13px 13px 20px;
}
.shop-item .shop-top{
  text-align: center;
  width:100%;
}
.shop-item .shop-top img{
  width: 316px;
  height: 284px;
}
.shop-item .shop-bottom{
  width: 100%;
  position: relative;
  padding-top: 15px;
  height: 130px;
}
.shop-item .shop-bottom .shop-title{
  font-size: 28px; /*px*/
  color: #333;
  word-break: break-all; 
}
.shop-item .shop-bottom .shop-price{
  font-size: 26px; /*px*/
  color: #ff4e25;
  position: absolute;
  bottom: 0;
  left: 0;
}
.shop-item .shop-bottom .shop-price span{
    font-size: 20px; /*px*/
}
.shop-item .shop-bottom .shop-btn{
  background-color: transparent;
  border:none;
  outline: none;
  margin:0;
  padding:0;
  width: 80px;
  height: 80px;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
  line-height: 50px;
}
.shop-item .shop-bottom .shop-btn::after{
  border:none;
  outline: none;
}
.shop-item .shop-bottom .shop-btn img{
  width: 50px;
  height: 50px;
  display: inline-block;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>


