<style lang="scss" scoped>
    .page-custom-report-template-list {
        // background: #ffffff;
        // padding: 4px 22px;
        margin: 10px;
        padding: 10px;
        box-shadow: 0 0 0 1px #dae2ed inset;
        background-color: #fff;
        border-radius: 3px;
        min-height: calc(100vh - 104px);
        position: relative;
        z-index: 8;
        header {
            height: 45px;
            border-bottom: solid 1px #dae2ed;
            h2 {
                float: left;
                height: 45px;
                line-height: 30px;
                background: url("../image/title-icon-custom-report.png") no-repeat left top;
                -webkit-background-size: 26px 26px;
                background-size: 26px 26px;
                text-indent: 40px;
                font-size: 18px;
                font-weight: normal;
                color: #243847;
            }
            a.btn-add {
                float: right;
                width: 129px;
                height: 36px;
                line-height: 36px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                background: #1890ff;
                color: #ffffff;
                font-size: 14px;
                text-align: center;
                // margin: 11px 0 0 0;
                &:hover {
                    background: #43a5ff;
                }
            }
        }
        .search_line{
            margin-top: 20px;
        }
        h3 {
            height: 36px;
            line-height: 36px;
            margin: 10px 0 0 0;
            font-size: 16px;
            font-weight: bold;
            color: #243847;
        }
        .list-table {
            margin: 8px 0 0 0;
            a.table-btn {
                margin: 0 0 0 10px;
                color: #1890ff;
                &:hover {
                    color: #2874ba;
                }
                &:first-child {
                    margin: 0;
                }
            }
        }
    }
</style>


<template>
    <div class="page-custom-report-template-list">
        <header>
            <h2>自定义报表</h2>
            <a class="btn-add" @click="toAdd()">新建自定义报表</a>
        </header>
        <div class="search_line">
            <el-row>
                <el-col :span="8">
                       模版类型：<el-select v-model="queryParams.belongType" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                </el-col>
                <el-col :span="8">
                    模板名称：<el-input v-model="queryParams.tempName" placeholder="请输入内容" style="width:194px"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="doSearch()" :loading="querying">查询</el-button>
                    <el-button type="primary" @click="reset()">重置</el-button>
                </el-col>
            </el-row>
            
        </div>
        <h3>已配置自定义报表</h3>
        <section class="list-table">
            <el-table v-loading="loading" :data="tableData" @sort-change="tableSortChangeHandle">
                <el-table-column label="模板编号" width="175" prop="tempCode" show-overflow-tooltip />
                <el-table-column label="模板名称" prop="tempName" show-overflow-tooltip />
                <el-table-column label="模板描述" width="230" prop="tempRemark" show-overflow-tooltip />
                <el-table-column label="报表类型" width="100" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.belongType | templateType}}</template>
                </el-table-column>
                <el-table-column label="创建时间" width="160" prop="createTime" align="center" show-overflow-tooltip />
                <el-table-column label="启用状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-switch v-if="scope.row.flag === '1'" v-model="scope.row.tempStatus" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)" />
                        <el-switch v-if="scope.row.flag !== '1'" v-model="scope.row.tempStatus" active-value="0" inactive-value="1" disabled />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <a v-if="scope.row.flag === '1'" class="table-btn update" @click="toUpdate(scope.row.tempId)">修改</a>
                        <a v-if="scope.row.flag === '1'" class="table-btn delete" @click="deleteConfirm(scope.row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <section class="pagination">
            <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
            />
        </section>
    </div>
</template>

<script>

    import { getCustomReportTemplateList, updateCustomReportTemplateStatus } from '@/api/report/report';
import { log } from '_@antv_g2plot@2.3.40@@antv/g2plot/lib/utils';

    export default {
        name: 'customReportList',
        data() {
            return {
                querying: false, //是否正在查询
                options: [{
                value: '1',
                label: '警情'
                }, {
                value: '2',
                label: '出动'
                }, {
                value: '3',
                label: '火灾'
                },],
                loading: false,
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    flag: '1',
                    sortField: 'index',
                    sortOrder: 'asc',
                    belongType: '',
                    tempName:'',
                },
                tableData: [],
                total: 0
            }
        },
        filters: {
            templateType: function (code) {
                let typeName = '';
                if (code === '1') {
                    typeName = '警情报告';
                } else if (code === '2') {
                    typeName = '出动报告';
                } else if (code === '3') {
                    typeName = '火灾报告';
                }
                return typeName;
            }
        },
        methods: {
            doSearch(){
                this.querying = true;
                if(this.queryParams.value == '' && this.queryParams.input == '' ){
                    this.$message('请至少输入一个条件查询')
                }else{
                    this.loading = true;
                    getCustomReportTemplateList(this.queryParams).then(response => {
                        // console.log(response);
                        this.loading = false;
                        if (response.code === 200) {
                            this.tableData = response.data.resultList || [];
                            this.total = response.data.totalNum;
                            this.querying = false;
                        } else {
                            this.$message.error(response.msg);
                        }
                    }).catch(e => {
                        this.loading = false;
                        this.querying = false;
                    });
                }
            },
            toAdd() {
                this.$router.push({path: '/eqw/customReport/add'});
            },
            toUpdate(id) {
                this.$router.push({path: '/eqw/customReport/update/' + id});
            },
            getList() {
                this.loading = true;
                getCustomReportTemplateList(this.queryParams).then(response => {
                    this.loading = false;
                    if (response.code === 200) {
                        this.tableData = response.data.resultList || [];
                        this.total = response.data.totalNum;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.loading = false;
                });
            },
            reset() {
                this.loading = true;
                this.queryParams.belongType = '',
                this.queryParams.tempName = '',
                getCustomReportTemplateList(this.queryParams).then(response => {
                    this.loading = false;
                    if (response.code === 200) {
                        this.tableData = response.data.resultList || [];
                        this.total = response.data.totalNum;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).catch(e => {
                    this.loading = false;
                });
            },
            tableSortChangeHandle({prop, order}) {
                if (prop && order) {
                    const orderMapper = {
                        ascending: 'asc',
                        descending: 'desc'
                    };
                    this.queryParams.sortField = prop;
                    this.queryParams.sortOrder = orderMapper[order];
                    this.getList();
                }
            },
            // 确认启用/停用模板
            handleStatusChange(row) {
                let text = row.tempStatus === '0' ? '启用' : '停用';
                this.$confirm('要' + text + '模板：' +row.tempName + '吗?', '信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    updateCustomReportTemplateStatus({tempId: row.tempId, tempStatus: row.tempStatus}).then(response => {
                        if (response.code === 200) {
                            this.$message.success('已' + text + '该模板');
                        } else {
                            this.$message.error(response.msg);
                            // 异常回滚
                            row.tempStatus = row.tempStatus === '0' ? '1' : '0';
                        }
                    }).catch(() => {
                        // 异常回滚
                        row.tempStatus = row.tempStatus === '0' ? '1' : '0';
                    });
                }).catch(() => {
                    // 取消回滚
                    row.tempStatus = row.tempStatus === '0' ? '1' : '0';
                });
            },
            // 确认删除模板
            deleteConfirm(row) {
                this.$confirm('要删除模板：' + row.tempName + '吗?', '信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    updateCustomReportTemplateStatus({tempId: row.tempId, tempStatus: 9}).then(response => {
                        if (response.code === 200) {
                            this.queryParams.pageNum = 1;
                            this.getList();
                            this.$message.success('模板删除成功');
                        } else {
                            this.$message.error(response.msg);
                        }
                    });
                }).catch(() => {});
            }
        },
        created() {
            this.getList();
        }
    }
</script>
