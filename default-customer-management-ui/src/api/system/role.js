import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}
// 角色优化->角色管理->查询本单位及下级单位 角色列表（非系统）
export function listRoleByUserId(query) {
  return request({
    url: '/system/role/queryRoleByUserId',
    method: 'get',
    params: query
  })
}
// 角色优化->用户管理->修改用户->分配角色->查询系统角色 + 本单位 + 下级单位 角色列表
export function listRoleForRoleAssignment(query) {
  return request({
    url: '/system/role/queryRoleForRoleAssignment',
    method: 'get',
    params: query
  })
}
// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}