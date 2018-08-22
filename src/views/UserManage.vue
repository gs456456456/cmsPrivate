<template>
    <div class="user-manage">
      <div class="h-title">用户管理</div>
        <div class="h-account flex-row">
            <div>
                <span>用户账号:</span>
                <input type="text">
            </div> 
            <div>
                <span>用户姓名:</span>
                <input type="text">
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
                <input type="text">
            </div> 
            <div>
                <span>手机号:</span>
                <input type="text">
            </div> 
        </div>
        <div class="btn-group">
            <button>用户查询</button>
            <button @click="addUserInfo">用户增加</button>
            <button @click="updateUserInfo">用户更新</button>
            <button @click="delectUserInfo">用户删除</button>
        </div>
        <div class="h-userinfo">
            <table border="1">
                <tr>
                    <th>选择</th>
                    <th>用户姓名</th>
                    <th>用户账号</th>
                    <th>部门</th>
                    <th>邮箱</th>
                    <th>手机账号</th>
                </tr>
                <tr v-for="item in test" :key="'person'+index">
                    <td><input type="radio" name="people" @click="userSelectFunc(item)"></td>
                    <td>{{item.account}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.divisional}}</td>
                    <td>{{item.email}}</td>
                    <td>{{item.phone}}</td>
                </tr>
                <!-- <tr>
                    <td><input type="radio" name="people"></td>
                    <td>用户名</td>
                    <td>账号状态</td>
                </tr> -->
            </table>
        </div>
    </div>
</template>
<style type="text/less"  lang="less" scoped>  

</style>
<script>
import HDropdown from '@/components/HDropdown'
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "UserManage",
  components: {
      HDropdown:HDropdown
  },
  data() {
    return {
      divisionalConf:{
        text:['有效','锁定']
      },
      test:[{
          account:"",
          name:"aaa",
          divisional:"aaa",
          email:"aaa",
          phone:"aaa"}],
      userInfoUpdate:{
        ifSelect:false,
        selectInfo:{
          account:"",
          name:"",
          divisional:"",
          email:"",
          phone:""
        }
      },
      userInfoDelete:{
        ifSelect:false,
        selectInfo:{
          account:"",
          name:"",
          divisional:"",
          email:"",
          phone:""
        }
      }
    };
  },
  computed: {
  },
  methods: {
    ...mapMutations([
        "setUserInfoCache",
        "setUserRouterBefore"
    ]),
    pageInit(){

    },
    userSelectFunc(item){
      this.userInfoUpdate.ifSelect=true
      this.userInfoDelete.ifSelect=true
      this.setUserInfoCache(item)
    },
    addUserInfo(){
      this.setUserRouterBefore('addUser')
      this.jumpUserInfo()
    },
    updateUserInfo(){
      if(!this.userInfoUpdate.ifSelect){
        alert('请选择一条记录！')
        return
      }
      this.setUserRouterBefore('updateUser')
      this.jumpUserInfo()
    },
    delectUserInfo(){
      if(!this.userInfoDelete.ifSelect){
        alert('请选择一条记录！')
        return
      }
    },
    jumpUserInfo(){
      this.$router.push('/userinfo')
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
