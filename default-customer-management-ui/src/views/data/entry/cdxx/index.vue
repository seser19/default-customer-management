<template lang="pug">
  .app-container
    .list(v-if="show")
      .reporting-title
        h2 {{ $route.meta.title }}
        el-button(type="primary" @click="dialogVisible=true") 新建草稿
      .body
        el-tabs(v-model="activeName" @tab-click="handleClick")
          el-tab-pane(label="待填报清单" name="first")
            //- h3 待填报清单
            .listTable
              el-table(v-loading="listTableLoading" :data="tabledata" style="width: 100%" @sort-change="tableSortChangeHandle"
                :default-sort="{prop: 'create_time', order: 'descending'}")
                el-table-column(type="index" label="序号" width="50")
                el-table-column(prop="jjsj" label="接警时间" width="140" sortable="custom")
                  template(slot-scope="scope")
                    span {{ scope.row.jqxx.jjsj }}
                el-table-column(prop="jqmc" label="警情名称" show-overflow-tooltip)
                  template(slot-scope="scope")
                    span {{ scope.row.jqxx.jqmc }}
                el-table-column(prop="type" label="参战形式" width="100" sortable="custom")
                  template(slot-scope="scope") {{scope.row.respondType=='010000'?'主战':'增援'}}
                el-table-column(prop="zrqddmc" label="责任区大队" width="120" show-overflow-tooltip)
                el-table-column(prop="sjlbmc" label="警情类型" width="140" show-overflow-tooltip sortable="custom")
                el-table-column(prop="sender" label="发送单位" width="160" sortable="custom")
                el-table-column(prop="create_time" label="发送时间" width="150" sortable="custom")
                  template(slot-scope="scope")
                    span {{ scope.row.jqxx.createTime }}
                el-table-column(label="操作" width="100")
                  template(slot-scope="scope")
                    el-button(type="text" @click="fillIn(scope.row.cdbh, scope.row.jqxx.sjlbdm)") 填报
                    el-button(type="text" @click="gjBtn(scope.row.cdbh)") 导入
              pagination(
              v-show="queryParams.total>0"
                :total="queryParams.total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getList")
          el-tab-pane(label="草稿信息列表" name="second")
            .listTable
              el-table(v-loading="listTableLoading" :data="draftCdxxList" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}")
                el-table-column(type="index" label="序号" width="50")
                el-table-column(prop="title" label="草稿名称" )
                el-table-column(prop="respondType" label="参战形式" )
                  template(slot-scope="scope") {{scope.row.respondType=='010000'?'主战':'增援'}}
                el-table-column(prop="zrqdddm" label="是否首到" )
                  template(slot-scope="scope") {{scope.row.isFirstarrive=="Y"?'是':'否'}}
                el-table-column(label="人员伤亡" )
                  template(slot-scope="scope") {{scope.row.isCzrysw=="1"?'有':'无'}}
                el-table-column(prop="sjlbmc" label="警情类别" )
                  template(slot-scope="scope") {{scope.row.sjlbmc || '-'}}
                el-table-column(prop="zjxgsj" label="录入时间" )
                el-table-column( label="操作" width="120")
                  template(slot-scope="scope")
                    el-button(type="text" @click="writeDraft(scope.row)") 修改
                    el-button(type="text" @click="delDraft(scope.row.cgbh)") 删除
              pagination(
              v-show="draftCdxxParams.total>0"
                :total="draftCdxxParams.total"
                  :page.sync="draftCdxxParams.pageNum"
                  :limit.sync="draftCdxxParams.pageSize"
                  @pagination="getdraftList")
    reporting-police(:draft="draft" @back="back" :tableRow="tableRow" v-else)
    //- 信息选择
    el-dialog(title="信息选择" width="30" :visible.sync="dialogVisible" :before-close="handleClose")
      el-form(ref="dialogForm" :model="draft" :rules="dialogFormRules" label-width="90px")
        el-form-item(label="草稿名称" prop="title")
          el-input(v-model="draft.title" placeholder="请输入草稿名称" style="width:70%" :maxlength="50")
        el-form-item(label="参战形式")
          el-radio(v-model="draft.respondType" label="010000") 主战
          el-radio(v-model="draft.respondType" label="020000") 增援
        el-form-item(label="警情类型" prop="sjlbdm")
          //- el-radio(v-model="draft.sjlbdm" label="020000000000") 抢险救援
          //- el-radio(v-model="draft.sjlbdm" label="010000000000") 火灾扑救
          el-cascader(ref="cascader"
            :props="props"
          v-model="draft.sjlbdm"
          placeholder="请选择警情类型"
          clearable style="width: 70%")
        el-form-item(label="是否首到")
          el-checkbox(v-model="draft.isFirstarrive") 首到
      span(slot="footer" class="dialog-footer")
        el-button(@click="handleClose" size="small") 取 消
        el-button(type="primary" @click="addNewDraft" size="small") 确 定

    //- 导入草稿列表
    el-dialog(title="导入草稿清单" :visible.sync="dialogVisibleList" width="60%" :show-close="true" :before-close="VisibleListClose")
      el-table(v-loading="listTableLoading"  ref="singleTable"  highlight-current-row
      @current-change="handleCurrentChange" :data="draftCdxxList" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}")
        el-table-column(type="index" label="序号" width="50")
        el-table-column(prop="title" label="草稿名称" )
        el-table-column(prop="respondType" label="参战形式" )
          template(slot-scope="scope") {{scope.row.respondType=='010000'?'主战':'增援'}}
        el-table-column(prop="zrqdddm" label="是否首到")
          template(slot-scope="scope") {{scope.row.isFirstarrive=="Y"?'是':'否'}}
        el-table-column(label="人员伤亡" )
          template(slot-scope="scope") {{scope.row.isCzrysw=="1"?'有':'无'}}
        el-table-column(prop="sjlbmc" label="警情类别" )
          template(slot-scope="scope") {{scope.row.sjlbmc || '-'}}
        el-table-column(prop="zjxgsj" label="录入时间" )
      pagination(
      v-show="draftCdxxParams.total>0"
        :total="draftCdxxParams.total"
          :page.sync="draftCdxxParams.pageNum"
          :limit.sync="draftCdxxParams.pageSize"
          @pagination="getdraftList")
      .footer(style="margin-top:30px; text-align:right")
        el-button(type="primary" size="small" @click="articulatedBtn") 确定
