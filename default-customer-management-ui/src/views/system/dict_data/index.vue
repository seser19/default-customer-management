<template>
    <div class="app-container">

        <el-table v-loading="loading" :data="typeList" style="width: 100%;" empty-text="暂无数据">
            <el-table-column label="字典名称" align="center" prop="dictLabel" :show-overflow-tooltip="true"/>

            <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
            <el-table-column label="值" align="center" prop="dictValue">
                <template slot-scope="scope">
                    <span v-if="scope.row.dictType.endsWith('data_freeze_flag')">

                        <el-date-picker
                            v-model="freezeTime"
                            type="datetime"
                            @change="changeFreezeTime($event, scope.row)"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"
                            v-bind:editable="f"
                            v-bind:clearable="f"
                            placeholder="选择冻结日期时间">
                        </el-date-picker>
                    </span>
                    <span v-else>{{ scope.row.dictValue }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
            <!--<el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>-->
            <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="启用"
                        inactive-text="禁用"
                        active-value="0"
                        inactive-value="1"
                        @change="change(scope.row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {
        listData, updateData
    } from "@/api/system/dict/data";

    import {
        getLvl2DeptId
    } from "@/api/system/dept";

    export default {
        name: "specifydata",

        mounted() {
            getLvl2DeptId().then(response => {
                if (200 == response.code) {
                    let lvl2DeptId = response.data;
                    this.queryParams.dictTypes = `${lvl2DeptId}_query_light_fire_flag,${lvl2DeptId}_data_freeze_flag`;
                    this.getList();
                }
            });
        },
        data() {
            return {
                // 遮罩层
                loading: false,
                // 总条数
                total: 0,
                // 字典表格数据
                typeList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 状态数据字典
                statusOptions: [],
                // 日期范围
                dateRange: [],

                //冻结时间
                freezeTime: '',
                t: true,
                f: false,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    dictName: undefined,
                    dictType: undefined,
                    dictTypes: '',
                    dictValue: undefined,
                    status: undefined
                }
            };
        },

        methods: {

            /** 查询字典类型列表 */
            getList() {
                this.loading = true;
                 listData(this.addDateRange(this.queryParams, this.dateRange)).then(
                    response => {
                        this.typeList = response.rows;
                        this.total = response.total;
                        this.loading = false;

                        // 冻结时间
                        this.freezeTime = response.rows.filter(row => {
                            return this.isFreezeDict(row);
                        }).map(row => row.dictValue);
                        this.freezeTime = JSON.parse(JSON.stringify(this.freezeTime))[0];
                    }
                );
            },
            // 字典状态字典翻译
            statusFormat(row, column) {
                if ('0' == row.status) {
                    return '启用';
                }
                return '禁用';
                // console.log(row, column);
            },

            isFreezeDict(row) {
                return row.dictType.endsWith('data_freeze_flag');
            },

            //修改冻结时间
            changeFreezeTime($event, row) {
                this.resetParams();
                this.queryParams.dictCode = row.dictCode;
                this.queryParams.dictValue = $event;
                updateData(this.queryParams);
            },

            /** 修改按钮操作 */
            change(row) {
                this.resetParams();
                this.queryParams.dictCode = row.dictCode;
                this.queryParams.status = row.status;
                updateData(this.queryParams);
            },

            resetParams() {
                this.queryParams.dictTypes = undefined;
            }
        }
    };
</script>
