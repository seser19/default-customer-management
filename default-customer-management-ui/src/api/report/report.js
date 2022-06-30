import request from '@/utils/request'

// 查询获取报表
export function queryReport(params) {
  return request({
    url: '/report/ReportFourItems/getReportInfos',
    method: 'post',
    data: params
  })
}

export function getFireReport(params) {
  return request({
    url: '/report/getFireReportInfo',
    method: 'post',
    data: params
  })
}

export function synchronizeData() {
  return request({
    url: '/report/callTableGeneratedData',
    method: 'post',
    data: null
  })
}

export function getSynchronizeDataTime() {
  return request({
    url: '/report/getEtlTime',
    method: 'post',
    data: null
  })
}

export function getReportTemplateLv1(params) {
  return request({
    url: `/reportType/getRptLvlOne?deptLevel=${params.deptLevel}&rptSource=${params.rptSource || ''}`,
    method: 'get'
  })
}


export function getReportTemplateLv2(params) {
  return request({
    url: `/reportType/getRptLvlTwo?deptLevel=${params.deptLevel}&parentId=${params.parentId}&type=${params.type}&rptSource=${params.rptSource||""}`,
    method: 'get'
  })
}
//获取最后一次同步时间
export function getLastEtlTime(){
  return request({
    url:'/report/getLastEtlTime',
    method: 'get'
  })
}

// 获取自定义报表模板编号
export function getCustomReportTemplateCode() {
  return request({
    url: '/customReport/getCustomReportTempCode',
    method: 'post'
  });
}

// 获取自定义报表行配置
export function getCustomReportRowConfig(params) {
  return request({
    url: '/customReport/getCustomReportConfRowInfo',
    method: 'post',
    data: params
  });
}

// 获取自定义报表列配置
export function getCustomReportColumnConfig(params) {
  return request({
    url: '/customReport/getCustomReportConfColumnInfo',
    method: 'post',
    data: params
  });
}

// 编辑自定义报表模板（新增和修改）
export function editCustomReportTemplate(params) {
  return request({
    url: '/customReport/editCustomReportTemp',
    method: 'post',
    data: params
  });
}

// 获取自定义报表模板列表
export function getCustomReportTemplateList(params) {
  return request({
    url: '/customReport/getCustomReportTempList',
    method: 'post',
    data: params
  });
}

// 获取自定义报表模板详情
export function getCustomReportTemplateDetail(params) {
  return request({
    url: '/customReport/getCustomReportTempDetail',
    method: 'post',
    data: params
  });
}

// 更改自定义报表模板状态
export function updateCustomReportTemplateStatus(params) {
  return request({
    url: '/customReport/customReportTempStatusEdit',
    method: 'post',
    data: params
  });
}

//列表关联限制条件查询接口
export function getCustomReportRestrictValue(params) {
  return request({
    url: '/customReport/getCustomReportRestrictValue',
    method: 'post',
    data: params
  });
}
export function getReportInfos(params) {
  return request({
    url: '/customReportExcel/getReportInfos ',
    method: 'post',
    data: params
  });
}

export function getCombinationAreaName(params) {
   return request({
     url:'/customReport/getCombinationAreaName',
     method:'post',
     data:params
   });
}
