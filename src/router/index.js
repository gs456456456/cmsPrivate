import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/views/Index')
// const Login = () => import('@/views/Login')
// const Register = () => import('@/views/Register')
// const Dandw = () => import('@/views/Dandw')
// const Fund = () => import('@/views/Fund')
// const Active = () => import('@/views/Active')
// const Forgot = () => import('@/views/Forgot')
// const Maintenance = () => import('@/views/Maintenance')
// const Reset = () => import('@/views/Reset')
// const Tradehistory = () => import('@/views/Tradehistory')
// const UserCenter = () => import('@/views/UserCenter')
// const Exchange = () => import('@/views/Exchange')
// const Support = () => import('@/views/Support')
// const InvestIndex = () => import('@/views/InvestIndex')
// const InvestRecord = () => import('@/views/InvestRecord')
// const InvestProducts = () => import('@/views/InvestProducts')
// const InvestCollect = () => import('@/views/InvestCollect')

// const ActivityHTBCandy = () => import('@/views/activity/HTB_candy')
// const ActivityHTBBonus = () => import('@/views/activity/HTB_bonus')
// const ActivityICON = () => import('@/views/activity/ICON')
// const ActivityICONNew = () => import('@/views/activity/ICONNew')
// const ActivityIONCCandy = () => import('@/views/activity/IONC_candy')
// const ActivityIONCRank = () => import('@/views/activity/IONC_rank')
// const ActivityEUBCRank = () => import('@/views/activity/EUBC_rank')

// import Index from "@/views/Index.vue";


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: Login
    // },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: Register
    // },
    {
      path: '*',
      redirect: '/'
    }
  ]
})