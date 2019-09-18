<template>
    <div class="count_group">        
        <div class="count_btn" @click="tapBtn('minus')">            
            <img src="../assets/img/icon_jian1.png" v-if="count1<=min"/>           
            <img src="../assets/img/icon_jian2.png" v-else/>       
        </div>        
        <div class="count_input">            
            <input type='string' v-model="count1" />      
        </div>        
        <div class="count_btn" @click="tapBtn('plus')">            
            <img src="../assets/img/icon_jia.png" v-if="count1>=max"/>            
            <img src="../assets/img/icon_jia.png" v-else/>       
        </div>    
    </div>    
</template>

<script>
export default {
    props:{
        count:{
            required: true
        },
        max:{
            default:100
        },
        min:{
            default:1
        },
        id:{
            default:''
        }
    },
    data(){return{
        count1:this.count
    }},
    watch:{
        count:function(){},
    },
    methods:{
        tapBtn:function(val){
            const _tar=val;            
            const _max=this.max;            
            const _min=this.min;            
            let _count=this.count1;       
            if(_tar=='plus'){                
                if(_count<_max){                    
                    _count++;                
                }            
            }else{                
                if(_count>_min){                    
                    _count--;                
                }           
            };
            this.count1=_count;
            var data={
                count:_count,
                id:this.id
            }
            this.$emit('getCount',data);                
        }
    }
}
</script>

<style scoped>
.count_box {   
  width: 200px; 
  height: 50px;
  box-sizing: border-box;
}   
   .count_group {  
  width: 200px;      
  display: flex; 
  box-sizing: border-box;       
  justify-content: space-between;        
  align-items: center;        
  padding: 0;        
  height: 50px;               
  border-radius: 4px; 
}       
  .count_group  .count_btn {            
  width:50px;            
  height: 50px; 
  background-color: #f5f5f5; 
  position: relative;             
}  
  .count_group  .count_btn img{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}      
  .count_group  .count_input{           
  width: 100px;
  height: 50px;
  line-height: 50px;
  border-top:2px solid #e6e6e6;
  border-bottom:2px solid #e6e6e6;
  box-sizing: border-box;
  border-left:1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
}           
  .count_group  .count_input input{                
  text-align: center;                
  font-size: 36px;  
  height: 100%;  
  width: 100%;       
}        

</style>


