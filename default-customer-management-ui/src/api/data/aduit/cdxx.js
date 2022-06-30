import request from '@/utils/request'

// 查询出动信息列表
export function listCdxx(query) {
  return request({
    url: '/data/aduit/cdxx/list',
    method: 'get',
    params: query
  })
}

// 查询出动信息详细
export function getCdxx(cdbh) {
  return request({
    url: '/data/aduit/cdxx/' + cdbh,
    method: 'get'
  })
}

// 获取审核流程
export function getRecord(data) {
  return request({
    url: '/checkManager/getRecord',
    method: 'get',
    params: data
  })
}
// 获取当前审核流程
export function getTask(data) {
  return request({
    url: '/checkManager/findTask',
    method: 'get',
    params: data
  })
}

// 提交审核
export function exec(data) {
  return request({
    url: '/checkManager/exec',
    method: 'post',
    params: data
  })
}

// 出动信息审核查询
export function getRespondList(data) {
  return request({
    url: '/checkManager/getRespondList',
    method: 'get',
    params: data
  })
}

// 查询出动信息列表
export function cdxxCommomSearch(query) {
  return request({
    url: '/dataAduit/cdxxCommomSearch',
    method: 'post',
    params: query
  })
}
// 下载出动信息列表
export function cdxxCommomDownload(query) {
  return request({
    url: '/dataAduit/cdxxCommomDownload',
    method: 'post',
    params: query
  })
}

export function cdxxCommomCountSearch(query) {
  return request({
    url: '/dataAduit/cdxxCommomCountSearch',
    method: 'post',
    params: query
  })
}
