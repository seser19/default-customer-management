<template>
  <div class="jqlrTime">
    <div class="reporting-title">
      <h2>警情录入时间限制</h2>
      <el-button @click="getData">刷新列表</el-button>
      <el-button type="primary" @click="add">增加时间限制</el-button>
    </div>
<!--    <el-form :model="formData" class="form" label-position="left" label-width="100px">-->
<!--      <el-row :gutter="24">-->
<!--        <el-col :span="6">-->
<!--          <el-form-item label="队伍名称">-->
<!--            <el-input v-model="formData.dwmc"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="6">-->
<!--          <el-form-item label="用户名">-->
<!--            <el-input v-model="formData.yhm"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row :gutter="24">-->
<!--        <el-col :offset="18" :span="6">-->
<!--          <div class="btn">-->
<!--            <el-button type="primary">查询</el-button>-->
<!--            <el-button>重置</el-button>-->
<!--          </div>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-form>-->
<!--    <div class="reporting-title"></div>-->
    <el-table
      :data="data.filter(r => !search || r.deptName.toLowerCase().includes(search.toLowerCase()))"
      v-loading="tableLoading"
      border
      style="width: 100%;"
      :header-row-style="{height:'60px'}"
      header-cell-class-name="search"
    >
      <el-table-column
        type="index"
        width="50"
        align="right"
      >
      </el-table-column>
      <el-table-column
        prop="deptName"
      >
        <template slot="header" slot-scope="scope">
          <div class="ddname">
            <span>队伍名称:</span>
            <el-input
              v-model="search"
              size="mini"
              style="height: 30px;line-height: 30px;"
              placeholder="输入大队名称搜索"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
      >
      </el-table-column>
      <el-table-column
        label="限制来源"
        prop="createBy"
      >
      </el-table-column>
      <el-table-column
        label="时间限制"
        width="400"
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin:0 10px">{{ scope.row.jjsjBeginTime || '无限制' }}</span>-
          <span style="margin:0 10px">{{ scope.row.jjsjEndTime || '无限制' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="60"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :before-close="beforeClose" v-loading="subLoading" title="新建" :visible="addShow">
      <div class="reporting-title">
        <h2>选择时间范围</h2>
        <div>
          <el-date-picker v-model="time.jjsjBeginTime" type="datetime"></el-date-picker>
          <span>-</span>
          <el-date-picker v-model="time.jjsjEndTime" type="datetime"></el-date-picker>
        </div>
      </div>
      <div class="reporting-title">
        <h2>选择队伍</h2>
        <el-button @click="qk">清空</el-button>
      </div>
      <div class="box">
        <div class="left">
          <el-tree
            :load="loadNode"
            :props="selectProps"
            lazy
          >
            <div slot-scope="{ node, data }" class="deptTree">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  v-if="node.level!==1&&isAdd(data)"
                  size="mini"
                  type="text"
                  @click.stop="()=>addDept(data)"
                >
                  添加
                </el-button>
              </span>
            </div>
          </el-tree>
        </div>
        <div class="right">
          <span class="select">已选择：</span>
          <el-tree
            :data="selectDept"
          >
            <div slot-scope="{ node, data }" class="deptTree">
              <span>{{ data.deptName }}</span>
              <span>
                <el-button
                  size="mini"
                  type="text"
                  @click.stop="()=>delDept(data)"
                >
                  删除
                </el-button>
              </span>
            </div>
          </el-tree>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/system/user'
import { checkKsDeptList } from '@/api/system/dept'
import { postList, list, del } from '@/api/data/entry/jqsjxz'
import {formatDate} from '@/utils/index'

export default {
  name: 'jqlrTime',
  created() {
    this.getData();
  },
  data() {
    return {
      // formData: {
      //   dwmc: ''
      // },
      data: [],
      search:'',
      tableLoading: false,
      subLoading: false,
      root: undefined,
      addShow: false,
      selectLoading: false,
      selectDept: [],
      selectProps: {
        label: 'deptName',
        children: 'children',
        isLeaf: 'hasChildren'
      },
      time: {
        jjsjBeginTime: null,
        jjsjEndTime: null
      }
    }
  },
  methods: {
    getData(){
      this.tableLoading = true;
      list().then(r=>{
        this.data = r.rows;
        this.tableLoading = false;
        console.log(r)
      })
    },
    async add() {
      if (!this.root) {
        const res = await getUserProfile()
        this.root = res.deptRoots
      }
      this.addShow = true
    },
    async Edit() {

    },
    beforeClose() {
      this.rest()
      this.addShow = false
    },
    rest() {
      this.selectDept = []
      this.time = {
        jjsjBeginTime: null,
        jjsjEndTime: null
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        checkKsDeptList({ deptRoots: this.root }).then(r => {
          resolve(r.data.map(s => {
            s.hasChildren = !s.hasChildren
            return s
          }))
        }).catch(() => {
          this.$message.error('加载队伍失败！')
          resolve([])
        })
      } else {
        checkKsDeptList({ parentId: node.data.deptId }).then(r => {
          resolve(r.data.map(s => {
            s.hasChildren = !s.hasChildren
            if (s.deptLevel === 4) {
              s.hasChildren = true
            }
            return s
          }))
        }).catch(() => {
          this.$message.error('加载队伍失败！')
          resolve([])
        })
      }
    },
    isAdd(item) {
      return !this.selectDept.filter(r => r.deptId === item.deptId).length
    },
    addDept(data) {
      this.selectDept.push(data)
      this.$message.success(`添加${data.deptName}成功！`)
    },
    delDept(data) {
      let index = 0
      this.selectDept.forEach((r, i) => {
        if (r.deptId === data.deptId) {
          index = i
        }
      })
      this.selectDept.splice(index, 1)
      this.$message.warning(`已删除${data.deptName}！`)
    },
    qk() {
      this.selectDept = []
    },
    del(id){
      this.tableLoading = true;
      del(id).then(r=>{
        if (r.code === 200) {
          this.$message.success('删除成功！');
          this.getData();
        }
      })
    },
    submit() {
      if (!(this.time.jjsjEndTime || this.time.jjsjBeginTime)) {
        this.$message.warning('时间限制必填一项！')
        return
      }
      if (!this.selectDept.length) {
        this.$message.warning('请选择队伍！')
        return
      }
      const jjsjBeginTime = formatDate(this.time.jjsjBeginTime);
      const jjsjEndTime = formatDate(this.time.jjsjEndTime);
      const deptIds = this.selectDept.map(r => r.deptId).join(',');
      const formData = new FormData()
      formData.append('jjsjBeginTime',jjsjBeginTime);
      formData.append('jjsjEndTime',jjsjEndTime);
      formData.append('deptIds',deptIds);
      this.subLoading = true
      postList(formData).then(r => {
        if (r.code === 200) {
          this.$message.success('保存成功！');
          this.addShow = false;
          this.getData();
          this.rest();
        } else {
          this.$message.error('保存失败，请检查！');
        }
        this.subLoading = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.jqlrTime {
  background: #fff;
  margin: 10px;
  padding: 5px;
}

.form {
  padding: 0 10px;

  .btn {
    width: 100%;
    text-align: center;
  }
}

.timeSelect {
  margin-left: 20px;

  span {
    font-size: 17px;
    font-weight: bold;
  }
}
.ddname{
  display: flex!important;
  align-items: center;
  height: 60px!important;
}
::v-deep .search .cell{
  height: auto;
}
.box {
  height: 400px;
  overflow: hidden;
  display: flex;

  .left, .right {
    padding: 10px;
    height: 380px;
    overflow: auto;
    width: 50%;
    border: #3498db 1px solid;
  }

  .left {
    border-right: 0;
  }

  .right {
    border-left: 0;

    .select {
      line-height: 30px;
    }
  }

  .deptTree {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }
}
</style>
