import request from "@/utils/request";

/**
 * 研判报告列表
 */

export function getYpbgList(data) {
    return request({
      url: '/ypbg/list',
      method: 'get',
      params: data
    });
}

/**
 * 二年年度报告
 */

export function getNdbg(year,areaId) {
  return request({
    url: `/demo/export3?timeId=${year}&cyc=Y&areaId=${areaId}&kpiId=Y10001`,
    responseType: 'blob',
    method: 'post',
    data:{}
  });
}
/*
**
* 一年年度报告
*
*/

export function getOneNdbg(year,areaId) {
  return request({
    url: `/demo/export4?timeId=${year}&cyc=Y&areaId=${areaId}&kpiId=Y10001`,
    responseType: 'blob',
    method: 'post',
    data:{}
  });
}

/**
 * 自定义分析报告
 * @param timeId 年份
 * @param areaId 地区
 * @param sjdmList 条件
 * @param ccType 是否预览
 * @returns {AxiosPromise}
 */

export function getZdy(timeId='2020', areaId,sjdmList=[],ccType=0) {
  return request({
    url: `/demo2/export4?areaId=${areaId}&cyc=Y&kpiId=Y10001&timeId=${timeId}${sjdmList.map(r=>'&sjdmList='+r).join('')}&ccType=${ccType}`,
    method: 'post',
    responseType: 'blob',
    data:{}
  });
}
export function getZdyYl(timeId='2020', areaId,sjdmList=[]) {
  return request({
    url: `/demo2/export4?areaId=${areaId}&cyc=Y&kpiId=Y10001&timeId=${timeId}${sjdmList.map(r=>'&sjdmList='+r).join('')}&ccType=1`,
    method: 'post',
    data:{}
  });
}

/**
 * 获取配置项
 * @returns {AxiosPromise}
 */
export function getMsd() {
  return request({
    url: `/demo3/selectWordMsbyId`,
    method: 'post',
   data:{}
  });
}

/**
 *
 * @param areaId 地区
 * @param beginTimeId 开始年份
 * @param endTimeId 结束年份
 * @param beginMonth 开始月份
 * @param endMonth 结束月份
 * @param beginDay 开始日期
 * @param endDay 结束日期
 * @returns {AxiosPromise}
 */
export function getJqZb( areaId,beginTimeId,endTimeId,beginMonth,endMonth,beginDay,endDay) {
  return request({
    url: `/demo/export5?areaId=${areaId}&cyc=Y&kpiId=Y10001&beginTimeId=${beginTimeId}&endTimeId=${endTimeId}&beginMonth=${beginMonth}&beginDay=${beginDay}&endMonth=${endMonth}&endDay=${endDay}`,
    method: 'post',
    responseType: 'blob',
    data:{}
  });
}

