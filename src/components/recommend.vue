<template>
    <div class="tuijian"> 
        <h4>更多推荐</h4>
        <dl v-for='(item, key) in commentData && commentData.list' :key='key' @click="comment">
            <dt><img :src="item.imgUrl || item.bgImg" alt=""></dt>
            <dd><p>{{item.des}}</p><p><span class="active"><img src="../assets/img/coll_activity.png"/>{{item.type}}</span><span class="person">{{item.commentCount}}人参与</span></p></dd>
        </dl>
    </div>
</template>
<script>
import {getSortList} from 'src/service/getData'
import {browsers} from '../config/mUtils'
export default {
  data () {
    return {
      commentData: null,
      detailId: ''
    }
  },
  mounted () {
    this.detailId = this.$route.params.id
    this.initData()
  },
  methods: {
    initData () {
      this.getSameQuestionCategoryList()
    },
    async getSameQuestionCategoryList  () {
      let res = await getSortList(this.detailId)
      if (res.stateCode !== 1) {
        return
      }
      res.data.list.forEach(element => {
        switch (element.type) {
          case '1':
            element.type = '话题'
            break
          case '2':
            element.type = '问题'
            break
          case '3':
            element.type = '活动'
            break
          case '4':
            element.type = '心理测试题'
            break
        }
      })
      this.commentData = res.data
    },
    comment () {
      location.href = browsers()
    }
  }
}
</script>
<style scoped>
.tuijian{width: 92%;margin: 0 auto;}
.tuijian h4{font-size: .16rem;line-height: .46rem;font-weight: bolder;}
.tuijian dl{display: flex;}
.tuijian dl dt{flex-basis: 30%;}
.tuijian dl dt img{width: 100%;height: auto;border-radius: .02rem;}
.tuijian dl dd{flex-basis: 60%;margin-left: .1rem;}
.tuijian dl dd p:nth-child(1){font-size: .16rem;font-weight: bolder;line-height: .21rem;}
.tuijian dl dd p:nth-child(2){display: flex;justify-content: space-between;line-height: .45rem;}
.tuijian dl dd p:nth-child(2) .active{color: #598bff;font-size: 0.08rem;}
.tuijian dl dd p:nth-child(2) .active img{width: .14rem;height: .14rem;vertical-align: middle;margin-right: .055rem;}
.tuijian dl dd p:nth-child(2) .person{color: #787878;font-size: .13rem;}
</style>
