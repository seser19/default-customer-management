import request from '@/utils/request'

// 获取表格数据
export function selectTableData(queryParam, url) {
  return request({
    url: url,
    method: 'post',
    data: queryParam
  })
}
// 获取表格数据并下载
export function selectTableDataDownload(queryParam, url) {
  return request({
    url: url,
    method: 'post',
    data: queryParam
  })
}

// 获取统计数据
export function selectCommonCount(queryParam, url) {
  return request({
    url: url,
    method: 'post',
    data: queryParam
  })
}

// 加载已存在模板
export function loadExitsTemplate(queryParam) {
  return request({
    url: '/system/dict/treeData/query',
    method: 'get',
    params: queryParam
  })
}

// 加载适用范围
export function loadFitScopes(queryParam) {
  return request({
    url: '/system/dict/treeData/query',
    method: 'get',
    params: queryParam
  })
}
