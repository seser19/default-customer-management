import request from "@/utils/request";

/**
 * 待审核列表
 * @returns {AxiosPromise}
 */
export const checkList = (data={}) =>
  request({
    url: '/filingAudit/checkList',
    method: "post",
    data
  })

/**
 * 已审核列表
 * @returns {AxiosPromise}
 */
export const passList = () =>
  request({
    url: '/filingAudit/passList',
    method: "post",
    data:{}
  })
/**
 * 审核操作
 * @returns {AxiosPromise}
 */
export const doAudit = data =>
  request({
    url: '/filingAudit/doAudit',
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
  })

/**
 *
 * @param eventId:事件id
 * @returns {AxiosPromise}
 */
export const getDetail = eventId =>
  request({
    url: '/filingAudit/getDetail/'+eventId,
    method: "get",
    params:{}
  })

/**
 *
 * @param eventId:事件id
 * @returns {AxiosPromise}
 */
export const matchingJqxx = eventId =>
  request({
    url: '/filingAudit/matchingJqxx/'+eventId,
    method: "get",
    params:{}
  })

/**
 * 根据警情编号获取事件
 * @param jqbh
 * @returns {AxiosPromise}
 */
export const getEvent = jqbh =>
  request({
    url: '/data/entry/zqxx/getCitizenFilingList',
    method: "post",
    params:{jqbh}
  })
