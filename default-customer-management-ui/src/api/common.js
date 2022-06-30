// 通用接口文档
import request from '@/utils/request'

/**
 * 出动 / 火灾 通用的查询当前用户审核列表数据
 * @param {Object} data
 * 出动
 *    instType	查询列表类型(respond:出动；disaster:灾情)
 *    cdbh	出动编号
 *    jqbh	警情编号
 *    xzqydm	行政区域代码
 * 		xzqymc	行政区域名称
 *    jqfsdd	警情发生地点
 *    sjlbdm	警情类型
 *    czxsdm	参战形式
 *    shzt	审批状态
 *    pageNum 1
 *    pageSize 10
 *    params{}
 *  		beginTime	yyyy-MM-dd
 * 			endTime	yyyy-MM-dd
 *
 * 火灾
 *    instType	查询列表类型(respond:出动；disaster:灾情)
 *    zqbh	火灾编号
 *    xzqydmSj	行政区域代码
 *    jqfsdd	警情地址
 *    jqdj	警情等级
 *    qhdd	起火地点
 *    qhcslb	起火场所
 *    qhwfldm	起火物
 *    hzyyfldm	起火原因
 *    isSw	人员伤亡 1 || 0
 *    shzt	报告状态
 *    pageNum 1
 *    pageSize 10
 *    params{}
 *  		beginTime	yyyy-MM-dd
 * 			endTime	yyyy-MM-dd
 */
export function getAssigneeList(data) {
  return request({
    url: '/checkManager/getAssigneeList',
    method: 'post',
    params: data
  })
}
export function getResetFill(data) {
  return request({
    url: '/simple/registration/resetFill',
    method: 'post',
    params: data
  })
}

/**
 * 获取单位列表的通用接口
 * @param {Object} query 两个字段二选一
 * parentId 父级 id
 * deptLevel 部门层级
 * deptName 全局检索关键词
 */
export function checkDeptList(query) {
  return request({
    url: '/system/dept/checkDeptList',
    method: 'get',
    params: query
  })
}

// 图片上传添加水印的接口地址
export const picUploadAddWatermarkUrl = '/data/aduit/cdxx/uploadWaterMarkImg';
