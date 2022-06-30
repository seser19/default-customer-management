
/**
 * [getTimeLineInterval 计算时间线间隔]
 * @Author       Miliky
 * @DateTime     2020-02-03T16:59:18+0800
 * @Description: [一行代码一行诗]
 * @param        {String}                 timestamp1 [时间戳]
 * @param        {String}                 timestamp2 [时间戳]
 * @param        {Array}                 	arr        [待插入数组]
 * @return       {Boolean}                           [false结束方法]
 */
export function getTimeLineInterval(timestamp1, timestamp2, arr) {
	if(timestamp1 == 0 || timestamp1 == undefined || timestamp2 == undefined || arr == undefined ){ return false; }
	let num = parseInt(timestamp2) - parseInt(timestamp1);
	if (num > 0) {
		let nums = (num / 1000) >>> 2;
		if (nums == 0) 
			return false;
		else if(nums > 6)
			nums = 6;
		for (let i = 0; i < nums; i++) {
			arr.push({
				date: null,
				timeName: null,
				isNode: false,
				time: null,
				timestamp: null,
			})
		}
	}else{ 
		return false;
	}
}