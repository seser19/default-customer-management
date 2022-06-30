<template>
  <div class="warningList">
    <div class="header">
      <el-radio-group v-model="dateKey">
        <el-radio-button v-for="item in dateListData" :label="item.value" :key="item.value">{{
            item.name
          }}
        </el-radio-button>
      </el-radio-group>
      <div class="areaSelect">
        <el-cascader
          v-model="areaId"
          :options="options"
          :props="{ checkStrictly: true, label: 'areaName', value: 'areaId',emitPath:false }"
          :show-all-levels="false"
          @change="areaChange"
        ></el-cascader>
      </div>
    </div>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="12" :span="12">
        <div class="section">
          <div class="head">
            <div class="title">火灾预警</div>
            <div class="btn">
              <div class="tooplip">
                <div class="none">未设阈值</div>
                <div class="begin">未达到最小值</div>
                <div class="center">安全值</div>
                <div class="end">超过危险值</div>
              </div>
            </div>
          </div>
          <china-chars :areaId="areaId" :dateKey="dateKey" @clickArea="setArea"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12" :span="12">
        <div class="section">
          <div class="head">
            <div class="title">火灾分布</div>
            <div class="btn"></div>
          </div>
          <fire-distribution :area-id="areaId" :cyc="dateKey"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" :span="24" v-loading="dataLoading">
        <div class="section content">
          <div class="head">
            <div class="title">自定义预警</div>
            <div class="btn">
              <el-radio-group v-model="charStyle">
                <el-radio-button :label="true">仪表盘</el-radio-button>
                <el-radio-button :label="false">子弹图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="enpty" v-if="!list.length">无数据</div>
          <div v-else>
            <warning-box v-if="charStyle" :list="list"/>
            <bullet-warning v-else :list="list"/>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/system/user'
import { listAreaQuery } from '@/api/system/area'
import ChinaChars from '@/views/system/warning/component/chinaChars'
import {  getWarningData, getWarningList } from '@/api/system/warning'
import FireDistribution from '@/views/system/warning/component/fireDistribution'
import WarningBox from '@/views/system/warning/component/WarningBox'
import BulletWarning from '@/views/system/warning/component/BulletWarning'

export default {
  name: 'warningList',
  components: { BulletWarning, WarningBox, FireDistribution, ChinaChars },
  created() {
    this.getArea()
  },
  data() {
    return {
      dateListData: [{
        value: 'Y',
        name: '年'
      }, {
        value: 'M',
        name: '月'
      }],
      dateKey: 'Y',
      areaId: '',
      options: [],
      data: null,
      dataLoading: false,
      list: [],
      charStyle:true
    }
  },
  methods: {
    getArea() {
      getUserProfile().then(async res => {
        if (res.code === 200) {
          const Roots = res.areaRoots
          Roots.children = (await listAreaQuery({ parentId: Roots.areaId })).data.map(r => ({ ...r, children: null }))
          this.options = [Roots]
          this.areaId = Roots.areaId
          this.getWarningData();
        }
      })
    },
    async getWarningData() {
      this.dataLoading = true
      const r =await getWarningData(this.areaId, this.dateKey)
      this.data = r
      let list = await getWarningList({ areaIds: this.areaId, thresholdCyc: this.dateKey })
      if (list) {
        list = list[this.areaId][0].warning
        this.list = list.map(r => ({
          ...r,
          value: this.data[r.thresholdType],
          max: Math.floor(r.thresholdValueMax),
          min: Math.floor(r.thresholdValueMin),
          title: r.areaName,
          content: r.thresholdName
        }))
      }
      this.dataLoading = false
    },
    setArea({ data }) {
      const { areaId, areaLevel } = data
      if (areaLevel > 3) return
      this.areaId = areaId
      this.getWarningData();
    },
    areaChange(id){
      if(id) this.getWarningData();
    }
  }
}
</script>

<style lang="scss" scoped>
.warningList {
  margin: 10px;
  padding: 10px;
  min-height: calc(100vh - 104px);
  position: relative;
  z-index: 8;
}

.section {
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 54, 104, 0.25);
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  overflow: auto;
}

.header {
  display: flex;
  margin-bottom: 10px;

  .areaSelect {
    margin-left: 20px;
  }
}

.head {
  display: flex;
  justify-content: space-between;
  position: relative;

  &:before {
    left: 3px;
    top: 0;
    content: '';
    position: absolute;
    height: 17px;
    width: 4px;
    background: #3498db;
  }

  .title {
    font-size: 17px;
    line-height: 17px;
    margin-left: 15px;
  }

  .btn {

  }

  .tooplip {
    font-size: 14px;
    position: absolute;
    left: 20px;
    top: 230px;

    .none, .begin, .center, .end {
      line-height: 14px;
      position: relative;

      &:before {
        left: -10px;
        top: 0;
        content: '';
        position: absolute;
        height: 14px;
        width: 7px;
      }
    }

    .none {
      &:before {
        background: #bdc3c7;
      }
    }

    .begin {
      margin-top: 10px;

      &:before {
        background: #6FACFD;
      }
    }

    .center {
      margin-top: 10px;

      &:before {
        background: #2ecc71;
      }
    }

    .end {
      margin-top: 10px;

      &:before {
        background: #e74c3c;
      }
    }
  }
}
.content{
  min-height: 200px;
}
.enpty{
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #6b717b;
}
</style>
