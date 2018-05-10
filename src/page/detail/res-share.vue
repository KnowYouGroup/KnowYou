<template>
<div class="wrapper-res">
  <div class="top-section share-res-box">
    <div class="top-section-tit">{{shareData.des}}</div>
    <div class="img-box bg-img" :style="{'backgroundImage': 'url(' + resData.img + ')'}">
      <router-link class="btn-retest" :to="`/detail/${detailId}`"><i class="iconfont">&#xe61e;</i>重测</router-link>
    </div>
    <h2>{{resData.title}}</h2>
    <p :style="{overflow: flag ? 'visible' : 'hidden', height: flag ? 'auto' : '.45rem'}" :class="{'testElClass': flag}">{{resData.des}}</p>
    <div class="linear" ref='linear' v-if="!flag"></div>
    <div @click="isAppear" :class="{'is-appear': true, 'testElClass': flag}"><span>点击查看完整结果</span></div>
    <div class="match-list res-match-content"  v-if="friendMatch && friendMatch.length">
      <div class="res-match-tit tc"><span>TA和你</span></div>
      <ul>
        <li v-for='(item, key) in friendMatch' :key='key'>
          <img :src="item.avatar" alt="">
          <div class="friend-info">
            <span>{{item.nickname}}<em>测试匹配度{{item.matchNum}}%</em></span>
            <p><b>{{item.title}}: </b>{{item.des}}</p>
          </div>
        </li>
      </ul>
    </div>
    <router-link class="orang-button" :to="`/detail/res/${detailId}`">查看我的结果</router-link>
    <!-- <router-link v-if="!resData.matchUserId" class="orang-button" :to="`/detail/${detailId}`">我也要测</router-link> -->
    <a class="orang-button" :href="browserUrl">更多趣味测试</a>
  </div>

  <div class="section mod-session-item" v-if="categoryList && categoryList.list && categoryList.list.length">
    <h3 class="mod-session-tit">更多同类测试</h3>
    <div class="more-test">
      <ul class="clearfix">
        <li v-for="(item, index) in categoryList.list" class="more-test-item" :key="index">
          <a v-if="index % 3 === 0" class="test-content bg-img" :style="{'backgroundImage': 'url(' + item.imgUrl + ')'}" :href="browserUrl">
            <div class="test-content-info">
              <h4 class="f-ellipsis">{{item.title}}</h4>
              <p class="f-ellipsis">{{item.des}}</p>
              <span class="more-test-tag">应用专享</span>
            </div>
          </a>
          <router-link v-else class="test-content bg-img" :style="{'backgroundImage': 'url(' + item.imgUrl + ')'}" :to="`/detail/${item.categoryId}`">
            <div class="test-content-info">
              <h4 class="f-ellipsis">{{item.title}}</h4>
              <p class="f-ellipsis">{{item.des}}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
  <share-layer v-if="shareData.title" :shareData="shareData" :detailId="detailId"></share-layer>
</div>
</template>

<script>
import shareLayer from 'src/components/share' // 审批组件
import {getQuestionCategoryDetail, getInterestQuestionResult, getSameQuestionCategoryList, getFriendQuestionMatchResultList} from 'src/service/getData'
import {cookie} from '@/config/mUtils'
import {browsers} from '../../config/mUtils'
export default {
  data () {
    return {
      uId: '', // 当前用户ID
      shareUId: '', // 分享着ID
      detailId: '',
      resData: {}, // 测试结果
      categoryList: {}, // 更多分类测试
      shareData: {},
      flag: false,
      friendMatch: {},
      browserUrl: browsers()
    }
  },
  components: {
    shareLayer
  },
  mounted () {
    this.uId = cookie('uID')
    this.detailId = this.$route.params.id
    this.shareUId = this.$route.params.uid
    this.initData()
    // if (this.uId === this.shareUId) {
    //   this.$router.push(`/detail/res/${this.detailId}`)
    // } else {
    //   this.initData()
    // }
  },
  methods: {
    initData () {
      this.getDetailRes()
      this.getSameQuestionCategoryList()
      this.getFriendMatch()
    },
    async getDetail (userRes) { // 分享用
      let res = await getQuestionCategoryDetail(this.detailId)
      console.log('分享', res)
      if (res.stateCode !== 1) {
        return
      }
      // res.data.shareId = this.uId
      this.shareData = {
        des: `最符合我的竟然是${userRes.title}，你呢？`,
        imgUrl: userRes.img || res.data.imgUrl,
        title: res.data.des
      }
      console.log('SSSSSSSSSSSSSSSSSS', this.shareData)
      document.title = res.data.des || res.data.title
    },
    async getDetailRes () { // 获取做题结果
      let res = await getInterestQuestionResult(this.detailId, this.shareUId)
      console.log('做题结果', res)
      if (res.stateCode !== 1) {
        return
      }
      // if (res.data.isQuestion === '0' || res.data.isQuestion === 0) {
      //   this.$router.push(`/detail/${this.detailId}`)
      //   return
      // }
      this.resData = res.data
      this.getDetail(res.data) // 获取分享
    },
    async getFriendMatch () { // 获取好友测试题匹配结果列表
      let res = await getFriendQuestionMatchResultList(this.detailId, 1, this.shareUId)
      console.log('好友测试题匹配结果', res)
      if (res.stateCode !== 1) {
        return
      }
      this.friendMatch = res.data
    },
    async getSameQuestionCategoryList () { // 更多同类测试
      let res = await getSameQuestionCategoryList(this.detailId)
      console.log('更多同类测试', res)
      if (res.stateCode !== 1) {
        return
      }
      this.categoryList = res.data
    },
    // 分享蒙层开关
    triggerShareLayer () {
      document.body.classList.toggle('app-share-layer')
    },
    isAppear () {
      this.flag = !this.flag
    }
  }
}
</script>
<style>
@import '../../assets/css/detail-res.css';
.res-match-content{width:100%; padding:.1rem 0 .05rem;}
.res-match-content li{padding:0;}
.res-match-tit{margin:.1rem 0 0; border-top:.01rem solid #ccc; line-height:.22rem;}
.res-match-tit span{position:relative; display:inline-block; background-color:#fff; padding:0 .05rem; top:-.11rem; color:#000;
}
.top-section p{position: relative; width: 100%;height: .45rem;overflow: hidden;}
.linear{width: 100%;height: .4rem;background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0),rgba(255, 255, 255, 255));position: relative;top:-.4rem;left:0;}
.is-appear{ width: 100%;height: .2rem;line-height: .2rem;text-align: center;color: #598bff;margin-top: -.3rem;}
.testElClass{margin-top: 0;}
</style>
