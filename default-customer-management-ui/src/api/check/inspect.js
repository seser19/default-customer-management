import request from "@/utils/request";

/**
 * 稽查数据查询条件
 */

export function querytermlist(data) {
  return request({
    url: '/audit/querytermlist',
    method: 'post',
    data: data
  });
}
export function jqAuditList(data) {
  return request({
    url: '/audit/jqAuditList',
    method: 'post',
    data: data
  });
}
