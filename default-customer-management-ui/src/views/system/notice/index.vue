<template>
    <div class="app-container">
        <el-form :inline="true" label-width="80px">
            <el-form-item label="公告标题">
                <el-input
                    v-model="queryParams.noticeTitle"
                    placeholder="请输入公告标题"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="操作人员">
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入操作人员"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable size="small">
                    <el-option
                        v-for="dict in typeOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['system:notice:add']"
                >新增</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="noticeList">
            <el-table-column label="序号" align="center" type="index" width="60" />
            <!-- <el-table-column label="序号" align="center" prop="noticeId" width="100" /> -->
            <el-table-column
                label="公告标题"
                align="center"
                prop="noticeTitle"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="公告类型"
                align="center"
                prop="noticeType"
                :formatter="typeFormat"
                width="100"
            />
            <el-table-column
                label="状态"
                align="center"
                prop="status"
                :formatter="statusFormat"
                width="100"
            />
            <el-table-column
                label="创建者"
                align="center"
                prop="createBy"
                width="100"
                show-overflow-tooltip
            />
            <el-table-column label="创建时间" align="center" prop="createTime" width="180" :formatter="dateFormat">
                <!--<template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>-->
            </el-table-column>
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:notice:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['system:notice:remove']"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination" v-show="total > 0">
           <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>

        <!-- <pagination
            v-show="total>0"
            :total="total"
            :page-sizes="[8, 10]"
            :page-size=" queryParams.pageSize"
            
            @pagination="getList"
        /> -->

        <!-- 添加或修改公告对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="780px" @close="cancel">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公告标题" prop="noticeTitle">
                            <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公告类型" prop="noticeType">
                            <el-select v-model="form.noticeType" placeholder="请选择" style="width: 100%">
                                <el-option
                                    v-for="dict in typeOptions"
                                    :key="dict.dictValue"
                                    :label="dict.dictLabel"
                                    :value="dict.dictValue"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio
                                    v-for="dict in statusOptions"
                                    :key="dict.dictValue"
                                    :label="dict.dictValue"
                                >{{dict.dictLabel}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接收单位" prop="dept">
<!--                            <identity-tree-->
<!--                                @update-component-data="setDeptData"-->
<!--                                :dept-data="form.dept"-->
<!--                                :is-multiple="true"-->
<!--                            ></identity-tree>-->
                          <select-dw-id :deptNames="form.deptNames" @selectList="setDeptData"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容" prop="noticeContent">
                            <Editor v-model="form.noticeContent" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="时限">
                            <el-date-picker
                                v-model="dateRange"
                                style="width: 50%"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :unlink-panels="true"
                                :picker-options="pickerOptions"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="附件">
                            <el-upload
                                ref="upload"
                                action="#"
                                :limit="1"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :http-request="uploadImport"
                                :auto-upload="true"
                                :file-list="fileDataList"
                            >
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                <div class="el-upload__tip" slot="tip">只能上传一个附件，且不能超过 10MB</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-top:20px" v-loading="submittingNotice">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import {
        listNotice,
        getNotice,
        delNotice,
        addNotice,
        updateNotice,
        uploadAttachment
    } from "@/api/system/notice";
    import { fileDownload } from "@/utils/fileDownload";
    import { formatterDate } from "@/utils/index";

    import Editor from "@/components/Editor";
    import IdentityTree from "@/components/IdentityTree";
    import SelectDwId from '@/views/system/notice/component/selectDwId'

    export default {
        name: "noticeannouncement",
        components: {
          SelectDwId,
            Editor,
            IdentityTree
        },
        data() {
            return {
                // 遮罩层
                loading: true,
                // 总条数
                total: 0,
                // 公告表格数据
                noticeList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 类型数据字典
                statusOptions: [],
                // 状态数据字典
                typeOptions: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 8,
                    noticeTitle: undefined,
                    createBy: undefined,
                    status: undefined
                    
                },
                // 日期范围
                dateRange: [],
                pickerOptions: {
                    // 禁用规则
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
                    }
                },
                // 表单参数
                form: {
                    noticeId: "",
                    noticeTitle: "",
                    noticeType: "",
                    noticeContent: "",
                    accessoryName: "",
                    accessoryPath: "",
                    dept: "",
                    status: "0",
                    deptNames:"",
                    nontent:"",
                },
                // 表单校验
                rules: {
                    noticeTitle: [
                        { required: true, message: "公告标题不能为空", trigger: "blur" }
                    ],
                    noticeType: [
                        { required: true, message: "公告类型不能为空", trigger: "change" }
                    ],
                    dept:[
                      { required: true, message: "接收单位不能为空", trigger: ["blur","change"] }
                    ],
                   noticeContent:[
                      { required: true, message: "请填写公告内容", trigger: ["blur","change"] }
                    ]
                },
                /**********************附件上传 */
                // 列表
                fileDataList: [],
                // 临时存储上传的文件
                fileData: null,
                // 防止重复提交的标识
                submittingNotice: false
            };
        },
        computed: {
            ...mapGetters(["deptId"])
        },
        created() {
            this.getList();
            this.getDicts("sys_notice_status").then(response => {
                this.statusOptions = response.data;
            });
            this.getDicts("sys_notice_type").then(response => {
                this.typeOptions = response.data;
            });
        },
        methods: {
            /** 查询公告列表 */
            getList() {
                this.loading = true;
                listNotice(this.queryParams).then(response => {
                    this.noticeList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            },
            // 公告状态字典翻译
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.status);
            },
            // 公告状态字典翻译
            typeFormat(row, column) {
                return this.selectDictLabel(this.typeOptions, row.noticeType);
            },
            // 取消按钮
            cancel() {
                this.reset();
                this.open = false;
            },
            // 表单重置
            reset() {
                this.form = {
                    noticeId: "",
                    noticeTitle: "",
                    noticeType: "",
                    noticeContent: "",
                    accessoryName: "",
                    accessoryPath: "",
                    dept: "",
                    status: "0",
                    deptNames:""
                };
                this.resetForm("form");
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 新增按钮操作 */
            handleAdd() {
                // 设置默认的 时限 - 开始日期 为当天
                this.dateRange = [formatterDate(new Date(), "YYYY-MM-DD"), ""];
                this.fileDataList = [];
                this.title = "添加公告";
                this.open = true;
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.loading = true;
                getNotice(row.noticeId)
                    .then(response => {
                      //todo
                        this.form = response.data;
                        // // 重置派发单位为空，修复组件选择时产生的问题
                        // this.form.dept = this.deptId + "";
                        const {
                            accessoryName,
                            accessoryPath,
                            startTime,
                            endTime
                        } = this.form;
                        // 如果时限的两个值都不存在，设置默认的 时限 - 开始日期 为当天
                        if (!startTime && !endTime) {
                            this.dateRange = [formatterDate(new Date(), "YYYY-MM-DD"), ""];
                        } else {
                            // 赋值
                            this.dateRange = [startTime || "", endTime || ""];
                        }
                        this.fileDataList = [];
                        accessoryName &&
                        this.fileDataList.push({
                            url: `${process.env.VUE_APP_FTP_API + accessoryPath}`,
                            name: accessoryName
                        });
                        this.open = true;
                        this.title = "修改公告";
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            /** 提交按钮 */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        this.submittingNotice = true;
                        // 组装数据
                        this.form.startTime = !this.dateRange
                            ? formatterDate(new Date(), "YYYY-MM-DD")
                            : this.dateRange[0] || formatterDate(new Date(), "YYYY-MM-DD");
                        this.form.endTime = !this.dateRange ? "" : this.dateRange[1] || "";
                        if (this.form.noticeId) {
                            updateNotice(this.form)
                                .then(response => {
                                    if (response.code === 200) {
                                        this.msgSuccess("修改成功");
                                        this.open = false;
                                        this.getList();
                                    } else {
                                        this.msgError(response.msg);
                                    }
                                })
                                .finally(() => {
                                    this.cancel();
                                    this.submittingNotice = false;
                                });
                        } else {
                            addNotice(this.form)
                                .then(response => {
                                    if (response.code === 200) {
                                        this.msgSuccess("新增成功");
                                        this.open = false;
                                        this.getList();
                                    } else {
                                        this.msgError(response.msg);
                                    }
                                })
                                .finally(() => {
                                    this.cancel();
                                    this.submittingNotice = false;
                                });
                        }
                    }
                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                this.$confirm(
                    '是否确认删除公告标题为"' + row.noticeTitle + '"的数据项?',
                    "警告",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                    .then(function() {
                        return delNotice(row.noticeId);
                    })
                    .then(() => {
                        this.getList();
                        this.msgSuccess("删除成功");
                    })
                    .catch(function() {});
            },
            /**
             * 派发单位 组件选中回调
             */
            setDeptData(data) {
              this.form.dept = data.map(r=>r.deptId).join(",");
              this.form.deptNames = data.map(r=>r.deptName).join(",");
            },
            /*******************************************附件上传 */
            uploadImport(params) {
                const me = this;
                let { file } = params;
                me.fileData = file;
                const fileType = file.name.split(".")[1];
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                    me.$message.warning("上传文件大小不能超过 10MB!");
                    me.$refs.upload.clearFiles();
                    return false;
                }
                me.form.accessoryName = file.name;

                me.submitUpload();
                return false; // 返回false不会自动上传
            },
            /**
             * 相关附件 - 单个文件点击回调 下载
             */
            handlePreview(file) {
                const { url, name } = file;
                fileDownload(url, name);
            },
            handleRemove(file, fileList) {
                this.form.accessoryPath = this.form.accessoryName = "";
            },
            submitUpload() {
                const me = this;
                if (this.form.accessoryName == "") {
                    this.$message.warning("请选择要上传的文件！");
                    return false;
                }
                let fileFormData = new FormData();
                fileFormData.append("file", this.fileData);
                fileFormData.append("ggbh", this.form.noticeId);
                uploadAttachment(fileFormData).then(res => {
                    if (res.code == 200) {
                        me.form.accessoryPath = res.data.avatar;
                        this.$message.success("文件上传成功！");
                    } else {
                        this.$message.warning("文件上传失败！");
                    }
                });
            },
            // 前端处理时间格式
            dateFormat(row, column, cellValue, index) {
              var date = row[column.property];
              return formatterDate(date);
            }
        }
    };
</script>
