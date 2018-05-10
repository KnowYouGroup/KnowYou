<template>
<transition>
  <router-view></router-view>
</transition>
</template>
<script>
import {cookie} from '@/config/mUtils'
import '@/assets/css/base.css'
import '@/assets/css/common.css'
import '@/assets/iconfont/iconfont.css'
export default {
  name: 'app',
  data () {
    return {
    }
  },
  mounted () {
    if (cookie('uID')) { //  && cookie('pVersion') === 'a102601'
      this.getUserInfo() // 获取用户信息
    } else {
      // 未登录时，不是首页和登录页面，记住当前访问页面，以便登录后跳转回来
      if (location.hash && location.hash !== '#/' && location.hash !== '#/login') {
        cookie('LoginUrlReferrer', '#' + location.hash.split('#')[1], {expires: new Date(Date.parse(new Date()) + 1000 * 60 * 60)})
      }
      // 未登录访问首页，跳到登录页面
      this.$router.push('/login')
    }
  },
  methods: {
    getUserInfo () {
      console.log('STATE: is login')
      this.$router.push('/login?logined=true')
    }
  }
}
</script>
<style>
</style>
