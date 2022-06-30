import request from '@/utils/request'

// 查询警情页面option
// 警情等级 tb_dic_jqdj
// 现场指挥 tb_dic_xczh
// 火警类型 tb_dic_zqdj
export function getOptions(type) {
  return request({
    url: '/system/dict/data/dictType/' + type,
    method: 'get'
  })
}
// 查询警情类型option
export function getJqcdlb(query) {
  return request({
    url: '/system/dict/treeData/query',
    method: 'get',
    params: query
  })
}
// // 火灾概况接口
// export function jqxxDatilInfo4Zq(params) {
//   return request({
//     url: `/police/situation/jqxxDatilInfo4Zq?jqbh=${params}`,
//     method: 'get',
//   })
// }
// // 出动概况接口
// export function jqxxDatilInfo4Cd(params) {
//   return request({
//     url: `/police/situation/jqxxDatilInfo4Cd?jqbh=${params}`,
//     method: 'get',
//   })
// }
// 警情信息填报接口
export function jqxxAdd(data) {
  return request({
    url: '/police/situation/jqxxAdd',
    method: 'post',
    data: data
  })
}

export function jqxxAdd4Jcj(data) {
  return request({
    url: '/police/situation/jqxxAdd4Jcj',
    method: 'post',
    data: data
  })
}
// 跨区域警情信息填报接口
export function kqyJqxxAdd(data) {
  return request({
    url: '/police/situation/kqyJqxxAdd',
    method: 'post',
    data: data
  })
}

// 查询历史警情信息
export function jqxxList(query) {
  return request({
    url: '/police/situation/jqxxList',
    method: 'get',
    params: query
  })
}

// 查询辖区警情信息
export function jqxxUpList(query) {
  return request({
    url: '/police/situation/jqxxUpList',
    method: 'get',
    params: query
  })
}

// 接处警同步列表查询
export function getUnallocatedList(query) {
  return request({
    url: '/ds4jq/getUnallocatedList',
    method: 'post',
    params: query
  })
}

// 接处警同步列表查询，待挂起
export function getListByZt(query) {
  return request({
    url: '/ds4jq/getListByZt',
    method: 'post',
    params: query
  })
}

// 同步列表操作，更改状态
export function updateZtByIdBatch(data) {
  return request({
    url: '/ds4jq/updateZtByIdBatch',
    method: 'post',
    data
  })
}

export function Upload(data) {
  return request({
    url: '/ds4jq/uploadPicAddWaterMark',
    method: 'post',
    data: data,
    headers:{'Content-Type':'multipart/form-data'}
  })
}

// 接处警同步更新时间
export function getLastSynTime() {
  return request({
    url: '/ds4jq/getLastSynTime',
    method: 'get',
  })
}

// 接处警同步待派发列表批量删除的接口
export function delUnallocatedBatch(data) {
  return request({
    url: '/ds4jq/delUnallocatedBatch',
    method: 'post',
    data
  })
}

// 接处警同步同步按钮的接口
export function synchronization() {
  return request({
    url: '/ds4jq/synchronization',
    method: 'post',
  })
}

// 通过警情编码查询警情详情信息
export function jqxxListDatails(query) {
  return request({
    url: '/police/situation/jqxxListDatails',
    method: 'get',
    params: query
  })
}

// 查询单条警情信息详情
export function jqxxDatilInfo(query) {
  return request({
    url: '/police/situation/jqxxDatilInfo',
    method: 'get',
    params: query
  })
}

// 删除单条警情信息
export function deleteJqxx(query) {
  return request({
    url: '/checkManager/deleteJqxx',
    method: 'post',
    params: query
  })
}

// 根据条件查询警情
export function jqxxCommomSearch(params) {
  return request({
    url: '/dataAduit/jqxxCommomSearch',
    method: 'post',
    params
  })
}
// 根据条件查询警情
export function jqxxCommomDownload(params) {
  return request({
    url: '/dataAduit/jqxxCommomDownload',
    method: 'get',
    params
  })
}

// 根据条件查询警情总数/头部概览查询
export function selectJqxxCommonCount(params) {
  return request({
    url: '/dataAduit/selectJqxxCommonCount',
    method: 'post',
    params
  })
}

// 查询警情编号
export function getTimeAxis(params) {
  return request({
    url: `/police/situation/getTimeAxis?jqbh=${params}`,
    method: 'get',
  })
}

// 查询警情信息
export function jqxxUpdateInfo(jqbh) {
  return request({
    url: `/police/situation/jqxxUpdateInfo?jqbh=${jqbh}`,
    method: 'get',
  })
}

// 查询警情信息
export function getMappedJqxxDetail(id) {
  return request({
    url: `/ds4jq/getMappedJqxxDetail`,
    method: 'post',
    params:{id}
  })
}

// 警情信息修改接口
export function jqxxUpdate(data) {
  return request({
    url: '/police/situation/jqxxUpdate',
    method: 'post',
    data: data
  })
}

/**
 * 获取总队列表
 * @returns {AxiosPromise}
 */
export function getSelelctAdmin(){
  return request({
    url: '/system/dept/queryGeneralDeptsList',
    method: 'get',
    params: {}
  })
}

/**
 * 跨区域警情录入（新）
 * @param data
 * @returns {AxiosPromise}
 */
export function kqyProJqxxAdd(data) {
  return request({
    url: '/police/situation/kqyJqxxAddNew',
    method: 'post',
    data: data
  })
}

/**
 * 跨区域警情录入列表（新）
 * @param data
 * @returns {AxiosPromise}
 */
export function kqyProJqxxList() {
  return request({
    url: '/data/aduit/cdxx/selectKqyDtbJqxxByZd',
    method: 'get',
    params: {}
  })
}

export function jqxxKqyUpdateInfo(jqbh) {
  return request({
    url: `/police/situation/kqyDtbJqxxTabList?jqbh=${jqbh}`,
    method: 'get',
  })
}

/**
 *  跨区域警情各总队增援出动录入
 * @param data
 * @returns {AxiosPromise}
 */
export function jqxxKyqAdd(data) {
  return request({
    url: '/data/aduit/cdxx/insertKqyJqxxCdxfdwByZd',
    method: 'post',
    data: data
  })
}

/**
 * 跨区域警情待填报tab-警情详情页
 * @param jqbh
 * @returns {AxiosPromise}
 */
export function jqxxZdTab(jqbh) {
  return request({
    url: '/police/situation/kqyDtbJqxxTabList',
    method: 'get',
    params: {jqbh}
  })
}

export function deriveFile(params) {
  return request({
    url: '/data/aduit/cdxx/cdxxByTimeDownload',
    method: 'post',
    params
  })
}

//出动审核导出
export function cdxxAuditByTimeDownload(params) {
  return request({
    url: '/data/aduit/cdxx/cdxxAuditByTimeDownload',
    method: 'post',
    params
  })
}

export function jqxxByTimeDownload(params) {
  return request({
    url: '/police/situation/jqxxByTimeDownload',
    method: 'post',
    params
  })
}

export function hzxxByTimeDownload(params) {
  return request({
    url: '/data/entry/zqxx/hzxxByTimeDownload',
    method: 'post',
    params
  })
}

export function hzxxAuditByTimeDownload(params) {
  return request({
    url: '/data/entry/zqxx/hzxxAuditByTimeDownload',
    method: 'post',
    params
  })
}