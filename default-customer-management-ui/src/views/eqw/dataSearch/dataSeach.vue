<style rel="stylesheet/scss" lang="scss">
    .dataSearch {
        margin: 15px 22px;
        padding: 20px;
        background-color: #fff;
        .filter-section {
            padding: 0 0 15px 0;
            border-bottom: dashed 1px #e4e4e4;
            margin: 0 0 10px 0;
            h4 {
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                padding-left: 10px;
                margin-bottom: 10px;
                position: relative;
                border-left: 2px solid #437fdf;
                a {
                    float: right;
                    font-size: 14px;
                    color: #437fdf;
                    i {
                        // width: 29px;
                        height: 14px;
                        // margin: 0 0 0 -3px;
                        -webkit-transition: all 0.2s;
                        -moz-transition: all 0.2s;
                        -ms-transition: all 0.2s;
                        -o-transition: all 0.2s;
                        transition: all 0.2s;
                        &.opened {
                            -webkit-transform: rotate(-90deg);
                            -moz-transform: rotate(-90deg);
                            -ms-transform: rotate(-90deg);
                            -o-transform: rotate(-90deg);
                            transform: rotate(-90deg);
                        }
                    }
                }
            }
            .filter-form {
                overflow: hidden;
                &.warning {
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                    height: 168px;
                    &.hide-some {
                        height: 89px;
                    }
                }
                &.dispatch-casualty {
                    -webkit-transition: all 0.2s;
                    -moz-transition: all 0.2s;
                    -ms-transition: all 0.2s;
                    -o-transition: all 0.2s;
                    transition: all 0.2s;
                    height: 126px;
                    &.hide-some {
                        height: 47px;
                    }
                }
                &.fire-casualty {
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                    height: 208px;
                    &.hide-some {
                        height: 47px;
                    }
                }
                .el-row {
                    // height: 32px;
                    // margin: 15px 0 0 0;
                    .el-col {
                        margin: 5px 0px;
                        .form-item {
                            // display: flex;
                            label {
                                display: inline-block;
                                width: 160px;
                                // font-size: 13px;
                                height: 32px;
                                line-height: 32px;
                                // color: #333333;
                                font-weight: normal;
                                flex-shrink: 0;
                            }
                            .form-item-ctrl {
                                display: inline-flex;
                                height: 32px;
                                flex-grow: 1;
                                .el-input {
                                    height: 32px;
                                    input {
                                        height: 32px;
                                        line-height: 32px;
                                        font-size: 13px;
                                        padding: 0 26px 0 8px;
                                    }
                                    .el-input__suffix {
                                        right: 3px;
                                    }
                                }
                                .el-date-editor {
                                    height: 32px;
                                    width: 47%;
                                    input {
                                        padding: 0 14px 0 30px;
                                        cursor: pointer;
                                    }
                                }
                                &.complex {
                                    position: relative;
                                    .el-input {
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 32px;
                                        input {
                                            cursor: pointer;
                                            padding: 0 32px 0 8px;
                                            overflow: hidden;
                                            white-space: nowrap;
                                            text-overflow: ellipsis;
                                        }
                                        .el-input__suffix {
                                            right: 25px;
                                        }
                                    }
                                    i.iconfont {
                                        position: absolute;
                                        top: 0;
                                        right: 0;
                                        width: 34px;
                                        height: 32px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    }
                                }
                                .el-cascader {
                                    width: 100%;
                                    height: 32px;
                                    cursor: pointer;
                                    input {
                                        height: 32px !important;
                                    }
                                    .el-cascader__tags {
                                        height: 32px;
                                        top: 0;
                                        display: block;
                                        line-height: 32px;
                                        -webkit-transform: none;
                                        -moz-transform: none;
                                        -ms-transform: none;
                                        -o-transform: none;
                                        transform: none;
                                    }
                                }
                                .el-select {
                                    width: 100%;
                                }
                                .el-input-number {
                                    width: 44%;
                                    input {
                                        padding: 0 8px;
                                    }
                                }
                                .tilde {
                                    width: 6%;
                                    height: 32px;
                                    line-height: 32px;
                                    font-size: 15px;
                                    text-align: center;
                                    &.large {
                                        width: 12%;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .operations {
            margin: 20px 0 0 0;
            button {
                padding: 0;
                height: 30px;
                width: 70px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                &.synchronize-btn {
                    width: 100px;
                    float: right;
                    margin: 0 0 0 17px;
                }
            }
            p.synchronize-timestamp {
                float: right;
                height: 30px;
                line-height: 30px;
                font-size: 13px;
                color: #333333;
                margin: 0;
                span {
                    font-size: 14px;
                    color: red;
                }
            }
        }
        .result {
            h4 {
                font-size: 16px;
                color: #437fdf;
                font-weight: normal;
                margin: 17px 0 0 0;
            }
            .summary {
                font-size: 12px;
                color: #777777;
                margin: 8px 0 10px 0;
                span {
                    color: #f77006;
                }
            }
            .pic {
                position: relative;
                padding-left: 18px;
            }
            .pic img {
                width: 14px;
                height: 14px;
                position: absolute;
                left: 0;
                top: 4px;
            }
        }
    }
</style>

<template>
    <div class="dataSearch">
        <el-tabs v-model="activeName">
            <el-tab-pane label="警情查询" name="warning">
                <police-sentiment-search />
            </el-tab-pane>
            <el-tab-pane label="出动查询" name="dispatch">
                <dispatch-sentiment-search />
            </el-tab-pane>
            <el-tab-pane label="火灾查询" name="fire">
                <fire-sentiment-search />
            </el-tab-pane>
            <el-tab-pane label="指战员伤亡查询" name="dispatchCasualty">
                <dispatch-casualty-search />
            </el-tab-pane>
            <el-tab-pane label="火灾伤亡查询" name="fireCasualty">
                <fire-casualty-search />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    // 警情查询
    import policeSentimentSearch from "./components/policeSentimentSearch";
    // 出动查询
    import dispatchSentimentSearch from "./components/dispatchSentimentSearch";
    // 火灾查询
    import fireSentimentSearch from "./components/fireSentimentSearch";
    // 出动人员伤亡查询
    import dispatchCasualtySearch from './components/dispatchCasualtySearch.vue';
    // 火灾人员伤亡查询
    import fireCasualtySearch from './components/fireCasualtySearch.vue';

    export default {
        name: 'dataquery',
        components: {
            policeSentimentSearch,
            dispatchSentimentSearch,
            fireSentimentSearch,
            dispatchCasualtySearch,
            fireCasualtySearch
        },
        data() {
            return {
                activeName: 'warning'
            };
        },
        methods: {
        }
    };
</script>
