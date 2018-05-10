import {getInterestQuestionResult} from 'src/service/getData'
export default {
  state: {
    resData: {}
  },
  actions: {
    async getDetailRes ({commit}, params) { // 获取做题结果
      const {detailId, uId} = params
      let res = await getInterestQuestionResult(detailId, uId)
      if (res.stateCode !== 1) {
        return
      }
      commit('QUESTIONRESULT', res)
    }
  },
  mutations: {
    QUESTIONRESULT (state, res) {
      state.resData = res.data
    }
  }
}
