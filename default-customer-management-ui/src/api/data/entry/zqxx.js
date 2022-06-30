import request from '@/utils/request'

// 获取基本方式数据
export function getSelectOptions(type) {
  return request({
    url: '/system/dict/data/dictType/' + type,
    method: 'get'
  })
}


// 获取树形数据字典
export function getTreeOptions(data) {
  return request({
    url: '/system/dict/treeData/query',
    method: 'get',
    params:data
  })
}

// 起火场所
export function getFirePlaceOptions(data) {
  return request({
    url: '/system/dict/treeData/query',
    method: 'get',
    params:data
  })
}


// 起火物树形图
export function getFireObjectOptions(data) {
  return request({
    url: '/system/dict/treeData/query?dictType=qhw',
    method: 'get',
    params:data
  })
}

// 起火原因树形图
export function getFireReasonOptions(data) {
  return request({
    url: '/system/dict/treeData/query?dictType=qhyy',
    method: 'get',
    params:data
  })
}

// 填报+++++
export function saveWrite(data) {
  return request({
    url: '/data/entry/zqxx/saveWrite',
    method: 'post',
    data: data
  })
}

// 上传文件
export function UploadFile(data) {
  return request({
    url: '/data/entry/zqxx/uploadFile',
    method: 'post',
    data: data,
    headers:{'Content-Type':'multipart/form-data'}
  })
}


// 上传图片
export function UploadPicFile(data) {
  return request({
    url: '/data/entry/zqxx/uploadPicAddWaterMark',
    method: 'post',
    data: data,
    headers:{'Content-Type':'multipart/form-data'}
  })
}

// 查询代填报信息
export function queryYetFill(data) {
  return request({
    url: '/data/entry/zqxx/query',
    method: 'get',
    params: data,
  })
}

// 灾情确认转派
export function zqRedeploy(data) {
  return request({
    url: '/data/entry/zqxx/transfer',
    method: 'get',
    params: data,
  })
}

// 灾情确认转派
export function backToZrqdd(data) {
  return request({
    url: '/data/entry/zqxx/backToZrqdd',
    method: 'get',
    params: data,
  })
}

// 挂机查询数据
export function queryhook(data) {
  return request({
    url: '/data/entry/zqxx/queryCaoGao',
    method: 'get',
    params: data,
  })
}

// 导入确认
export function affirmHook(data) {
  return request({
    url: '/data/entry/zqxx/doLink',
    method: 'get',
    params: data,
  })
}

// 获取中队信息
export function getMiddleInfo(data) {
  return request({
    url: '/system/dept/querySecondDepts',
    method: 'get',
    params: data,
  })
}


// 导入查询接口
export function queryHookinfo(data) {
  return request({
    url: '/data/entry/zqxx/queryCaoGao',
    method: 'get',
    params: data,
  })
}

// 删除草稿数据
export function deleteCaogao(query) {
  return request({
    url: '/data/entry/zqxx/deleteCaogao',
    method: 'post',
    params: query
  })
}

// 导入查询接口
// export function queryHookinfo(data) {
//   return request({
//     url: '/data/entry/zqxx/queryCaoGao',
//     method: 'get',
//     params: data,
//   })
// }

// 查询火警类别option
export function getHjlb(query) {
  return request({
    url: '/system/dict/data/dictType/tb_dic_zqdj',
    method: 'get',
    params: query
  })
}


// 查询火灾信息
export function lszqxxList(query) {
  return request({
    url: '/data/entry/zqxx/queryHisData',
    method: 'post',
    params: query
  })
}

// 查询辖区内的火灾信息
export function queryDeptHisData(query) {
  return request({
    url: '/data/entry/zqxx/queryDeptHisData',
    method: 'post',
    params: query
  })
}

// 历史灾情删除
export function lszqscList(query) {
  return request({
    url: '/data/entry/zqxx/deleteHisData',
    method: 'post',
    params: query
  })

}
// 历史灾情删除
export function lszqscListNew(query) {
  return request({
    url: '/data/entry/zqxx/deleteHisDataNew',
    method: 'post',
    params: query
  })

}
// 火灾信息详情
export function lszqDetailList(query) {
  return request({
    url: '/data/entry/zqxx/getHisDataDetail',
    method: 'get',
    params: query
  })
}

// 火灾历史单信息
export function getFireHistoryFormInfo(params) {
  return request({
    url: '/data/entry/zqxx/getOldZqxxDateDetail',
    method: 'get',
    params
  })
}


// 起火场所树形单选
export function getQhcs(query) {
  return request({
    url: '/system/dict/treeData/queryQhcs',
    method: 'get',
    params: query
  })
}



// 头部警情信息查询
export function getJqxxList(query) {
  return request({
    url: '/data/entry/zqxx/queryJqxxDetail',
    method: 'get',
    params: query
  })
}


// 出动查询
export function getCdxxList(query) {
  return request({
    url: '/data/entry/zqxx/queryCdxxDetail',
    method: 'get',
    params: query
  })
}


// 根据数 的value查询 label
export function getTreeLabel(query) {
  return request({
    url: '/system/dict/treeData/queryTreeDataLabels',
    method: 'get',
    params: query
  })
}

// 开始审核接口
export function doAduit(param){
  return request({
    url: '/data/entry/zqxx/doAduit',
    method: 'post',
    data: param
  })
}
//获取图片列表
export function getHisDataPic(params){
  return request({
    url: '/data/entry/zqxx/getHisDataPic',
    method: 'get',
    params
  })
}

// 草稿修改接口
export function updateCaogao(data) {
  return request({
    url: '/data/entry/zqxx/updateCaogao',
    method: 'post',
    data
  })
}

// 草稿回显查询接口
export function getHisCaogaoDataDetail(params) {
  return request({
    url: '/data/entry/zqxx/getHisCaogaoDataDetail',
    method: 'post',
    params
  })
}

// 火场图片删除
export function deletePicByAvater(params) {
  return request({
    url: '/data/entry/zqxx/deletePicByAvater',
    method: 'post',
    params
  })
}

// 警情火灾保存接口
export function saveJqAndZq(data) {
  return request({
    url: '/data/entry/zqxx/saveJqAndZq',
    method: 'post',
    data
  })
}

// 获取是是否是中队
export function validateIsZd() {
  return request({
    url: '/data/entry/zqxx/validateIsZd',
    method: 'post',
  })
}

// //填报率接口
export function repprtFill(data) {
  return request({
    url: '/report/reportRateStatistics',
    method: 'put',
    data:data
  })
}

// 判断“其他/轻微火灾”是否是火灾扑救
export function checkSlightFire() {
  return request({
    url: '/data/entry/zqxx/isSlightFireTreatment',
    method: 'get'
  })
}

//查询72小时内火灾列表
export function queryHzxxByTime(params) {
  return request({
    url: '/data/entry/zqxx/queryHzxxByTime',
    method: 'post',
    params
  })
}

//火灾审核超时
export function queryHzxxAuditByTime(params) {
  return request({
    url: '/data/entry/zqxx/queryHzxxAuditByTime',
    method: 'post',
    params
  })
}