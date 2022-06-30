export const formList = {
    xzqydm:"", //行政区域代码
    jqbh: "",//警情编号
    zqlbdm: "",// 灾情类别代码
    qwhz:"",//轻微火灾
    // 基本信息
    sfdcz: "0",//是否正在调查
    zqsj: "",//起火时间
    zqdd: "",//起火地点
    lxdh: "",//失火单位/户主联系电话
    dwtyshxydm: "",//单位统一社会信用代码
    sfcz: '0', // 是否成灾
    qydm: "",//区域
    czc: "",//城中村
    qydmItem2: "",//区域2
    jdjcqk: "",//监督检查情况
    jdjcqkItems:'',
    jdjcqkItem1: "",//监督检查情况2
    jdjcqkItem2: "",//监督检查情况3
    sgqtdcbm: "",//事故调查牵头部门
    sgqtdcbmItem1: "",//事故调查牵头部门2
    hylbdm: "",//所属行业
    jjlxdm: "",//经济类型

    // 起火场所信息
    qhcslb: "",//起火场所类型+++++++++++
    qhcsmc: "",//起火场所名称
    zqxxQhcsList: "",//起火场所列表
    qhcsdm: "",//起火场所代码

    isyc: "",//是否属于世界遗产
    sfsjycdm: "",//世界遗产2
    jzsyyt: "",//建筑使用用途
    jzsyytItem1: "",//建筑使用用途2
    jzlbdm: "",//建筑类别
    dxzht: "",//大型综合体
    jznhdjdm: "",//建筑耐火等级
    jzjgdm: "",//建筑结构

    // 火灾及失火建筑情况描述
    hzsfmydljjz: "0",//火灾蔓延到邻近建筑
    sffshr: "0",//发生轰然
    shjzmcsfkq: "0",//失火建筑门窗在火灾过程中开启
    jzzlcs: "",//建筑总楼层数
    shlc: "",//失火楼层

    // 消防设施
    zdbjxtsfaz: "",//自动报警系统(含独立报警)
    zdbjxtsfazItem1: "",
    zdbjxtsfazItem2: "",
    zdbjxtsfazItem3: "",
    zdmhxtsfaz: "",//自动灭火系统(含简易喷淋)
    zdmhxtsfazItem1: "",
    zdmhxtsfazItem2: "",
    zdmhxtsfazItem3: "",
    fpyxtsfaz: "",//防排烟系统
    fpyxtsfazItem1: "",
    fpyxtsfazItem2: "",
    fpyxtsfazItem3: "",
    fhjl: "",//防火卷帘
    fhjlItem1: "",
    fhjlItem2: "",
    fhjlItem3: "",
    snxhsxtsfaz: "",//室内消火栓系统
    snxhsxtsfazItem1: "",
    snxhsxtsfazItem2: "",
    snxhsxtsfazItem3: "",
    fhfq: "",//防火分区
    fhfqIiem1: "0",//米
    fhjj: "",//防火间距
    fhjjItem1: "0",//米
    sstd: "",//疏散通道
    sstdItem1: "",
    yjck: "",//紧急出口
    yjckItem1: "",
    yjsszm: "",//应急疏散照明
    yjsszmItem1: "",
    sflw: "",//与城市火灾报警系统、城市消防远程监控系统或智慧消防系统联网情况
    sflwItem1: "",//
    sfbx: "",//是否保险
    sfbxItem1: "",
    sfdfhzsh: "",//是否单方火灾事故

    // 起火原因
    qhwms: "",//起火物名称+++++++++++++++
    qhwfldm: "",//起火物代码
    qhwmsItem1: "",//起火物其他
    hzyyflmc: "",//起火原因名称++++++++++++++
    hzyyfldm: "",//起火原因代码
    bpchzyymc: "",//不排除原因名称+++++++++++
    zqxxBpchzyyList: "",//不排除火灾原因列表

    // 引起火灾原因人员情况 //
    zqxxYqhzry: {
        // 年龄
        nl: "",
        // 受教育情况
        sjycddm: "",
        // 健康状况
        jkzkdm: ""
    },

    // 直接经济损失
    dcfs: "",//调查方式
    zjccss: "",//直接财产损失（元)
    hzxcczfy: "",//火灾现场处置费用（元)
    ryswzc: "",//人身伤亡支出（元)
    ssly: "",//损失来源
    ghmj: "",//过火面积（平方米）
    szhs: "",//受灾户数（户）
    szrs: "",//直接受灾人数（人）

    // 人员伤亡情况
    zqxxRyswList: [],//人员受伤名单

    // 处理情况 - 两案处理
    sfla: "",//是否立案
    zjrs: "",//追究人数
    jyclrs: "",//建议处理人数

    // 处理情况 - 火灾处罚情况
    zqxxDwclList: [],//单位列表
    zqxxGrclList: [],//个人列表
    // 刑事放火
    sfxsfh: "0",//是否属于刑事放火
    zqxxXsfh: {
        yjzl: "",// 移交资料
        ajjg: "",// 案件结果
        xcqkbg: ""// 现场情况报告
    },

    // 安全生产事故
    sfaqscsg: "0",//是否属于安全事故
    zqxxAqscsg: {
        ygzfwj: "",//有关政府文件
        xcqkbg: "",//现场情况报告
    },

    // 火场图片
    hctp: "",

    // 其他
    qtsm: "",//其他说明
    ygfjsc: "",//相关附件上传
};

