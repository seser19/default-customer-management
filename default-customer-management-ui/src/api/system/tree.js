import request from '@/utils/request'
// 获取区域树形数据字典
export function getTree(data) {
  return request({
    url: '/system/dict/treeData/query',
    method: 'get',
    params: data
  })
}