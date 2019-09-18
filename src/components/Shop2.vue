<template>
    <div class='shop2-item'>
        <div class='shop2-left'><img :src='shopInfo.img'/></div>
        <div class='shop2-right'>
            <p class='shop2-title'>{{shopInfo.title}}</p>
            <!-- <p class='shop2-model'>规格：{{model}}</p> -->
            <p class='shop2-price'>¥{{shopInfo.price}}</p>
            <p class='shop2-count'>x{{shopInfo.count}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props:['shopInfo'],
}
</script>

<style scoped>
.shop2-item{
  width: 700px;
  margin:20px auto;
  height: 200px;
  background-color: #fff;
  box-sizing: border-box;
  padding:20px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  position: relative;
}
.shop2-item .shop2-left{
  width: 180px; 
  height: 160px;
}
.shop2-item .shop2-left img{
  width: 160px;
  height: 160px;
  background-color: #f4f4f4;
}
.shop2-item .shop2-right{
  width: 470px;
  position: relative;
  height: 100%;
}
.shop2-item .shop2-title{
  font-size: 30px;
  padding-top: 5px;
}
.shop2-item .shop2-model{
  font-size: 24px;
  color: #999;
}
.shop2-item .shop2-price{
  font-size: 30px;
  position: absolute;
  bottom: 0;
  left: 0;
}
.shop2-item .shop2-count{
  font-size: 30px;
  color: #999;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>


