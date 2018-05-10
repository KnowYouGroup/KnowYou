/*
 * 分享组件
 */
<template>
<div class="share-layer" @click="triggerShareLayer">
  <div class="share-tips">
    <p>1.点击右上方按钮<i class="icon-arrow bg-img"></i></p>
    <p>2.点击 <i class="icon-share bg-img"></i> 或 <i class="icon-moment bg-img"></i> 分享</p>
  </div>
</div>
</template>
<script>
import wx from 'weixin-js-sdk'
import {getWXConfig} from 'src/service/getData'
import {cookie} from '@/config/mUtils'
export default {
  data () {
    return {
      uId: '', // 当前用户ID
      isDetailState: false, // 是否详情页状态
      shareConfig: {},
      pageUrl: ''
    }
  },
  props: ['shareData', 'isDetail', 'detailId'],
  computed: {
  },
  mounted () {
    this.uId = cookie('uID') // 分享用户ID
    this.getWXConfigData()
    console.log(this.shareData, 'this.shareDatathis.shareData')
    this.shareConfig = this.shareData || {}
    if (this.isDetail === 'DETAIL') { // 是否详情页状态
      this.isDetailState = true
    }
    console.log('shareConfig', this.isDetail, this.shareConfig)
  },
  methods: {
    // 分享蒙层开关
    triggerShareLayer () {
      document.body.classList.toggle('app-share-layer')
    },
    async getWXConfigData () {
      console.log('AAA', window.location.href.split('#')[0])
      let res = await getWXConfig(window.location.href.split('#')[0])
      console.log('获取微信分享息', res)
      if (location.hash.indexOf('topic') !== -1) {
        this.pageUrl = '话题'
      } else {
        this.pageUrl = '测试'
      }
      console.log(this.pageUrl, '&&&&&&&&&&&&')
      if (res.code !== 200) {
        return
      }
      this.setWXFn(res.data)
    },
    setWXFn (wxConfig) {
      wx.config({
        debug: false,
        appId: wxConfig.appId, // 必填，公众号的唯一标识
        timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
        nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
        signature: wxConfig.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      let shareConfig = {
        title: this.shareConfig.title || '懂你-' + this.pageUrl + '-' + shareConfig.title,
        link: 'http://match.changyou.com/' + location.hash,
        imgUrl: this.shareConfig.imgUrl || 'http://match.changyou.com/static/share.png',
        desc: this.shareConfig.des || '',
        success: function () {
          document.body.classList.remove('app-share-layer')
          // console.log('%csuccess 分享成功', 'color:#00b304')
        },
        cancel: function () {
          document.body.classList.remove('app-share-layer')
          // console.log('%csuccess 分享失败', 'color:#666666')
        }
      }
      console.log(shareConfig.title, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
      let shareTLConfig = {
        title: '懂你-' + this.pageUrl + '-' + shareConfig.title,
        link: shareConfig.link,
        imgUrl: shareConfig.imgUrl,
        desc: shareConfig.desc,
        success: function () {
          document.body.classList.remove('app-share-layer')
          // console.log('%csuccess 分享成功', 'color:#00b304')
        },
        cancel: function () {
          document.body.classList.remove('app-share-layer')
          // console.log('%csuccess 分享失败', 'color:#666666')
        }
      }
      console.log('微信分享日志信息', shareConfig)
      wx.ready(function () {
        wx.onMenuShareAppMessage(shareConfig)
        wx.onMenuShareTimeline(shareTLConfig)
        wx.onMenuShareQQ(shareConfig)
        wx.onMenuShareWeibo(shareConfig)
        wx.onMenuShareQZone(shareConfig)
      })
      wx.error(function (res) {
      })
    }
  },
  watch: {
    // 侧边选中文章
    shareData: function (val) {
      console.log('WATCH shareData', val)
    }
  }
}

</script>
<style>
.share-layer{z-index:-1; position:fixed; left:0; top:0; width:100%; height:100%; color:#fff; background:rgba(0,0,0,.6); opacity:0;
transition:opacity .2s linear 0s;}
.app-share-layer .share-layer{opacity:1;  z-index:99999;
transition:opacity .2s linear 0s;}
.share-tips{float:right; padding:.3rem .3rem 0 0; font-size:.18rem; line-height:.32rem;}
.icon-arrow{width:.3rem; height:.3rem; margin-left:.15rem; display:inline-block; background-image:url(../assets/img/h5Arrow@3x.png);}
.icon-share{width:.3rem; height:.3rem; display:inline-block; background-image:url(../assets/img/h5Share@3x.png); vertical-align:-.04rem;}
.icon-moment{width:.3rem; height:.3rem; display:inline-block; background-image:url(../assets/img/h5Circle@3x.png); vertical-align:-.04rem;}
</style>
