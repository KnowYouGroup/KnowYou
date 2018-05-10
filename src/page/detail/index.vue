<template>
<div class="layout-box wrapper detail-wrapper" v-if="detailData && detailData.questionList && detailData.questionList.length">
  <div class="box-col detail-colbox">
    <div class="detail-swp">
      <swiper :options="swiperOption">
        <swiper-slide class="detail-swapper" v-for="(item, index) in detailData.questionList" :key="index">
          <div class="detail-item layout-box">
            <div class="detail-item-header bg-img" :style="{backgroundImage: 'url(' + item.img + ')'}"></div>
            <div class="detail-item-des">{{item.question}}</div>
            <div class="detail-item-select box-col">
              <ul>
                <li v-for="(answer, idx)  in item.answerList" :key="answer.answerId">
                    <div class="check">
                      <input type="radio" v-model="item.handleCheck" :id="item.id + '_' + answer.answerId" :value="item.id + '_' + answer.answerId" @change="changeHandleCheck(index, idx, item.id)"> <label :for="item.id + '_' + answer.answerId" class="labels">{{answer.answerContent}}</label>
                      <img v-if="answer.isHint*1"   src="static/test_notes@3x.png" class="test_notes"  @click="addPage(answer,answer.isHint)">
                    </div>
                    <div class="percentage" v-if="isPercentage">
                      <p  :class="{'process-bar': true, 'current': nums[index]===idx}"  :style = [c]></p>
                    </div>
                </li>
              </ul>
            </div>
            <div v-if="index === detailData.questionList.length - 1">
              <span v-if="item.handleCheck === ''" class="btn-detail-submit is-disable" style="border-radius: 0 0 .08rem .08rem;">查看结果</span>
              <span v-else class="btn-detail-submit" @click="submitInterestAnswer" style="border-radius: 0 0 .08rem .08rem;">查看结果</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
<div class="detail-ft">
<button ref="prevBtn" class="swapper-prev" style="position:fixed; left:-9999px;">prev</button>
<button ref="nextBtn" class="swapper-next" style="position:fixed; left:-9999px;">next</button>
  <div class="detail-page-nav">
    <span class="btn-prev" :class="{'is-hidden': realIndex === 0}" @click="tryToPrev">上一题</span>
    <span>{{realIndex + 1}}/{{detailData.questionList.length}}</span>
    <span class="btn-next" :class="{'is-disable': detailData.questionList[realIndex].handleCheck === '' || inChange, 'is-hidden': realIndex === detailData.questionList.length - 1}" @click="tryToNext((detailData.questionList[realIndex].handleCheck === '' || inChange) ? false : true)">下一题</span>
  </div>
<share-layer v-if="shareData.title" :shareData="shareData" :isDetail="'DETAIL'" :detailId="detailId"></share-layer>
</div>
<div class="mask" v-if="dialogflag">
  <div class="addpage">
  <img :src="hintContent.hintImg" alt="">
  <p class="discribe">{{hintContent.hintDes}}</p>
  <span class="btn-detail-submit" @click="isdialog">涨知识啦</span>
</div>
</div>
</div>
</template>

