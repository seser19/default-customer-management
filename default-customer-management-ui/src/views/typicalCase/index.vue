<template>
    <div class="app-container">
        <el-form :inline="true" label-width="80px">
            <el-form-item label="案例名称">
                <el-input
                    v-model="queryParams.typicalCaseName"
                    placeholder="请输案例名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="案例类型">
                <el-select v-model="queryParams.typicalCaseType" placeholder="案例类型" clearable size="small">
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
                    v-hasPermi="['typical:case:add']"
                >新增</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="typicalCaseList">
            <el-table-column label="编号" align="center" type="index" width="60" />
            <el-table-column
                label="案例名称"
                align="center"
                prop="typicalCaseName"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="案例类型"
                align="center"
                prop="dictLabel"
                width="200"
            />
            <el-table-column
                label="创建者"
                align="center"
                prop="createBy"
                width="120"
                show-overflow-tooltip
            />
            <el-table-column label="创建时间" align="center" prop="createTime" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleView(scope.row)"
                        v-hasPermi="['typical:case:show']"
                    >查看</el-button>
                    <el-button v-if="scope.row.isShowBut==1"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['typical:case:edit']"
                    >修改</el-button>
                    <el-button v-if="scope.row.isShowBut==1"
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['typical:case:remove']"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改典型案例对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="780px" @close="cancel">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="submitting">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="案例名称" prop="typicalCaseName">
                            <el-input v-model="form.typicalCaseName" placeholder="请输入案例名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="案例类型" prop="typicalCaseType">
                            <el-select v-model="form.typicalCaseType" placeholder="请选择" style="width: 100%">
                                <el-option
                                    v-for="dict in typeOptions"
                                    :key="dict.dictValue"
                                    :label="dict.dictLabel"
                                    :value="dict.dictValue"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="案例内容">
                            <Editor v-model="form.typicalCaseContent" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="附件">
                           <el-upload
                               ref="upload"
                               action=""
                               :auto-upload="true"
                                list-type="picture-card"
                               :multiple="true"
                               :limit="6"
                                accept=".jpg,.png,.jpeg,.doc,.pdf,.xls,.docx,.xlsx,.pptx,.zip"
                               :file-list="fileList"
                               :show-file-list="true"
                               :http-request="uploadImage"
                               :before-upload="beforeAvatarUpload"
                               :on-preview="handlePictureCardPreview"
                               :before-remove="beforeHandleRemove"
                               :on-remove="handleRemove"
                           >
                             <i slot="default" class="el-icon-plus"></i>
                             <div slot="file" slot-scope="{file}">
                               <img
                                 class="el-upload-list__item-thumbnail"
                                 :src="file.url" alt=""
                               >
                               <span style="text-align: center;display:block;">{{file.name}}</span>
                               <span class="el-upload-list__item-actions">
                              <!--    <span
                                    class="el-upload-list__item-preview"
                                    @click="handlePictureCardPreview(file)"
                                  >
                                    <i class="el-icon-zoom-in"></i>
                                  </span>-->
                                  <span
                                    class="el-upload-list__item-delete"
                                    @click="handleDownload(file)"
                                  >
                                    <i class="el-icon-download"></i> </span>
                                  <span
                                    class="el-upload-list__item-delete"
                                    @click="handleRemove(file)"
                                  >
                                    <i class="el-icon-delete"></i>
                                  </span>
                               </span>
                             </div>

                           </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-top:20px">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 详情页面对话框 -->
        <el-dialog id="check" :title="''" :visible.sync="openDetail" width="1000px"  @close="cancel">
                <el-row>
                  <el-col :span="24">
                     <span style="font-size: 20px">{{form.typicalCaseName}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px">
                  <el-col :span="6">
                      <div class="grid-content bg-purple">
                        <span>创建时间:{{form.createTime}}</span>
                      </div>
                  </el-col>
                  <el-col :span="5">
                      <div class="grid-content bg-purple-light">
                        <span>案例类型:{{form.dictLabel}}</span>
                      </div>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row >
                  <el-col :span="24">
                    <div v-html="form.typicalCaseContent"></div>
                    <span v-if="fileList.length" style="font-weight: bold">附件：</span>
                    <el-upload
                      ref="upload"
                      action=""
                      list-type="picture-card"
                      :file-list="fileList"
                      :show-file-list="true"
                      style="margin-top: 10px"
                    >
                      <div slot="file" slot-scope="{file}">
                        <img
                          class="el-upload-list__item-thumbnail"
                          :src="file.url" alt=""
                        >
                        <span style="text-align: center;display:block;">{{file.name}}</span>
                        <span class="el-upload-list__item-actions">
                          <span
                            class="el-upload-list__item-delete"
                            @click="handleDownload(file)"
                          >
                          <i class="el-icon-download"></i> </span>
                        </span>
                      </div>
                    </el-upload>
                  </el-col>

                </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import {
        listTypicalCase,
        getTypicalDicts,
        UploadPicFile,
        addTypicalCase,
        deletePicByFilePath,
        downloadPicByFilePath,
        delTypicalCase,
        getTypicalCase,
        updateTypicalCase,
        getDeptLevel
    } from "@/api/system/typicalCase";
    import { fileDownload } from "@/utils/fileDownload";
    import { formatterDate } from "@/utils/index";

    import Editor from "@/components/Editor/index.vue";
    import IdentityTree from "@/components/IdentityTree";

    export default {
        name: "classiccase",
        components: {
            Editor,
            IdentityTree
        },
        data() {
            return {
                fileList: [],
                // 遮罩层
                loading: true,
                // 总条数
                total: 0,
                // 典型案例表格数据
                typicalCaseList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 状态数据字典
                typeOptions: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    typicalCaseName: "",
                    typicalCaseType: ""
                },
                // 表单参数
                form: {
                    typicalCaseId: "",
                    typicalCaseName: "",
                    typicalCaseType: "",
                    typicalCaseContent: "",
                    tbTypicalCaseUploads: []
                },
                // 表单校验
                rules: {
                    typicalCaseName: [
                        { required: true, message: "案例名称不能为空", trigger: "blur" }
                    ],
                    typicalCaseType: [
                        { required: true, message: "案例类型不能为空", trigger: "change" }
                    ]
                },
                /**********************附件上传 */
                imgsList: {},
                // 防止重复提交的标识
                submitting: false,
                //是否是更新操作
                isUpdate:false,
                //是否显示详情页面
                openDetail:false,
                // 新增，修改，删除按钮是否显示
                // isButShow:true,
            };
        },
        computed: {
            ...mapGetters(["deptId"])
        },
        created() {
            this.getList();
            getTypicalDicts().then(response => {
                 this.typeOptions = response.data;
            });
           /* getDeptLevel().then(response => {
               var deptLevel=response.data.deptLevel;
               if(deptLevel==="1"||deptLevel==="2"||deptLevel==="3"){
                 this.isButShow = true;
               }else{
                 this.isButShow = false;
               }
            });*/
        },
        methods: {
            /** 查询公告列表 */
            getList() {
                this.loading = true;
                listTypicalCase(this.queryParams).then(response => {
                    this.typicalCaseList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.tbTypicalCaseUploads = [];
                this.title = "添加典型案例";
                this.open = true;
            },
            // 取消按钮
            cancel() {
                this.reset();
                this.open = false;
                this.$refs.upload.clearFiles();
                this.fileList=[];
            },
            // 表单重置
            reset() {
                this.form = {
                    typicalCaseId: "",
                    typicalCaseName: "",
                    typicalCaseType: "",
                    typicalCaseContent: "",
                    tbTypicalCaseUploads:[]
                };
                this.$refs.upload.clearFiles();
                this.resetForm("form");
            },
           /** 提交按钮 */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        // 判断参数
                        if (!this.form.typicalCaseName) {
                            this.$message.warning("案例名称不能为空");
                            return;
                        }
                        if(!this.form.typicalCaseContent){
                            this.$message.warning("案例内容不能为空");
                            return;
                        }
                        this.submitting = true;
                        if (this.form.typicalCaseId) {
                            updateTypicalCase(this.form).then(response => {
                                    if (response.code === 200) {
                                        this.msgSuccess("修改成功");
                                        this.open = false;
                                        this.getList();
                                        this.fileList=[];
                                    } else {
                                        this.msgError(response.msg);
                                    }
                            })
                            .finally(() => {
                                this.cancel();
                                this.submitting = false;
                            });

                        }else{
                            //新增保存
                            addTypicalCase(this.form).then(response => {
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
                                    this.submitting = false;
                                });
                        }

                    }
                });
            },
             /** 修改按钮操作 */
            handleUpdate(row) {
                this.loading = true;
                getTypicalCase(row.typicalCaseId).then(response => {
                        this.form = response.data;
                        this.fileList=[];
                        var arry = [];
                        for (var j = 0; j < this.form.tbTypicalCaseUploads.length; j++) {


                             var fileMap={
                                 name: this.form.tbTypicalCaseUploads[j].fileName,
                                 url: `${process.env.VUE_APP_FTP_API + this.form.tbTypicalCaseUploads[j].filePath}`
                            };
                            arry.push(fileMap);
                        }
                        this.fileList=arry;
                        this.open = true;
                        this.title = "修改典型案例";
                        this.isUpdate=true;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                this.$confirm(
                    '是否确认删除数据项?',
                    "警告",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                .then(function() {
                    return delTypicalCase(row.typicalCaseId);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
            },
            /** 查看详情 */
            handleView(row){
                this.loading = true;
                 this.openDetail = true;
                     getTypicalCase(row.typicalCaseId).then(response => {
                       this.form=response.data;
                       this.fileList=[];
                       var arry = [];
                       for (var j = 0; j < this.form.tbTypicalCaseUploads.length; j++) {
                         var fileMap={
                           name: this.form.tbTypicalCaseUploads[j].fileName,
                           url: `${process.env.VUE_APP_FTP_API + this.form.tbTypicalCaseUploads[j].filePath}`
                         };
                         arry.push(fileMap);
                       }
                       this.fileList=arry;
                       console.log(this.fileList);
                     })
                    .finally(() => {
                      this.loading = false;
                    });
            },
            /**
             * 上传典型案例图片
             * 上传单张不可大于10M
             */
            uploadImage(params) {
                const { file } = params;
                const fileType = file.name.split('.')[1];
                const isLt10M = file.size / 1024 / 1024 < 10;
                const formData = new FormData();
                formData.append('file', file);// 上传的文件
                // 调用上传接口
                UploadPicFile(formData).then(res => {
                        this.imgsList[res.data.filename] = res.data.filepath;
                        var resFileMap={
                            "fileName":res.data.filename,
                            "filePath":res.data.filepath
                        };
                        this.form.tbTypicalCaseUploads.push(resFileMap);
                        this.$message({
                            message: '成功上传',
                            type: 'success'
                        })

                    })
                    .catch(err => {
                        console.log(err, 'error')
                    })
            },
            beforeAvatarUpload(file) {
                    const isJPG = (file.type === 'image/jpeg')
                                ||(file.type === 'image/jpg')
                                ||(file.type === 'image/png'
                                ||(file.type==='application/x-zip-compressed')
                                ||(file.type==='application/pdf')
                                ||(file.type==='application/msword')
                                ||(file.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                                ||(file.type==='text/plain')
                                ||(file.type==='application/vnd.ms-excel')
                                ||(file.type==='application/vnd.openxmlformats-officedocument.presentationml.presentation')
                                ||(file.type==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                      );
                    const isLt2M = file.size / 1024 / 1024 < 10;

                    if (!isJPG) {
                        this.imgState = false;
                        this.$message.error('上传附件只能是jpg,png,jpeg,doc,txt,pdf,xls,docx,xlsx,pptx,zip格式!');
                    }
                    if (!isLt2M) {
                        this.imgState = false;
                        this.$message.error('上传附件大小不能超过 10MB!');
                    }else{
                        this.imgState = true;
                    }
                    return isJPG && isLt2M;
             },
          /*   handlePictureCardPreview(file) {
                     this.dialogImageUrl = file.url
                     this.dialogVisible = true
             },*/
            beforeHandleRemove(file, fileList) {

            },
          handleDownload(file, fileList){
            var filePath = "";
            var fileName = "";
            for (var j = 0; j < this.form.tbTypicalCaseUploads.length; j++) {
              if (this.form.tbTypicalCaseUploads[j].fileName == file.name) {
                filePath = this.form.tbTypicalCaseUploads[j].filePath;
                fileName = this.form.tbTypicalCaseUploads[j].fileName; //原始文件名
              }
            }
            const downloadTrigger = document.createElement('a');
            // downloadTrigger.href = "http://10.20.16.169:8282" + "/prod-api" + filePath;
            downloadTrigger.href = process.env.VUE_APP_FTP_API + filePath;
            downloadTrigger.download = fileName;
            downloadTrigger.click();
          },
          handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
          },
          handleRemove(file, fileList) {
                var filePath="";
                for (var j = 0; j < this.form.tbTypicalCaseUploads.length; j++) {
                    if(this.form.tbTypicalCaseUploads[j].fileName==file.name){
                        filePath=this.form.tbTypicalCaseUploads[j].filePath;
                    }
                }

                if(filePath!=""){
                  //删除file_list中的附件
                  let fileList1 = this.$refs.upload.uploadFiles;
                  let index = fileList1.findIndex(fileItem => {
                    return fileItem.uid === file.uid
                  });
                  fileList1.splice(index, 1);
                     deletePicByFilePath({ filePath: filePath ,typicalCaseId:this.form.typicalCaseId}).then(res => {
                            if (res.code == 200) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                for (var j = 0; j < this.form.tbTypicalCaseUploads.length; j++) {
                                    if(this.form.tbTypicalCaseUploads[j].fileName==file.name){
                                        filePath=this.form.tbTypicalCaseUploads[j].filePath;
                                        this.form.tbTypicalCaseUploads.splice(j,1);
                                    }
                                }
                            }else{
                              //删除
                              let fileList1 = this.$refs.upload.uploadFiles;
                              let index = fileList1.findIndex(fileItem => {
                                return fileItem.uid === file.uid
                              })
                            }
                     })
                  }

             },

        }

    };
</script>
<style>
  #check .el-upload--picture-card{
    display: none;
  }
</style>
