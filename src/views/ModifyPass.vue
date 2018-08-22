<template>
    <div class="modify-pass">
        <div>
          <span>原密码:</span>
          <input type="password">
      </div> 
      <div>
          <span>新密码:</span>
          <input type="password" v-model="newPass">
      </div>
      <div>
          <span>新密码确认:</span>
          <input type="password" v-model="reNewPass">
      </div>
      <button @click='resetPassClick'>确认修改</button>
    </div>
</template>
<script>
export default {
  name: "ModifyPass",
  components: {

  },
  data() {
    return {
        newPass:"",
        reNewPass:""
    };
  },
  computed: {
  },
  methods: {
    pageInit(){

    },
    resetPassClick(){
        if(this.newPass===this.reNewPass){
            alert('新旧密码不一致')
            return
        }
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
