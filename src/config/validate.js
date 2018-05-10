/**
 * 获取localStorage和设置localStorage
 * @name    localStorage
 * @param   {String}  名字
 * @param   {String}  值
 * @return  {String}  当只有名字时返回名字对应值
*/

import {trim} from './utils' // trim
// 手机号
export const validateMobile = (rule, value, callback) => {
  value = trim(value)
  if (!value) {
    return callback(new Error('手机号不能为空'))
  } else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
    return callback(new Error('请输入11位有效手机号'))
  } else {
    callback()
  }
}
// 电话
export const validateTelphone = (rule, value, callback) => {
  value = trim(value)
  if (!value) {
    return callback(new Error('电话不能为空'))
  }
  if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(value) || /^(\(\d{3,4}-\)|\d{3,4}-)?\d{7,8}$/.test(value)) {
    callback()
  } else {
    return callback(new Error('请输入正确的电话号码'))
  }
}
// 用户名
export const validateUsername = (rule, value, callback) => {
  value = trim(value)
  if (!value) {
    return callback(new Error('账号不能为空'))
  } else {
    callback()
  }
}
// 用户名
export const validateName = (rule, value, callback) => {
  value = trim(value)
  if (!value) {
    return callback(new Error('姓名不能为空'))
  } else {
    callback()
  }
}

// 密码 // /^(?![^a-zA-Z]+$)(?!\D+$)/
// 两种 /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/
export const validatePassword = (rule, value, callback) => {
  value = trim(value)
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  if (/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/.test(value)) {
    callback()
  } else {
    return callback(new Error('密码至少包含数字、字母、字符的两种'))
  }
}

// 邮箱
export const validateMail = (rule, value, callback) => {
  value = trim(value)
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
    return callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}

// 部门角色
export const validateSectorRole = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择部门/角色'))
  } else if (value.length < 2) {
    return callback(new Error('请选择角色'))
  } else {
    callback()
  }
}

// 上级
export const validateSuperior = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择上级'))
  } else {
    callback()
  }
}

