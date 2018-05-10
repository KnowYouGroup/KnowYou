<template>
<div class="wrapper-res">
  <div class="top-section">
    <div class="top-section-tit">{{resData.title}}</div>
    <div class="img-box bg-img" :style="{'backgroundImage': 'url(' + resData.img + ')'}">
    </div>
    <h2>{{resData.title}}</h2>
    <p :style="{overflow: flag ? 'visible' : 'hidden', height: flag ? 'auto' : '.45rem'}" :class="{'testElClass': flag}">{{resData.des}}</p>
    <div class="linear" ref='linear' v-if="!flag"></div>
    <div @click="isAppear" :class="{'is-appear': true, 'testElClass': flag}"><span>点击查看完整结果</span></div>
    <span class="orang-button" @click="myTest">我也要测</span>
    <a class="orang-button" :href="browserUrl">更多趣味测试</a>
  </div>
  <recommend/>
  <share-layer v-if="shareData.title" :shareData="shareData" :detailId="detailId"></share-layer>
</div>
</template>

<script>
import shareLayer from 'src/components/share' // 审批组件
import {getQuestionCategoryDetail} from 'src/service/getData'
import {cookie} from '@/config/mUtils'
import { mapActions, mapState } from 'vuex'
import recommend from '@/components/recommend' // 审批组件
import {browsers} from '../../config/mUtils'
export default {
  data () {
    return {
      uId: '', // 当前用户ID
      detailId: '',
      shareData: {},
      flag: false,
      browserUrl: browsers()
    }
  },
  computed: {
    ...mapState({
      resData: state => {
        // resData中无数据，目前只有isQuestion
        console.log(state, '++++++++++++++++++++++++')
        return state.questionResult.resData
      }
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
      console.log('SSSSSSSSSSSSSSSSSS', this.shareData)
      // document.title = res.data.title
      document.title = res.data.des || res.data.title
    },
    // 点击我也要测
    myTest () {
      this.$router.push(`/detail/${this.detailId}`)
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
</style>
