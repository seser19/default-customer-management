import request from '@/utils/request'

// 查询挂起功能配置列表
export function listConfig(query) {
  return request({
    url: '/system/handUpConfig/list',
    method: 'get',
    params: query
  })
}

// 查询挂起功能配置详细
export function getConfig(id) {
  return request({
    url: '/system/config/' + id,
    method: 'get'
  })
}

// 新增 挂起功能配置
export function addConfig(data) {
  return request({
    url: '/system/handUpConfig',
    method: 'post',
    data: data
  })
}

// 修改 挂起功能配置
export function updateConfig(data) {
  return request({
    url: '/system/handUpConfig',
    method: 'put',
    data: data
  })
}

// 删除挂起功能配置
export function delConfig(id) {
  return request({
    url: '/system/handUpConfig/' + id,
    method: 'delete'
  })
}
