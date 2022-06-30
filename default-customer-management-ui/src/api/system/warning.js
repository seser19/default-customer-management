import request from '@/utils/request'

/**
 * 创建预警
 * @param data
 * @returns {AxiosPromise}
 */
export function createWarning(data) {
  return request({
    url: '/home/thresholdWarn/addThresholdWarningBatch',
    method: 'post',
    data:[data]
  })
}

/**
 * 查询阈值
 * @param data
 * @returns {AxiosPromise}
 */
export function getWarningList(data={}){
  return request({
    url:'/home/thresholdWarn/getActivedList',
    method:'get',
    params:data
  })
}

/**
* 更新阈值
* @param data
* @returns {AxiosPromise}
*/
export function updateWarningList(data={}){
  return request({
    url:'/home/thresholdWarn/updateThresholdWarning',
    method:'post',
    params:data
  })
}



/**
* 删除阈值
* @param  IdsArray
* @returns {AxiosPromise}
*/
export function delWarningList(IdsArray){
  return request({
    url:'/home/thresholdWarn/deleteThresholdWarningBatch',
    method:'get',
    params:{ids:IdsArray.join(',')}
  })
}

/**
 *
 * @param thresholdArea 阈值类型的地区id
 * @param thresholdCyc 阈值类型的时间(年：Y；月：M)
 * @returns {AxiosPromise}
 */
export function getWarningByArea(thresholdArea,thresholdCyc){
  return request({
    url:'/home/thresholdWarn/getWarningInfo',
    method:'post',
    params:{thresholdArea,thresholdCyc}
  })
}

/**
 * 获取首页数据并组装
 * @param areaId
 * @param cyc
 * @returns {Promise<unknown>}
 */
export function getWarningData(areaId,cyc){
  return new Promise(async resolve=>{
    const data = {}
    const { data:indexData1 } = await request({url:`/home/morePage/getIndexWarning?cyc=${cyc}&areaId=${areaId}&kpiId=Y10001`,method:'post',data:{}})
    const { data:indexData2 } = await request({url:`/home/morePage/getPieChartDatas?cyc=${cyc}&areaId=${areaId}&kpiId=Y10001`,method:'post',data:{}})
    if(indexData1.length){
      const s = indexData1[0]
      data['1'] = s.zqsCnt;
      data['2'] = s.hzqsCnt;
      data['10'] = s.qwhzCnt;
      data['8'] = s.swrsCnt;
      data['9'] = s.ssrsCnt;
      data['11'] = s.zjssFee;
      data['12'] = s.hzqsCnt;
    }
    if(indexData2.length){
      const qxjy = indexData2.find(r=>r.indexName==='抢险救援');
      const shjz = indexData2.find(r=>r.indexName==='社会救助');
      const gwzq = indexData2.find(r=>r.indexName==='公务执勤');
      const fkpb = indexData2.find(r=>r.indexName==='反恐排爆');
      const qtcd = indexData2.find(r=>r.indexName==='其他出动');
      qxjy?data['3'] = qxjy.indexValue:'';
      shjz?data['4'] = shjz.indexValue:'';
      gwzq?data['5'] = gwzq.indexValue:'';
      fkpb?data['6'] = fkpb.indexValue:'';
      qtcd?data['7'] = qtcd.indexValue:'';
    }
    resolve(data)
  })
}
