import App from '../App'
export default [
  {
    path: '/',
    component: App, // 顶层路由，对应index.html
    children: [ // 二级路由。对应App.vue
      {
        path: '/detail/:id',
        component: resolve => require(['../page/detail'], resolve),
        meta: {auth: true}
      }, {
        path: '/detail/res/:id',
        component: resolve => require(['../page/detail/res'], resolve),
        meta: {auth: true}
      }, {
        path: '/detail/share/:id/:uid',
        component: resolve => require(['../page/detail/res-share'], resolve),
        meta: {auth: true}
      }, {
        path: '/detail/friend/:id',
        component: resolve => require(['../page/detail/friend'], resolve),
        meta: {auth: true}
      }, {
        path: '/topic/:id',
        component: resolve => require(['../page/topic'], resolve)
      }, {
        path: '/noques/:id',
        component: resolve => require(['../page/detail/noques'], resolve)
      }, {
        path: '/login',
        component: resolve => require(['../page/login'], resolve)
      }
    ]
  },
  {
    path: '*',
    component: resolve => require(['../page/404'], resolve)
  }
]

