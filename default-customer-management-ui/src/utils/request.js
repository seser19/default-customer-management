import axios from 'axios'
import qs from 'qs'
import {
  Notification,
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  // timeout: 10000
})
// request拦截器
service.interceptors.request.use(
  config => {
    // console.log('==',config)
    // 请求时不加认证的接口名称白名单
    const whiteList = ['/login', '/captchaImage']
    const isWhite = whiteList.some((element, index, arr) => {
      return config.url === element;
    })
    if (getToken() && !isWhite) {
      // if(config.url && !config.url.match('custInfo')){
      //   axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      // }
    }
    if(config.url == '/system/user/list'){
      config.paramsSerializer = function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    }
    if(config.url == '/system/role/queryRoleByUserId'){
      config.paramsSerializer = function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    }
    if(config.url == '/system/menu/list'){
      config.paramsSerializer = function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    }
    return config
  },
  error => {
    console.log('err' + error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(res => {
    const code = res.data.code
    if (code === 401) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {})
    } else if (code !== 200) {
      res.data.msg?Notification.error({
        title: '提示',
        message:res.data.msg
      }):''
      return res.data
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