// 自定义表单校验：失火单位/户主联系电话
const lxdhValidate = (rule, value, callback) => {
    if (value && value.length > 30) {
        callback(new Error('联系号码过长'));
    } else {
        callback();
    }
};
// const jzlbdm = (rule, value, callback) =>{
//     console.log(rule, value)
//     if (value === "") {
//         callback(new Error("请输入"));
//         } else {
//         callback();
//     }
// }

export const rulesList = {

    qhcsms:[{ required: true, message: "请输入", trigger: "change" }],
    //警情验证
    provName:[{ required: true, message: "请输入", trigger: "blur" }],
    jqfsdd:[{ required: true, message: "请输入", trigger: "blur" }],
    dwmcHzm:[{ required: true, message: "请输入", trigger: "blur" }],

    //起火原因
    hzyyms:[{ required: true, message: "请输入", trigger: "change" }],
    //不排除火灾原因
    bpchzyymc:[{ required: true, message: "请输入", trigger: "change" }],

    jdjcqkItems:[{ required: true, message: "请输入", trigger: "change" }],
    //火灾等级
    zqlbdm: [{ required: true, message: "请输入", trigger: "change" }],
    // 失火单位/户主 联系电话
    lxdh: [{ validator: lxdhValidate, trigger: 'blur' }],

    //调查方式
    dcfs: [{ required: true, message: "请输入", trigger: "change" }],

    //起火时间
    zqsj: [{ required: true, message: "请输入", trigger: "change" }],

    //起火地点
    zqdd: [{ required: true, message: "请输入", trigger: "change" }],

    //区域
    qydm: [{ required: true, message: "请输入", trigger: "change" }],
    czc: [{ required: true, message: "请输入", trigger: "change" }],
    qydmItem2: [{ required: true, message: "请输入", trigger: "change" }],

    //监督检查情况
    jdjcqk: [{ required: true, message: "请输入", trigger: "change" }],

    //所属行业
    hylbdm: [{ required: true, message: "请输入", trigger: "change" }],

    //事故调查牵头部门
    sgqtdcbm: [{ required: true, message: "请输入", trigger: "change" }],

    //经济类型
    //jjlxdm: [{ required: true, message: "请输入", trigger: "change" }],

    //起火场所类型
    qhcslb: [{ required: true, message: "请输入", trigger: "change" }],

    //是否属于世界遗产
    sfsjycdm: [{ required: true, message: "请输入", trigger: "change" }],

    //建筑使用用途
    jzsyyt: [{ required: true, message: "请输入", trigger: "change" }],
    jzsyytItem1: [{ required: true, message: "请输入", trigger: "change" }],

    //建筑类别
    // jzlbdm: [{ validator: jzlbdm, trigger: "change" }],

    //建筑耐火等级
    jznhdjdm: [{ required: true, message: "请输入", trigger: "change" }],

    //建筑结构
    jzjgdm: [{ required: true, message: "请输入", trigger: "change" }],

    //火灾蔓延到邻近建筑
    hzsfmydljjz: [{ required: true, message: "请选择", trigger: "change" }],

    //发生轰然
    sffshr: [{ required: true, message: "请输入", trigger: "change" }],

    // 失火建筑门窗在火灾过程中开启
    shjzmcsfkq: [{ required: true, message: "请输入", trigger: "change" }],

    //建筑总楼层数
    jzzlcs: [{ required: true, message: "请输入", trigger: "blur" }],

    //失火楼层
    shlc: [{ required: true, message: "请输入", trigger: "blur" }],

    //自动报警系统(含独立报警)
    zdbjxtsfaz: [{ required: true, message: "请选择", trigger: "change" }],
    zdbjxtsfazItem1: [{ required: true, message: "请选择", trigger: "change" }],
    zdbjxtsfazItem2: [{ required: true, message: "请选择", trigger: "change" }],
    zdbjxtsfazItem3: [{ required: true, message: "请选择", trigger: "change" }],

    //自动灭火系统(含简易喷淋)
    zdmhxtsfaz: [{ required: true, message: "请选择", trigger: "change" }],
    zdmhxtsfazItem1: [{ required: true, message: "请选择", trigger: "change" }],
    zdmhxtsfazItem2: [{ required: true, message: "请选择", trigger: "change" }],
    zdmhxtsfazItem3: [{ required: true, message: "请选择", trigger: "change" }],

    //防排烟系统
    fpyxtsfaz: [{ required: true, message: "请选择", trigger: "change" }],
    fpyxtsfazItem1: [{ required: true, message: "请选择", trigger: "change" }],
    fpyxtsfazItem2: [{ required: true, message: "请选择", trigger: "change" }],
    fpyxtsfazItem3: [{ required: true, message: "请选择", trigger: "change" }],

    //防火卷帘
    fhjl: [{ required: true, message: "请选择", trigger: "change" }],
    fhjlItem1: [{ required: true, message: "请选择", trigger: "change" }],
    fhjlItem2: [{ required: true, message: "请选择", trigger: "change" }],
    fhjlItem3: [{ required: true, message: "请选择", trigger: "change" }],

    //室内消火栓系统
    snxhsxtsfaz: [{ required: true, message: "请选择", trigger: "change" }],
    snxhsxtsfazItem1: [{ required: true, message: "请选择", trigger: "change" }],
    snxhsxtsfazItem2: [{ required: true, message: "请选择", trigger: "change" }],
    snxhsxtsfazItem3: [{ required: true, message: "请选择", trigger: "change" }],

    //防火分区
    fhfq: [{ required: true, message: "请选择", trigger: "change" }],
    fhfqIiem1: [{ required: true, message: "请输入", trigger: "blur" }],

    //防火间距
    fhjj: [{ required: true, message: "请选择", trigger: "change" }],
    fhjjItem1: [{ required: true, message: "请输入", trigger: "blur" }],

    //疏散通道
    sstd: [{ required: true, message: "请选择", trigger: "change" }],
    sstdItem1: [{ required: true, message: "请选择", trigger: "change" }],

    //紧急出口
    yjck: [{ required: true, message: "请选择", trigger: "change" }],
    yjckItem1: [{ required: true, message: "请选择", trigger: "change" }],

    //应急疏散照明
    yjsszm: [{ required: true, message: "请选择", trigger: "change" }],
    yjsszmItem1: [{ required: true, message: "请选择", trigger: "change" }],

    //与城市火灾报警系统、城市消防远程监控系统或智慧消防系统联网情况
    sflw: [{ required: true, message: "请选择", trigger: "change" }],
    sflwItem1: [{ required: true, message: "请选择", trigger: "change" }],

    //是否保险
    sfbx: [{ required: true, message: "请选择", trigger: "change" }],
    sfbxItems: [{ required: true, message: "请选择", trigger: "change" }],

    //是否单方火灾事故
    sfdfhzsh: [{ required: true, message: "请选择", trigger: "change" }],

    //起火物
    qhwms: [{ required: true, message: "请选择", trigger: "change" }],
    qhwmsItem1: [{ required: true, message: "请输入", trigger: "blur" }],

    //起火原因
    hzyyflmc: [{ required: true, message: "请选择", trigger: "blur" }],
    hzyymsItem1: [{ required: true, message: "请输入", trigger: "blur" }],

    // 直接财产损失（元)
    zjccss: [{ required: true, message: "请输入", trigger: ["change", "blur"] }],
    // 火灾现场处置费用（元)
    hzxcczfy: [{ required: true, message: "请输入", trigger: ["change", "blur"] }],
    // 人身伤亡支出（元)
    ryswzc: [{ required: true, message: "请输入", trigger: ["change", "blur"] }],
    // 损失来源
    ssly: [{ required: true, message: "请输入", trigger: "change" }],
    // 保护财产价值
    protectPropVal: [{ required: true, message: "请输入", trigger: ["change", "blur"] }],
    //过火面积（平方米）
    ghmj: [{ required: true, message: "请输入", trigger: "change" }],

    //受灾户数（户）
    szhs: [{ required: true, message: "请输入", trigger: "change" }],

    //直接受灾人数（人）
    szrs: [{ required: true, message: "请输入", trigger: "change" }],

    //是否有人员伤亡
    // ishurt: [{ required: true, message: "请选择", trigger: "change" }],

    //是否立案
    // sfla: [{ required: true, message: "请选择", trigger: "change" }],

    //是否属于刑事放火
    // sfxsfh: [{ required: true, message: "请输入", trigger: "change" }],

    //是否属于安全事故
    // sfaqscsg: [{ required: true, message: "请输入", trigger: "change" }],

    // areaId: [{ required: true, message: "请输入", trigger: "change" }]
    //起火经过
   fireProcess:[{ required: true, message: "请输入", trigger: "change" }]

};

