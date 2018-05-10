<template>
<div class="wrapper-res" v-load-more="loaderMore">
  <div class="section mod-session-item" v-if="ffData && ffData.length">
    <div class="match-list">
      <ul>
        <router-link tag="li" v-for="item in ffData" :to="'/detail/share/' + detailId + '/' + item.userId" :key="item.userId">
          <img :src="item.avatar">
          <div class="friend-info">
            <span>{{item.nickname}}<em>测试匹配度{{item.matchNum || '0'}}%</em></span>
            <p><b>{{item.title}}: </b>{{item.des}}</p>
          </div>
        </router-link>
      </ul>
    </div>
    <div v-if="showLoading" class="mod-loading"><i class="icon-loading"></i> <span>正在加载</span></div>
    <div v-if="touchend" class="mod-loadend"><span>没有更多了</span></div>
  </div>
  <share-layer v-if="shareData.title" :shareData="shareData" :detailId="detailId"></share-layer>
</div>
</template>

<script>
import shareLayer from 'src/components/share' // 审批组件
import {getQuestionCategoryDetail, getFriendQuestionMatchResultList} from 'src/service/getData'
import {cookie} from '@/config/mUtils'
import {loadMore} from '@/config/mixin'
export default {
  data () {
    return {
      preventRepeatReuqest: false, // 到达底部加载数据，防止重复加载
      showLoading: true, // 显示加载动画
      touchend: false, // 没有更多数据
      uId: '', // 当前用户ID
      detailId: '',
      resData: {}, // 测试结果
      categoryList: {}, // 更多分类测试
      shareData: {},
      ffData: []
    }
  },
  mixins: [loadMore],
  components: {
    shareLayer
  },
  mounted () {
    this.uId = cookie('uID')
    console.log('this.uId', this.uId)
    this.detailId = this.$route.params.id
    this.initData()
  },
  methods: {
    initData () {
      this.getDetail() // 获取分享
      this.getFriendDetailRes()
    },
    async getDetail () { // 分享用
      let res = await getQuestionCategoryDetail(this.detailId)
      console.log('分享', res)
      if (res.stateCode !== 1) {
        return
      }
      // res.data.shareId = this.userId
      this.shareData = res.data
      document.title = res.data.title
    },
    async getFriendDetailRes () { // 获取好友测试匹配度
      let res = await getFriendQuestionMatchResultList(this.detailId, '2', '-1')
      console.log('获取好友测试匹配度', res)
      if (res.stateCode !== 1) {
        return
      }
      this.ffData = res.data.list
    },
    async loaderMore () {
      console.log('ass')
      if (this.touchend) {
        return
      }
      // 防止重复请求
      if (this.preventRepeatReuqest) {
        return
      }
      this.showLoading = true
      this.preventRepeatReuqest = true
      let tmpEndData = this.ffData[this.ffData.length - 1] || {}
      console.log('lllllllllllllllllllllllllLLLL', this.ffData.length)
      let res = await getFriendQuestionMatchResultList(this.detailId, '2', tmpEndData.userId)
      console.log('==============', res)
      if (res.stateCode !== 1) {
        this.showLoading = false
        this.preventRepeatReuqest = false
        return
      }
      this.showLoading = false
      this.ffData = [...this.ffData, ...res.data.list]
      if (res.data.list.length < 1) {
        this.touchend = true
        return
      }
      this.preventRepeatReuqest = false
    },
    // 分享蒙层开关
    triggerShareLayer () {
      document.body.classList.toggle('app-share-layer')
    }
  }
}
</script>
<style>
@import '../../assets/css/detail-res.css';
</style>
