<template>
    <el-dialog :visible.sync="mulModal">
        <div slot="title" class="search_zone">
            <span>单项选择</span>
            <!-- <el-input placeholder="全局搜索" suffix-icon="el-icon-search" v-model="keyWords"></el-input> -->
        </div>
        <div class="modal_tree" v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="15">
                    <h5>起火物</h5>
                    <div class="tree_zone">
                        <el-tree
                            ref="tree"
                            :props="props"
                            show-checkbox
                            :load="loadNode"
                            lazy
                            node-key="dictValue"
                            :filter-node-method="filterNode"
                            @check="checkClick"
                        ></el-tree>
                    </div>
                </el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
      <el-button @click="mulModal = false">取 消</el-button>
      <el-button type="primary" @click="modalSubmit">保 存</el-button>
            <!-- <div class="btn_orange" @click="modalSubmit">保 存</div> -->
    </span>
    </el-dialog>
</template>

<script>
    import { getFireObjectOptions } from "@/api/data/entry/zqxx";
    export default {
        name: "fireObjectMul",
        data() {
            return {
                loading: false,

                mulModal: false,
                keyWords: "",
                props: {
                    children: "children",
                    label: "dictLabel",
                    id: "dictValue",
                    isLeaf: "leaf"
                },
                //tagzone
                tags: [],
                //当前被选中的节点
                checkNode: ""
            };
        },
        methods: {
            loadNode(node, resolve) {
                // console.log(node);
                if (node.level === 0) {
                    this.loading = true;
                    getFireObjectOptions()
                        .then(res => {
                            resolve(this.handleData(res.data));
                            this.loading = false;
                        })
                        .catch(res => {
                            resolve([]);
                            this.loading = false;
                        });
                } else {
                    getFireObjectOptions({ parentValue: node.data.dictValue })
                        .then(res => {
                            resolve(this.handleData(res.data));
                        })
                        .catch(res => {
                            resolve([]);
                        });
                }
            },
            // 设置是否为leaf节点
            handleData(arr) {
                arr.forEach(item => {
                    if (item.isLast == 0) {
//                        item.disabled = true; //放开父级可选
                    } else {
                        item["leaf"] = true;
                    }
                });
                return arr;
            },
            echo(id) {
                if (id !== "") {
                    var keys = id.split(',');
                    this.$nextTick(() => {
                        this.$refs.tree.setCheckedKeys(keys);
                        //this.checkNode = this.$refs.tree.getCheckedNodes()[0];
                    });
                } else {
                    this.$nextTick(() => {
                        this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
                    });
                }
            },

            //控制显示隐藏
            toggle() {
                this.mulModal = !this.mulModal;
            },
            //关键字搜索
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //提交
            modalSubmit() {
                var arr = this.$refs.tree.getCheckedNodes();
/*                if (arr.length == 0) {
                    this.$message({
                        message: "请选择起火物",
                        type: "warning"
                    });
                    return;
                }*/
                this.$emit("setFireMulVal", arr);
                this.mulModal = false;
            },
            // 获取末端节点数组
            // getLastNodes() {
            //   let arr = this.$refs.tree.getCheckedNodes(),
            //     tagArr = arr.filter(item => {
            //       return item.hasChildren == undefined || item.hasChildren == false;
            //     });
            //   // console.log(tagArr);
            //   return tagArr;
            // },
            checkClick(clicked, y) {
                //变成单选
                console.log(clicked)
            },
            clear(){
                this.$refs.tree.setCheckedKeys([]); 
            }
        },
        watch: {
            keyWords(val) {
                this.$refs.tree.filter(val);
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .search_zone {
        display: flex;
        align-items: center;

        span {
            font-size: 18px;
        }

        .el-input {
            margin-left: 16px;
            width: 200px;
        }
    }

    .modal_tree {
        margin: 0 25px;

        h5 {
            font-size: 14px;
            font-weight: 500;
            color: rgba(8, 8, 8, 1);
            margin: 15px 0;
        }

        ul, li {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .tree_zone {
            overflow-y: auto;
            max-height: 295px;
        }
    }
</style>