export const echoCheckData = (formData)=>{
    if (formData.jdjcqk == 1) {
        if (formData.jdjcqkItem1 != null) formData.jdjcqkItems = formData.jdjcqkItem1.split(',');
    }
    if (formData.sfbx == 0) {
        if (formData.sfbxItem1 != null) formData.sfbxItems = formData.sfbxItem1.split(',');
    }
    formData.jznhdjdm == null ? formData.jznhdjdm = "" : formData.jznhdjdm += "";
    formData.czc = formData.czc+"";
    formData.dxzht = formData.dxzht+"";
    formData.yjsszmItem1 = formData.yjsszmItem1+"";
    formData.sfxsfh = formData.sfxsfh+"";
    formData.sfaqscsg = formData.sfaqscsg+"";
    formData.dcfs = formData.dcfs+"";
    formData.sfdfhzsh == null?formData.sfdfhzsh="":formData.sfdfhzsh += "";
    for (let index = 0; index < formData.zqxxGrclList.length; index++) {
        formData.zqxxGrclList[index].xb = formData.zqxxGrclList[index].xb+''
    }
    formData.ssryList.map(item => {
        item.swfl += '';
        item.xb += '';
    });
    formData.swryList.map(item => {
        item.xb += '';
    });
    if (formData.jdjcqkItem1 == null) {
        formData.jdjcqkItem1 = "";
    }
    if (formData.zqxxYqhzry == null) {
        formData.zqxxYqhzry = {
            nl : 0,
            jkzkdm:'',
            sjycddm:''
        }
    }
    if (formData.zqxxBpchzyyList.length>0) {
        let name = '';
        formData.zqxxBpchzyyList.forEach(item=>{
            name += item.hzyymc + " ";
        });
        formData.bpchzyymc = name;
    }
    if (formData.zqxxXsfh == null || formData.zqxxXsfh == []) {
        formData.zqxxXsfh = {
            yjzl: "",// 移交资料
            yjzlName: "",// 移交资料名
            yjzlRemark: "",// 移交资料描述
            ajjg: "",// 案件结果
            ajjgName: "",// 案件结果名
            ajjgRemark: "",// 案件结果描述
            xcqkbg: "",// 现场情况报告
            xcqkbgName: "",// 现场情况报告名
            xcqkbgRemark: "",// 现场情况报告描述
        }
    }
    if (formData.zqxxAqscsg == null|| formData.zqxxAqscsg == []) {
        formData.zqxxAqscsg = {
            ygzfwj: "",//有关政府文件
            ygzfwjName: "",//有关政府文件名
            ygzfwjRemark: "",//有关政府文件描述
            xcqkbg: "",//现场情况报告
            xcqkbgName: "",//现场情况报告名称
            xcqkbgRemark: "",//现场情况报告描述
        }
    }
    return formData;
};
