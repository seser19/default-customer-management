/**
 * 
 * @Author Miliky
 * @Date 2020/01/07 17:08
 */

/**
 * [companyCodeEnmu 单位编码对应省份简称]
 * @type {Object}
 */
const companyCodeEnmu={
	"11" : "bj",
	"12" : "tj",
	"13" : "he",
	"14" : "sx",
	"15" : "nmgzzq",
	"21" : "ln",
	"22" : "jl",
	"23" : "hlj",
	"31" : "sh",
	"32" : "js",
	"33" : "zj",
	"34" : "ah",
	"35" : "fj",
	"36" : "jx",
	"37" : "sd",
	"41" : "ha",
	"42" : "hb",
	"43" : "hn",
	"44" : "gd",
	"45" : "gx",
	"46" : "hi",
	"50" : "cq",
	"51" : "sc",
	"52" : "gz",
	"53" : "yn",
	"54" : "xz",
	"61" : "sn",
	"62" : "gs",
	"63" : "qh",
	"64" : "nx",
	"65" : "xj",
	"66" : "xjbt",
	"71" : "tw",
	"81" : "xgtbxzq",
	"82" : "amtbxzq"
}

/**
 * [getAccountNumberSuffix 根据单位 id 获取对应账号的后缀名]
 * @param  {String} code [单位 id]
 * @return {Array}      [返回一个“.{a|b|c|d}@地市简称”的数组]
 */
export function getAccountNumberSuffix(code){
	if (null === code || code == "" || code == undefined) {
		return "code Error ！";
	}
	let zongdui = code.substr(0,2),  // 总队
			zhidui = code.substr(2,2),   // 支队
			dadui = code.substr(4,2),    // 大队
			zhongdui = code.substr(6,2); // 中队或专职队

	/**
	 * [当总队编码为“10”开头时，返回.xf]
	 * @param  {String} zongdui [中队编码]
	 * @return {Array}         [后缀名]
	 */
	if (zongdui == "10") {
		return ["@xf"];
	}

	if (zhongdui != "00") {
		let oneCode = `.c@${getCompanyCodeEnmu(zongdui)}`;
		let twoCode = `.d@${getCompanyCodeEnmu(zongdui)}`;
		return new Array(oneCode, twoCode);
	}else if(dadui != "00"){
		let oneCode = `.b@${getCompanyCodeEnmu(zongdui)}`;
		return new Array(oneCode);
	}else if(zhidui != "00"){
		let oneCode = `.a@${getCompanyCodeEnmu(zongdui)}`;
		return new Array(oneCode);
	}else{
		let oneCode = `@${getCompanyCodeEnmu(zongdui)}`;
		return new Array(oneCode);
	}
}
/**
 * [getCompanyCodeEnmu 根据总队编码获取对应的枚举值]
 * @param  {[type]} companyCode [总队编码]
 * @return {[type]}             [对应省份的简称]
 */
function getCompanyCodeEnmu(companyCode){
	if (null == companyCode || companyCode == "" || companyCode == undefined ) {
		return "companyCode Error ！"
	}
	console.log(companyCodeEnmu.companyCode)
	return companyCodeEnmu[companyCode] || [];
}

/**
 * [getCompanyCode 获取单位编码]
 * @param  {String} code [上级单位编码]
 * @return {Array}      [数组第一位为单位编码前几位，第二位为单位编码后几位]
 */
export function getCompanyCode(code){
	if (null === code || code == "" || code == undefined) {
		return "code Error ！";
	}
	let one = code.substr(0,2),    // 前两位
			two = code.substr(2,2),    // 第三位和第四位
			three = code.substr(4,2),  // 第四位和第五位
			four = code.substr(6,2),   // 第五位和第六位
			end = code.substr(8);      // 剩余位数
	if (one == "10") {
		return new Array("", code.substr(2));
	}else if (two == "00") {
		return new Array(one, code.substr(4));
	}else if (three == "00") {
		return new Array(one+two, code.substr(6));
	}else if (four == "00") {
		return new Array(one+two+three, end);
	}
}
