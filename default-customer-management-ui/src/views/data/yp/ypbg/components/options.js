export const options = [
  "tb_dic_zqdj",//火灾等级
  "tb_dic_dcfs",//调查方式
  "tb_dic_hylb",//所属行业
  "tb_dic_jjlx",//经济类型
  "tb_dic_qhcslb",//起火场所类型
  "tb_dic_sjyc",//世界遗产代码
  "tb_dic_jzlb",//建筑类别
  "tb_dic_jzwnhdj",//建筑耐火等级
  "tb_dic_jzjg",//建筑结构
  "tb_dic_fhty",//防火分区 +++
  "tb_dic_yqhzrysjycd",//受教育程度
  "tb_dic_yqhzryjkzk",//健康状况
  "tb_dic_ssly",//损失来源
  "sys_user_sex",//人员性别
  "tb_dic_rynl",//人员年龄
  "tb_dic_ryjkzk",//健康状况
  "tb_dic_swyy",//致伤原因
  "tb_dic_ryly",//来源
  "tb_dic_ryly2",//来源2
  "tb_dic_ryzy",//职业
  "tb_dic_rysjycd",//受教育程度
  "tb_dic_swyy",//致死原因
  "tb_dic_swwz",//发现尸体位置
  // "tb_dic_swsj",//死亡时间
  "swsj",//死亡时间
  "tb_dic_grxzcf"//行政处罚
];

export const treeOptions = [
  {
    dictType: "swsj",//死亡时间
    parentValue: "",
    resName: "swsj"
  },
  // {
  //   dictType: "swsj",//死亡时间
  //   parentValue: "",
  //   resName: "swsjswsjdmItem1"
  // },
  {
    dictType: "qydm",//区域树形调用
    parentValue: "",
    resName: "qydm"
  },
  {
    dictType: "qydm",//区域树形调用2
    parentValue: 6,
    resName: "qydmItem2"
  },
  {
    dictType: "jdjcqk",//督查检查情况树
    parentValue: "",
    resName: "jdjcqk"
  },
  {
    dictType: "sgqtdcbm",//事故牵头部门
    parentValue: "",
    resName: "sgqtdcbm"
  },
  {
    dictType: "sstd",//疏散通道
    parentValue: "",
    resName: "sstd"
  },
  {
    dictType: "sstd",//疏散通道2
    parentValue: 2,
    resName: "sstdItem1"
  },
  {
    dictType: "yjck",//紧急出口
    parentValue: "",
    resName: "yjck"
  },
  {
    dictType: "yjck",//紧急出口2
    parentValue: 2,
    resName: "yjckItem1"
  },
  {
    dictType: "yjsszm",//应急疏散照明
    parentValue: "",
    resName: "yjsszm"
  },
  {
    dictType: "yjsszm",//应急疏散照明2
    parentValue: 2,
    resName: "yjsszmItem1"
  },
  {
    dictType: "jzyt",//建筑使用用途树
    parentValue: "",
    resName: "jzsyyt"
  },
  {
    dictType: "jzyt",//建筑使用用途树2
    parentValue: 3,
    resName: "jzsyytItem1"
  },
  {
    dictType: "sflw",//城市火灾报警系统
    parentValue: "",
    resName: "sflw"
  },
  {
    dictType: "sflw",//城市火灾报警系统2
    parentValue: 1,
    resName: "sflwItem1"
  }
];
