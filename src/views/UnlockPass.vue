<template>
    <div class="unlock-pass">
        <div class="h-title">账号解锁</div>
        <div class="h-account flex-row">
            <div>
                <span>用户名:</span>
                <input type="text">
            </div> 
            <div class="flex-row">
                <span>账号状态:</span>
                <h-dropdown
                    :text="accountStatusConf.text"
                >
                </h-dropdown>
            </div>
        </div>
        <div class="btn-group">
            <button>查询</button>
            <button>密码解锁</button>
            <button>密码重置</button>
        </div>
        <div class="h-userinfo">
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
        </div>
    </div>
</template>
<style type="text/less"  lang="less" scoped>  
    .h-account{

    }
</style>
<script>
import HDropdown from '@/components/HDropdown'
export default {
  name: "UnlockPass",
  components: {
      HDropdown:HDropdown
  },
  data() {
    return {
        accountStatusConf:{
            text:['有效','锁定']
        }
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
