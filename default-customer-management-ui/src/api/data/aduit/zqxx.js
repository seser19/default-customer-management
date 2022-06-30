import request from '@/utils/request'

// 查询出动信息列表
export function listZqxx(query) {
  return request({
    url: '/data/aduit/zqxx/list',
    method: 'get',
    params: query
  })
}

// 查询出动信息详细
export function getZqxx(cdbh) {
  return request({
    url: '/data/aduit/zqxx/' + cdbh,
    method: 'get'
  })
}

// 获取审核单信息
export function getCreateDeptAndDate(data) {
  return request({
    url: '/data/entry/zqxx/getCreateDeptAndDate',
    method: 'get',
    params: data
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

// 获取灾情信息审核列表
export function getList(data) {
  return request({
    url: '/data/entry/zqxx/queryAduit',
    method: 'get',
    params: data
  })
}

// 查看当前
export function findTask(params){
  return request({
    url: '/checkManager/findTask',
    method: 'get',
    params
  })
}

// 查看审核完整节点
export function processPreview(params){
  return request({
    url: '/checkManager/processPreview',
    method: 'post',
    params
  })
}