const fireOption = [
  'tb_dic_zqdj', // 火灾等级
  'tb_dic_jjlx', // 经济类型
  'tb_dic_hylb', // 所属行业
  'tb_dic_qhcslb', // 起火场所类型
  'tb_dic_jzlb', // 建筑类别
  'tb_dic_jzwnhdj', // 建筑耐火等级
  'tb_dic_jzjg', // 建筑结构
  'tb_dic_fhty', // 防火分区
  'tb_dic_dcfs'//调查方式
]
const fireTreeOption = [
  // 督查检查情况树
  {
    dictType: 'jdjcqk',
    parentValue: '',
    resName: 'jdjcqk'
  },
  // 事故牵头部门
  {
    dictType: 'sgqtdcbm',
    parentValue: '',
    resName: 'sgqtdcbm'
  },
  // 疏散通道
  {
    dictType: 'sstd',
    parentValue: '',
    resName: 'sstd'
  },
  // 紧急出口
  {
    dictType: 'yjck',
    parentValue: '',
    resName: 'yjck'
  },
  // 应急疏散照明
  {
    dictType: 'yjsszm',
    parentValue: '',
    resName: 'yjsszm'
  },
  // 建筑使用用途
  {
    dictType: 'jzyt',
    parentValue: '',
    resName: 'jzsyyt'
  },
  // 联网情况
  {
    dictType: 'sflw',
    parentValue: '',
    resName: 'sflw'
	},
  {
    dictType: 'qydm',
    parentValue: '6',
    resName: 'qydmItem2',
  },
  {
    dictType: 'qydm',
    parentValue: '',
    resName: 'qydm'
  },
  {
    dictType: 'xfssqk',
    parentValue: '',
    resName: 'xfssqk'
  }
]
const optionsList = {
  tb_dic_zqdj: [],
  tb_dic_jjlx: [],
  tb_dic_hylb: [],
  tb_dic_qhcslb: [],
  tb_dic_jzlb: [],
  tb_dic_jzwnhdj: [],
  tb_dic_jzjg: [],
  tb_dic_fhty: [],

  jdjcqk: [],
  sgqtdcbm: [],
  sstd: [],
  yjck: [],
  yjsszm: [],
  jzyt: [],
  sflw: [],

	xfssqk: [],
	qydm:[],
  qydmItem2:[],
}

const cdOptions = [
  'tb_dic_czqk', // 处置情况
  'tb_dic_hzqk', // 到场时火灾情况
  'tb_dic_hyzgbm', // 行业主管部门
  'tb_dic_ddzhzw', // 带队指挥员职务
  'tb_dic_xczh', // 全勤指挥部
  'tb_dic_fx', // 风向
  'tb_dic_qh' // 天气
]

const cdOptionsList = {
  tb_dic_czqk: [],
  tb_dic_hzqk: [],
  tb_dic_hyzgbm: [],
  tb_dic_ddzhzw: [],
  tb_dic_xczh: [],
  tb_dic_fx: [],
  tb_dic_qh: []
}

// ***********伤亡查询**********
const casualty = [
  "sys_user_sex",     // 人员性别
  "tb_dic_ryjkzk",    // 健康状况
  "tb_dic_swyy",      // 致伤原因
  "tb_dic_ryzy",      // 职业
  "tb_dic_rysjycd",   // 受教育程度
  "tb_dic_ryly"       // 来源
]
const casualtyOptionsList = {
  sys_user_sex:[],     // 人员性别
  tb_dic_ryjkzk:[],    // 健康状况
  tb_dic_swyy:[],      // 致伤原因
  tb_dic_ryzy:[],      // 职业
  tb_dic_rysjycd:[],   // 受教育程度
  tb_dic_ryly:[]       // 来源
}

export {
  fireOption,
  fireTreeOption,
  optionsList,
  cdOptions,
  cdOptionsList,
  casualty,
  casualtyOptionsList
}

