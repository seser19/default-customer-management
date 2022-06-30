import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'delete'
  })
}

/**
 * 上传公告附件
 * @param {Object} data 
 *    file 
 *    ggbh 公告编号,非必填
 */
export function uploadAttachment(data) {
  return request({
    url: '/system/notice/uploadAttachment',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    method: 'post',
    data: data
  })
}
