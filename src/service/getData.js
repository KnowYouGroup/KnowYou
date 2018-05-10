import fetch from '@/config/fetch'
// import {cookie} from '@/config/utils' // trim

// export const fileSign = (file) => fetch('/api/file/sign', { // 文件上传令牌
//   data: {file}, headers: {ssid: cookie('uToken')}, contentType: 'file'
// })

// export const fileSignUrl = '/api/file/sign'
export const getWXConfig = (url) => fetch('/wx/api/getWXConfig.php', {
  data: {appname: 'match', url}
})

/*
 登录相关接口请求
*/
export const getWeixinLoginUserInfo = (code) => fetch('/socialWeb/h5/getWeixinLoginUserInfo?code=' + code, {
  type: 'GET'
})

/*
 登录相关接口请求
*/
export const createAndLoginThridUser = (type, uniqueId, questionCategoryId) => fetch('/socialWeb/web/createAndLoginThridUser', {
  data: {type, uniqueId, questionCategoryId}
})

// 获取问题分类 分享用
export const getQuestionCategoryDetail = (questionCategoryId) => fetch('/socialWeb/web/getQuestionCategoryDetail', {
  data: {questionCategoryId}
})

// 获取问题分类详情
export const getInterestQuestionList = (questionCategoryId) => fetch('/socialWeb/web/getInterestQuestionList', {
  data: {questionCategoryId}
})

// 提交问题答案
export const commitInterestAnswer = (categoryId, answerIds) => fetch('/socialWeb/web/commitInterestAnswer', {
  data: {categoryId, answerIds}
})

// 获取问题测试结果
export const getInterestQuestionResult = (questionCategoryId, userId) => fetch('/socialWeb/web/getInterestQuestionResult', {
  data: {questionCategoryId, userId}
})

// 获取好友测试题结果列表
export const getFriendQuestionMatchResultList = (categoryQuestionId, type, lastUserId) => fetch('/socialWeb/web/getFriendQuestionMatchResultList', {
  data: {categoryQuestionId, type, lastUserId}
})

// 获取问题分类列表
export const getSameQuestionCategoryList = (categoryQuestionId) => fetch('/socialWeb/web/getSameQuestionCategoryList', {
  data: {categoryQuestionId}
})

// 获取活动话题接口
export const getSquareActivityTopicDetailH5 = (activityId) => fetch('/socialWeb/web/getSquareActivityTopicDetailH5', {
  data: {activityId}
})

// 获取推荐分类列表
export const getSortList = (categoryQuestionId) => fetch('/socialWeb/web/getSameQuestionCategoryList', {
  data: {categoryQuestionId}
})
