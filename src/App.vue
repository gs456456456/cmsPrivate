<template>
  <div id="app">
	  	<!-- <div class="nav">
			
		</div> -->
    	<router-view></router-view>
  </div>
</template>
<script>	
// import '@/assets/css/common.less'
import '@/assets/css/nav.less'
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
export default {
name: 'App',
	data () {
		return {

		}
	},
	computed: {

	},
	created () {
		this.initData();
	},
	mounted () {

	},
	methods: {
		...mapMutations(['setIsLogin']),
		...mapActions([
			''
		]),
		initData(){
			console.log(1)
		},
		initLogin(){
			
		}
	},
	watch: {
		//监听是否已登录
		'$route' (to, from) {
			console.log(to.name)
			if (to.name === 'Index') {
				if(localStorage.getItem('islogin',true)){
					this.$router.push('/userinfo')
				}
			}
		}
	},
}
</script>
<style>

</style>
