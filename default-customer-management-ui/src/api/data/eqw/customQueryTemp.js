import request from "@/utils/request";
import qs from "qs";
/*自定义查询 模板保存，删除，修改 ，查询 API */


// 
export function tempListQuery(data) {
    return request({
      url: '/customzingTemplate/templateQry',
      method: 'post',
      data: data
    })
  }


  export function delOwenTemp(data) {
    return request({
      url: '/customzingTemplate/templateDel',
      method: 'post',
      data: data
    })
  }
  export function saveTemplate(data) {
    return request({
      url: '/customzingTemplate/templateSave',
      method: 'post',
      data: data
    })
  }
  