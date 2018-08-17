import Vue from 'vue'
// import Error from './Error'
import App from './App'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import router from './router';
import store from './store';


window.$ = $
process.version = "8.11.1"

//ladda圈圈插件
import VueLadda from 'vue-ladda'
Vue.component('vue-ladda', VueLadda)

//这是什么，不知道，请打个备注
Vue.config.productionTip = false


//判断是否登录跳转路由
router.beforeEach(function (to, from, next) {
  console.log(this)
  // const nextRoute = ['/dw', '/fund/history', '/trade/history', '/usercenter'];
  // const loginNextRoute = ['/login', '/register', '/forgotpassword', '/resetpassword'];
  // //跳转至上述页面  
  // if(!localStorage.getItem('islogin')){
  //     // router.push({ path: "/" });
  //     if (nextRoute.indexOf(to.path) >= 0) {
  //       router.push({ path: '/login' })
  //     }
  // }
  // else{
  //   if (loginNextRoute.indexOf(to.path) >= 0) {
  //     router.push({ path: "/" });
  //   } 
  // }
  next();
});



/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
window.global = {}
global.vm = vm