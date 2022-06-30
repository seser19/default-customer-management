import request from '@/utils/request'

/*****************处理监督新接口 */
// 查询任务列表
export function getDealTaskList(query) {
  return request({
    url: '/statistical/supervision/getDealTaskList',
    method: 'get',
    params: query
  })
}

// 查询任务详情列表
export function getDealTaskTeamById(query) {
  return request({
    url: '/statistical/supervision/getDealTaskTeamById',
    method: 'get',
    params: query
  })
}
//处理监督
export function doSupervise(query) {
  return request({
    url: '/statistical/supervision/doSupervise',
    method: 'post',
    params: query
  })
}


/*****************处理监督老接口 */
// 查询任务列表
export function listTask(query) {
  return request({
    url: '/check/deal/list',
    method: 'get',
    params: query
  })
}

// 查询任务详细
export function getTask(taskId) {
  return request({
    url: '/check/deal/' + taskId,
    method: 'get'
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/check/deal',
    method: 'post',
    data: data
  })
}

// 修改任务
export function updateTask(data) {
  return request({
    url: '/check/deal',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delTask(taskId) {
  return request({
    url: '/check/deal/' + taskId,
    method: 'delete'
  })
}
