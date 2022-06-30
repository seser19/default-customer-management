<template>
  <div class="app-container">
    <div class="page_zone" v-loading="loading">
      <div class="reporting-title">
        <h2>{{ $route.meta.title }}</h2>
      </div>
      <div class="content">
        <el-table
          :data="list"
          style="width: 100%"
          >
          <el-table-column
            prop="jqxx.jqbh"
            label="警情编号"
            width="150">
          </el-table-column>
          <el-table-column
            prop="jqxx.jjsj"
            label="接警时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="jqxx.dwmcHzm"
            label="单位名称/户主名">
          </el-table-column>
          <el-table-column
            prop="jqxx.jqfsdd"
            label="警情地址">
          </el-table-column>
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag>待添加</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="openJqxx(scope.row.jqxx)"
                type="text"
                size="small">
                警情信息
              </el-button>
              <el-button
                @click.native.prevent="addCd(scope.row)"
                type="text"
                size="small">
                增加出动队伍
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { kqyProJqxxList } from '@/api/data/entry/jqxx'

export default {
  name: 'List',
  data(){
    return{
      list:[],
      loading:false,
    }
  },
  mounted() {
    this.getList();
  },
  methods:{
    getList(){
      this.loading = true;
      kqyProJqxxList().then(r=>{
        if(r.code===200){
          this.list = r.data.hasresult?r.data.table.rows:[]
        }
        this.loading = false;
      })
    },
    openJqxx(data){
      this.$router.push('/showDetail/jqxxShowDetail?jqbh='+data.jqbh);
    },
    addCd(data){
      this.$router.push({
        path: "/dataEntry/kqyjqxxEditNew",
        query: {
          jqbh:data.jqxx.jqbh,
          hasmain:data.hasmain
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
