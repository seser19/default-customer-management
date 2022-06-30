<template>
  <div class="app-container">
    <div class="reporting-title">
      <h2>{{ $route.meta.title }}</h2>
    </div>
    <el-row :gutter="24">
      <el-col :span="unfold?8:16">
        <div class="section">
          <div class="title">分析报告导出</div>
          <el-form label-width="70px" label-position="left">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="时间">
                  <el-date-picker type="year" :clearable="false" :style="`width: ${unfold?'100%':'300px'};`"
                                  :format="`yyyy年-${year.getFullYear()+1}年`" :picker-options="pickerOptions"
                                  v-model="year"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="行政区域">
                  <el-input :value="area.title" :style="`width: ${unfold?'100%':'300px'};`" @focus="openProvModal()"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="查询条件">
                  <div class="cxtj">
                    <el-tag
                      :key="tag.ms+tag.id+index"
                      v-for="(tag,index) in condition"
                      closable
                      :disable-transitions="false"
                      @close="delAddItem(index)"
                      class="tag"
                      size="medium"
                      effect="plain"
                    >
                      {{ tag.ms }}
                    </el-tag>
                    <el-button size="small" v-if="!isAdd" @click="showAddSelect">+ 增加条件</el-button>
                    <el-autocomplete
                      v-show="isAdd"
                      :fetch-suggestions="querySearch"
                      placeholder="请选择内容"
                      @select="handleSelect"
                      ref="addSelet"
                      popper-class="addSelect"
                      style="width: 100px;"
                    ></el-autocomplete>
                  </div>
                </el-form-item>
                <div class="btn">
                  <el-button type="primary" @click="submit">导&nbsp;&nbsp;出</el-button>
                  <el-button type="primary" @click="submitYl">预  览</el-button>
                  <el-button @click="rest">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="unfold?16:8">
        <div class="section" v-if="!unfold">
          <el-page-header @back="unfold = true" title="展开" content="历史记录">
          </el-page-header>
          <el-table
            :data="history"
            style="width: 100%;margin-top: 10px;"
            max-height="400"
            @row-click="useHistory"
          >
            <el-table-column
              prop="year"
              label="日期"
              width="120"
            >
              <template slot-scope="scope">
                {{ `${scope.row.year.getFullYear()}年-${scope.row.year.getFullYear() + 1}年` }}
              </template>
            </el-table-column>
            <el-table-column
              prop="area"
              label="行政区域"
            >
              <template slot-scope="scope">
                {{ scope.row.area.title }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="section" v-else>
          <el-page-header @back="unfold = false" title="收起" content="历史记录">
          </el-page-header>
          <el-table
            :data="history"
            style="width: 100%;margin-top: 10px;"
            max-height="400"
            @row-click="useHistory"
          >
            <el-table-column
              prop="year"
              label="日期"
              width="120"
            >
              <template slot-scope="scope">
                {{ `${scope.row.year.getFullYear()}年-${scope.row.year.getFullYear() + 1}年` }}
              </template>
            </el-table-column>
            <el-table-column
              prop="area"
              label="行政区域"
            >
              <template slot-scope="scope">
                {{ scope.row.area.title }}
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="导出时间"
            ></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form>
                  <el-form-item inline label="查询条件" label-width="70px">
                    <el-tag
                      :key="tag.ms+tag.id+index"
                      v-for="(tag,index) in props.row.condition"
                      :disable-transitions="false"
                      class="tag"
                      size="medium"
                      effect="plain"
                    >
                      {{ tag.ms }}
                    </el-tag>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="unfold?8:16" v-if="!unfold&&ylArr.length">
        <div class="section" style="margin-top: 10px;">
          <div class="title">报告信息预览</div>
          <div>
            <p v-for="item in ylArr" :key="item">{{ item }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <provModal ref="provModal" @setProv="setProvValue"></provModal>
  </div>
</template>

<script>
import provModal from '@/views/data/yp/ndbg/components/provModal'
import { getZdy, getMsd, getZdyYl } from '@/api/data/yp/ypbg'
import moment from 'moment'

const date = new Date(2020, 1, 1)
export default {
  components: {
    provModal
  },
  name: 'index',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const start = date.getTime()
          const end = new Date(new Date().getFullYear() - 1, 1, 1).getTime()
          return time.getTime() > end || time.getTime() < start
        }
      },
      history: [],
      msdSelect: [],
      year: date,
      area: {
        title: '',
        id: ''
      },
      condition: [],
      isAdd: false,
      unfold: false,
      ylArr:[]
    }
  },
  methods: {
    showAddSelect() {
      this.isAdd = true
      this.$nextTick(() => {
        this.$refs.addSelet.focus()
      })
    },
    cancelAdd() {
      this.isAdd = false
    },
    handleSelect(e) {
      if(!this.condition.find(r=>r.id===e.id)){
        this.condition.push({ id: e.id, ms: e.ms })
      }
      this.isAdd = false
    },
    delAddItem(index) {
      this.condition.splice(index, 1)
    },
    querySearch(queryString, cb) {
      this.msdSelect.length
        ? cb(this.msdSelect)
        :
        getMsd().then(r => {
          this.msdSelect = r.map(s => ({ ...s, value: s.ms }))
          cb(this.msdSelect)
        })
    },
    submit() {
      if (!this.area.id) {
        this.$message.warning('请填写地区！')
        return
      }
      if (!this.condition.length) {
        this.$message.warning('请填写查询条件！')
        return
      }
      this.history.push({
        year: this.year,
        area: { ...this.area },
        condition: this.condition.slice(),
        time: moment().format('YYYY年MM月DD日 HH:mm')
      })
      this.download();
    },
    submitYl() {
      if (!this.area.id) {
        this.$message.warning('请填写地区！')
        return
      }
      if (!this.condition.length) {
        this.$message.warning('请填写查询条件！')
        return
      }
      this.history.push({
        year: this.year,
        area: { ...this.area },
        condition: this.condition.slice(),
        time: moment().format('YYYY年MM月DD日 HH:mm')
      })
      this.ylArr = [];
      const loading = this.$loading({ text: '处理数据中，请稍后...', fullscreen: true })
      getZdyYl(this.year.getFullYear(), this.area.id,this.condition.map(r=>r.id)).then(r => {
        loading.close()
        if(!r.code===200){
          this.$message.error('预览失败，请检查！')
          this.selectShow = false
          return
        }
        this.ylArr = r.rows;
        this.selectShow = false
        loading.close()
      }).catch(() => {
        loading.close()
        this.$message.error('预览失败，请检查！')
      })
    },
    rest() {
      this.condition = []
      this.year = date
      this.area = {
        title: '',
        id: ''
      }
      this.ylArr = [];
    },
    useHistory(item){
      this.$confirm('是否使用该历史？','提示',{
        confirmButtonText: "使用",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        this.area = {...item.area};
        this.condition = item.condition.slice();
        this.year = item.year;
      })
    },
    setProvValue(obj, { first, second, third }) {
      this.area.title = `${first} ${second} ${third}`
      this.area.id = obj.id
    },
    openProvModal() {
      this.$refs.provModal.toggle()
    },
    download() {
      const loading = this.$loading({ text: '处理数据中，即将开始下载', fullscreen: true })
      getZdy(this.year.getFullYear(), this.area.id,this.condition.map(r=>r.id)).then(r => {
        this.downWord(this.area.title+'分析报告', r, 'doc')
        loading.close()
        this.selectShow = false
      }).catch(() => {
        loading.close()
        this.$message.error('导出失败，请检查！')
      })
    },
    downWord(fileName, buff, type) {
      if ('download' in document.createElement('a')) {
        let url = window.URL.createObjectURL(buff)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `${fileName}.${type}`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        navigator.msSaveBlob(buff, `${fileName}.${type}`)
      }
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
}

.title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 20px;
}

.tag {
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 32px;
  height: 32px;
}

.cxtj {
  box-shadow: 0 0 2px 1px #909399;
  padding: 10px;
  border-radius: 10px;
}

.btn {
  text-align: right;
}
</style>
<style>
.addSelect {
  width: auto !important;
}
</style>
