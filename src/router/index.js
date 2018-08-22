import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/views/Index')
const ModifyPass = () => import('@/views/ModifyPass')
const UnlockPass = () => import('@/views/UnlockPass')
const UserManage = () => import('@/views/UserManage')
const UserInfo = () => import('@/views/UserInfo')
const DivisionalManage = () => import('@/views/DivisionalManage')
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
    {
      path: '/usermanage',
      name: 'UserManage',
      component: UserManage
    },
    {
      path: '/modifypass',
      name: 'ModifyPass',
      component: ModifyPass
    },
    {
      path: '/unlockpass',
      name: 'UnlockPass',
      component: UnlockPass
    },
    {
      path: '/userinfo',
      name: 'UserInfo',
      component: UserInfo
    },
    {
      path: '/divisionalmanage',
      name: 'DivisionalManage',
      component: DivisionalManage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})