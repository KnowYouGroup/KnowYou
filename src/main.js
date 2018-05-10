// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/'
import routes from '@/router'
import vueTap from 'v-tap' // 移动端专用
import FastClick from 'fastclick' // 移动端专用
// import * as filters from '@/config/filter'
import '@/config/rem.js'  // 移动端viewport设置
import {cookie} from '@/config/mUtils'
import axios from 'axios'
Vue.prototype.$http = axios
// 暂时屏蔽请求拦截
axios.interceptors.response.use((res) => {
  console.log('res ===', res)
  let status = res.status
  let statusText = res.statusText || 'error'
  if ((status >= 200 && status < 300) || status === 304) {
    if (res.data && typeof res.data === 'object' && res.data.stateCode && res.data.stateCode === -2) {
      // removeCookie('uID')
      location.pathname = '/login'
      location.hash = '#/login'
    }
    return res
  } else {
    routes.push({path: '/404', query: {code: res.status}})
    var error = new Error(statusText)
    error.response = res
    throw error
  }
}, (err) => {
  router.push({path: '/404', query: {code: 'X10021'}})
  return Promise.reject(err)
})

// import './mock/index'  模拟数据 开发阶段使用
// Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
Vue.use(vueTap)
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body)
  }, false)
}

if (process.env.NODE_ENV !== 'development' && !/debug/i.test(window.location.search)) {
  window.console.log = function () {}
}
Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  strict: process.env.NODE_ENV !== 'production'
})
// 用户登录过滤器
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    // if (store.getters.authorizd) { // 已经登陆
    if (cookie('uID') && cookie('pVersion') === '111609') {
      next()
    } else {
      cookie('LoginUrlReferrer', to.fullPath)
      next({path: '/login'})
      // next({path: '/login', query: {referrer: to.fullPath}})
    }
  } else {
    next()
  }
})
new Vue({
  router,
  store
}).$mount('#app')
