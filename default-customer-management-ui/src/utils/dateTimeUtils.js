import formatterDate from './index.js'
/**
 * 时间工具类
 * @author Miliky
 * @date 2020/01/06 16:56
 */

/**
 * 获取一个时间段, 时间格式yyyy-MM-dd
 *
 * [getNearlyRecentDays 获取近多少天的时间段，从当前时间起。时间格式yyyy-MM-dd]
 * @param  {Number} date   [获取近多少天,默认获取近30天]
 * @return {Array}        [返回一个数组，开始时间和结束时间]
 */
export function getNearlyRecentDays(date=30){
    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * date);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 0);
    return new Array(formdate(start), formdate(end));
}


export function getNearlyRecentYear(date){
  let end = new Date();
  let start = new Date(2019,0,1);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 0);
  return new Array(formdate(start), formdate(end));
}

/*
 *获取当年时间从1月1日零点起到当前时间
 * @return {Array} [返回一个数据，开始-结束]
 */
export function getInitTime() {
  let firstDay = new Date();
  firstDay.setMonth(0);
  firstDay.setDate(1);
  firstDay.setHours(0, 0, 0, 0);
  let lastDay = new Date();
  return[formdate(firstDay),formdate(lastDay)];
}

export function formdate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}
