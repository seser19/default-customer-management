<template>
  <div class="app-container">
    <div class="reporting-title">
      <h2>{{ $route.meta.title }}</h2>
    </div>
    <el-table :data="list">
      <el-table-column type="index" width="50"/>
      <el-table-column prop="title" label="标题" show-overflow-tooltip width="140"/>
      <el-table-column prop="details" label="详情" show-overflow-tooltip/>
      <el-table-column prop="type" label="类型" show-overflow-tooltip/>
      <el-table-column prop="status" label="状态" width="140"/>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="openSelect(scope.row)">导出报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible="selectJqShow" title="请选择" @close="selectColse">
      <el-form label-width="100px">
        <el-row :gutter="18">
          <el-col :span="12">
            <el-form-item label="时间">
              <el-date-picker type="year" :clearable="false" style="width: 100%;"
                              :format="`yyyy年-${selectJq.year.getFullYear()+1}年`" :picker-options="pickerOptions"
                              v-model="selectJq.year"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区域">
              <el-input :value="selectJq.area.title" @focus="openProvModal()"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="selectJqShow = false">取 消</el-button>
        <el-button type="primary" @click="downloadJq">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible="selectHzShow" title="请选择" @close="selectColse">
      <el-form label-width="100px">
        <el-row :gutter="18">
          <el-col :span="12">
            <el-form-item label="时间">
              <el-date-picker type="year" :clearable="false" style="width: 100%;"
                              format="yyyy年" :picker-options="pickerHzOptions"
                              v-model="selectHz.year"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区域">
              <el-input :value="selectHz.area.title" @focus="openProvModal()"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="selectJqShow = false">取 消</el-button>
        <el-button type="primary" @click="downloadHz">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible="selectJqZbShow" title="请选择" @close="selectColse">
      <el-form label-width="100px">
        <el-row :gutter="18">
          <el-col :span="12">
            <el-form-item label="时间">
              <el-date-picker
                :value="selectJqZb.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerJqZbOptions"
                @input="handZbChange"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区域">
              <el-input :value="selectJqZb.area.title" @focus="openProvModal()"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="selectJqZbShow = false">取 消</el-button>
        <el-button type="primary" @click="downloadJqZb">确 定</el-button>
      </span>
    </el-dialog>
    <provModal ref="provModal" @setProv="setProvValue"></provModal>
  </div>
</template>

<script>
import provModal from '@/views/data/yp/ndbg/components/provModal'
import { getJqZb, getNdbg, getOneNdbg } from '@/api/data/yp/ypbg'

const date = new Date(2020, 1, 1)
export default {
  components: {
    provModal
  },
  name: 'index',
  data() {
    return {
      list: [
        {
          title: '警情分析报告',
          details: '警情分析数据',
          type: '警情',
          status: '正常'
        },
        {
          title: '火灾分析报告',
          details: '火灾分析数据',
          type: '火灾',
          status: '正常'
        },{
          title: '警情与火灾周报',
          details: '警情与火灾情况周报',
          type: '警情与火灾周报',
          status: '正常'
        }
      ],
      item: undefined,
      selectJqShow: false,
      selectJq: {
        year: date,
        area: {
          id: '',
          title: ''
        }
      },
      selectHzShow: false,
      selectHz: {
        year: new Date(),
        area: {
          id: '',
          title: ''
        }
      },
      selectJqZbShow:false,
      selectJqZb:{
        date:[],
        area:{
          id:'',
          title:''
        }
      },
      pickerOptions: {
        disabledDate(time) {
          const start = date.getTime()
          const end = new Date(new Date().getFullYear() - 1, 1, 1).getTime()
          return time.getTime() > end || time.getTime() < start
        }
      },
      pickerHzOptions: {
        disabledDate(time) {
          const start = date.getTime()
          const end = new Date().getTime()
          return time.getTime() > end || time.getTime() < start
        }
      },
      pickerJqZbOptions: {
        disabledDate(time) {
          const start = date.getTime()
          const end = new Date().getTime()
          return time.getTime() > end || time.getTime() < start
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  methods: {
    openSelect(val) {
      this.item = val
      switch (val.type) {
        case '警情':
          this.selectJqShow = true
          break
        case '火灾':
          this.selectHzShow = true
          break
        case '警情与火灾周报':
          this.selectJqZbShow = true
          break
      }
    },
    selectColse() {
      this.selectJq = {
        year: date,
        area: {
          id: '',
          title: ''
        }
      }
      this.selectHz = {
        year: new Date(),
        area: {
          id: '',
          title: ''
        }
      }
      this.selectJqZb={
        date:[],
          area:{
          id:'',
            title:''
        }
      }
      this.selectJqShow = false
      this.selectHzShow = false
      this.selectJqZbShow = false
    },
    setProvValue(obj, { first, second, third }) {
      switch (this.item.type) {
        case '警情':
          this.selectJq.area.title = `${first} ${second} ${third}`
          this.selectJq.area.id = obj.id
          break
        case '火灾':
          this.selectHz.area.title = `${first} ${second} ${third}`
          this.selectHz.area.id = obj.id
          break
        case '警情与火灾周报':
          this.selectJqZb.area.title = `${first} ${second} ${third}`
          this.selectJqZb.area.id = obj.id
          break
      }
    },
    openProvModal() {
      this.$refs.provModal.toggle()
    },
    handZbChange(e){
      if(!e){
        this.selectJqZb.date = []
        return
      }
      const [start,end] = e;
      if((end.getTime()-start.getTime()+this.getDayTime(1))===this.getDayTime(7)){
        this.selectJqZb.date = [start,end]
      }else {
        this.$message.warning('请选择一周时间！')
      }
    },
    getDayTime(num){
      return num*24*60*60*1000
    },
    downloadJq() {
      if (!this.selectJq.year || !this.selectJq.area.id) {
        this.$message.warning('请完善年份或地区！')
        return
      }
      const loading = this.$loading({ text: '处理数据中，即将开始下载', fullscreen: true })
      getNdbg(this.selectJq.year.getFullYear(), this.selectJq.area.id).then(r => {
        this.downWord(this.item.title, r, 'doc')
        loading.close()
        this.selectJqShow = false
      }).catch(() => {
        loading.close()
        this.$message.error('导出失败，请检查！')
      })
    },
    downloadHz() {
      if (!this.selectHz.year || !this.selectHz.area.id) {
        this.$message.warning('请完善年份或地区！')
        return
      }
      const loading = this.$loading({ text: '处理数据中，即将开始下载', fullscreen: true })
      getOneNdbg(this.selectHz.year.getFullYear(), this.selectHz.area.id).then(r => {
        this.downWord(this.item.title, r, 'doc')
        loading.close()
        this.selectHzShow = false
      }).catch(() => {
        loading.close()
        this.$message.error('导出失败，请检查！')
      })
    },
    downloadJqZb(){
      if (!this.selectJqZb.date.length || !this.selectJqZb.area.id) {
        this.$message.warning('请完善年份或地区！')
        return
      }
      const loading = this.$loading({ text: '处理数据中，即将开始下载', fullscreen: true });
      const [start,end] = this.selectJqZb.date;
      getJqZb(this.selectJqZb.area.id,start.getFullYear(),end.getFullYear(),start.getMonth()+1,end.getMonth()+1,start.getDate(),end.getDate()).then(r=>{
        this.downWord(this.item.title, r, 'doc')
        loading.close()
        this.selectJqZbShow = false
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

<style scoped>

</style>
