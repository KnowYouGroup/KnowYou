<template>
<div class="wrapper">
  <div class="login-loader"></div>
  <div class="login-tips">登录中 ···</div>
  <button @click="tryLogin">HandleLogin</button>
</div>
</template>
<script>
import {browser, cookie, removeCookie, getQueryString} from '@/config/mUtils'
import {createAndLoginThridUser, getWeixinLoginUserInfo} from 'src/service/getData'
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      browser: {},
      gid: '',
      referrerUrl: ''
    }
  },
  computed: {
    // fql这儿是测试题的逻辑
    ...mapState({
      resData: state => state.questionResult.resData
    })
  },
  mounted () {
    this.referrerUrl = cookie('LoginUrlReferrer') || '/detail/1' // fql这儿做兼容性处理，路由上也做了兼容性处理
    console.log(getQueryString('code'))
    // code在确认微信登录，页面刷新后由参数中带过来的
    this.code = getQueryString('code')
    this.browser = browser()
    this.getDataAndJump()
    // this.tryLogin()
  },
  methods: {
    ...mapActions(['getDetailRes']),
    async getDataAndJump () {
      // await this.getDetailRes({detailId: 1, uId: cookie('uID')}) // fql这儿直接默认是去获取状态
      console.log('this.$route.query==', this.$route.query['logined'])
      if (this.$route.query['logined'] === 'true') {
        // 从首页过来的已登录用户
        this.tryLogin()
      } else {
        // 直接访问登录页面
        this.tryJumpUrl()
      }
    },
    tryJumpUrl () {
      if (cookie('uToken') && cookie('uID') && cookie('pVersion') === 'a102601') {
        this.$router.push(this.referrerUrl)
      } else if (cookie('uID') && cookie('pVersion') === '111609') {
        this.gotoNextPage()
      } else {
        this.matchLogin()
      }
    },
    matchLogin (state) {
      if (this.browser.isMobile && this.browser.WeChat) {
        // 微信登录
        this.WeChatLogin(state)
      } else if (getQueryString('debug')) {
        alert('Test User.')
        this.tryLogin()
      } else {
        this.tryLogin()
//        this.$router.push('/index?baseurl=' + this.referrerUrl)
      }
    },
    WeChatLogin (state) { // 微信授权登录是为了获取用户信息
      if (!this.code || state === 'BS') {
        // 微信登录弹窗，登录后页面刷新，带回code参数，用于后续获取用户信息
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx596e6126ab7242a3&redirect_uri=' + encodeURIComponent(window.location.origin + '/#/login') + '&response_type=code&scope=snsapi_userinfo&state=39f1f71ca2c97794#wechat_redirect'
      } else {
        this.getWeixinLoginUserInfo()
      }
    },
    async getWeixinLoginUserInfo () {
      // 通过code获取用户信息
      let res = await getWeixinLoginUserInfo(this.code)
      console.log(res)
      res = res || {}
      if (res.unionid) {  // unionid为微信用户唯一id
        this.tryLogin(res.unionid, res.nickname)
      } else if (res.errcode === 40001) {
        this.matchLogin('BS')
      }
    },
    async tryLogin (openid, nickname) {
      // 创建临时登录uid，参数为type、uniqueId、questionCategoryId
      openid = openid || '39f1f71ca2c97794'
      let res = await createAndLoginThridUser(1, openid, 1)
      console.log(res, nickname)
      console.log(this.resData, '登录数据')
      if (res.stateCode === 1) { // fql这是跳转的初始化逻辑
        cookie('pVersion', '111609')
        cookie('uID', res.userId)
        // removeCookie('LoginUrlReferrer')
        // location.hash = this.referrerUrl // 修改页面的hash值
        console.log('this.resData===', this.resData)
        this.gotoNextPage()
      } else {
        console.log('登录失效')
      }
    },
    async gotoNextPage () {
      removeCookie('LoginUrlReferrer')
      if (this.referrerUrl.indexOf('topic') !== -1) {
        console.log('跳转到海报页面')
        this.$router.push(this.referrerUrl.split('#')[1])
      } else {
        const questionCategoryId = this.referrerUrl.match(/\d+/g)[0]
        const res = await this.getDetailRes({detailId: questionCategoryId, uId: cookie('uID')}) // fql这儿是用于获取自己的对于这个问题的状态
        if (res.data.isQuestion === '1') {
          this.$router.push(`/detail/share/${questionCategoryId}/${cookie('uID')}`)
        } else {
          const friendId = this.referrerUrl.match(/\d+/g)[1] || 1 // 这儿需要一个别人的
          await this.getDetailRes({detailId: questionCategoryId, uId: friendId}) // fql这儿是获取别人的结果
          this.$router.push(`/detail/noques/${questionCategoryId}`)
        }
      }
    }
  }
}
</script>
<style>
.login-tips{position:absolute; top:50%; left:0; z-index:100; width:100%; height:22px; margin-top:-11px; text-align:center;}
.login-loader{position:absolute; top:50%; left:50%; z-index:100;width: 40px; height: 40px; display:inline-block; margin-left:-20px; margin-top:-60px; padding:0px;border-radius:100%;border:5px solid;
border-top-color:rgba(254, 168, 23, 0.65);
border-bottom-color:rgba(57, 154, 219, 0.65);
border-left-color:rgba(188, 84, 93, 0.95);
border-right-color:rgba(137, 188, 79, 0.95);
-webkit-animation: loader2 2s ease-in-out infinite alternate;
animation: loader2 2s ease-in-out infinite alternate;}
@keyframes loader2 {
   from {transform: rotate(0deg);}
   to {transform: rotate(720deg);}
}
@-webkit-keyframes loader2 {
   from {-webkit-transform: rotate(0deg);}
   to {-webkit-transform: rotate(720deg);}
}
</style>
