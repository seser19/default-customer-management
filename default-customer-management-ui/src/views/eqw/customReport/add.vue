<style lang="scss">
    .page-custom-report-template-add {
        background: #f4f6f8;
        padding: 12px;
        .upper-half {
            padding: 4px 22px 0;
            background: #ffffff;
            header {
                height: 58px;
                border-bottom: solid 1px #dae2ed;
                h2 {
                    float: left;
                    height: 58px;
                    line-height: 58px;
                    background: url("../image/title-icon-custom-report.png") no-repeat left center;
                    -webkit-background-size: 29px 29px;
                    background-size: 29px 29px;
                    text-indent: 40px;
                    font-size: 18px;
                    font-weight: normal;
                    color: #243847;
                }
                a {
                    float: right;
                    width: 60px;
                    height: 32px;
                    line-height: 32px;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    font-size: 14px;
                    text-align: center;
                    &.btn-save {
                        background: #1890ff;
                        color: #ffffff;
                        margin: 13px 0 0 0;
                        &:hover {
                            background: #43a5ff
                        }
                    }
                    &.btn-back {
                        border: solid 1px #c4cdd5;
                        background: #ffffff;
                        color: #37394c;
                        margin: 13px 20px 0 0;
                        &:hover {
                            background: rgba(0, 0, 0, 0.1);
                        }
                    }
                }
            }
            .basic-info {
                margin: 20px 0 0 0;
                .el-row {
                    margin: 3px 0 0 0;
                    >>> label {
                        font-weight: normal;
                        text-align: right;
                        padding: 0 25px 0 0;
                        color: #939eab;
                        font-size: 13px;
                    }
                }
            }
        }
        .bottom-half {
            padding: 22px;
            margin: 12px 0 0 0;
            background: #ffffff;
            .config-section {
                height: 626px;
                position: relative;
                .config {
                    position: absolute;
                    left: 0;
                    right: 0;
                    -webkit-box-shadow: 0 0 10px #cccccc;
                    -moz-box-shadow: 0 0 10px #cccccc;
                    box-shadow: 0 0 10px #cccccc;
                    height: 305px;
                    overflow: hidden;
                    -webkit-transition: height 0.3s;
                    -moz-transition: height 0.3s;
                    -ms-transition: height 0.3s;
                    -o-transition: height 0.3s;
                    transition: height 0.3s;
                    &.row {
                        top: 0;
                        &.close {
                            height: 46px;
                        }
                    }
                    &.column {
                        bottom: 0;
                        &.large {
                            height: 564px;
                        }
                    }
                    .header {
                        height: 46px;
                        padding: 14px;
                        h4 {
                            display: inline-block;
                            height: 18px;
                            line-height: 18px;
                            font-size: 16px;
                            font-weight: bold;
                            color: #243847;
                            border-left: solid 6px #e2110c;
                            text-indent: 10px;
                        }
                        .toggler {
                            float: right;
                            display: block;
                            width: 20px;
                            height: 20px;
                            font-weight: bold;
                            font-size: 16px;
                            color: #666666;
                            text-align: center;
                            line-height: 20px;
                            cursor: pointer;
                            -webkit-transition: all 0.2s;
                            -moz-transition: all 0.2s;
                            -ms-transition: all 0.2s;
                            -o-transition: all 0.2s;
                            transition: all 0.2s;
                            &.close {
                                -webkit-transform: rotate(180deg);
                                -moz-transform: rotate(180deg);
                                -ms-transform: rotate(180deg);
                                -o-transform: rotate(180deg);
                                transform: rotate(180deg);
                            }
                        }
                        .el-checkbox {
                            float: right;
                            margin: 0 0 0 20px;
                        }
                    }
                    .config-option {
                        position: absolute;
                        top: 46px;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        padding: 0 14px 14px;
                        background: #ffffff;
                        .option-tree {
                            width: 100%;
                            height: 100%;
                            padding: 1px 14px 12px;
                            background: #f4f6f8;
                            overflow: auto;
                            .option-group {
                                margin: 10px 0 0 0;
                                h5 {
                                    display: inline-block;
                                    height: 20px;
                                    font-size: 14px;
                                    color: #37394c;
                                    cursor: pointer;
                                    i {
                                        vertical-align: top;
                                        display: inline-block;
                                        width: 20px;
                                        height: 20px;
                                        margin: 0 0 0 2px;
                                        line-height: 20px;
                                        font-size: 13px;
                                        font-weight: bold;
                                        color: #777777;
                                        text-align: center;
                                        -webkit-transition: all 0.2s;
                                        -moz-transition: all 0.2s;
                                        -ms-transition: all 0.2s;
                                        -o-transition: all 0.2s;
                                        transition: all 0.2s;
                                        &.close {
                                            -webkit-transform: rotate(180deg);
                                            -moz-transform: rotate(180deg);
                                            -ms-transform: rotate(180deg);
                                            -o-transform: rotate(180deg);
                                            transform: rotate(180deg);
                                        }
                                    }
                                }
                                ul {
                                    margin: 0;
                                    padding: 0;
                                    overflow: hidden;
                                    -webkit-transition: all 0.3s;
                                    -moz-transition: all 0.3s;
                                    -ms-transition: all 0.3s;
                                    -o-transition: all 0.3s;
                                    transition: all 0.3s;
                                    li {
                                        list-style-type: none;
                                        margin: 8px 0 0 0;
                                        height: 20px;
                                        line-height: 20px;
                                        >>> .el-checkbox__label {
                                            font-size: 13px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .preview-section {
                height: 626px;
                -webkit-box-shadow: 0 0 10px #cccccc;
                -moz-box-shadow: 0 0 10px #cccccc;
                box-shadow: 0 0 10px #cccccc;
                position: relative;
                .header {
                    height: 46px;
                    padding: 14px;
                    h4 {
                        height: 18px;
                        line-height: 18px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #243847;
                        border-left: solid 6px #e2110c;
                        text-indent: 10px;
                    }
                }
                .sort-column {
                    position: absolute;
                    top: 46px;
                    left: 14px;
                    width: 230px;
                    bottom: 14px;
                    background: #f4f6f8;
                    padding: 3px 12px;
                    overflow: auto;
                    ul {
                        margin: 0;
                        padding: 0;
                        li {
                            list-style-type: none;
                            height: 26px;
                            margin: 12px 0 0 0;
                            div {
                                position: relative;
                                display: inline-block;
                                max-width: 150px;
                                height: 26px;
                                line-height: 26px;
                                overflow: hidden;
                                font-size: 12px;
                                color: #6b717b;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                padding: 0 22px 0 8px;
                                background: #ffffff;
                                border: solid 1px #e1e6ee;
                                -webkit-border-radius: 3px;
                                -moz-border-radius: 3px;
                                border-radius: 3px;
                                a {
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    display: inline-block;
                                    width: 26px;
                                    height: 26px;
                                    line-height: 26px;
                                    color: #cccccc;
                                    text-align: center;
                                    font-size: 12px;
                                    font-weight: bold;
                                    &:hover {
                                        color: #999999;
                                    }
                                }
                            }
                            > a {
                                float: right;
                                width: 20px;
                                height: 20px;
                                cursor: pointer;
                                position: relative;
                                left: 3px;
                                top: 3px;
                                text-align: center;
                                line-height: 20px;
                                color: #e0e3e7;
                                background: #a5adba;
                                -webkit-border-radius: 50%;
                                -moz-border-radius: 50%;
                                border-radius: 50%;
                                font-size: 12px;
                                font-weight: bold;
                                &.el-icon-sort-down {
                                    margin: 0 6px 0 0;
                                }
                                &:hover {
                                    color: #ffffff;
                                }
                            }
                        }
                    }
                }
                .table-head-preview {
                    position: absolute;
                    top: 46px;
                    left: 260px;
                    right: 14px;
                    padding: 80px 0 0 0;
                    overflow: auto;
                    white-space: nowrap;
                    font-size: 0;
                    ul {
                        margin: 0;
                        padding: 0;
                        font-size: 0;
                        list-style-type: none;
                        &.root {
                            display: inline-block;
                            border-top: solid 1px #cccccc;
                            border-left: solid 1px #cccccc;
                            overflow-x: auto;
                            overflow-y: hidden;
                        }
                        li {
                            list-style-type: none;
                            display: inline-block;
                            vertical-align: top;
                            white-space: nowrap;
                            p {
                                margin: 0;
                                font-size: 13px;
                                padding: 0 10px;
                                border-right: solid 1px #cccccc;
                                border-bottom: solid 1px #cccccc;
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="page-custom-report-template-add" v-loading="submitting">
        <section class="upper-half">
            <header>
                <h2>新建自定义报表</h2>
                <a class="btn-save" @click="submit()">保存</a>
                <a class="btn-back" @click="back()">返回</a>
            </header>
            <!-- 基础信息 -->
            <div class="basic-info">
                <el-form
                    :model="form"
                    :rules="formValidate"
                    ref="form"
                    label-width="105px"
                    label-position="left"
                >
                    <el-row :gutter="30">
                        <el-col :span="8">
                            <el-form-item label="模板编号" prop="tempCode">
                                <el-input v-model="form.tempCode" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="模板名称" prop="tempName">
                                <el-input v-model="form.tempName" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="模板类型" prop="belongType">
                                <el-select v-model="form.belongType" @change="toggleTemplateType()" size="small">
                                    <el-option
                                        v-for="o in templateTypeOption"
                                        :key="o.value"
                                        :label="o.text"
                                        :value="o.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="30">
                        <el-col :span="8">
                            <el-form-item label="适用范围" prop="tempScope">
                                <el-select v-model="form.tempScope" size="small">
                                    <el-option
                                        v-for="o in templateScopeOption"
                                        :key="o.value"
                                        :label="o.text"
                                        :value="o.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="交叉点标题" prop="crossTitle">
                                <el-input v-model="form.crossTitle" clearable />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="报表描述" prop="tempRemark">
                                <el-input type="textarea" v-model="form.tempRemark" :autosize="{minRows: 3}" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </section>
        <!-- 行与列的配置 -->
        <section class="bottom-half">
            <el-row :gutter="14">
                <el-col :span="7">
                    <div class="config-section">
                        <div class="config row" :class="{close: !rowConfigOpen}" v-loading="rowOptionLoading">
                            <div class="header">
                                <h4>配置行</h4>
                                <i class="toggler el-icon-arrow-up" :class="{close: !rowConfigOpen}" @click="rowConfigOpen = !rowConfigOpen"></i>
                            </div>
                            <div class="config-option">
                                <div class="option-tree">

                                    <div class="option-group" v-for="o in rowOption" :key="o">
                                        <h5 @click="toggleSubNode(o)">{{o.name}}<i class="el-icon-arrow-up" :class="{close: o.close}"></i></h5>
                                        <ul :id="'subNode_' + o.id" :style="{height: o.children.length * 28 + 'px'}">
                                            <li v-for="c in o.children" :key="c">
                                                <el-checkbox v-model="c.checked" @change="toggleRowSelect(c)">{{c.name}}</el-checkbox>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="config column" :class="{large: !rowConfigOpen}" v-loading="columnOptionLoading">
                            <div class="header">
                                <h4>配置列</h4>
                                <el-checkbox v-model="useTotal">统计</el-checkbox>
                            </div>
                            <div class="config-option">
                                <div class="option-tree">

                                    <div class="option-group" v-for="o in columnOption" :key="o">
                                        <h5 @click="toggleSubNode(o)">{{o.name}}<i class="el-icon-arrow-up" :class="{close: o.close}"></i></h5>
                                        <ul :id="'subNode_' + o.id" :style="{height: o.children.length * 28 + 'px'}">
                                            <li v-for="c in o.children" :key="c">
                                                <el-checkbox v-model="c.checked" @change="toggleColumnSelect(c)">{{c.name}}</el-checkbox>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="17">
                    <div class="preview-section">
                        <div class="header">
                            <h4>预览</h4>
                        </div>
                        <div class="sort-column">
                            <ul>
                                <li v-for="(column, index) in selectedColumn" :key="index">
                                    <div>{{column.name}}<a class="el-icon-close" @click="removeSelectedColumn(column)"></a></div>
                                    <a class="el-icon-sort-up" @click="riseColumn(column, index)"></a>
                                    <a class="el-icon-sort-down" @click="dropColumn(column, index)"></a>
                                </li>
                            </ul>
                        </div>
                        <div class="table-head-preview" ref="preview"></div>
                    </div>
                </el-col>
            </el-row>
        </section>
    </div>
</template>

<script>
    import { getCustomReportTemplateCode, getCustomReportRowConfig, getCustomReportColumnConfig, editCustomReportTemplate } from '@/api/report/report';

    export default {
        name: 'customReportAdd',
        data() {
            return {
                // 可选模板类型
                templateTypeOption: [{
                    value: '1',
                    text: '警情报告'
                }, {
                    value: '2',
                    text: '出动报告'
                }, {
                    value: '3',
                    text: '火灾报告'
                }],
                // 可选适用范围
                templateScopeOption: [{
                    value: '0',
                    text: '仅本单位'
                }, {
                    value: '1',
                    text: '本单位及下级单位'
                }],
                // 基础信息表单
                form: {
                    tempCode: '',
                    tempName: '',
                    belongType: '1',
                    tempScope: '0',
                    crossTitle: '',
                    tempRemark: ''
                },
                // 基础信息表单校验
                formValidate: {
                    tempCode: [{required: true, message: '模板编号不可为空', trigger: 'blur'}],
                    tempName: [{required: true, message: '请填写模板名称', trigger: 'blur'}],
                    belongType: [{required: true, message: '请选择模板类型', trigger: 'change'}],
                    tempScope: [{required: true, message: '请选择适用范围', trigger: 'change'}],
                    crossTitle: [{required: true, message: '请填写交叉点标题', trigger: 'blur'}]
                },
                // 是否展开行配置
                rowConfigOpen: true,
                // 可选行
                rowOption: [],
                // 可选行加载中flag
                rowOptionLoading: false,
                // 可选列
                columnOption: [],
                // 可选列加载中flag
                columnOptionLoading: false,
                // 已选行
                selectedRow: [],
                // 已选列
                selectedColumn: [],
                // 列的最深层级
                columnDepth: 2,
                // 表头预览html
                previewHtml: '',
                // 启用统计
                useTotal: false,
                // 是否正在提交
                submitting: false
            }
        },
        methods: {
            back() {
                this.$router.push({path: '/eqw/customReport'});
            },
            toggleTemplateType() {
                this.rowOptionLoading = true;
                // 更新可选行列
                this.$refs.preview.innerHTML = '';
                this.rowOption = [];
                this.selectedRow = [];
                this.columnOption = [];
                this.selectedColumn = [];
                getCustomReportRowConfig({belongType: this.form.belongType}).then(response => {
                    if (response.code === 200) {
                        const rows = response.data || [];
                        const level1Rows = rows.filter(row => row.level === '1');
                        const level2Rows = rows.filter(row => row.level === '2');
                        level2Rows.map(row => row.checked = false);
                        level1Rows.map(row => {
                            row.children = level2Rows.filter(r => r.pid === row.id);
                            row.close = false;
                        });
                        this.rowOption = level1Rows;
                    } else {
                        this.$message.error(response.msg);
                    }
                }).finally(() => {
                    this.rowOptionLoading = false;
                });
            },
            // 切换展示子节点
            toggleSubNode(node) {
                node.close = !node.close;
                document.getElementById('subNode_' + node.id).style.height = node.close ? '0' : node.children.length * 28 + 'px';
            },
            // 切换行选择
            toggleRowSelect(targetRow) {
                if (targetRow.checked) {
                    this.columnOptionLoading = true;
                    // 更新可选列
                    this.$refs.preview.innerHTML = '';
                    this.columnOption = [];
                    this.selectedColumn = [];
                    getCustomReportColumnConfig({belongType: this.form.belongType, rowConfId: targetRow.id}).then(response => {
                        if (response.code === 200) {
                            const columns = response.data || [];
                            columns.map(column => {
                                column.close = false;
                                column.children.map(r => r.checked = false);
                            });
                            this.columnOption = columns;
                        } else {
                            this.$message.error(response.msg);
                        }
                    }).finally(() => {
                        this.columnOptionLoading = false;
                    });
                    this.selectedRow = [targetRow];
                    // 保持单选
                    this.rowOption.map(row => {
                        row.children.map(r => {
                            r.checked = r.id === targetRow.id;
                        });
                    });
                } else {
                    // 不可取消选择
                    targetRow.checked = true;
                }
                // 由于vue的实现原理导致二维数组变动无法更新视图，这里直接使用强制更新
                this.$forceUpdate();
            },
            // 切换列选择
            toggleColumnSelect(targetColumn) {
                // 由于vue的实现原理导致二维数组变动无法更新视图，这里直接使用强制更新
                this.$forceUpdate();
                if (targetColumn.checked) {
                    this.selectedColumn.push(targetColumn);
                } else {
                    this.selectedColumn = this.selectedColumn.filter(c => c.id !== targetColumn.id);
                }
                this.renderPreview();
            },
            // 渲染表头预览
            renderPreview() {
                // 确定最深列
                let columnDepth = 1;
                this.selectedColumn.map(column => {
                    if (column.totalLevel > columnDepth) {
                        columnDepth = column.totalLevel;
                    }
                });
                this.columnDepth = columnDepth;
                // 生成并加载预览的html
                this.generatePreviewHtml(this.selectedColumn, true);
                this.$refs.preview.innerHTML = this.previewHtml;
            },
            // 递归方法：生成预览的html
            generatePreviewHtml(columnList, init) {
                if (init) {
                    this.previewHtml = '<ul class="root">';
                } else {
                    this.previewHtml += '<ul>';
                }
                columnList.map(column => {
                    this.previewHtml += '<li>';
                    if (column.children && column.children.length > 0) {
                        // 当前列还有下属子列，则当前列使用默认高度，继续遍历处理其下属子列
                        this.previewHtml += '<p style="height: 35px; line-height: 35px">' + column.name + '</p>';
                        this.generatePreviewHtml(column.children, false);
                    } else {
                        // 当前列已经是子叶节点，进行高度倍乘处理
                        const rowSpan = this.columnDepth - (parseInt(column.level) - 1) + 1;
                        const h = (35 * rowSpan) + 'px';
                        this.previewHtml += '<p style="height: ' + h + '; line-height: ' + h + ';">' + column.name + '</p>';
                    }
                    this.previewHtml += '</li>';
                });
                this.previewHtml += '</ul>';
            },
            // 移除已选的列
            removeSelectedColumn(targetColumn) {
                // 从已选列中移除
                this.selectedColumn = this.selectedColumn.filter(c => c.id !== targetColumn.id);
                // 联动更新左侧可选列
                this.columnOption.map(o => {
                    o.children.map(column => {
                        if (column.id === targetColumn.id) {
                            column.checked = false;
                        }
                    });
                });
                this.$forceUpdate();
                // 更新预览
                this.renderPreview();
            },
            // 行降序
            dropColumn(column, index) {
                if (index === this.selectedColumn.length - 1) {
                    return;
                }
                const temp = JSON.parse(JSON.stringify(this.selectedColumn[index + 1]));
                this.selectedColumn.splice(index, 1, temp);
                this.selectedColumn.splice(index + 1, 1, column);
                this.renderPreview();
            },
            // 行升序
            riseColumn(column, index) {
                if (index === 0) {
                    return;
                }
                const temp = JSON.parse(JSON.stringify(this.selectedColumn[index - 1]));
                this.selectedColumn.splice(index, 1, temp);
                this.selectedColumn.splice(index - 1, 1, column);
                this.renderPreview();
            },
            // 保存模板
            submit() {
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        this.$message.warning('基础信息不完整');
                        return;
                    }
                    if (this.selectedRow.length === 0) {
                        this.$message.warning('请配置报表行');
                        return;
                    }
                    if (this.selectedColumn.length === 0) {
                        this.$message.warning('请配置报表列');
                        return;
                    }
                    // 校验交叉点标题是否与列名称有重复
                    let crossTitleValid = true;
                    for (const column of this.selectedColumn) {
                        if (column.name === this.form.crossTitle.trim()) {
                            crossTitleValid = false;
                            break;
                        }
                        for (const c of column.children) {
                            if (c.name === this.form.crossTitle.trim()) {
                                crossTitleValid = false;
                                break;
                            }
                        }
                        if (!crossTitleValid) {
                            break;
                        }
                    }
                    if (!crossTitleValid) {
                        this.$message.warning('交叉点标题不能与任意列名相同');
                        return;
                    }
                    // 重复提交拦截
                    if (this.submitting) {
                        return;
                    }
                    this.submitting = true;
                    // 基础信息
                    const params = {
                        tempCode: this.form.tempCode,
                        tempName: this.form.tempName,
                        belongType: this.form.belongType,
                        tempScope: this.form.tempScope,
                        crossTitle: this.form.crossTitle,
                        colTotal: this.useTotal ? '0' : '1'
                    };
                    if (this.form.tempRemark) {
                        params.tempRemark = this.form.tempRemark;
                    }
                    // 配置行
                    const row = [];
                    this.selectedRow.forEach((r, i) => {
                        row.push({
                            confId: r.id,
                            instSort: i
                        });
                    });
                    params.row = row;
                    // 配置列
                    const column = [];
                    this.selectedColumn.forEach((c, i) => {
                        column.push({
                            confId: c.id,
                            name: c.name,
                            instSort: i
                        });
                    });
                    params.column = column;
                    // 提交接口
                    editCustomReportTemplate(params).then(response => {
                        if (response.code === 200) {
                            this.$message.success('报表模板新增成功');
                            this.$router.push({path: '/eqw/customReport'});
                            this.pageInit();
                        } else {
                            this.$message.error(response.msg);
                        }
                    }).finally(() => {
                        this.submitting = false;
                    });
                });
            },
            pageInit() {
                // 获取编号
                getCustomReportTemplateCode().then(response => {
                    if (response.code === 200) {
                        this.form.tempCode = response.data.tempCode;
                    } else {
                        this.$message.error(response.msg);
                    }
                });
                // 重置表单和页面
                this.form = {
                    tempCode: '',
                    tempName: '',
                    belongType: '1',
                    tempScope: '0',
                    crossTitle: '',
                    tempRemark: ''
                };
                // 初始化可配置行
                this.toggleTemplateType();
                this.rowConfigOpen = true;
                this.useTotal = false;
            }
        },
        mounted() {
            this.pageInit();
        }
    }
</script>
