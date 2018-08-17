<template>
  <keep-alive id="app">
	  	<div class="nav">

		</div>
    	<router-view></router-view>
  </keep-alive>
</template>
<script>	
import '@/assets/css/common.less'
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
		//nav权限
		// '$route' (to, from) {
		// 	if (to.name === 'home') {
		// 		// something
		// 	} else if (to.name === 'detail') {
		// 		// something
		// 	}
		// }
	},
}


</script>