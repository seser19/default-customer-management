import request from '@/utils/request'

// 获取审核流程数据
export function actDiyConfigList(params) {
  return request({
    url: '/actDiyConfig/index',
    method: 'get',
    params
  })
}

// 提交审核流程数据
export function saveTmplToConfig(params) {
  return request({
    url: 'actDiyConfig/saveTmplToConfig',
    method: 'post',
    params
  })
}