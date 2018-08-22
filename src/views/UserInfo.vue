<template>
    <div class="unlock-pass">
        <div class="h-title">用户信息维护</div>
        <div class="h-account flex-row">
            <div>
                <span>用户账号:</span>
                <input type="text" v-model="getUserInfoCache.account">
            </div> 
            <div>
                <span>用户姓名:</span>
                <input type="text" v-model="getUserInfoCache.name">
            </div> 
            <div class="flex-row">
                <span>部门:</span>
                <h-dropdown
                    :text="divisionalConf.text"
                >
                </h-dropdown>
            </div>
            <div>
                <span>邮箱:</span>
                <input type="text" v-model="getUserInfoCache.email">
            </div> 
            <div>
                <span>手机号:</span>
                <input type="text" v-model="getUserInfoCache.phone">
            </div> 
        </div>
        <div class="btn-group">
            <button>确认</button>
            <button>退出</button>
        </div>
        <!-- <div class="h-userinfo">
            <table border="1">
                <tr>
                    <th>选择</th>
                    <th>用户名</th>
                    <th>账号状态</th>
                </tr>
                <tr>
                    <td>选择</td>
                    <td>用户名</td>
                    <td>账号状态</td>
                </tr>
            </table>
        </div> -->
    </div>
</template>
<style type="text/less"  lang="less" scoped>  
    .h-account{

    }
</style>
<script>
import HDropdown from '@/components/HDropdown'
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "UnlockPass",
  components: {
      HDropdown:HDropdown
  },
  data() {
    return {
        divisionalConf:{
            text:['有效','锁定']
        }
    };
  },
  computed: {
      ...mapGetters(['getUserInfoCache','getUserRouterBefore'])
  },
  methods: {
    ...mapMutations([
        "setUserInfoCache",
        "setUserRouterBefore"
    ]),
    entranceSolve(){
        if(this.isEmptyObj(this.getUserRouterBefore)||this.getUserRouterBefore==='addUser'){
            this.setUserInfoCache({
                account:"",
                name:"",
                divisional:"",
                email:"",
                phone:""
            })   
        }
    },
    pageInit(){
        //判断是由哪个按钮链接进
        this.entranceSolve()
    }
  },
  created() {
    this.pageInit();
  },
  mounted() {
    
  },
  watch: {
    
  }
};
</script>
