<template>
    <div class="app-container">
        <div class="page_zone" v-loading="loading">
            <div class="reporting-title">
                <h2>{{ $route.meta.title }}</h2>
            </div>
            <div class="content">
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="160px"
                    label-position="top"
                >
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="警情名称">
                                <div class="police_name">{{ruleForm.jqmc || '接警日期 + 城市 + 区县 + 单位名称 + 警情类型'}}</div>
                                <input type="hidden" v-model="ruleForm.jqmc"/>
                            </el-form-item>
                        </el-col>

                        <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
                          <el-form-item label="是否出动" prop="isYdwcd">
                            <el-radio-group v-model="ruleForm.isYdwcd">
                              <el-radio label="1">是</el-radio>
                              <el-radio label="0">否</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </el-col>-->
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :xs="24" :sm="12" :lg="8" :span="8">
                            <el-form-item label="接警时间" prop="jjsj">
                                <el-date-picker
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm"
                                    value-format="yyyy-MM-dd HH:mm"
                                    placeholder="年月日时分"
                                    v-model="ruleForm.jjsj"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :lg="8" :span="8">
                            <el-form-item label="119案件编号" prop="caseNbr">
                                <el-input v-model="ruleForm.caseNbr" placeholder="请输入119案件编号" clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <!-- <el-col :xs="24" :sm="12" :lg="8" :span="8">
                          <el-form-item label="接警时间" prop="jjsj">
                            <el-date-picker
                              type="datetime"
                              format="yyyy-MM-dd HH:mm"
                              value-format="yyyy-MM-dd HH:mm"
                              placeholder="年月日时分"
                              v-model="ruleForm.jjsj"
                              :picker-options="pickerOptions"
                            ></el-date-picker>
                          </el-form-item>
                        </el-col>-->

                        <el-col :xs="24" :sm="12" :lg="8" :span="8" style="height: 76px;">
                            <el-form-item label="警情类型" prop="sjlbdm">
                                <el-cascader
                                    @change="cascaderChange('sjlbdm')"
                                    ref="cascader"
                                    :props="props"
                                    v-model="ruleForm.sjlbdm"
                                    placeholder="请选择"
                                ></el-cascader>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="isText || ruleForm.qtsjlbsm!=''">
                            <el-form-item label="其他说明" prop="qtsjlbsm">
                                <el-input v-model="ruleForm.qtsjlbsm" placeholder="请输入说明"/>
                            </el-form-item>
                        </el-col>

                        <!-- 火灾扑救可以选择五个等级；抢险救援可以选择四个等级；其他情况默认等级为1，值为 "1"，不显示下拉选择框 -->
                        <el-col
                            :xs="24"
                            :sm="12"
                            :lg="8"
                            :span="8"
                            v-if="ruleForm.sjlbdm === '010000000000' || ruleForm.sjlbdm.substr(0,3) === '020'"
                        >
                            <el-form-item label="警情等级" prop="jqdj">
                                <el-select v-model="ruleForm.jqdj" placeholder="请选择" @change="setShowValue('jqdj')">
                                    <el-option
                                        v-for="item in options.jqdj"
                                        :key="item.dictCode"
                                        :label="item.dictLabel"
                                        :value="item.dictValue"
                                        v-if="!(ruleForm.sjlbdm.substr(0,3) === '020' && item.dictCode === 1251)"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60" v-if="ruleForm.isYdwcd == '1'">
                        <el-col :xs="24" :sm="12" :lg="8" :span="8">
                            <el-form-item label="出动队伍" prop="setOff">
                                <el-input
                                    v-model="showValue.setOff"
                                    placeholder="请选择"
                                    :readonly="true"
                                    ref="mulInput"
                                >
                                    <!-- TODO: 注释看不懂的逻辑先 -->
                                    <!-- v-if="!(ruleForm.setOff.length !== 0 && (ruleForm.sjlbdm =='010000000000'||(ruleForm.sjlbdm >='020000000000' && ruleForm.sjlbdm <'030000000000')))" -->
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="openMulModal()"></i>
                                </el-input>
                                <input type="hidden" v-model="ruleForm.setOff"/>
                            </el-form-item>
                        </el-col>

                        <!-- 需求变更：所有的警情类型都有 主战和增援 2020.1.4 sxc
                           v-if="ruleForm.sjlbdm === '010000000000' || ruleForm.sjlbdm.substr(0,3) === '020'"
                        -->
                        <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.setOff.length !== 0">
                            <el-form-item label="主战中队">
                                <el-radio-group v-model="zzxfd">
                                    <el-radio
                                        v-for="(item,index) in ruleForm.setOff"
                                        :label="item"
                                        :key="item"
                                    >{{ showValue.setOff.split(',')[index] }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.setOff.length !== 0">
                            <el-form-item label="首到中队">
                                <el-radio-group v-model="sdxfd">
                                    <el-radio
                                        v-for="(item,index) in ruleForm.setOff"
                                        :label="item"
                                        :key="item"
                                    >{{ showValue.setOff.split(',')[index] }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="60">
                        <el-col :xs="24" :sm="24" :lg="24" :span="24" v-if="ruleForm.setOff.length !== 0">
                            <el-form-item label="是否责任区主战">
                                <el-radio v-model="ruleForm.sfzrqzz" label="Y">是</el-radio>
                                <el-radio v-model="ruleForm.sfzrqzz" label="N">否</el-radio>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.sfzrqzz == 'N'">
                            <el-form-item label="主战队站" prop="mainTeam">
                                <el-input
                                    v-model="showValue.mainTeamName"
                                    placeholder="请选择"
                                    :readonly="true"
                                >
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="openMulMainTermModal"></i>
                                </el-input>
                                <input type="hidden" v-model="ruleForm.mainTeam"/>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :lg="8" :span="8">
                            <el-form-item label="行政区域" prop="xzqydmSj">
                                <el-input
                                    v-model="showValue.provName"
                                    placeholder="请选择"
                                    :readonly="true"
                                    ref="provInput"
                                    @focus="openProvModal()"
                                >
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()"></i>
                                </el-input>
                                <input type="hidden" name v-model="ruleForm.xzqydmSj"/>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :lg="8" :span="8">
                            <el-form-item label="警情地址" prop="jqfsdd">
                                <el-input v-model="ruleForm.jqfsdd" placeholder="请填写"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :lg="8" :span="8">
                            <el-form-item label="单位名称/户主名" prop="dwmcHzm">
                                <el-input v-model="ruleForm.dwmcHzm" placeholder="没有请填写无"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- 只有【警情类型】选择的是 火灾扑救，才会有这个选择框 -->
                        <el-col :xs="24" :sm="12" :lg="8" :span="8" v-if="ruleForm.sjlbdm === '010000000000'">
                            <el-form-item label="责任区大队" prop="zrqdddm">
                                <el-input
                                    v-model="showValue.duty"
                                    placeholder="请选择"
                                    :readonly="true"
                                    ref="dutyInput"
                                >
                                    <i slot="suffix" class="iconfont icon-icon-test" @click="openDutyModal"></i>
                                </el-input>
                                <input type="hidden" v-model="ruleForm.zrqdddm"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="备注">
                                <el-input
                                    type="textarea"
                                    v-model="ruleForm.bz"
                                    maxlength="300"
                                    show-word-limit
                                    resize="none"
                                    style="width:100%"
                                    :autosize="{ minRows: 3, maxRows: 3 }"
                                    placeholder="请填写备注信息"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                          <el-form-item label="警情标签">
                            <el-row :gutter="10" style="margin: 0;">
                              <el-col :span="24" style="border: 1px solid rgba(0,0,0,0.2);min-height: 70px;border-radius: 4px;">
                                <el-row :gutter="10" class="mb8">
                                	<el-col style="cursor: pointer;" :span="1.5" v-for="(t, index) in selectTargetList" :key="index">
                                    <el-tag size="medium"  :type="t.type" effect="dark" closable @close="handleClose(index,t)">{{ t.tagName }}</el-tag>
                                  </el-col>
                                </el-row>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                        <el-col class="btn-center">
                          <el-button type="primary" icon="el-icon-icon" @click="addTarget">添加标签</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="submit-button">
                    <el-button type="primary" size="medium" @click="confirm">修&nbsp;改</el-button>
                </div>
            </div>

            <!-- 模态框 -->
            <!-- 责任区大队 -->
            <modal ref="modal" @setVal="setDutyValue"></modal>

            <!-- 主战战队 -->
            <mainTeamModal ref="mainTeamModal" :depth="1" @setVal="setMainTeamValue"></mainTeamModal>

            <!-- 出动队伍名称 -->
            <mulModal ref="mulModal" @setMulVal="setMulValue"></mulModal>

            <!-- 行政区域 -->
            <provModal ref="provModal" @setProv="setProvValue"></provModal>

            <!-- 确认信息 -->
            <confirm ref="confirmModal" @onSubmit="onSubmit" :data="ruleForm" :labels="showValue"></confirm>
            <!-- 标签弹框 -->
            <el-dialog title="添加标签" :visible.sync="targetFlag">
              <el-row :gutter="10">
              	<el-col style="cursor: pointer;" :span="1.5" v-for="(t, index) in targetList" :key="index">
                  <el-tag size="medium" @click="selectTag(index,t)"  :type="t.type" effect="dark">{{ t.tagName }}</el-tag>
                </el-col>
              </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    let id = 0;
    import {getOptions, getJqcdlb, jqxxUpdate, jqxxUpdateInfo} from "@/api/data/entry/jqxx";
    // 责任区大队
    import modal from "./components/modal";
    // 出动队伍
    import mulModal from "./components/mulModal";
    // 主战战队
    import mainTeamModal from "./components/modal";
    // 地区选择
    import provModal from "./components/provModal";
    // 确认信息
    import confirm from "./components/confirm";
    //标签接口
    import {
      listTarget, targetNameTarget, addBusinessTags, deleteBusinessTags, queryBusinessTags
    } from "@/api/system/dict/target";

    export default {
        name: "alarmentry",
        components: {modal, mulModal, mainTeamModal, provModal, confirm},
        data() {
            var checkTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("请填写联系电话"));
                }
                setTimeout(() => {
                    if (!/^1[3456789]\d{9}$/.test(value)) {
                        callback(new Error("请输入正确的联系方式"));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            let $caseNbr = (rule, value, callback) => {
                let reg = new RegExp(/^[a-zA-Z0-9]{1,50}$/);
                if (value == "") {
                    callback();
                } else if (!reg.test(value)) {
                    callback(new Error("请正确输入119案件编号(限定字母和数字)"));
                } else {
                    callback();
                }
            };
            return {
                // 警情类型级联懒加载
                props: {
                    lazy: true,
                    lazyLoad: this.getJqlxOption,
                    children: "children",
                    label: "dictLabel",
                    value: "dictValue",
                    isLeaf: "isLeaf",
                    // 是否返回由该节点所在的各级菜单的值所组成的数组
                    emitPath: false
                },
                isText: false,
                //主战首到
                sdxfd: "0",
                zzxfd: "0",
                //selectOptions
                options: {
                    jqdj: [],
                    xczh: [],
                    jqcjlb: [],
                    zqdj: []
                },
                //显示的三条中文input值(责任区大队，出动队伍，行政区)
                showValue: {
                    duty: "",
                    setOff: "",
                    provName: "",
                    // 缩写 行政区：市 + 区县
                    shortProvName: ""
                },
                ruleForm: {
                    // 警情编号
                    jqbh: '',
                    // 警情名称
                    jqmc: "",
                    // 119案件编号
                    caseNbr: "",
                    //警情等级
                    jqdj: "",
                    //接警时间
                    jjsj: "",
                    //现场指挥
                    xczh: "",
                    //带队领导
                    ddld: "",
                    //指挥长
                    zhz: "",
                    //警情类型
                    sjlbdm: "",
                    // 其他说明
                    qtsjlbsm: "",
                    //火警类型
                    zqdjdm: "",
                    //是否为轻微火灾
                    ifqwhz: "0",
                    //责任区大队
                    zrqdddm: "",
                    //是否有队伍出动
                    isYdwcd: "1",
                    //出动队伍名称 & 集合
                    setOff: "",
                    jqxxCdxfdws: [],
                    // 是否责任区主战
                    sfzrqzz: "N",
                    // 主战队站
                    mainTeam: "",
                    //行政区域
                    xzqydmSj: "",
                    //警情地址
                    jqfsdd: "",
                    //单位名称/户主名
                    dwmcHzm: "",
                    //联系电话
                    lxdh: "",
                    //单位统一社会信用代码
                    dwtyshxydm: "",
                    //备注
                    bz: ""
                },
                pickerOptions: {
                    disabledDate(time) {
                        const now = Date.now();
                        return time.getTime() > now || time.getTime() < now - 365 * 24 * 60 * 60 * 1000;
                    }
                },

                rules: {
                    jqmc: [{required: true}],
                    caseNbr: [
                        {
                            validator: $caseNbr,
                            trigger: "blur"
                        }
                    ],
                    qtsjlbsm: [
                        {required: true, message: "请填写其他说明", trigger: "blur"}
                    ],
                    jqdj: [
                        {required: true, message: "请填写警情等级", trigger: "change"}
                    ],
                    jjsj: [{required: true, message: "请填写接警时间", trigger: "blur"}],
                    xczh: [
                        {required: true, message: "请填写现场指挥", trigger: "change"}
                    ],
                    ddld: [{required: true, message: "请填写带队领导", trigger: "blur"}],
                    zhz: [{required: true, message: "请填写指挥长", trigger: "blur"}],
                    sjlbdm: [
                        {required: true, message: "请填写警情类型", trigger: "change"}
                    ],
                    zqdjdm: [
                        {required: true, message: "请填写火警类型", trigger: "change"}
                    ],
                    zrqdddm: [
                        {required: true, message: "请填写责任区大队", trigger: "blur"}
                    ],
                    mainTeam: [{required: true, message: "请填写主战队站", trigger: "blur"}],
                    isYdwcd: [
                        {required: true, message: "请填写警情等级", trigger: "change"}
                    ],
                    setOff: [
                        {
                            required: true,
                            message: "请填写出动队伍名称",
                            trigger: "blur",
                            type: "array"
                        }
                    ],
                    xzqydmSj: [
                        {required: true, message: "请填写行政区域", trigger: "blur"}
                    ],
                    jqfsdd: [
                        {required: true, message: "请填写警情地址", trigger: "blur"}
                    ],
                    dwmcHzm: [
                        {required: true, message: "请填写单位名称/户主名", trigger: "blur"}
                    ],
                    lxdh: [
                        {
                            validator: checkTel,
                            trigger: "blur",
                            required: true
                        }
                    ]
                },
                //避免重复提交
                ifSubmit: true,
                //loading层
                loading: false,
                targetFlag:false, //标签弹框展示
                targetList: [],
                selectTargetList:[], //添加标签列表
            };
        },
        created() {
            this.ruleForm.jqbh = this.$route.query.jqbh;
            this.getSelectOption();
            this.getJqxxInfo(this.$route.query.jqbh)
            if(this.$route.query.jqbh){
              this.queryTag(()=>{
                this.getTagList();
              });
            }

        },
        methods: {
            async getJqxxInfo(jqbh) {
                const res = await jqxxUpdateInfo(jqbh);
                if (res.code == 200) {
                    const arr = res.data.jqmc.split(" ");
                    console.log(arr)
                    // this.showValue.shortProvName = arr[5] + " " + arr[6];
                    this.showValue.shortProvName = res.data.cityName + " " + res.data.countyName;
                    this.showValue.eventType = res.data.sjlbmc;

                    this.ruleForm.jjsj = res.data.jjsj;
                    this.ruleForm.sjlbdm = res.data.sjlbdm;
                    this.showValue.sjlbdm = res.data.sjlbmc;
                    //
                    this.ruleForm.qtsjlbsm = res.data.qtsjlbsm || "";

                    this.$refs.cascader.inputValue = res.data.sjlbmc;
                    this.ruleForm.caseNbr = res.data.caseNbr;
                    this.ruleForm.jqdj = res.data.jqdj;
                    this.showValue.provName = res.data.xzqymc;
                    this.ruleForm.xzqydmSj = res.data.xzqydmSj;
                    this.ruleForm.jqfsdd = res.data.jqfsdd;
                    this.ruleForm.dwmcHzm = res.data.dwmcHzm;
                    this.ruleForm.bz = res.data.bz;
                    // 责任区大队
                    this.showValue.duty = res.data.zrqddmc;
                    this.ruleForm.zrqdddm = res.data.zrqdddm;
                    // 出动队伍
                    this.setMulValue(res.data.jqxxCdxfdws, 1);

                    // 主战队站
                    this.showValue.mainTeamName = res.data.mainTeamMc;
                    this.ruleForm.mainTeam = res.data.mainTeam;

                    //
                    this.setShowValue('jqdj');
                }
            },
            cascaderChange(name) {
                // 每次改变警情类型之后将其他说明重置为空
                this.ruleForm.qtsjlbsm = "";

                let arr = [],
                    text = "",
                    code = "";
                if (this.$refs.cascader.getCheckedNodes()[0] == undefined) {
                    text = this.ruleForm.sjlbdm;
                } else {
                    arr = this.$refs.cascader.getCheckedNodes()[0].pathNodes;
                    arr.forEach((item, index) => {
                        text = index == 0 ? item.label : text + "/" + item.label;
                    });
                }
                this.showValue[name] = text;
                this.isText = text.includes("其他");
                this.showValue["jqlx"] = this.ruleForm.sjlbdm;

                // 清空 责任区大队
                this.ruleForm.zrqdddm = this.showValue.duty = "";
                // 【警情等级】判断：火灾扑救可以选择五个等级；抢险救援可以选择四个等级；其他情况默认等级为1，值为 "1"
                if (
                    this.ruleForm.sjlbdm !== "010000000000" ||
                    this.ruleForm.sjlbdm.substr(0, 3) !== "020"
                ) {
                    this.ruleForm.jqdj = "1";
                    this.showValue["jqdj"] = "一级";
                } else {
                    this.ruleForm.jqdj = this.showValue["jqdj"] = "";
                }
            },
            setShowValue(name) {
                let value = this.ruleForm[name],
                    option = this.options[name],
                    text = option.filter(item => {
                        return item.dictValue == value;
                    })[0].dictLabel;
                this.showValue[name] = text;
            },
            getJqlxOption(node, resolve) {
                const parentValue = node.level === 0 ? '0' : node.value;
                getJqcdlb({dictType: 'jqcjlb', parentValue: parentValue}).then(response => {
                    if (response.code === 200) {
                        resolve(this.handle(response.data));
                    } else {
                        this.$message.error(response.msg);
                        resolve([]);
                    }
                }).catch(e => {
                    this.$message.error(e);
                    resolve([]);
                });
            },
            //设置叶子节点
            handle(arr) {
                // console.log(arr);
                arr.forEach(item => {
                    if (item.isLast == "1") {
                        item["leaf"] = true;
                    }
                });
                return arr;
            },
            getSelectOption() {
                //警情等级
                getOptions("tb_dic_jqdj").then(res => {
                    if (res.code !== 200) {
                        return;
                    }
                    this.options.jqdj = res.data;
                });
                //现场指挥
                getOptions("tb_dic_xczh").then(res => {
                    if (res.code !== 200) {
                        return;
                    }
                    this.options.xczh = res.data;
                });
                //火警类型
                getOptions("tb_dic_zqdj").then(res => {
                    if (res.code !== 200) {
                        return;
                    }
                    this.options.zqdj = res.data;
                });
            },
            //打开责任大区模态框 并 回显
            openDutyModal() {
                this.$refs.modal.echo(this.ruleForm.zrqdddm);
                this.$refs.modal.toggle();
            },
            //打开多选框 并 回显
            openMulModal(type) {
                this.$refs.mulModal.echo(this.ruleForm.setOff);
                this.$refs.mulModal.toggle();
            },
            //打开多选框 并 回显
            openMulMainTermModal(type) {
                this.$refs.mainTeamModal.echo(this.ruleForm.mainTeam);
                this.$refs.mainTeamModal.toggle();
            },
            // 将树形中的值赋值给责任大区 input id 付给hidden input
            setDutyValue(data) {
                this.ruleForm.zrqdddm = data.deptId;
                this.showValue.duty = data.deptName;
                this.$refs.dutyInput.focus();
                this.$refs.dutyInput.blur();
            },
            //将多选框的值赋给input
            setMulValue(arr, state = 0) {
                let nameArr = [],
                    idArr = [];
                arr.forEach(item => {
                    nameArr.push(item.deptName || item.xfdwmc);
                    idArr.push(item.deptId || item.xfdwdm);
                    if (state) {
                        if (item.sfsddw === 'Y')
                            this.sdxfd = item.xfdwdm;
                        if (item.sfzzxfd === 'Y')
                            this.zzxfd = item.xfdwdm;
                        if (item.sfzrqzz === 'Y')
                            this.ruleForm.sfzrqzz = "Y";
                    }
                });
                this.ruleForm.setOff = idArr;
                this.showValue.setOff = nameArr.join(",");
                //给队伍设置默认主战和首到
                if (!state) {
                    this.sdxfd = idArr[0];
                    this.zzxfd = idArr[0];
                }
                this.$refs.mulInput.focus();
                this.$refs.mulInput.blur();
            },
            //将多选框的值赋给input
            setMainTeamValue(data) {
                if (5 != data.deptLevel) {
                    this.$message.error('必须选择中队或站');
                    return;
                }
                this.ruleForm.mainTeam = data.deptId;
                this.showValue.mainTeamName = data.deptName;
            },
            //打开行政区域的模态框
            openProvModal() {
                this.$refs.provModal.toggle();
            },
            // 行政区域赋值
            setProvValue(obj, {first, second, third, last}) {
                // console.log(name, obj.id);
                this.showValue.provName = `${first} ${second} ${third} ${last}`;
                this.showValue.shortProvName = `${second} ${third}`;
                this.ruleForm.xzqydmSj = obj.id;
                this.$refs.provInput.focus();
                this.$refs.provInput.blur();
            },
            // 预览
            confirm() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        this.showValue.caseNbr = this.ruleForm.caseNbr;
                        this.showValue.qtsjlbsm = this.ruleForm.qtsjlbsm;
                        if (this.ruleForm.isYdwcd == "1") {
                            // 提交之前组装消防队（首到主战）列表
                            let arr = [];
                            this.ruleForm.setOff.forEach(item => {
                                let obj = {
                                    jqbh: this.ruleForm.jqbh,
                                    xfdwdm: item,
                                    sfsddw: "N",
                                    sfzzxfd: "N"
                                };
                                arr.push(obj);
                            });
                            // 需求变更：所有的警情类型都有 主战和增援 2020.1.4 sxc
                            // if (
                            //   this.ruleForm.sjlbdm === "010000000000" ||
                            //   this.ruleForm.sjlbdm.substr(0, 3) === "020"
                            // ) {
                            //   arr.forEach(item => {
                            //     if (item.xfdwdm == this.sdxfd) {
                            //       item.sfsddw = "Y";
                            //     }
                            //     if (item.xfdwdm == this.zzxfd) {
                            //       item.sfzzxfd = "Y";
                            //     }
                            //     // 是否责任区主战
                            //     if (
                            //       item.xfdwdm == this.zzxfd &&
                            //       this.ruleForm.sfzrqzz === "Y"
                            //     ) {
                            //       item.sfzrqzz = "Y";
                            //     }
                            //   });
                            // }

                            arr.forEach(item => {
                                if (item.xfdwdm == this.sdxfd) {
                                    item.sfsddw = "Y";
                                }
                                if (item.xfdwdm == this.zzxfd) {
                                    item.sfzzxfd = "Y";
                                }
                                // 是否责任区主战
                                if (item.xfdwdm == this.zzxfd && this.ruleForm.sfzrqzz === "Y") {
                                    item.sfzrqzz = "Y";
                                }
                            });
                            this.ruleForm.jqxxCdxfdws = arr;
                        }
                        // console.log(this.ruleForm);
                        // console.log(this.showValue);

                        this.$refs.confirmModal.toggle();
                    } else {
                        return false;
                    }
                });
            },
            //右上角提交
            async onSubmit() {
                //避免重复提交
                if (this.ifSubmit == false) {
                    return;
                }
                // console.log(this.ruleForm);
                this.ifSubmit = false;
                this.loading = true;
                const res = await jqxxUpdate(this.ruleForm);
                if (res.code === 200) {
                    this.ifSubmit = true;
                    this.loading = false;
                    // this.resetForm("ruleForm");
                    this.showValue.setOff = this.showValue.provName = this.ruleForm.setOff =
                        "";
                    this.$message({
                        message: "提交成功！",
                        type: "success"
                    });
                    this.$store
                        .dispatch("tagsView/delView", this.$route)
                        .then(({visitedViews}) => {
                            if (this.isActive(this.$route)) {
                                this.toLastView(visitedViews, this.$route);
                            }
                        });
                    this.$router.push({
                        path: "/data/entry/lsjqxx"
                    });
                    // this.$confirm("已修改派发成功", "提示", {
                    //   confirmButtonText: "录入新警情",
                    //   cancelButtonText: "查看已派发",
                    //   type: "success"
                    // })
                    // .then(() => {
                    //   return;
                    // })
                    // .catch(() => {
                    //   this.$router.push({
                    //     path: "/data/entry/lsjqxx"
                    //   });
                    // });
                } else {
                    this.ifSubmit = true;
                    this.loading = false;
                    this.$message.error("修改失败！");
                }
                // .then(res => {
                //   console.log(res);
                //   if (res.code === 200) {
                //     this.ifSubmit = true;
                //     this.loading = false;
                //     // this.$message({
                //     //   message: "提交成功！",
                //     //   type: "success"
                //     // });
                //     this.resetForm("ruleForm");
                //     this.showValue.setOff = this.showValue.provName = this.ruleForm.setOff =
                //       "";
                //     this.$confirm("已修改派发成功", "提示", {
                //       confirmButtonText: "录入新警情",
                //       cancelButtonText: "查看已派发",
                //       type: "success"
                //     })
                //       .then(() => {
                //         return;
                //       })
                //       .catch(() => {
                //         this.$router.push({
                //           path: "/data/entry/lsjqxx"
                //         });
                //       });
                //   }
                // })
                // .catch(err => {
                //   this.ifSubmit = true;
                //   this.loading = false;
                //   this.$message.error("提交失败！");
                // });
            },
            handleName() {
                let startingTime = !this.ruleForm.jjsj
                    ? "接警时间"
                    : this.ruleForm.jjsj.slice(0, 10).split("-"),
                    shortProvName = this.showValue.shortProvName || "城市 + 区县",
                    companyName = this.ruleForm.dwmcHzm
                        ? `【${this.ruleForm.dwmcHzm}】`
                        : "单位名称",
                    eventType = "警情类型";
                startingTime !== "接警时间" &&
                (startingTime = `${startingTime[0]} 年${startingTime[1]} 月${startingTime[2]} 日 `);
                // 向上找到所有的父节点
                if (this.ruleForm.sjlbdm !== "") {
                    // console.log(this.$refs.cascader.getCheckedNodes());
                    if (this.$refs.cascader.getCheckedNodes()[0] == undefined) {
                        eventType = this.showValue.eventType;
                    } else {
                        eventType =
                            this.$refs.cascader.getCheckedNodes()[0].pathLabels[1] ||
                            this.$refs.cascader.getCheckedNodes()[0].pathLabels[0];
                    }
                }
                this.ruleForm.jqmc = `${startingTime} ${shortProvName} ${companyName} ${eventType}`;
            },
            // 关闭按钮
            handleClose(num, node) {
              let _params = {
                "relId": node.relId
              }
              deleteBusinessTags(_params).then(res=>{
                this.changeTag(num, node, this.selectTargetList, this.targetList);
              });
            },
            //  获取标签
            getTagList() {
              setTimeout(()=>{
              },3000);

              let _params = {
                tagName: "",
                tagType: "J"
              }
              targetNameTarget(_params).then(
                response => {
                  this.loading = false;
                  if (response.code === 200) {
                    let typeList = response.data;

                    let _list = [];
                    let _tmap = [];
                    for(var i=0;i< this.selectTargetList.length;i++) {
                      _tmap[this.selectTargetList[i].tagId] = true;
                    }

                    for(var i=0;i< typeList.length;i++) {
                      typeList[i].sortNum = i;
                      if (!_tmap[typeList[i].tagId]) {
                          _list.push(typeList[i]);
                      }
                    }
                    this.targetList = _list;
                  } else {
                    this.msgError(response.msg);
                  }

                }
              );
            },
            // 关闭按钮
            handleClose(num, node) {
              let _params = {
                "relId": node.relId
              }
              deleteBusinessTags(_params).then(res=>{
                this.changeTag(num, node, this.selectTargetList, this.targetList);
              });
            },
            changeTag(num, node, list1, list2) {
              list1.splice(num,1);
              list2.push(node);
            },
            // 点击添加标签事件
            addTarget() {
              this.targetFlag = true;
            },
            // 查询业务标签
            queryTag(callback) {
              let _params = {
                "businessId": this.ruleForm.jqbh
              }
              queryBusinessTags(_params).then(res => {
                if(res.code == 200) {
                  this.selectTargetList = res.data;
                  if(callback) {
                    callback();
                  }
                } else {
                  this.msgError(res.msg);
                }
              });
            },
            // 选择标签
            selectTag(num, node) {
              let _params = {
                "tagId": node.tagId,
                "tagName": node.tagName,
                "businessId": this.ruleForm.jqbh,
                "sortNum": node.sortNum,
                "tagType": "J"
              }
              this.loading = true;
              addBusinessTags(_params).then((res) => {
                this.loading = false;
                if(res.code == 200) {
                  this.sortNum ++;
                  this.queryTag();
                  this.changeTag(num, node, this.targetList, this.selectTargetList);
                } else {
                  this.msgError(res.msg);
                }
              });
            }
        },
        watch: {
            /**
             * 监测值的变化，如果是 "0" 需要将之前选中一系列值清空掉
             */
            "ruleForm.isYdwcd"(val) {
                if (val === "0") {
                    this.ruleForm.setOff = this.showValue.setOff = "";
                    // 给队伍设置默认主战和首到
                    this.sdxfd = this.zzxfd = "0";

                    this.ruleForm.jqxxCdxfdws = [];
                }
            },
            /**
             * 一系列转换 警情名称 的回调
             */
            "ruleForm.jjsj"(val) {
                this.handleName();
            },
            "ruleForm.jqfsdd"(val) {
                this.handleName();
            },
            "showValue.provName"(val) {
                this.handleName();
            },
            "ruleForm.dwmcHzm"(val) {
                this.handleName();
            },
            "ruleForm.sjlbdm"(val) {
                this.handleName();
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .app-container
        // background-color #F4F6F8
        // padding 10px
        // min-height calc(100vh - 84px)
        .btn-center
          text-align center
        .reporting-title
            h2
                background-image url('~@/views/data/entry/jqxx/image/jqxx.png')
                background-repeat no-repeat
                background-position 0 50%
                background-size 23px
        .content
            padding 0 30px 18px
            .submit-button
                padding-top 15px
                text-align center
            .shadow-box
                padding 15px
                width 100%
                margin-bottom 20px
                background rgba(255, 255, 255, 1)
                box-shadow 0px 3px 14px 0px rgba(0, 0, 0, 0.11)
                border-radius 3px
                border 1px solid rgba(196, 205, 213, 0.22)
                .shadow-title
                    height none
                    font-size 16px
                    font-weight 600
                    padding-left 10px
                    color rgba(57, 60, 65, 1)
                    margin-bottom 5px
                    border-left 6px solid #FB5938
            .el-select, .el-input, .el-cascader
                width 100%
            .police_name
                color rgba(147, 158, 171, 1)

    .
    content > > >
    .el-form-item__label
        // display: flex;
        // align-items: center;
        // justify-content: flex-end;
        // text-align: right;
        // height 32px
        line-height 16px
        font-weight normal

    .tag_group
        .tag_item
            margin 5px auto
            .tag_name
                width 100px
                color #606266
                font-weight 600
                display inline-block
                margin-right 15px
</style>
