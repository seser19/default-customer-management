import request from '@/utils/request'

// 查询标签
export function listTarget(query) {
  return request({
    url: '/tags/list',
    method: 'post',
    params: query
  })
}

// 添加标签
export function addTarget(query) {
  return request({
    url: '/tags/add',
    method: 'post',
    params: query
  })
}

// 修改标签
export function updateTarget(query) {
  return request({
    url: '/tags/update',
    method: 'post',
    params: query
  })
}

// 删除标签
export function delTarget(query) {
  return request({
    url: '/tags/delete',
    method: 'post',
    params: query
  })
}

// targetName模糊查询
export function targetNameTarget(query) {
  return request({
    url: '/tags/query',
    method: 'post',
    params: query
  })
}

// 业务打标
export function addBusinessTags(query) {
  return request({
    url: '/tags/addBusinessTags',
    method: 'post',
    params: query
  })
}

// 删除业务打标
export function deleteBusinessTags(query) {
  return request({
    url: '/tags/deleteBusinessTags',
    method: 'post',
    params: query
  })
}

// 查询业务标签
export function queryBusinessTags(query) {
  return request({
    url: '/tags/queryBusinessTags',
    method: 'post',
    params: query
  })
}
