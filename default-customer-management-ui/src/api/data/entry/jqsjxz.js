import request from '@/utils/request'

/**
 * 警情限制列表
 * @param data
 * @returns {AxiosPromise}
 */
export const list = (data={})=> {
    return request({
      url: `/system/restrict/list`,
      method: "get",
      params: data
    });
  }
/**
 * 增加警情时间限制初
 * @param data
 * @returns {AxiosPromise}
 */
export const postList = (data={})=> {
  return request({
    url: `/system/restrict/addBatch`,
    method: "post",
    data: data,
    headers:{"Content-Type":"multipart/form-data"}
  });
}
/**
 * 警情时间限制删除
 * @param id
 * @returns {AxiosPromise}
 */
export const del = (id)=> {
  return request({
    url: `/system/restrict/del/${id}`,
    method: "post",
    data: {}
  });
}
/**
 * 警情时间限制初始化
 * @param data
 * @returns {AxiosPromise}
 */
export const init = (data={})=> {
  return request({
    url: `/system/restrict/init`,
    method: "get",
    params: data
  });
}
