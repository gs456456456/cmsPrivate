<template>
  <div>
    <div class="h-title">
        现货平台后台管理系统
    </div>
    <div class="login-left">
      <div>
          <span>用户名:</span>
          <input type="text">
      </div> 
      <div>
          <span>密码:</span>
          <input type="password">
      </div>
    </div>
    <div class="login-right">
      <button>登陆</button>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "Index",
  components: {

  },
  data() {
    return {

    };
  },
  computed: {
  },
  methods: {
    pageInit(){

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
