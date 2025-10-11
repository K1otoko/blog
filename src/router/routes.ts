import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  //预览页面
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/views/homeView.vue'),
  }, //后台管理页面
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "home" */ '@/admin/adminHome.vue'),
    children: [
      {
        path: '/admin',
        redirect: '/admin/home',
      },
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "home' */ '@/admin/pages/homeView.vue'),
      },
      {
        path: 'article',
        component: () => import(/* webpackChunkName: "home' */ '@/admin/pages/articleView.vue'),
      },
      {
        path: 'category', //分类管理
        component: () => import(/* webpackChunkName: "home' */ '@/admin/pages/categoryView.vue'),
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "home' */ '@/admin/pages/userView.vue'),
      },
      {
        path: 'comment',
        component: () => import(/* webpackChunkName: "home' */ '@/admin/pages/commentView.vue'),
      },
      {
        path: 'setting',
        component: () => import(/* webpackChunkName: "home' */ '@/admin/pages/settingView.vue'),
      },
    ],
  },
  //login页面
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "home" */ '@/auth/loginView.vue'),
  },
]
export default routes
