<template>
   <div class="topic">
      <img :src="topicData && topicData.bgImg" alt=""> 
      <div class="content">
          <p>{{topicData && topicData.des}}</p>
      </div>
      <div class="option">
          <b>更多观点</b><div class="you"><span>精华</span><span>全部</span></div>
      </div>
      <div class="all-users">
        <div class="user-info" v-for='(item, key) in topicData && topicData.list' :key='key'>
          <div class="user">
              <div class="left"><img  :src="item.userAvatar" alt=""><b class="name">{{item.userNickname}}</b><img :src="item.sex===1?'static/inf_boy.png':'static/inf_gril.png'" alt="" class="sex"></div>
              <div class="right">{{parseInt(item.createTime/1000/60/60)}}小时</div>
          </div>
          <p class="user-content">{{item.content}}</p>
          <div class="support"><span><i class="iconfont icon-dianzan"></i><em>{{item.likeCount}}</em><i class="iconfont icon-dianzan rotate"></i><em>{{item.treadCount}}</em></span><span><i class="iconfont icon-web-icon-"></i><em>{{item.commentCount}}</em></span></div>
          <hr class="hr">
        </div>
        <div class="comment" @click="comment"><span>到APP内查看更多评论</span></div>
      </div>
      <recommend/>
      <share-layer v-if="shareData.title" :shareData="shareData" :detailId="detailId"></share-layer>
   </div>
</template>
<script>
import {getSquareActivityTopicDetailH5} from 'src/service/getData'
import shareLayer from 'src/components/share' // 审批组件
import recommend from 'src/components/recommend' // 审批组件
import {browsers} from '@/config/mUtils'
export default {
  data () {
    return {
      topicData: null,
      shareData: {},
      detailId: ''
    }
  },
  components: {
    shareLayer,
    recommend
  },
  mounted () {
    this.detailId = this.$route.params.id
    this.initData()
  },
  methods: {
    initData () {
      this.getTopic()
    },
    async getTopic () {
      let res = await getSquareActivityTopicDetailH5(151)
      if (res.stateCode !== 1) {
        return
      }
      this.topicData = res.data
      this.shareData = {
        desc: res.data.title,
        imgUrl: res.data.bgImg,
        title: res.data.title,
        url: window.location.href
      }
      document.title = res.data.title
      document.title = res.data.des || res.data.title
    },
    comment () {
      location.href = browsers()
    }
  }
}
</script>
<style scoped>
.topic{color: #000;}
.topic  img{width: 100%;height: auto;vertical-align: middle;}
.topic .content{padding: .2rem .15rem;}
.topic .content p{color: #000;font-size: .16rem;line-height: .25rem;font-family: 'PingFangSC-Light';}
.topic .option{width: 100%;height: .42rem;border-top: 1px solid #b8b8b8;display: flex;align-items: center;justify-content: space-between;padding: .15rem;box-sizing: border-box;}
.topic .option b{font-size: .17rem;}
.topic .option span{padding: 0.05rem 0.23rem;background: #f3f3f3;border-radius: .04rem;font-size: .13rem;}
.topic .option span:nth-child(1){color: #fe5a51;}
.topic .option span:nth-child(2){color: #787878;margin-left: .2rem;}
.topic .all-users{border-bottom: .1rem solid #F3F3F3;}
.topic .all-users .user-content{padding: 0 .18rem;line-height: .25rem;}
.topic .all-users .user{width: 100%;line-height: .62rem;display: flex;align-items: center;justify-content: space-between;padding:0 .15rem;box-sizing: border-box;}
.topic .all-users .user .left img{width: .4rem;height: .4rem;vertical-align: middle;border-radius: 50%;}
.topic .all-users .user .left .name{margin-left: .08rem;font-size: .16rem;}
.topic .all-users .user .left .sex{width: .2rem;height: .2rem;margin-left: 0.05rem;}
.topic .all-users .user .right{color: #787878;font-size: .13rem;}
.topic .all-users .user-info hr{color:  #B8B8B8;width: 93%;}
.topic .all-users .user-info .support{width: 100%;padding: 0 4%;box-sizing: border-box;height: .48rem;display: flex;justify-content: space-between;align-items: center;}
.topic .all-users .user-info .support .iconfont{font-size:  .2rem;color: #666;}
.topic .all-users .user-info .support em{margin-left: .07rem;}
.topic .all-users .user-info .support .rotate:before{margin-left: .195rem;transform:rotate(180deg);display: inline-block;}

.topic .comment{width: 92%;height: .38rem;background: #FE5A51;border-radius: 0.08rem;margin: 0 auto;text-align: center;line-height: .38rem;margin-bottom: .14rem;}
.topic .comment span{font-size: .16rem;color: #fff;}

</style>
