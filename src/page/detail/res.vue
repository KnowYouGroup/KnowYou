<template>
<div class="wrapper-res">
  <div class="top-section">
    <div class="img-box bg-img" :style="{'backgroundImage': 'url(' + resData.img + ')'}">
      <router-link class="btn-retest" :to="`/detail/${detailId}`"><i class="iconfont">&#xe61e;</i>重测</router-link>
    </div>
    <h2>{{resData.title}}</h2>
    <p :style="{overflow: flag ? 'visible' : 'hidden', height: flag ? 'auto' : '.45rem'}" :class="{'testElClass': flag}">{{resData.des}}</p>
    <div class="linear" ref='linear' v-if="!flag"></div>
    <div @click="isAppear" :class="{'is-appear': true, 'testElClass': flag}"><span>点击查看完整结果</span></div>
    <span class="orang-button" @click="triggerShareLayer">分享</span>
    <a class="orang-button" :href="browserUrl">更多测试交友</a>
  </div>
  <div class="ccc"></div>
  <div class="section mod-session-item" v-if="ffData && ffData.length">
    <h3 class="mod-session-tit">好友测试匹配度<router-link class="moreMatch" :to="'/detail/friend/' + detailId">更多</router-link></h3>
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
  </div>
  <recommend/>
  <!-- 更多同类测试 -->
  <!-- <div class="section mod-session-item" v-if="categoryList && categoryList.list && categoryList.list.length">
    <h3 class="mod-session-tit">更多同类测试</h3>
    <div class="more-test">
      <ul class="clearfix">
        <li v-for="(item, index) in categoryList.list" class="more-test-item" v-if="index < 4" :key="index">
          <a v-if="index % 3 === 0" class="test-content bg-img" :style="{'backgroundImage': 'url(' + item.bgImg + ')'}" href="https://fir.im/n3ah">
            <div class="test-content-info">
              <h4 class="f-ellipsis">{{item.title}}</h4>
              <p class="f-ellipsis">{{item.des}}</p>
              <span class="more-test-tag">应用专享</span>
            </div>
          </a>
          <router-link v-else class="test-content bg-img" :style="{'backgroundImage': 'url(' + item.bgImg + ')'}" :to="`/detail/${item.categoryId}`">
            <div class="test-content-info">
              <h4 class="f-ellipsis">{{item.title}}</h4>
              <p class="f-ellipsis">{{item.des}}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div> -->
  <share-layer :shareData="shareData" :detailId="detailId"></share-layer>
</div>
</template>

<script>
import shareLayer from 'src/components/share' // 审批组件
import {getQuestionCategoryDetail, getFriendQuestionMatchResultList, getSameQuestionCategoryList} from 'src/service/getData'
import {cookie} from '@/config/mUtils'
import { mapActions, mapState } from 'vuex'
import recommend from '@/components/recommend' // 审批组件
import {browsers} from '../../config/mUtils'
export default {
  data () {
    return {
      uId: '', // 当前用户ID
      detailId: '',
      categoryList: {}, // 更多分类测试
      shareData: {},
      ffData: [],
      flag: false,
      browserUrl: browsers()
    }
  },
  computed: {
    ...mapState({
      resData: state => state.questionResult.resData
    })
  },
  components: {
    shareLayer,
    recommend
  },
  mounted () {
    this.uId = cookie('uID')
    console.log('this.uId', this.uId)
    this.detailId = this.$route.params.id
    this.initData()
  },
  methods: {
    ...mapActions(['getDetailRes']),
    initData () {
      this.getDetailRes({detailId: this.detailId, uId: this.uId})
      this.getFriendDetailRes()
      this.getSameQuestionCategoryList()
    },
    async getDetail (userRes) { // 分享用
      console.log(userRes, 'AAAAAAAAAAAAAAAAAAAAAAA')
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
      document.title = res.data.des || res.data.title
    },
    async getFriendDetailRes () { // 获取好友测试匹配度
      let res = await getFriendQuestionMatchResultList(this.detailId, '1', '-1')
      console.log('获取好友测试匹配度', res)
      if (res.stateCode !== 1) {
        return
      }
      this.ffData = res.data.list
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
.top-section p{position: relative; width: 100%;height: .45rem;overflow: hidden;}
.linear{width: 100%;height: .4rem;background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0),rgba(255, 255, 255, 255));position: relative;top:-.4rem;left:0;}
.is-appear{ width: 100%;height: .2rem;line-height: .2rem;text-align: center;color: #598bff;margin-top: -.3rem;}
.testElClass{margin-top: 0;}
.ccc{width: 100%;height: .1rem;background: #F3F3F3;}
</style>
