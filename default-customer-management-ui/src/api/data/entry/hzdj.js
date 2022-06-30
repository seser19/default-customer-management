import request from "@/utils/request";
const COMMON = "/simple/registration";

export const getDownLoad = bh =>{
  return request({
    url: COMMON + '/importPdf',
    method: "get",
    params: {bh},
    responseType: 'blob'
  });
}
export const getDownLoadPic = bh =>{
  return request({
    url: COMMON+'/importScenePic',
    method: "get",
    params: {bh},
    responseType: 'blob'
  });
}
export const getDdshXcAllData = data => {
  return request({
    url: COMMON + '/selectYshListAll',
    method: "post",
    params: data
  });
};
export const getDdshYsAllData = data => {
  return request({
    url: COMMON + '/selectAllTbYsxxByDD',
    method: "post",
    params: data
  });
};

export const getDdshXcData = data => {
  return request({
    url: COMMON + "/selectDshList",
    method: "post",
    params: data
  });
};
export const getXcdjCxData = data => {
  return request({
    url: COMMON + '/selectJsDshList',
    method: "post",
    params: data
  });
};
export const getYsgzCxData = data => {
  return request({
    url: COMMON + '/jyselectTbYsxxByDD',
    method: "post",
    params: data
  });
};
export const getXcCxData = data => {
  return request({
    url: COMMON + '/selectJsYshList',
    method: "post",
    params: data
  });
};
export const getYsCxData = data => {
  return request({
    url: COMMON + '/jyselectAllTbYsxxByDD',
    method: "post",
    params: data
  });
};

export const getDdshYsData = data => {
  return request({
    url: COMMON + "/selectTbYsxxByDD",
    method: "post",
    params: data
  });
};

export const postXcdjSh = data => {
  return request({
    url: COMMON + "/updateTbDjxxShzt",
    method: "post",
    params: data
  });
};
export const postYsgzSh = data => {
  return request({
    url: COMMON + "/shTbysxx",
    method: "post",
    params: data
  });
};
export const selectAllTbYsxx = () => {
  return request({
    url: COMMON + '/selectAllTbYsxx',
    method: "post"
  });
};

//场所类型分类
export const getCslx = () => {
  return request({
    url: '/system/dict/data/dictType/tb_dic_qhcslb',
    method: "get"
  });
};

//报表
export const getbb = data => {
  return request({
    url: '/jydjReport/getFireReportInfo',
    method: "post",
    data
  });
};

//登记驳回
/**
 *
 * @param 登记编号
 * @returns {AxiosPromise}
 */
export const djxxbh = data => {
  return request({
    url: COMMON+'/djReject',
    method: "post",
    data
  });
};

//登记驳回
/**
 *
 * @param 登记编号
 * @returns {AxiosPromise}
 */
export const djDelet = data => {
  return request({
    url: COMMON+'/djDelet',
    method: "post",
    data
  });
};
/**
 *
 * @param data
 * @returns {AxiosPromise}
 */
export const sfzd = data => {
  return request({
    url: COMMON+'/sfzd',
    method: "post",
    data
  });
};
