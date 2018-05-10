import {getInterestQuestionResult} from 'src/service/getData'
export default {
  state: {
    resData: {}
  },
  actions: {
    async getDetailRes ({commit}, params) { // 获取做题结果
      const {detailId, uId} = params
      let res = await getInterestQuestionResult(detailId, uId)
      if (res.stateCode !== 1) { // fql这儿完全吃掉异常，没有做任何处理
        return
      }
      commit('QUESTIONRESULT', res)
      return res
    }
  },
  mutations: {
    QUESTIONRESULT (state, res) {
      state.resData = res.data
    }
  }
}