</template>
<script>
  import {cdxxApi} from "@/api/data/entry/cdxx.js";
  import {getJqcdlb} from "@/api/data/entry/jqxx";
  // 出动 新增/修改/审核 组件
  import ReportingPolice from "./components/ReportingPolice.vue";

  export default {
    name: "dispatchedreport",
    components: {
      ReportingPolice
    },
    data() {
      return {
        activeName: "first",
        tableRow: undefined,
        listTableLoading: false,
        dialogVisible: false, //弹框
        dialogVisibleList: false, //导入草稿
        show: true, //展示填报
        //待填报清单分页
        queryParams: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          params: {
            // 依据排序的属性名称（从 table 返回的数据中获取）
            sortField: "new_tbsj",
            sortOrder: "desc"
          }
        },
        tabledata: [], // 待填报清单
        //
        draftCdxxParams: {
          total: 0,
          pageSize: 20,
          pageNum: 1
        },
        draftCdxxList: [],
        // 出动 新增/修改/审核 组件 需要的数据
        draft: {
          // 出动编号
          cdbh: "",
          // 是否新增
          isNew: false,
          // 是否尝试获取历史单信息（仅在出动单新填报时为true）
          useHistory: true,
          // 是否首到
          isFirstarrive: false,
          // 主战 || 增援
          respondType: "010000",
          // 新建时的警情类型
          sjlbdm: "",
          // 新建时的草稿名称
          title: "",
          // 修改时选中的草稿箱编号
          cgbh: undefined
        },
        dialogFormRules: {
          title: [
            {required: true, message: "草稿名称不能为空", trigger: "blur"}
          ],
          sjlbdm: [
            {
              required: true,
              message: "警情类型不能为空",
              trigger: ["blur", "change"]
            }
          ]
        },

        gjInfo: {
          cgbh: "",
          cdbh: ""
        },
        // 警情类型级联懒加载
        props: {
          lazy: true,
          lazyLoad: this.lazyLoad,
          children: "children",
          label: "dictLabel",
          value: "dictValue",
          isLeaf: "isLeaf",
          // 是否返回由该节点所在的各级菜单的值所组成的数组
          emitPath: false
        }
      };
    },
    created() {
      //初始化加载列表
      // this.getCdxxList();
      this.getDraftCdxxList();
    },
    methods: {
      back(val) {
        this.show = true;
        this.resetForm("dialogForm");
        this.getCdxxList();
        this.getDraftCdxxList();
      },
      //新建草稿
      addNewDraft() {
        this.$refs["dialogForm"].validate(valid => {
          if (valid) {
            if (!this.draft.sjlbdm) {
              this.msgInfo("请选择警情类型！");
              return false;
            }
            this.draft.cdbh = this.draft.cgbh = undefined;
            this.draft.isNew = false;
            this.dialogVisible = false;
            this.show = false;
          }
        });
      },
      /**
       * 表格中的 填报 动作
       */
      fillIn(val, sjlbdm) {
        this.tableRow = sjlbdm
        this.draft.cdbh = val;
        this.draft.isNew = true;
        this.show = false;
      },
      //关闭
      handleClose() {
        this.dialogVisible = false;
        this.resetForm("dialogForm");
        this.draft = {
          cdbh: "",
          isNew: false, //是否新增
          isFirstarrive: false,
          respondType: "010000",
          // 新建时的警情类型
          sjlbdm: "",
          // 新建时的草稿名称
          title: "",
          // 修改时选中的草稿箱编号
          cgbh: undefined
        };
      },
      //
      handleClick(tab) {
        // if (tab.name == 'first') {
        // 	this.getCdxxList();
        // }else{
        // }
      },
      //加载填报清单列表分页
      getList(val) {
        let {page, limit} = val;
        this.getCdxxList();
      },
      //导入ID
      gjBtn(val) {
        this.dialogVisibleList = true;
        this.gjInfo.cdbh = val;
      },
      //关闭导入弹窗
      VisibleListClose() {
        this.dialogVisibleList = false;
        this.gjInfo.cgbh = "";
        this.gjInfo.cdbh = "";
        this.$refs.singleTable.setCurrentRow();
      },
      //选择导入信息
      handleCurrentChange(row) {
        // console.log(row);
        row && (this.gjInfo.cgbh = row.cgbh);
      },
      //草稿分页
      getdraftList(val) {
        let {page, limit} = val;
        this.getDraftCdxxList();
      },
      //导入
      articulatedBtn() {
        const $this = this;
        if (this.gjInfo.cgbh == "" || this.gjInfo.cdbh == "") {
          this.$message.warning("请选择导入信息!");
          return;
        } else {
          this.listTableLoading = true;
          cdxxApi
            .respondLinkPolice($this.gjInfo)
            .then(res => {
              if (res.code == 200) {
                this.$message.success("导入成功!");
                this.getCdxxList();
                this.getDraftCdxxList();
              }
            })
            .finally(() => {
              this.dialogVisibleList = this.listTableLoading = false;
            });
        }
      },
      // 删除草稿数据
      delDraft(val) {
        // console.log(val);
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            cdxxApi.deleteDraft({cgbh: val}).then(res => {
              if (res.code == 200) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: "success"
                });
                this.getDraftCdxxList();
              }
            });
          })
          .catch(function () {
          });
      },
      /**
       * 修改草稿箱数据
       * title 草稿名称
       * cgbh 草稿箱编号
       */
      writeDraft({title, cgbh}) {
        this.draft.cdbh = undefined;
        this.draft.isNew = false;

        // this.draft.title = title;
        this.draft.cgbh = cgbh;
        this.show = false;
      },

      // 导入列表
      getDraftCdxxList() {
        const $this = this;
        cdxxApi.draftCdxxList($this.draftCdxxParams).then(res => {
          if (res.code == 200) {
            if (!res.data.hasresult) {
              $this.draftCdxxList = [];
              $this.draftCdxxParams.total = 0;
              return;
            }
            $this.draftCdxxList = res.data.table.rows;
            $this.draftCdxxParams.total = res.data.table.total;
          }
        });
      },
      // 加载填报清单列表
      getCdxxList() {
        const $this = this;
        $this.listTableLoading = true;

        cdxxApi
          .dtbCdxxList(this.queryParams)
          .then(res => {
            if (res.code == 200) {
              if (!res.data.hasresult) {
                $this.tabledata = [];
                $this.queryParams.total = 0;
                return;
              }
              $this.tabledata = res.data.table.rows;
              // let a = JSON.stringify(this.tabledata[0].jqxx.sjlbdm);
              // console.log('this.123',this.tabledata)
              // console.log('this.tabledata',a)
              $this.queryParams.total = res.data.table.total;
              $this.listTableLoading = false;
            }
          })
          .finally(() => {
            $this.listTableLoading = false;
          });
      },
      /**
       * 警情类型 加载
       */
      lazyLoad(node, resolve) {
        if (node.level === 0) {
          getJqcdlb({
            dictType: "jqcjlb",
            parentValue: "0"
          })
            .then(res => {
              if (res.code !== 200) {
                return;
              }
              resolve(this.handle(res.data));
            })
            .catch(res => {
              resolve([]);
            });
        } else {
          getJqcdlb({
            dictType: "jqcjlb",
            parentValue: node.value
          })
            .then(res => {
              if (res.code !== 200) {
                return;
              }
              resolve(this.handle(res.data));
            })
            .catch(res => {
              resolve([]);
            });
        }
        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
      },
      // 设置叶子节点
      handle(arr) {
        // console.log(arr);
        arr.forEach(item => {
          if (item.isLast == "1") {
            item["leaf"] = true;
          }
        });
        return arr;
      },
      /**
       * 表格 单列排序改变回调
       */
      tableSortChangeHandle({column, prop, order}) {
        if (prop && order) {
          const dictionaries = {
            ascending: "asc",
            descending: "desc"
          };
          // 特殊字段进行处理
          if (prop === "type") {
            prop = "respond_type";
          } else if (prop === "sjlbmc") {
            prop = "sjlbdm";
          } else if (prop === "sender") {
            prop = "tbzh";
          }
          // 转换数据
          this.queryParams.params.sortField = prop;
          this.queryParams.params.sortOrder = dictionaries[order];
          this.getCdxxList();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";

  .app-container {
    .list {
      .reporting-title {
        h2 {
          background-image: url("./image/icon-info.png");
          background-repeat: no-repeat;
          background-size: 20px;
        }
      }
      .body {
        .el-tabs {
          .el-tabs__header {
            .el-tabs__nav-wrap:after {
              background-color: #fff !important;
            }
          }
        }
      }
    }
  }
</style>
<style lang="stylus">
  .app-container
    .body
      .el-tabs
        .el-tabs__header
          .el-tabs__nav-wrap:after
            background-color #fff !important
</style>
