<template>
  <div class="app-container">
    <div class="reporting-title">
      <h2>{{ $route.meta.title }}</h2>
      <div>
        <el-button type="primary" @click="createShow = true">新 增</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="getWarningData({areaIds:selectArea})" circle></el-button>
      </div>
    </div>
    <el-row :gutter="24">
      <el-col :span="6">
        <div class="section" >
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            node-key="areaId"
            accordion
            :default-expanded-keys="[defaultOpenKey]"
            ref="tree"
            lazy
            :load="loadNode"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="section" v-loading="loading">
          <el-table :data="list" stripe>
            <el-table-column prop="thresholdAreaName" width="130" label="行政区域"></el-table-column>
            <el-table-column prop="areaName" width="130" label="火灾区域"></el-table-column>
            <el-table-column prop="thresholdName"  label="阈值类型"></el-table-column>
            <el-table-column prop="thresholdValueMin" width="120" label="最小值"></el-table-column>
            <el-table-column prop="thresholdValueMax" width="120" label="最大值"></el-table-column>
            <el-table-column width="200" label="创建时间">
              <template slot-scope="scope">
                {{getTimeFormat(scope.row.createTime)}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="edit(scope.row)">修改</el-button>
                <el-button type="text" @click="del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>


    <el-dialog :visible.sync="createShow" title="新建阈值" @close="clear" v-loading="loading">
      <el-form :rules="rules" :model="form" label-width="120px" ref="form">
        <el-form-item prop="thresholdArea" label="目标地区：">
          <area-tree ref="areaTreeMb" @update-component-data="getPageData"/>
        </el-form-item>
        <el-form-item prop="areaId" label="火灾地区：">
          <el-cascader v-model="form.areaId" ref="areaTree" :options="area"
                       :props="{ checkStrictly: true,lazy: true,lazyLoad: loadHandleNode,leaf: 'isLeaf', label: 'areaName', value: 'areaId',emitPath:false }"
                       :show-all-levels="false" filterable placeholder="请选择"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="thresholdCyc" label="查询时间：">
          <el-radio-group v-model="form.thresholdCyc">
            <el-radio label="Y">年</el-radio>
            <el-radio label="M">月</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="thresholdType" label="阈值类型：">
          <el-select v-model="form.thresholdType" clearable placeholder="请选择">
            <el-option
              v-for="item in filterType"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="thresholdValueMin" label="最小值：">
          <el-input-number v-model="form.thresholdValueMin" :min="0"/>
        </el-form-item>
        <el-form-item prop="thresholdValueMax" label="最大值：">
          <el-input-number v-model="form.thresholdValueMax" :min="1"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="clear">重置</el-button>
        <el-button @click="createShow = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="subLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="editShow" title="修改阈值">
      <el-form :rules="editRules" :model="editForm" label-width="120px" ref="editForm">
        <el-form-item prop="thresholdValueMin" label="最小值：">
          <el-input-number v-model="editForm.thresholdValueMin" :min="0"/>
        </el-form-item>
        <el-form-item prop="thresholdValueMax" label="最大值：">
          <el-input-number v-model="editForm.thresholdValueMax" :min="1"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="subLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AreaTree from '@/components/AreaTree'
import { listAreaQuery } from '@/api/system/area'
import { createWarning, delWarningList, getWarningList, updateWarningList } from '@/api/system/warning'
import WarningChar from '@/views/system/warning/component/Warning'
import { getUserProfile } from '@/api/system/user'
import moment from 'moment'

export default {
  components: {
    AreaTree,
    WarningChar
  },
  name: 'warning',
  computed: {
    List() {
      const data = this.list.reduce((t, r) => {
        if (t[r[this.fl]]) {
          t[r[this.fl]].push(r)
        } else {
          t[r[this.fl]] = [r]
        }
        return t
      }, {})
      return data
    },
    filterType(){
      this.form.thresholdType = '';
      return this.form.areaId === this.form.thresholdArea ? this.type.slice(0,11): this.type.slice(11)
    }
  },
  data() {
    return {
      type: [],
      createShow: false,
      editShow: false,
      selectArea:'',
      form: {
        areaId: '',
        thresholdArea: '',
        thresholdCyc: 'Y',
        thresholdType: '',
        thresholdValueMin: 0,
        thresholdValueMax: 0
      },
      editForm:{
        id:0,
        thresholdValueMin: 0,
        thresholdValueMax: 0
      },
      area: [],
      list: [],
      flData: [{ label: '阈值类型', value: 'thresholdName' }, {
        label: '地区',
        value: 'thresholdAreaName'
      }, { label: '划分年月（年:Y，月:M）', value: 'thresholdCycTitle' }],
      fl: 'thresholdName',
      loading: false,
      subLoading:false,
      rules: {
        areaId: [
          { required: true, message: '请选择的地区', trigger: 'blur' }
        ],
        thresholdArea: [
          { required: true, message: '请选择的地区', trigger: 'blur' }
        ],
        thresholdCyc: [
          { required: true, message: '请选择的查询时间', trigger: 'blur' }
        ],
        thresholdType: [
          { required: true, message: '请选择阈值类型', trigger: ['blur', 'change'] }
        ],
        thresholdValueMin: [
          { required: true, message: '请输入最小值', trigger: ['blur', 'change'] }
        ],
        thresholdValueMax: [
          { required: true, message: '请输入最大值', trigger: ['blur', 'change'] }
        ]
      },
      editRules:{
        thresholdValueMin: [
          { required: true, message: '请输入最小值', trigger: ['blur', 'change'] }
        ],
        thresholdValueMax: [
          { required: true, message: '请输入最大值', trigger: ['blur', 'change'] }
        ]
      },
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "areaName",
        isLeaf: "isLeaf"
      },
      defaultOpenKey: ''
    }
  },
  created() {
    this.getDicts('tb_dic_threshold').then(response => {
      this.type = response.data
    })
    getUserProfile().then(res => {
      if (res.code === 200) {
        const areaRoots = res.areaRoots;
        areaRoots.isLeaf = false;
        areaRoots.children = [];
        this.deptOptions = [areaRoots];
        this.defaultOpenKey = areaRoots.areaId;
        this.selectArea = areaRoots.areaId;
        this.getWarningData({areaIds:areaRoots.areaId})
      }
    });

  },
  methods: {
    submit() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.form.thresholdValueMin >= this.form.thresholdValueMax) {
            this.$message.warning('最小值不能大于或者等于最大值！')
            return
          }
          this.subLoading = true;
          createWarning(this.form).then(r => {
            if (r.code === 200) {
              this.$message.success('创建成功！')
              this.createShow = false
              this.getWarningData({areaIds:this.selectArea})
              this.subLoading = false;
            } else {
              this.$message.error('创建失败！')
            }
          }).finally(()=>{
            this.subLoading = false;
          })
        }
      })
    },
    getWarningData(data = {}) {
      this.loading = true
      getWarningList(data).then(r => {
        this.list = r[data.areaIds][0]['warning'].map(r => ({ ...r, thresholdCycTitle: r.thresholdCyc === 'M' ? '月' : '年' }))
        this.loading = false
      })
    },
    getPageData(data) {
      if (data) {
        const { areaId } = data
        this.area = [{ ...data, isLeaf: false }]
        this.form.thresholdArea = areaId
        this.form.areaId = []
      }
    },
    loadNode(node, resolve) {
      this.selectArea = node.data.areaId;
      listAreaQuery({
        parentId: node.data.areaId
      }).then(res => {
        let saveData = res.data
        // 手动将 isLeaf 字段转换成 Boolean 值，areaLevel > 2 是 区县 和 街道
        saveData.forEach(element => {
          element.isLeaf = element.areaLevel>3
          element.children = []
        })
        resolve(saveData)
      })

    },
    loadHandleNode(node, resolve) {
      listAreaQuery({
        parentId: node.data.areaId
      }).then(res => {
        let saveData = res.data
        // 手动将 isLeaf 字段转换成 Boolean 值，areaLevel > 2 是 区县 和 街道
        saveData.forEach(element => {
          element.isLeaf = true
        })
        resolve(saveData)
      })
    },
    clear() {
      this.$refs.form.resetFields()
      this.$refs.areaTreeMb.cascaderHandleChange(true)
    },
    edit(item) {
      this.editForm.id = item.id;
      this.editForm.thresholdValueMax = item.thresholdValueMax;
      this.editForm.thresholdValueMin = item.thresholdValueMin;
      this.editShow = true;
    },
    editSubmit(){
      this.$refs.editForm.validate(v=>{
        if(v){
          if (this.editForm.thresholdValueMin >= this.editForm.thresholdValueMax) {
            this.$message.warning('最小值不能大于或者等于最大值！')
            return
          }
          this.subLoading = true;
          updateWarningList(this.editForm).then(r=>{
            if(r.code===200){
              this.$message.success('修改成功！');
              this.getWarningData({areaIds:this.selectArea});
              this.editShow = false;
              this.subLoading = false;
            }else {
              this.$message.error('修改失败！');
            }
          }).finally(()=>{
            this.subLoading = false;
          })
        }
      })
    },
    del(i) {
      this.$confirm('是否删除该阈值！', '提示').then(() => {
        delWarningList([i.id]).then(r=>{
          if(r.code===200){
            this.$message.success('删除成功！');
            this.getWarningData({areaIds:this.selectArea});
          }else {
            this.$message.error('删除失败！');
          }
        })
      }).catch(() => {
      })
    },
    handleNodeClick(data){
      this.selectArea = data.areaId;
      this.getWarningData({areaIds:data.areaId})
    },
    getTimeFormat(time){
      return moment(time).format("YYYY年MM月DD日 HH:mm:ss")
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 54, 104, 0.25);
  border-radius: 5px;
  padding: 20px 10px;
  margin-bottom: 10px;
  max-height: 1000px;
  min-height: 800px;
  overflow: auto;
}

.setBox {
  position: relative;

  .set {
    position: absolute;
    right: 0;
    top: 0;
  }
}

</style>
