// 多个页面驳回使用的接口
import request from '@/utils/request'

// 警情驳回
export function jqReject(data) {
  return request({
    url: '/statistical/supervision/jqReject',
    method: 'post',
    params: data
  })
}

// 出动驳回
export function cdReject(data) {
  return request({
    url: '/statistical/supervision/cdReject',
    method: 'post',
    params: data
  })
}

// 火灾驳回
export function hzReject(data) {
  return request({
    url: '/statistical/supervision/hzReject',
    method: 'post',
    params: data
  })
}
