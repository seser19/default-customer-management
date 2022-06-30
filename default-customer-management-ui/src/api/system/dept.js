import request from '@/utils/request'

/**
 * 查询部门列表
 * @param {Object} query 两个字段二选一
 * parentId 父级 id
 * deptName 全局检索关键词
 */
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询全部部门列表
 * @param {Object} query 两个字段二选一
 * parentId 父级 id
 * deptName 全局检索关键词
 */
export function ksList(query) {
  return request({
    url: '/system/dept/ksList',
    method: 'get',
    params: query
  })
}

export function listDeptPage(query) {
  return request({
    url: '/system/dept/listPage',
    method: 'get',
    params: query
  })
}

/**
 * 查询责任区大队列表
 * @param {Object} query 两个字段二选一
 * parentId 父级 id
 * deptLevel 部门层级
 * deptName 全局检索关键词
 */
export function listDeptCheck(query) {
  return request({
    url: '/system/dept/checkDeptList',
    method: 'get',
    params: query
  })
}
/**
 * 查询责任区大队列表
 * @param {Object} query 两个字段二选一
 * parentId 父级 id
 * deptLevel 部门层级
 * deptName 全局检索关键词
 */
export function checkKsDeptList(query) {
  return request({
    url: '/system/dept/checkKsDeptList',
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect(query) {
  return request({
    url: '/system/dept/treeselect',
    method: 'get',
    params: query
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}

// 导出单位列表 excel
export function exportDept(query) {
  return request({
    url: '/system/dept/export',
    method: 'get',
    params: query
  })
}

// 查询当前所属总队
export function getLvl2DeptId() {
  return request({
    url: '/system/dept/getLvl2DeptId',
    method: 'get'
  })
}
