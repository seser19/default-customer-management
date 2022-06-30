import request from '@/utils/request'

/*****************发起监督新接口 */
// 查询监督信息列表
export function getTasksInitiatedList(query) {
  return request({
    url: '/statistical/supervision/getTasksInitiatedList',
    method: 'get',
    params: query
  })
}

// 查询监督信息详情
export function getTaskById(query) {
  return request({
    url: '/statistical/supervision/getTaskById',
    method: 'get',
    params: query
  })
}

// 删除监督列表
export function delTaskById(query) {
  return request({
    url: '/statistical/supervision/delTaskById',
    method: 'post',
    params: query
  })
}

// 查询报表
export function getTaskTeamList(query) {
  return request({
    url: '/statistical/supervision/getTaskTeamList',
    method: 'get',
    params: query
  })
}

// 发送报表
export function getReportFilterResult(query) {
  return request({
    url: '/statistical/supervision/getReportFilterResult',
    method: 'get',
    params: query
  })
}

// 保存任务
export function addReportFilterResult(query) {
  return request({
    url: '/statistical/supervision/addReportFilterResult',
    method: 'post',
    data: query
  })
}

/*****************发起监督老接口 */
// 查询监督信息列表
export function tbControlTaskList(query) {
  return request({
    url: '/check/create/tbControlTaskList',
    method: 'get',
    params: query
  })
}

// 删除单个监督任务
export function deleteTbCheckTaskById(data) {
  return request({
    url: '/check/create/deleteTbCheckTaskById',
    method: 'post',
    params: data
  })
}

// 获取当前单位直属下级的级别 
export function tbTaskListShow(data) {
  return request({
    url: '/check/create/tbTaskListShow',
    method: 'get'
  })
}

// 警情判断等量
export function jqinfoCount(data) {
  return request({
    url: '/check/create/jqinfoCount',
    method: 'post',
    params: data
  })
}

// 警情查询接口
export function jqxxCommomSearch(data) {
  return request({
    url: '/check/create/jqxxCommomSearch',
    method: 'post',
    params: data
  })
}

// 出动判断等量
export function cdInfoCount(data) {
  return request({
    url: '/check/create/cdInfoCount',
    method: 'post',
    params: data
  })
}

// 出动查询接口
export function cdxxCommomSearch(data) {
  return request({
    url: '/check/create/cdxxCommomSearch',
    method: 'post',
    params: data
  })
}

// 火灾判断等量
export function zqxxInfoCount(data) {
  return request({
    url: '/check/create/zqxxInfoCount',
    method: 'post',
    params: data
  })
}

// 火灾查询接口
export function queryZqxxData(data) {
  return request({
    url: '/check/create/queryZqxxData',
    method: 'post',
    params: data
  })
}

// 自定义信息插入临时表
export function insertDimCheckTeam(data) {
  return request({
    url: '/check/create/insertDimCheckTeam',
    method: 'post',
    params: data
  })
}

// 派发任务
export function insertTbCheckTask(data) {
  return request({
    url: '/check/create/insertTbCheckTask',
    method: 'post',
    params: data
  })
}

