import request from '@/utils/request'

// 查询行政区域弹出窗口 省市县
export function listAreaQuery(query) {
  return request({
    url: '/system/area/listAreaQuery',
    method: 'get',
    params: query
  })
}

// 查询区域列表
export function listArea(query) {
  return request({
    url: '/system/area/list',
    method: 'get',
    params: query
  })
}

// 查询区域详细
export function getArea(areaId) {
  return request({
    url: '/system/area/' + areaId,
    method: 'get'
  })
}

// 查询区域下拉树结构
export function treeselect(query) {
  return request({
    url: '/system/area/treeselect',
    method: 'get',
    params: query
  })
}

// 根据角色ID查询区域树结构
export function roleAreaTreeselect(roleId) {
  return request({
    url: '/system/area/roleAreaTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增区域
export function addArea(data) {
  return request({
    url: '/system/area',
    method: 'post',
    data: data
  })
}

// 修改区域
export function updateArea(data) {
  return request({
    url: '/system/area',
    method: 'put',
    data: data
  })
}

// 删除区域
export function delArea(areaId) {
  return request({
    url: '/system/area/' + areaId,
    method: 'delete'
  })
}

// 导出区域列表 excel
export function exportArea(query) {
  return request({
    url: '/system/area/export',
    method: 'get',
    params: query
  })
}
