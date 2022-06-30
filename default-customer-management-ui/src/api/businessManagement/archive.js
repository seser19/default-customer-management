import request from '@/utils/request'

/********************************************批量归档接口****************************************** */
// 出动列表查询
export function batchArchiveCdQuery(data) {
  return request({
    url: '/archive/batchArchiveCdQuery',
    method: 'post',
    data
  })
}

// 查询挂起功能配置列表
export function batchArchiveZqQuery(data) {
  return request({
    url: '/archive/batchArchiveZqQuery',
    method: 'post',
    data
  })
}
// 归档接口
export function batchArchive(data) {
  return request({
    url: '/archive/batchArchive',
    method: 'post',
    data
  })
}

/************************************************************************************************ */