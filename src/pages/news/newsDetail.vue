<template>
    <div class="container">
        <div v-html="content"></div>
    </div>
</template>
<script>
export default {
    data(){return{
        content:''
    }},
    created:function(){
    this.content=this.$store.state.newsDetail; 
    }
}
</script>

