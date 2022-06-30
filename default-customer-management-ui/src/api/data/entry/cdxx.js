import request from "@/utils/request";
import qs from "qs";
/**
 * 警情填报
 */
const cdxxApi = {
  addNewDraft(data) {
    return request({
      url: `/data/aduit/cdxx/addNewDraft`,
      method: "post",
      data: data
    });
  },

  addNewInit(data) {
    return request({
      url: "/data/aduit/cdxx/addNewInit",
      method: "get",
      params:data
    });
  },
  // 待填报列表
  dtbCdxxList(data) {
    return request({
      url: "/data/aduit/cdxx/dtbCdxxList",
      method: "get",
      params: data
    });
  },
  // 草稿列表
  draftCdxxList(data) {
    return request({
      url: "/data/aduit/cdxx/draftCdxxList",
      method: "get",
      params: data
    });
  },

  // 查询出动信息
  getJqxx(cdbh, useHistory = false) {
    return request({
      url: '/data/aduit/cdxx/' + cdbh + '?useHistory=' + (useHistory ? '1' : '0'),
      method: "get"
    });
  },

  // 警情 待填报清单 填报 提交
  updateAndSendToActiviti(data) {
    return request({
      url: "/data/aduit/cdxx/updateAndSendToActiviti",
      method: "post",
      data
    });
  },

  // 查询出动草稿箱详情
  getDispatchDraftDetails(data) {
    return request({
      url: `/data/aduit/cdxx/draft/${data}`,
      method: "get"
    });
  },

  // 修改草稿
  updateDraft(data) {
    return request({
      url: "/data/aduit/cdxx/updateDraft",
      method: "post",
      data: data
    });
  },

  //删除草稿
  deleteDraft(data) {
    return request({
      url: "/data/aduit/cdxx/deleteDraft",
      method: "post",
      params: data
    });
  },

  //保存文件
  uploadFile(fileData) {
    return request({
      url: "/data/aduit/cdxx/uploadFile",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      method: "post",
      data: fileData
    });
  },

  //导入
  respondLinkPolice(params) {
    return request({
      url: "/data/aduit/cdxx/respondLinkPolice",
      method: "post",
      params
    });
  },

  // 审核出动信息
  changeAuditInfo(data) {
    return request({
      url: "/data/aduit/cdxx/changeAuditInfo",
      method: "post",
      data: data
    });
  }
};

const historyCdxx = {
  //48小时警情超时出动列表查询
  searchJqxxByTime(params) {
    return request({
      url: "/police/situation/searchJqxxByTime",
      method: "post",
      params
    });
  },
  // 查询已录出动出动列表信息
  searchCdxxHistory(params) {
    return request({
      url: "/data/aduit/cdxx/searchCdxxHistory",
      method: "post",
      params
    });
  },
  // 查询辖区出动出动列表信息
  searchCdxxHistoryDown(params) {
    return request({
      url: "/data/aduit/cdxx/searchCdxxHistoryDown",
      method: "post",
      params
    });
  },
  //48小时出动列表查询
  searchCdxxByTime(params) {
    return request({
      url: "/data/aduit/cdxx/searchCdxxByTime",
      method: "post",
      params
    })
  },
  
//出动审核超时
  searchCdxxAuditByTime(params) {
    return request({
     url: '/data/aduit/cdxx/searchCdxxAuditByTime',
      method: 'post',
      params
  })
}

};

export {
  cdxxApi,
  historyCdxx
};