<script>
import {getQuestionCategoryDetail, getInterestQuestionList, commitInterestAnswer} from 'src/service/getData'
import shareLayer from 'src/components/share' // 审批组件
import {swiper, swiperSlide} from 'vue-awesome-swiper'
export default {
  data () {
    return {
      inChange: false, // 变化中状态
      realIndex: 0,
      swiperOption: {
        pagination: '.swiper-pagination',
        nextButton: '.swapper-next',
        prevButton: '.swapper-prev',
        simulateTouch: false,
        spaceBetween: 0,
        swipeHandler: '.detail-page-nav',
        onSlideChangeEnd: swiper => {
          this.realIndex = swiper.realIndex
        }
      },
      detailId: '',
      timmer: null,
      detailData: {}, // 问题列表数据详情
      shareData: {},
      dialogflag: false,
      hintContent: '', // 提示内容
      sum: 0,
      staNum: 0,
      c: {
        width: 0 + 'px'
      },
      num: null,
      nums: [],
      isPercentage: false
    }
  },
  components: {
    shareLayer,
    swiper,
    swiperSlide
  },
  computed: {
  },
  mounted () {
    this.detailId = this.$route.params.id
    this.getDetail()
    this.getQlist()
  },
  methods: {
    // 获取问题列表
    async getQlist () {
      let res = await getInterestQuestionList(this.detailId)
      console.log('问题列表', res.data)
      if (res.stateCode !== 1) {
        return
      }
      for (var i = 0; i < res.data.questionList.length; i++) {
        res.data.questionList[i].handleCheck = ''
      }
      this.detailData = res.data
      this.nums = Object.keys(res.data.questionList)
    },
    async getDetail () { // 分享用
      let res = await getQuestionCategoryDetail(this.detailId)
      console.log('分享', res)
      if (res.stateCode !== 1) {
        return
      }
      this.shareData = res.data
      // document.title = res.data.title
      document.title = res.data.des || res.data.title
    },
    changeHandleCheck (index, idx, itemId) {
      this.isPercentage = true
      this.nums[index] = idx
      this.num = idx
      this.inChange = true
      this.staNum = this.detailData.questionList[index].answerList[idx].staNum * 1
      this.detailData.questionList[index].answerList.forEach(ele => {
        this.sum += this.staNum * 1
      })
      this.c.width = this.staNum / this.sum + 'px'
      this.timmer = setTimeout(() => {
        this.tryToNext(true)
        clearTimeout(this.timmer)
      }, 600)
    },
    tryToPrev () {
      if (this.realIndex === 0) return
      clearTimeout(this.timmer)
      this.$refs.prevBtn.click()
      this.inChange = false
    },
    tryToNext (state) {
      if (!state) return
      this.$refs.nextBtn.click()
    },
    async submitInterestAnswer () {
      let ansArr = []
      for (var i = 0; i < this.detailData.questionList.length; i++) {
        ansArr[i] = this.detailData.questionList[i].handleCheck.split('_')[1]
      }
      console.log(ansArr.join(','), '777777')
      let res = await commitInterestAnswer(this.detailId, ansArr.join(','))
      if (res.stateCode === 1) {
        this.$router.push(`/detail/res/${this.detailId}`)
      } else {
        alert(res.info || '操作失败，请稍后重试')
      }
    },
    addPage (answer, isHint) { // 点击选项后的补充页
      console.log(answer, 'answer')
      console.log(isHint, 'isHint')
      this.hintContent = answer
      this.dialogflag = !this.dialogflag
    },
    isdialog () {
      this.dialogflag = !this.dialogflag
    }
  },
  watch: {
    realIndex: function (value) {
      // console.log(this.realIndex)
    }
  }
}
</script>
<style >
@import '../../assets/css/swiper.css';
.detail-wrapper{width:100%; height:100%; background:rgb(243, 243, 243);}
.detail-wrapper .box-col{background:#fff; border-radius:.05rem;}
.detail-ft{width:100%; height:.5rem; margin-bottom:-.15rem;}
.detail-colbox{position:relative;}
.detail-swp{position:absolute; width:100%; height:100% !important;}
.swiper-container,.swiper-wrapper{width:100%; height:100% !important;}

.detail-item-header{width:100%; height:2.199rem; border-radius:.05rem .05rem 0 0;}
.detail-item-des{padding:.125rem .15rem; font-size:.18rem; line-height:.26rem; color:#000;}
.detail-item-select{position:relative; padding:.02rem .15rem .15rem;}
.detail-item-select ul{position:absolute; top:.02rem; left:.15rem; right:.15rem; bottom:.15rem; overflow-y:scroll;}
.detail-item-select ul li .check{padding:.075rem 0;display: flex;align-items: center}
.detail-item-select ul li .check input{float:left; margin-top:.01rem;}
.detail-item-select ul li .check label{padding-left:.15rem; line-height:.22rem; display:block;}
.detail-item-select ul li .percentage{width: 2.45rem;height: 0.05rem;border-radius: .5rem;background: #ebebeb;margin-left: .4rem;}
.detail-item-select ul li .percentage .process-bar{width: 0;height: 0.05rem;border-radius: .5rem;background: #FEACA8;}
.detail-item-select ul li .percentage .current{background: #FE5A51}
.detail-item-select input[type=radio]{-webkit-appearance:none; vertical-align:middle; margin-right:.05rem; width:.2rem; height:.2rem; background:none; border:.01rem solid rgb(254,90,81); border-radius:50%;}
.detail-item-select input[type=radio]:checked{background:rgb(254,90,81) url(../../assets/img/checked.png) no-repeat 50% 50%; background-size:100% 100%; color:#fff;}

.detail-page-nav{width:100%; text-align:center; padding:.1rem 0; font-size:.16rem; line-height:.3rem; color:rgb(120,120,120)}
.detail-page-nav span{height:.3rem; display:inline-block; vertical-align:middle;}
.btn-prev,
.btn-next{color:#598bff; font-size:.14rem;}
.detail-page-nav .btn-prev{float:left;}
.detail-page-nav .btn-next{float:right;}
.detail-page-nav span.is-disable{color:#787878;}
.detail-page-nav span.is-hidden{opacity:0;}
.btn-detail-submit{width:100%; height:.45rem; display:block; line-height:.45rem; color:#fff; font-size:.17rem; text-align:center; background:rgb(254,90,81); border-radius: .08rem;}
.btn-detail-submit.is-disable{ background:rgba(254,90,81,.7)}
.test_notes{width: .2rem;height: .2rem;margin-left: .17rem;}
.mask{width: 100%;height: 100%;position: fixed;left: 0;top:0;background: #616161;z-index: 100;background: rgba(0,0,0,.3); }	 
.addpage{width: 86%;height: 76%;background: #fff;margin:.42rem auto;position: fixed;left: 0;right: 0;top: 0;bottom: 0;border-radius: 0.08rem;}
.addpage img{width: 100%;height: 2.06rem;} 
.addpage .discribe{padding: .15rem;font-size: .16rem;line-height: .2rem;color: #000;}
.addpage  .btn-detail-submit{width: 90%;margin: .46rem auto 0;} 
    
    

</style>
