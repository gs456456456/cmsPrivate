<template>
    <div class="dropdown-wrapper">
        <input 
            class="dropdownButton"
            @click="dropdownClick()"
            v-model="text[0]"
            readonly>
            <i class="fa fa-caret-down"></i>
        <ul v-if="dropdownConf.isShow" class="dropdown_ul">
            <li 
                v-for="(item,index) in text"
                @click="dropdownLiClick(item)">
                {{item}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'HDropdown',
    data() {
        return {
            dropdownConf:{
                isShow:false,
            }
        }
    },
    props:['text'],
    methods:{
        dropdownClick() {
            this.dropdownConf.isShow = !this.dropdownConf.isShow;
        },
        dropdownLiClick(item) {
            this.dropdownConf.isShow = false;
            this.text.forEach((v,i,a) => {
                if(v==item){
                    this.text.splice(i,1);
                    this.text.unshift(item)
                }
            });
            this.$emit('input', item)
        }
    },
    mounted() {
        
    }
}
</script>


<style lang="less">
    li{
        list-style: none;
    }
    i{
        margin-left: -20px;
    }
    .dropdown-wrapper{
        position: relative;
        .dropdownButton {
          color: #718a96;
        //   border: 1px solid #16323f;
        //   background-color: #0b1b23;
          i{
            font-size: 20px;
            padding-left:5px;
          }
        }
        .dropdown_ul {
          position: absolute;
        //   border: 1px solid #16323f;
        //   background-color: #0b1b23;
          margin-top: 5px;
          width: 100%;
          li {
            width: 100%;
            padding: 4px 8px;
          }
          li:hover {
            // background-color: #16323f;
          }
        }
      }
</style>
