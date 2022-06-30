<template>
  <div class="app-container">
    <el-row style="padding-left: 10px; padding-right: 10px;">
      <el-tabs class="position" v-model="tabName" @tab-click="changeTab" style="padding-right: 10px;padding-left: 10px; padding-top: 10px;">
        <el-tab-pane label="综合查询" name="first"></el-tab-pane>
        <el-tab-pane label="警情查询" name="second"></el-tab-pane>
        <el-tab-pane label="出动查询" name="third"></el-tab-pane>
        <el-tab-pane label="火灾查询" name="fourth"></el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row class="content" style="padding-left: 10px; padding-right: 10px;">
      <el-row>
        <el-col :span="16">
          <el-row>
            <div class="searchContentStyle divStyle" style="height: 100px;">
              <el-row>
                <div style="font-size: 15px;text-align: left;font-weight: bold;color: black">&nbsp;&nbsp;&nbsp;已选条件:</div>
              </el-row>
              <el-row style="text-align: left;margin-top: -20px">
                <div style="overflow-y:auto;height: 65px;line-height: 22px;padding-top: 10px;">
                  <el-tag style="margin-left: 10px;margin-top: 5px;" v-for="(tag,index) in tags" :type="tag.type" :key="index" effect="plain" closable @close="handleClose(tag)" @click="updateTag(tag)" disable-transitions>{{tag.label}}</el-tag>
                </div>
              </el-row>
            </div>
          </el-row>
          <el-row>&nbsp;</el-row>
          <el-card class="box-card">
            <el-row>
              <el-col :span="4" class="searchContentStyle">
                <el-row>
                  <div class="divStyle">
                    <el-button class="buttonStyle" @click="addTag('and','而且','and','而且',1)">而且</el-button>
                  </div>
                </el-row>
                <el-row>
                  <div class="divStyle">
                    <el-button class="buttonStyle" @click="addTag('or','或者','or','或者',2)">或者</el-button>
                  </div>
                </el-row>
                <el-row>
                  <div class="divStyle">
                    <el-button class="buttonStyle" @click="addTag('除了','除了','除了','除了',3)">除了</el-button>
                  </div>
                </el-row>
                <el-row>
                  <div class="divStyle">
                    <el-button class="buttonStyle" @click="addTag('left','左括号','(','左括号',4)">(</el-button>
                  </div>
                </el-row>
                <el-row>
                  <div class="divStyle">
                    <el-button class="buttonStyle" @click="addTag('right','右括号',')','右括号',5)">)</el-button>
                  </div>
                </el-row>
              </el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="18">
                <!-----------------------------   综合查询 -------------------------------------->
                <el-tabs v-model="activeName">
                  <el-tab-pane label="编码数据项" name="first">
                    <el-row>
                      <el-col :span="4">
                        <span style="text-align: right;font-weight: normal;line-height:32px;">数据项名称</span>
                      </el-col>
                      <el-col :span="20">
                        <el-row style="width: 50%;">
                          <el-select v-model="selectValue" value-key="dictCode" @change="selectChange" placeholder="请选择" style="width: 100%;line-height:32px;">
                            <el-option v-for="item in selectItems" :key="item.dictCode" :label="item.dictLabel" :value="item"></el-option>
                          </el-select>
                        </el-row>
                        <el-input v-model="xzqydmSj" type="hidden" style="height: 0px;"></el-input>
                        <!---- 行政区域 ---->
                        <el-row style="width: 50%;" v-if="'行政区域' == selectShow?true:false">
                          <el-input v-model="xzqyName" placeholder="请选择" readonly @focus="openProvModal()">
                            <i slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()" style="line-height:32px;"></i>
                          </el-input>
                        </el-row>
                        <!---- 警情类型 ---->
                        <el-row style="width: 50%;" v-if="'警情类型' == selectShow?true:false">
                          <el-cascader ref="cascader" :props="props" @change="jqlxChange" v-model="sjlbdm" placeholder="警情类型" style="line-height:32px;width: 100%;" clearable></el-cascader>
                        </el-row>
                        <!-- 警情等级 -->
                        <el-row style="width: 50%;" v-if="'警情等级' == selectShow?true:false">
                           <el-select v-model="jqdj"  placeholder="请选择" style="width: 100%;line-height:32px;" >
                              <el-option label="一级" value="1" ></el-option>
                              <el-option label="二级" value="2" ></el-option>
                              <el-option label="三级" value="3" ></el-option>
                              <el-option label="四级" value="4" ></el-option>
                              <el-option label="五级" value="5" ></el-option>
                            </el-select>
                        </el-row>
                        <!---- 发送单位 ---->
                        <el-row style="width: 50%;" v-if="'发送单位' == selectShow?true:false">
                          <el-input v-model="duty" placeholder="请选择" readonly @focus="openDutyModal">
                            <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openDutyModal"></i>
                            <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanDutyModal"  v-show="duty"></i>
                          </el-input>
                        </el-row>
                        <!---- 出动队伍 ---->
                        <el-row style="width: 50%;" v-if="'出动队伍' == selectShow?true:false">
                          <el-input v-model="xfdwdmName" placeholder="请选择" readonly @focus="openMulModal()">
                            <i slot="suffix" class="iconfont icon-icon-test" @click="openMulModal()" style="line-height:32px;"></i>
                            <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanMulModal"  v-show="xfdwdmName"></i>
                          </el-input>
                        </el-row>
                        <!---- 责任区大队 ---->
                        <el-row style="width: 50%;" v-if="'责任区大队' == selectShow?true:false">
                          <el-input v-model="zrqdddmName" placeholder="请选择" readonly @focus="openDutyMulModal()">
                            <i slot="suffix" class="iconfont icon-icon-test" @click="openDutyMulModal()" style="line-height:32px;"></i>
                            <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanDutyMulModal"  v-show="zrqdddmName"></i>
                          </el-input>
                        </el-row>
                        <!---- 主战队伍 ---->
                        <el-row style="width: 50%;" v-if="'主战队伍' == selectShow?true:false">
                          <el-input v-model="zzdwName" placeholder="请选择" readonly @focus="openZzMulModal()">
                            <i slot="suffix" class="iconfont icon-icon-test" @click="openZzMulModal()" style="line-height:32px;"></i>
                            <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanZzMulModal"  v-show="zzdwName"></i>
                          </el-input>
                        </el-row>
                        <!---- 起火物 ---->
                        <el-row style="width: 50%;" v-if="'起火物' == selectShow?true:false">
                          <el-input v-model="qhwms" placeholder="请输入" readonly @focus="openQhwMul">
                            <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openQhwMul"></i>
                            <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhwMul"  v-show="qhwms"></i>
                          </el-input>
                        </el-row>
                        <!---- 火灾原因 ---->
                        <el-row style="width: 50%;" v-if="'火灾原因' == selectShow?true:false">
                          <el-input v-model="hzyyms" placeholder="请输入" readonly @focus="openQhyyMul">
                            <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;" @click="openQhyyMul"></i>
                            <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhyyMul"  v-show="hzyyms"></i>
                          </el-input>
                        </el-row>
                        <!---- 警情标签 ---->
                        <el-row style="width: 50%;" v-if="'警情标签' == selectShow?true:false">
                          <el-select style="width: 100%;" v-model="tagIds" placeholder="请选择" clearable>
                            <el-option v-for="item in jqbqList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                        </el-row>
                        <!---- 火灾标签 ---->
                        <el-row style="width: 50%;" v-if="'火灾标签' == selectShow?true:false">
                          <el-select style="width: 100%;" v-model="tagIds" placeholder="请选择" clearable>
                            <el-option v-for="item in hzbqList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                        </el-row>
                        <el-row style="width: 50%;" v-if="'起火场所' == selectShow?true:false">
                          <el-select style="width: 100%;" v-model="qhcslb" placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in options.tb_dic_qhcslb" :key="index" :label="item.dictLabel" :value="item.dictValue"></el-option>
                          </el-select>
                          <el-row>&nbsp;</el-row>
                          <el-input v-model="qhcsms" placeholder="请输入" readonly>
                            <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;" @click="openQhcsMul"></i>
                            <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhcsMul"  v-show="qhcsms"></i>
                          </el-input>
                        </el-row>
                        
                        <el-row style="width: 50%;" v-if="'行政区域,警情类型,发送单位,出动队伍,责任区大队,主战队伍,起火物,火灾原因,起火场所,警情等级,警情标签,火灾标签'.indexOf(selectShow) == -1?true:false">
                          <el-select v-model="selectRelateValue" value-key="dictValue" placeholder="请选择" style="width: 100%;line-height:32px;">
                            <el-option v-for="item in relateSelectItems" :key="item.dictValue" :label="item.dictLabel" :value="item"></el-option>
                          </el-select>
                        </el-row>             
                    <el-row>&nbsp;</el-row>
                      <el-row style="width: 50%;">
                        <el-button type="primary" size="medium" @click="addSearchPoint">添加</el-button>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane label="数值数据项" name="second" v-if="numberTabShow">
                    <el-row>
                      <el-col :span="4">
                        <span style="text-align: right;font-weight: normal;line-height:32px;">数据项名称</span>
                      </el-col>
                      <el-col :span="20">
                        <el-row style="width: 50%;">
                          <el-select v-model="numberValue" value-key="dictCode" placeholder="请选择" style="width: 100%;line-height:32px;">
                            <el-option v-for="item in numberItems" :key="item.dictCode" :label="item.dictLabel" :value="item"></el-option>
                          </el-select>
                        </el-row>
                        <el-row>&nbsp;</el-row>
                        <el-row style="width: 100%;" v-if='numberValue.id != "isTimeoutCd" && numberValue.id != "isTimeoutZq"'>
                          <el-input v-model="numInputValue1" placeholder="请输入" style="width: 43%;line-height:32px;" clearable></el-input>
                          <span> - </span>
                          <el-input v-model="numInputValue2" placeholder="请输入" style="width: 43%;line-height:32px;" clearable></el-input>
                        </el-row>
                        <el-row style="width: 50%;" v-if='numberValue.id == "isTimeoutCd"'>
                           <el-select v-model="numInputValue3"  placeholder="请选择" style="width: 100%;line-height:32px;" >
                              <el-option label="0~24小时" value="0" ></el-option>
                              <el-option label="24小时以上" value="1" ></el-option>
                            </el-select>
                        </el-row>
                        <el-row style="width: 50%;" v-if='numberValue.id == "isTimeoutZq"'>
                           <el-select v-model="numInputValue3"  placeholder="请选择" style="width: 100%;line-height:32px;" >
                              <el-option label="0~48小时" value="0" ></el-option>
                              <el-option label="48小时以上" value="1" ></el-option>
                            </el-select>
                        </el-row>
                        <el-row>&nbsp;</el-row>
                        <el-row style="width: 50%;">
                            <el-button type="primary" size="medium" @click="addNumSearchPoint">添加</el-button>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane label="字符数据项" name="third">
                    <el-row>
                      <el-col :span="4">
                        <span style="text-align: right;font-weight: normal;line-height:32px;">数据项名称</span>
                      </el-col>
                      <el-col :span="20">
                        <el-row style="width: 50%;">
                          <el-select v-model="stringValue" value-key="dictCode" placeholder="请选择" style="width: 100%;line-height:32px;">
                            <el-option v-for="item in stringItems" :key="item.dictCode" :label="item.dictLabel" :value="item"></el-option>
                          </el-select>
                        </el-row>
                        <el-row>&nbsp;</el-row>
                        <el-row style="width: 50%;">
                          <el-input v-model="stringInputValue" placeholder="请输入" clearable></el-input>
                        </el-row>
                        <el-row>&nbsp;</el-row>
                        <el-row style="width: 50%;">
                          <el-button type="primary" size="medium" @click="addStringSearchPoint">添加</el-button>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane label="时间数据项" name="fourth">
                    <el-row>
                      <el-col :span="4">
                        <span style="text-align: right;font-weight: normal;line-height:32px;">数据项名称</span>
                      </el-col>
                      <el-col :span="20">
                        <el-row style="width: 50%;">
                          <el-select v-model="dateValue" value-key="dictCode" placeholder="请选择" style="width: 100%;line-height:32px;">
                            <el-option v-for="item in dateItems" :key="item.dictCode" :label="item.dictLabel" :value="item"></el-option>
                          </el-select>
                        </el-row>
                        <el-row>&nbsp;</el-row>
                        <el-row>
                          <el-date-picker v-model="paramZqsjFrom" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  @change="paramZqsjTimeChange" :clearable="true" default-time="['00:00:00']"></el-date-picker>
                          <span>-</span>
                          <el-date-picker v-model="paramZqsjTo" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="paramZqsjTimeChange" :clearable="true" default-time="['23:59:59']"></el-date-picker>
                        </el-row>
                        <el-row>&nbsp;</el-row>
                        <el-row style="width: 50%;">
                          <el-button type="primary" size="medium" @click="addDateSearchPoint">添加</el-button>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="24" class="el-col-tab">
          <el-row>
            <el-col :span="showFlag?8:14" style="float:right; pointer-events:auto" >
              <el-col :span="1">&nbsp;</el-col>
              <el-card class="card-box">
                <div slot="header">
                  <el-button v-if="showFlag" @click="arrowShowButton" type="text" icon="el-icon-d-arrow-left" style="margin:-5px -20px -2px;float: left;"></el-button>
                  <el-button v-else @click="arrowShowButton" type="text" icon="el-icon-d-arrow-right" style="margin:-5px -20px -2px;float: left;"></el-button>
                  <h2 class="title">已保存的条件</h2>
                  <el-radio-group v-model="temp_share" size="mini" @change="shareChange" style="margin: -33px -25px -25px -25px;float: right;">
                    <el-radio-button label="0">自有</el-radio-button>
                    <el-radio-button label="1">共享</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="div_box">
                  <el-table :data="haveData" style="width: 100%;" @row-click="selectRow" :show-header="false" type="expand" :height="windowHeight" v-loading="loading" :empty-text="haveTabList" stripe fit highlight-current-row>
                    <el-table-column v-if="false" key="TEMP_ID" prop="TEMP_ID" width="200"></el-table-column>
                    <el-table-column v-if="false" key="JSON_HTML" prop="JSON_HTML" width="200"></el-table-column>

                    <el-table-column v-if="showFlag" key="TEMP_NAME" prop="TEMP_NAME"></el-table-column>

                    <el-table-column v-else width="420" :fit="true">
                      <template slot-scope="scope">
                        <div style="padding:3px 0px;">{{scope.row.TEMP_NAME}}</div>
                        <div style="padding:3px 0px">{{scope.row.JSON_CONTENE}}</div>
                      </template>
                    </el-table-column>

                    <el-table-column  prop="IS_SHARE"  width="80" align="right">
                      <template slot-scope="scope">
                        <el-tag size="medium" v-if="scope.row.IS_SHARE=='0'" type="primary">仅自己</el-tag>
                        <el-tag size="medium" v-if="scope.row.IS_SHARE=='1'" type="success">已共享</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column align="right" width="80">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" v-on:click.stop="handleDelete(scope.row.TEMP_ID)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <el-pagination small layout="prev, pager, next" :total="50" @current-change="tempPageChage" :current-page="tempQueryForm.pageNum"> </el-pagination> -->
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="position" style="padding-left: 10px; padding-right: 10px;">
      <div class="dashedLine"></div>
      <el-row>&nbsp;</el-row>
      <el-row>
        <el-col :span="16">
          <el-button type="primary" size="medium" @click="tableSearch">查询</el-button>
          <el-button size="medium" @click="reset">重置</el-button>
          <el-button type="primary" size="medium" @click="saveTemplate">保存</el-button>
          <el-button type="primary" size="medium" @click="toReport">生成报表</el-button>
          <el-button v-if="showDownBtn" type="primary" size="medium" @click="tableSearch(this,true)">下载表格</el-button>
        </el-col>
        <!-- <el-col :span="8" style="text-align: right;">
          <span v-if="deptLevel == '2'">数据统计时间截止至<span style="color:#CC3333">{{synchronizationTime || '-'}}</span></span>
          <el-button  v-if="deptLevel == '2'" type="primary" size="medium" @click="dataSynchronize()" :loading="btnLoading">同步数据</el-button>
        </el-col> -->
      </el-row>
    </el-row>

    <el-row>&nbsp;</el-row>
    <el-row style="padding-left: 10px; padding-right: 10px;">
      <el-col :span="24">
        <el-card class="box-card" v-loading="listLoading">
          <div style="font-size: 15px;text-align: left;font-weight: bold;color: #1890ff">查询结果:</div>
          <div v-show="tabNameCh == 'zhcx'?true:false">共查询到 <span class="textColor">{{resultData.总警情数 || 0}}</span> 起警情记录，其中火灾扑救 <span class="textColor">{{resultData.火灾扑救 || 0}}</span> 起，抢险救援 <span class="textColor">{{resultData.抢险救援 || 0}}</span> 起，社会救助 <span class="textColor">{{resultData.社会救助 || 0}}</span> 起，公务执勤 <span class="textColor">{{resultData.公务执勤 || 0}}</span> 起，反恐排爆 <span class="textColor">{{resultData.反恐排爆 || 0}}</span> 起，其他 <span class="textColor">{{resultData.其他出动 || 0}}</span> 起，共出动队伍 <span class="textColor">{{resultData.出动次数 || 0}}</span> 队次，共出动车辆 <span class="textColor">{{resultData.出动车辆次 || 0}}</span> 辆次，出动人员 <span class="textColor">{{resultData.出动人次 || 0}}</span> 人次。</div>
          <div v-show="tabNameCh == 'jqcx'?true:false">共查询到 <span class="textColor">{{resultData.总警情数 || 0}}</span> 起警情记录，其中火灾扑救 <span class="textColor">{{resultData.火灾扑救 || 0}}</span> 起，抢险救援 <span class="textColor">{{resultData.抢险救援 || 0}}</span> 起，社会救助 <span class="textColor">{{resultData.社会救助 || 0}}</span> 起，公务执勤 <span class="textColor">{{resultData.公务执勤 || 0}}</span> 起，反恐排爆 <span class="textColor">{{resultData.反恐排爆 || 0}}</span> 起，其他 <span class="textColor">{{resultData.其他出动 || 0}}</span> 起，共出动队伍 <span class="textColor">{{resultData.出动次数 || 0}}</span> 队次，共出动车辆 <span class="textColor">{{resultData.出动车辆次 || 0}}</span> 辆次，出动人员 <span class="textColor">{{resultData.出动人次 || 0}}</span> 人次。</div>
          <div v-show="tabNameCh == 'cdcx'?true:false">共查询到 <span class="textColor">{{resultData.cdcsjl || 0}}</span> 次出动记录，出动车辆 <span class="textColor">{{resultData.cdcl || 0}}</span> 辆，出动警力 <span class="textColor">{{resultData.cdjl || 0}}</span> 人，抢救被困人员 <span class="textColor">{{resultData.qjbkry || 0}}</span> 人，疏散被困人员 <span class="textColor">{{resultData.ssbkry || 0}}</span> 人，抢救财产价值 <span class="textColor">{{resultData.qqccjz || 0}}</span> 元，参战人员死亡 <span class="textColor">{{resultData.czrysw || 0}}</span> 人，受伤 <span class="textColor">{{resultData.czryss || 0}}</span> 人。</div>
          <div v-show="tabNameCh == 'hzcx'?true:false">共查询到 <span class="textColor">{{resultData.jqxx || 0 }}</span> 起火灾调查报告，死亡 <span class="textColor">{{resultData.swrs || 0 }}</span> 人，受伤 <span class="textColor">{{resultData.ssrs || 0 }}</span> 人，直接财产损失 <span class="textColor">{{resultData.ccss || 0 }}</span> 元，过火面积 <span class="textColor">{{resultData.ghmj || 0 }}</span> 平方米。</div>

          <el-table v-show="tabNameCh == 'zhcx'?true:false" :data="tableData" element-loading-text="数据加载，请稍后..." style="width: 100%" stripe fit highlight-current-row>
            <el-table-column label="序号" type="index" sortable width="50"></el-table-column>
            <el-table-column label="警情编码" prop="jqbh" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="接警时间" prop="jjsj" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="行政区域" prop="xzqydmSj" sortable width="150"></el-table-column>
            <el-table-column label="警情地址" prop="jqfsdd" width="250" sortable>
              <template slot-scope="scope">
                <el-tooltip v-show="scope.row.jqfsdd != null && scope.row.jqfsdd !=undefined && scope.row.jqfsdd.length>15" class="item" effect="dark" :content="scope.row.jqfsdd" placement="top-start">
                  <div>{{(scope.row.jqfsdd.substring(0,15))}}...</div>
                </el-tooltip>
                <el-tooltip v-show="scope.row.jqfsdd != null && scope.row.jqfsdd !=undefined && scope.row.jqfsdd.length<=15" class="item" effect="dark" :content="scope.row.jqfsdd" placement="top-start">
                  <div>{{(scope.row.jqfsdd.substring(0,15))}}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="警情类型" prop="sjlbmc" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="投入力量" prop="carCount" width="80" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.carCount}} 车 {{scope.row.trrys}} 人</div>
              </template>
            </el-table-column>
            <el-table-column label="派发单位" prop="xfdwdm" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" show-overflow-tooltip width="60">
              <template slot-scope="scope">
                <el-button type="text" @click="toDetailClick(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table v-show="tabNameCh == 'jqcx'?true:false" :data="tableData" element-loading-text="数据加载，请稍后..." style="width: 100%" stripe fit highlight-current-row>
            <el-table-column label="序号" type="index" sortable width="50"></el-table-column>
            <el-table-column label="警情编码" prop="jqbh" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="接警时间" prop="jjsj" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="行政区域" prop="xzqydmSj" sortable width="150"></el-table-column>
            <el-table-column label="警情地址" prop="jqfsdd" width="250" sortable>
              <template slot-scope="scope">
                <el-tooltip v-show="scope.row.jqfsdd!= null && scope.row.jqfsdd!= undefined && scope.row.jqfsdd.length>15" class="item" effect="dark" :content="scope.row.jqfsdd" placement="top-start">
                  <div>{{(scope.row.jqfsdd.substring(0,15))}}...</div>
                </el-tooltip>
                <el-tooltip v-show="scope.row.jqfsdd!= null && scope.row.jqfsdd!= undefined && scope.row.jqfsdd.length<=15" class="item" effect="dark" :content="scope.row.jqfsdd" placement="top-start">
                  <div>{{(scope.row.jqfsdd.substring(0,15))}}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="警情类型" prop="sjlbmc" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="投入力量" prop="carCount" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.carCount}} 车 {{scope.row.trrys}} 人</div>
              </template>
            </el-table-column>
            <el-table-column label="派发单位" prop="xfdwdm" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" show-overflow-tooltip width="60">
              <template slot-scope="scope">
                <el-button type="text" @click="toDetailClick(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table v-show="tabNameCh == 'cdcx'?true:false" :data="tableData" element-loading-text="数据加载，请稍后..." style="width: 100%" stripe fit highlight-current-row>
            <el-table-column label="序号" type="index" sortable width="50"></el-table-column>
            <el-table-column label="出动编号" prop="cdbh" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="警情编码" prop="jqbh" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="接警时间" prop="jjsj" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="行政区域" prop="xzqydmSj" sortable width="150"></el-table-column>
            <el-table-column label="警情地址" prop="jqfsdd" width="250" sortable>
              <template slot-scope="scope">
                <el-tooltip v-show="scope.row.jqfsdd != null && scope.row.jqfsdd != undefined && scope.row.jqfsdd.length>15" class="item" effect="dark" :content="scope.row.jqfsdd" placement="top-start">
                  <div>{{(scope.row.jqfsdd.substring(0,15))}}...</div>
                </el-tooltip>
                <el-tooltip v-show="scope.row.jqfsdd != null && scope.row.jqfsdd != undefined && scope.row.jqfsdd.length<=15" class="item" effect="dark" :content="scope.row.jqfsdd" placement="top-start">
                  <div>{{(scope.row.jqfsdd.substring(0,15))}}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="警情类型" prop="sjlbmc" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="出动队伍" prop="zrqddmc" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="参战形式" prop="respondType" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="投入力量" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.carCount}} 车 {{scope.row.trrys}} 人</div>
              </template>
            </el-table-column>
            <el-table-column label="审批状态" prop="shzt" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="pic" v-if="scope.row.shzt == 0">
                  <img src="../../icons/weisongshen.svg">
                  <span>未送审</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == 1">
                  <img src="../../icons/shenpizhong.svg">
                  <span>审核中</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == 2">
                  <img src="../../icons/yishenpi.svg">
                  <span>已审核</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == 3">
                  <img src="../../icons/guaqi.svg">
                  <span>被挂起</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == -1">
                  <img src="../../icons/beizhongzhi.svg">
                  <span>待修改</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == -2">
                  <img src="../../icons/tuihui.svg">
                  <span>被退回</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == -3">
                  <img src="../../icons/daiwanshan.svg">
                  <span>待完善</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == 4">
                  <img src="../../icons/tuihui.svg">
                  <span>被驳回</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == 99">
                  <img src="../../icons/yishenpi.svg">
                  <span>已归档</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="toDetailClick(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table v-show="tabNameCh == 'hzcx'?true:false" :data="tableData" element-loading-text="数据加载，请稍后..." style="width: 100%" stripe fit highlight-current-row>
            <el-table-column label="序号" type="index" sortable width="50"></el-table-column>
            <el-table-column label="火灾编号" prop="zqbh" sortable width="130" show-overflow-tooltip></el-table-column>
            <el-table-column label="起火时间" prop="zqsj" sortable width="130" show-overflow-tooltip></el-table-column>
            <el-table-column label="行政区域" prop="xzqy" sortable width="150"></el-table-column>
            <el-table-column label="警情地址" prop="zqdd" width="250" sortable>
              <template slot-scope="scope">
                <el-tooltip v-show="scope.row.zqdd!= undefined && scope.row.zqdd != null && scope.row.zqdd.length >15" class="item" effect="dark" :content="scope.row.zqdd" placement="top-start">
                  <span>{{( scope.row.zqdd==undefined?'': scope.row.zqdd.substring(0,15))}}...</span>
                </el-tooltip>
                <el-tooltip v-show="scope.row.zqdd!= undefined && scope.row.zqdd != null && scope.row.zqdd.length <= 15" class="item" effect="dark" :content="scope.row.zqdd" placement="top-start">
                  <div>{{(scope.row.zqdd==undefined?'': scope.row.zqdd.substring(0,15))}}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="轻微火灾" prop="qwhz" sortable width="75" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.qwhz==0?'否':'是'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="起火场所" prop="qhcsms" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.qhcsms || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="起火原因" prop="hzyyms" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.hzyyms || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="伤亡情况" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.swrs+'死'+scope.row.ssrs+'伤'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="责任区大队" prop="deptname" show-overflow-tooltip></el-table-column>
            <el-table-column label="报告状态" prop="shzt" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="pic" v-if="scope.row.shzt == 0">
                  <img src="../../icons/weisongshen.svg">
                  <span>未送审</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == 1">
                  <img src="../../icons/shenpizhong.svg">
                  <span>审核中</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == 2">
                  <img src="../../icons/yishenpi.svg">
                  <span>已审核</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == 3">
                  <img src="../../icons/guaqi.svg">
                  <span>被挂起</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == -1">
                  <img src="../../icons/beizhongzhi.svg">
                  <span>待修改</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == -2">
                  <img src="../../icons/tuihui.svg">
                  <span>被退回</span>
                </span>
                <span class="pic" v-if="scope.row.shzt == -3">
                  <img src="../../icons/daiwanshan.svg">
                  <span>待完善</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip width="50">
              <template slot-scope="scope">
                <el-button type="text" @click="toDetailClick(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background @size-change="tableSizeChange" @current-change="tableCurrentChange" :page-sizes="[20, 50, 100, 200, 500]" :current-page="formData.pageNum" :page-size="formData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" size="small"></el-pagination>
        </el-card>
      </el-col>
    </el-row>

    <!-----------------------------   行政区域模态框 -------------------------------------->
    <provModal ref="provModal" @setProv="setProvValue"></provModal>
    <!-----------------------------   发送单位模态框 -------------------------------------->
    <modal ref="modal" @setVal="setDutyValue"></modal>
    <!-----------------------------   出动队伍模态框 -------------------------------------->
    <cdMulModal ref="mulModal" @setMulVal="setMulValue"></cdMulModal>
    <!-----------------------------   责任区大队模态框 -------------------------------------->
    <dutyModal ref="dutyModal" @setMulVal="setDutyMulValue"></dutyModal>
    <!-----------------------------   主站队伍模态框 -------------------------------------->
    <mulModal ref="zzMulModal" @setMulVal="setZzMulVal"></mulModal>
    <!-----------------------------   起火物 -------------------------------------->
    <fireObjectMul ref="fireObjecMul" @setFireMulVal="setFireMulVal"></fireObjectMul>
    <!-----------------------------   主站队伍模态框 -------------------------------------->
    <fireReasonMul ref="fireReasonMul" :multiple="true" @setFireReasonMulVal="setFireReasonMulVal"></fireReasonMul>
    <!-----------------------------   起火场所 -------------------------------------->
    <fireSpaceMul ref="Mulmodel" :qhcs-type="qhcslb ? qhcslb : ''" @setMulVals="setMulVals"></fireSpaceMul>

    <el-dialog title="保存" :visible.sync="saveTemplateDialogShow" style="width: 60%;margin-left: 20%">
      <el-form ref="form" label-width="80px" v-loading="tempSaveModelLoading">
        <el-form-item label="是否新建">
          <el-radio-group v-model="isNewTemp" @change="radioChange">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="覆盖已有" v-if="isNewTemp == '2'">
          <el-select v-model="overwriteExist" placeholder="请选择" style="width: 100%;" @change="isOverWrite($event)">
            <el-option v-for="item in owenTemp" :key="item.TEMP_ID" :label="item.TEMP_NAME" :value="item.TEMP_ID+'^,_,^'+item.TEMP_NAME"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" >
          <el-input v-model="templateName" placeholder="请输入内容" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="适用范围">
          <el-select v-model="fitScope" placeholder="请选择" style="width: 100%;">
            <el-option label="仅自己可见" value="0"></el-option>
            <el-option label="共享本单位及所属下属单位" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTemp()">保存</el-button>
        <el-button @click="saveTemplateDialogShow = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="updateTagDialogShow" style="width: 60%;margin-left: 20%">
      <el-input v-model="xzqydmSj" type="hidden" style="height: 0px;" v-if="'xzqydmSj' == updateStatus?true:false"></el-input>
      <el-row style="width: 50%;">
        <span style="line-height:32px;text-align: left">{{text}}</span>
      </el-row>
      <!---- 行政区域 ---->
      <el-row style="width: 50%;" v-if="'xzqydmSj' == updateStatus?true:false">
        <el-input v-model="xzqyName" placeholder="请选择" readonly @focus="openProvModal()">
          <i slot="suffix" class="iconfont icon-icon-test" @click="openProvModal()" style="line-height:32px;"></i>
        </el-input>
      </el-row>
      <!---- 警情类型 ---->
      <el-row style="width: 50%;" v-if="'sjlbdm' == updateStatus?true:false">
        <el-cascader ref="cascader" :props="props" @change="jqlxChange" v-model="sjlbdm" placeholder="警情类型" style="line-height:32px;width: 100%;" clearable></el-cascader>
      </el-row>
      <!-- 警情等级 -->
      <el-row style="width: 50%;" v-if="'jqdj' == updateStatus?true:false">
         <el-select v-model="jqdj"  placeholder="请选择" style="width: 100%;line-height:32px;" >
          <el-option label="一级" value="1" ></el-option>
          <el-option label="二级" value="2" ></el-option>
          <el-option label="三级" value="3" ></el-option>
          <el-option label="四级" value="4" ></el-option>
          <el-option label="五级" value="5" ></el-option>
        </el-select>
      </el-row>
      <!---- 警情标签 ---->
      <el-row style="width: 50%;" v-if="'jqTagIds' == updateStatus?true:false">
        <el-select style="width: 100%;" v-model="tagIds" placeholder="请选择" clearable>
          <el-option v-for="item in jqbqList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-row>
      <!---- 火灾标签 ---->
      <el-row style="width: 50%;" v-if="'zqTagIds' == updateStatus?true:false">
        <el-select style="width: 100%;" v-model="tagIds" placeholder="请选择" clearable>
          <el-option v-for="item in hzbqList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-row>
      <!---- 发送单位 ---->
      <el-row style="width: 50%;" v-if="'jqtbzh' == updateStatus?true:false">
        <el-input v-model="duty" placeholder="请选择" readonly @focus="openDutyModal">
          <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openDutyModal"></i>
          <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanDutyModal"  v-show="duty"></i>
        </el-input>
      </el-row>
      <!---- 出动队伍 ---->
      <el-row style="width: 50%;" v-if="'xfdwdm' == updateStatus?true:false">
        <el-input v-model="xfdwdmName" placeholder="请选择" readonly>
          <i slot="suffix" class="iconfont icon-icon-test" @click="openMulModal()" style="line-height:32px;"></i>
          <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanMulModal"  v-show="xfdwdmName"></i>
        </el-input>
      </el-row>
      <!---- 责任区大队 ---->
      <el-row style="width: 50%;" v-if="'zrqdddm' == updateStatus?true:false">
        <el-input v-model="zrqdddmName" placeholder="请选择" readonly>
          <i slot="suffix" class="iconfont icon-icon-test" @click="openDutyMulModal()" style="line-height:32px;"></i>
          <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanDutyMulModal"  v-show="zrqdddmName"></i>
        </el-input>
      </el-row>
      <!---- 主战队伍 ---->
      <el-row style="width: 50%;" v-if="'zzdw' == updateStatus?true:false">
        <el-input v-model="zzdwName" placeholder="请选择" readonly @focus="openZzMulModal()">
          <i slot="suffix" class="iconfont icon-icon-test" @click="openZzMulModal()" style="line-height:32px;"></i>
          <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanZzMulModal"  v-show="zzdwName"></i>
        </el-input>
      </el-row>
      <!---- 起火物 ---->
      <el-row style="width: 50%;" v-if="'qhwfldm' == updateStatus?true:false">
        <el-input v-model="qhwms" placeholder="请输入" readonly @focus="openQhwMul">
          <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;"  @click="openQhwMul"></i>
          <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhwMul"  v-show="qhwms"></i>
        </el-input>
      </el-row>
      <!---- 火灾原因 ---->
      <el-row style="width: 50%;" v-if="'hzyydm' == updateStatus?true:false">
        <el-input v-model="hzyyms" placeholder="请输入" readonly @focus="openQhyyMul">
          <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;" @click="openQhyyMul"></i>
          <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhyyMul"  v-show="hzyyms"></i>
        </el-input>
      </el-row>
      <el-row style="width: 50%;" v-if="'qhcsdm' == updateStatus?true:false">
        <el-select style="width: 100%;" v-model="qhcslb" placeholder="请选择" clearable>
          <el-option v-for="(item, index) in options.tb_dic_qhcslb" :key="index" :label="item.dictLabel" :value="item.dictValue"></el-option>
        </el-select>
        <el-row>&nbsp;</el-row>
        <el-input v-model="qhcsms" placeholder="请输入" readonly>
          <i slot="suffix" class="iconfont icon-icon-test" style="line-height:32px;" @click="openQhcsMul"></i>
          <i slot="suffix" class="el-icon-circle-close" style="line-height:30px; cursor: pointer;" @click="cleanQhcsMul"  v-show="qhcsms"></i>
        </el-input>
      </el-row>
      <el-row style="width: 50%;" v-if="'ljtj' == updateStatus?true:false">
        <el-select style="width: 100%;" value-key="value" v-model="ljtj" placeholder="请选择" clearable>
          <el-option v-for="item in ljtjs" :key="item.value" :label="item.label" :value="item"></el-option>
        </el-select>
      </el-row>
      <el-row style="width: 50%;" v-if="'isTimeoutCd' == updateStatus?true:false && this.numberValue.id == 'isTimeoutCd'">
        <el-select v-model="numInputValue3"  placeholder="请选择" style="width: 100%;line-height:32px;" >
          <el-option label="0~24小时" value="0" ></el-option>
          <el-option label="24小时以上" value="1" ></el-option>
        </el-select>
      </el-row>
      <el-row style="width: 50%;" v-if="'isTimeoutZq' == updateStatus?true:false  && this.numberValue.id == 'isTimeoutZq'">
        <el-select v-model="numInputValue3"  placeholder="请选择" style="width: 100%;line-height:32px;" >
          <el-option label="0~48小时" value="0" ></el-option>
          <el-option label="48小时以上" value="1" ></el-option>
        </el-select>
      </el-row>
      <el-row style="width: 100%;" v-if="'number' == updateStatus?true:false">
        <el-input v-model="numInputValue1" placeholder="请输入" style="width: 43%;line-height:32px;" clearable></el-input>
        <span> - </span>
        <el-input v-model="numInputValue2" placeholder="请输入" style="width: 43%;line-height:32px;" clearable></el-input>
      </el-row>

      <el-row style="width: 50%;" v-if="'string' == updateStatus?true:false">
        <el-input v-model="stringInputValue" placeholder="请输入" clearable></el-input>
      </el-row>

      <el-row v-if="'date' == updateStatus?true:false">
        <el-date-picker v-model="paramZqsjFrom" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  @change="paramZqsjTimeChange" :clearable="true"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="paramZqsjTo" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="paramZqsjTimeChange" :clearable="true"></el-date-picker>
      </el-row>
      <el-row style="width: 50%;" v-if="'jqdj,xzqydmSj,jqTagIds,zqTagIds,sjlbdm,jqtbzh,xfdwdm,zrqdddm,zzdw,qhwfldm,hzyydm,qhcsdm,ljtj,number,string,date,isTimeoutCd,isTimeoutZq'.indexOf(updateStatus) == -1?true:false">
        <el-select v-model="updateRelateValue" value-key="dictValue" placeholder="请选择" style="width: 100%;line-height:32px;">
          <el-option v-for="item in updateRelateSelectItems" :key="item.dictValue" :label="item.dictLabel" :value="item"></el-option>
        </el-select>
      </el-row>
      <el-row style="width: 50%;" v-if="updateStatus == 'qydm' ">
        <el-select v-model="updateRelateValue" value-key="dictValue" placeholder="请选择" style="width: 100%;line-height:32px;">
          <el-option v-for="item in updateRelateSelectItems" :key="item.dictValue" :label="item.dictLabel" :value="item"></el-option>
        </el-select>
      </el-row>
      <el-row>&nbsp;</el-row>
      <el-button type="primary" @click="update">确定</el-button>
      <el-button @click="updateTagDialogShow = false">取 消</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import { selectTableData, selectTableDataDownload, selectCommonCount, loadExitsTemplate, loadFitScopes } from "@/api/data/entry/zdycx";
  import { getJqcdlb } from "@/api/data/entry/jqxx";
  import * as tempQry from "@/api/data/eqw/customQueryTemp"
  import { getSelectOptions, getTreeOptions } from "@/api/data/entry/zqxx"
  import provModal from "@/views/eqw/customSearch/components/multiProvModal"
  import modal from "@/views/components/dataSeach/modal"
  import cdMulModal from "@/views/components/dataSeach/cdMulModal"
  import dutyModal from "@/views/components/dataSeach/dutyModal"
  import mulModal from "@/views/components/dataSeach/mulModal"
  import fireObjectMul from "@/views/eqw/customSearch/components/fireObjectModal"
  import fireReasonMul from "@/views/data/entry/zqxx/components/fireReasonMul"
  import fireSpaceMul from "@/views/eqw/customSearch/components/fireSpaceModal"
  import { fireOption, fireTreeOption, optionsList } from "../dataSearch/components/option.js";
  import { selectItems, numberItems, stringItems, dateItems, relateSelectItems } from "./components/dataOption.js";
  import {downloadFile} from "@/utils/download-file.js";
  import {getInitTime,getNearlyRecentDays} from "@/utils/dateTimeUtils";

  // -- 同步数据JS
  import {synchronizeData, getSynchronizeDataTime, getLastEtlTime} from '@/api/report/report';
  import { targetNameTarget } from "@/api/system/dict/target";
  export default {
    name: 'customSearch',
    components: {
      provModal,
      modal,
      cdMulModal,
      dutyModal,
      mulModal,
      fireObjectMul,
      fireReasonMul,
      fireSpaceMul
    },
    data() {
      return {
        jqdj:'',//警情等级
        synchronizationTime: "", // 同步时间
        deptLevel:'',
        tabNameCh: 'zhcx',
        tabName: 'first',
        activeName: 'first',
        tags: [],
        tagIds:"",
        jqbqList:[], //警情标签
        hzbqList:[], //火灾标签
        // tab页切换展示
        tabShow: 'showZhcx',
        // 行政区域
        xzqyName: null, // 行政区域名称
        selectedAreaInfo: [], // 行政区域选择对象
        xzqydmSj: '',// 行政区域ID
        // 警情类型
        sjlbdm: '',
        checkNodeLabel: '',
        props: {
          // 警情类型级联懒加载
          multiple: true,
          lazy: true,
          lazyLoad: this.lazyLoad,
          children: "children",
          label: "dictLabel",
          value: "dictValue",
          isLeaf: "isLeaf",
          // 是否返回由该节点所在的各级菜单的值所组成的数组
          emitPath: false,
          checkStrictly: true
        },
        // 发送单位
        jqtbzh: '', // 发送单位ID
        duty: '', // 发送单位名称
        // 出动队伍
        xfdwdmId: '', // 出动队伍对象
        xfdwdm: '', // 出动队伍ID
        xfdwdmName: '', // 出动队伍名称
        // 责任区大队
        zrqdddmId: '', // 责任区大队对象
        zrqdddm: '', // 责任区大队ID
        zrqdddmName: '', // 责任区大队名称
        // 主战队伍
        zzdwId: '', // 主战队伍对象
        zzdw: '', // 主战队伍ID
        zzdwName: '', // 主战队伍名称
        // 起火物
        qhwfldm: '', // 起火物ID
        qhwms: '', // 起火物名称
        // 火灾原因
        hzyyms: '', // 火灾原因名称
        hzyydm: '', // 火灾原因ID
        // 起火场所
        qhcsms: '', // 起火场所名称
        qhcsdm: '', // 起火场所ID
        zqxxQhcsList: [], // 起火场所list
        // 起火场所类型
        options: optionsList,
        qhcslb: '',
        numberTabShow: true,
        // 数值选项
        numInputValue1: '',
        numInputValue2: '',
        numInputValue3: '',
        // 字符串选项
        stringInputValue: '',
        // 时间选择
        paramZqsjFrom: '',
        paramZqsjTo: '',
        selectValue: selectItems[0],
        selectItems: selectItems.zhcx,
        selectShow: '行政区域',
        numberValue: '',
        numberItems: numberItems.zhcx,
        stringValue: '',
        stringItems: stringItems.zhcx,
        dateValue: {
            dictCode: '1',
            dictLabel: '接警起止时间',
            id: 'jjsj'
        },
        dateItems: dateItems.zhcx,
        selectRelateValue: '',
        relateSelectItems: undefined,
        updateRelateValue: '',
        updateRelateSelectItems: undefined,
        formData:{
          pageNum: 1,
          pageSize: 20,
          customingConDetails: [],
          params: [{
            // 依据排序的属性名称（从 table 返回的数据中获取）
            sortField: "tbsj",
            sortOrder: "desc"
          }]

        },
        tableData: [],
        total: 0,
        listLoading: false,
        tableSql: '',
        countSql: '',
        hzbgzt: '',
        cdbgzt: '',
        bgzt: '',
        loading: false,
        windowHeight: 300+'px',
        showFlag: true,
        haveData: [],
        tabType:0,
        haveTabList:"暂无数据",
        tempQueryForm:{
          pageNum:1,
          pageSize:10,
          queryType:0,
          hasShare:0,
        },
        sharedTemp:[],
        owenTemp:[],
        // tempData: [{"TEMP_ID":"1","TEMP_NAME":"模板一","JSON_CONTENE":"模板一<pre>参战形式：主战 而且 现场距离：800米 或者 出动警号100","TEMP_SHARE":0},
        //   {"TEMP_ID":"2","TEMP_NAME":"模板二","JSON_CONTENE":"模板二<pre>参战形式：主战111","TEMP_SHARE":1},
        //   {"TEMP_ID":"3","TEMP_NAME":"模板三","JSON_CONTENE":"模板三<pre>参战形式：主战222 或者 出动警号232100","TEMP_SHARE":0},
        //   {"TEMP_ID":"4","TEMP_NAME":"模板四","JSON_CONTENE":"模板四<pre>参战形式：23423 而且 现场距离：832300米 或者 出动警号:2342","TEMP_SHARE":1},
        //   {"TEMP_ID":"5","TEMP_NAME":"模板五","JSON_CONTENE":"模板五<pre>现场距离：235432米 或者 出动警号100","TEMP_SHARE":0}],
        temp_share: 0,
        isNewTemp:"1",
        // shareFlag: true,
        currentRow: '',
        // 保存
        saveTemplateDialogShow: false,
        tempSaveModelLoading:false,
        radio: '1',
        templateName: '',
        templateId:"",
        templates: [],
        overwriteExist: '',
        fitScopes: [],
        fitScope: '0',
        addOrUpdateShow: 'add',
        // 修改tag
        text: '',
        tag: '',
        updateTagDialogShow: false,
        showDownBtn: false,
        updateStatus: '',
        ljtj: '',
        ljtjs: [{
          value: 'and',
          label: '而且',
          fieldType: 1
        }, {
          value: 'or',
          label: '或者',
          fieldType: 2
        }, {
          value: '除了',
          label: '除了',
          fieldType: 3
        }, {
          value: 'left',
          label: '(',
          fieldType: 4
        }, {
          value: 'right',
          label: ')',
          fieldType: 5
        }],
        btnLoading:false, //同步按钮loading
        resultData:{
          总警情数: '-',
          火灾扑救: '-',
          抢险救援: '-',
          社会救助: '-',
          公务执勤: '-',
          反恐排爆: '-',
          其他出动: '-',
          出动次数: '-',
          出动车辆次: '-',
          出动人次: '-',
          cdcsjl: '-',
          cdcl: '-',
          cdjl: '-',
          qjbkry: '-',
          ssbkry: '-',
          qqccjz: '-',
          czrysw: '-',
          czryss: '-',
          jqxx: '-',
          swrs: '-',
          ssrs: '-',
          ccss: '-',
          ghmj: '-'
        }
      };
    },
    created() {
      //this.getLastTime();
      this.getSelectData();
      this.selectTempList();
      this.getAllTag();
      this.getAllTag1();
      this.deptLevel = this.$store.state.user.deptLevel
      this.paramZqsjFrom = getNearlyRecentDays()[0]; //开始时间初始化
      this.paramZqsjTo = getNearlyRecentDays()[1]; //结束时间初始化

    },
    mounted(){
      //页面渲染成功加载模板列表
    },
    methods: {
      //警情标签
      getAllTag() {
        let _params = {
          "tagName": "",
          "tagType": "J"
        }
        targetNameTarget(_params).then(res => {
          this.jqbqList = res.data.map(item => {
            return {
              label: item.tagName,
              value: item.tagId
            }
          });
        });
      },
      //火灾标签
      getAllTag1() {
        let _params = {
          "tagName": "",
          "tagType": "Z"
        }
        targetNameTarget(_params).then(res => {
          this.hzbqList = res.data.map(item => {
            return {
              label: item.tagName,
              value: item.tagId
            }
          });
        });
      },
      shareChange(val){
        //this.shareFlag = !this.shareFlag
        this.haveTabList="暂无数据";
        this.haveData = [];
        this.haveData = val==0?this.owenTemp:this.sharedTemp;

        // this.tempQueryForm.pageNum = 1
        // this.selectTempList();
      },
      selectRow(row) {
        // 需要自定义
        // console.log(row);
        this.currentRow = row;
        if(this.tags.length == 0) {
          if(row && row.JSON_HTML){
            this.tags = JSON.parse(row.JSON_HTML)
          }
          this.showFlag = true
        } else {
          this.$confirm("是否替换当前已选条件?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              //return delConfig(id);
              this.tags=[];
              if(row && row.JSON_HTML){
                this.tags = JSON.parse(row.JSON_HTML)
              }
              this.showFlag = true
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消替换',
              })
            });
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const { id } = row;
        this.$confirm("是否确认删除该模板?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        // .then(() => {
        //   //return delConfig(id);
        //   console.log(1);
        //   this.showFlag = true
        // })
          .then(() => {
            tempQry.delOwenTemp({ "modelId":row }).then(res=>{
              if(res.code===200){
                this.msgSuccess("删除成功");
                this.selectTempList();
              }
            })

            // console.log(2);
            //this.showFlag = true

          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消刪除',
            })
          });
      },
      arrowShowButton() {
        this.showFlag = !this.showFlag;
      },
      changeTab(tab, event){
        this.reset('changeTab');
        this.paramZqsjFrom = getNearlyRecentDays()[0]; //开始时间初始化
        this.paramZqsjTo = getNearlyRecentDays()[1]; //结束时间初始化
        // 综合查询
        if(this.tabName === 'first') {
          this.tabNameCh = 'zhcx';
          this.numberTabShow = true;
          this.selectItems = selectItems.zhcx;
          // this.hzcx = selectItems.zhcx;
          this.numberItems = numberItems.zhcx;
          this.stringItems = stringItems.zhcx;
          this.dateItems = dateItems.zhcx;
          this.tabType = 0
        }
        // 警情查询
        if(this.tabName === 'second') {
          this.tabNameCh = 'jqcx';
          this.numberTabShow = false;
          this.selectItems = selectItems.jqcx;
          this.numberItems = numberItems.jqcx;
          this.stringItems = stringItems.jqcx;
          this.dateItems = dateItems.jqcx;
          this.tabType = 1
        }
        // 出动查询
        if(this.tabName === 'third') {
          this.tabNameCh = 'cdcx';
          this.numberTabShow = true;
          this.selectItems = selectItems.cdcx;
          this.numberItems = numberItems.cdcx;
          this.stringItems = stringItems.cdcx;
          this.dateItems = dateItems.cdcx;
          this.tabType = 2
        }
        // 火灾查询
        if(this.tabName === 'fourth') {
          this.tabNameCh = 'hzcx';
          this.numberTabShow = true;
          this.selectItems = selectItems.hzcx;
          this.numberItems = numberItems.hzcx;
          this.stringItems = stringItems.hzcx;
          this.dateItems = dateItems.hzcx;
          this.tabType = 3
        }
        this.selectTempList();
        this.showDownBtn = false;
      },
      // 校验顺序对错
      judgeChoice(fieldFlag, fieldType) {
        let allLabel = '';
        let returnInfo = {returnMsg: '',returnFlag: true};
        for(let j = 0; j < this.tags.length; j++) {
          // 1代表条件
          if(this.tags[j].fieldFlag == 1) {
            allLabel += '1'
          }
          // 2代表连接符(而且，或者，除了)
          if(this.tags[j].fieldFlag == 2 && (this.tags[j].fieldType == 1 || this.tags[j].fieldType == 2 || this.tags[j].fieldType == 3)) {
            allLabel += '2'
          }
          if(this.tags[j].fieldFlag == 2 && this.tags[j].fieldType == 4) {
            allLabel += 'a'
          }
          if(this.tags[j].fieldFlag == 2 && this.tags[j].fieldType == 5) {
            allLabel += 'b'
          }
        }
        // 连续2个连接符(不包含括号)或者连续2个条件
        if(allLabel.replace(/a/g,'').replace(/b/g,'').indexOf('11') != -1 || allLabel.replace(/a/g,'').replace(/b/g,'').indexOf('22') != -1) {
          returnInfo.returnFlag = false;
          returnInfo.returnMsg = '条件添加错误，不能连续选择2个连接符或连续选择2个条件(括号除外)'
        }
        // 连接符后不能再添加连接符(点击连接符时判断)
        if(allLabel.replace(/a/g,'').replace(/b/g,'').substring(allLabel.length-1) == '2' && fieldType != 4 && fieldType != 5 && fieldFlag == '2') {
          returnInfo.returnFlag = false;
          returnInfo.returnMsg = '条件添加错误，不能连续选择2个连接符(括号除外)'
        }
        // 条件后不能再添加条件(点击添加按钮时判断)
        if(allLabel.replace(/a/g,'').replace(/b/g,'').substring(allLabel.length-1) == '1' && fieldFlag == '1') {
          returnInfo.returnFlag = false;
          returnInfo.returnMsg = '条件添加错误，不能连续选择2个条件'
        }
        return returnInfo
      },
      // tag新增与删除
      addTag(nameKey,nameValue,valueKey,value,fieldType) {
        if(this.tags.length == 0){
          if(fieldType != 3 && fieldType != 4) {
            this.$alert('请先选择条件', '提示', {confirmButtonText: '确定'});
            return
          }
        }
        let returnInfo = this.judgeChoice('2', fieldType);
        if(!returnInfo.returnFlag) {
          this.$alert(returnInfo.returnMsg, '提示', {confirmButtonText: '确定'});
          return
        }
         let name= '';
          if(this.jqdj == 1 ){
            name = '一级'
          }else if(this.jqdj == 2 ){
            name = '二级'
          }else if(this.jqdj == 3 ){
            name = '三级'
          }else if(this.jqdj == 4 ){
            name = '四级'
          }else if(this.jqdj == 5 ){
            name = '五级'
          }
        // console.log(allLabel.replace('(','').replace(')',''))
        // console.log(allLabel.substring(allLabel.length-1))
        this.tags.push({ type: 'info', label: value, fieldFlag: '2', fieldNameEn: nameKey,fieldNameCh: nameValue,fieldType: fieldType,fieldValueEn: valueKey, fieldValueCh: value, extendValue1: '', extendValue2: '',name: '' })
      },
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1)
      },
      // tag修改
      updateTag(tag) {
        this.text = '';
        this.tag = tag;
        this.updateStatus = this.tag.fieldNameEn;
        // 字符选框展示
        if (this.tag.fieldFlag == 2) {
          this.text = '操作符';
          this.updateStatus = 'ljtj'
        }
        // select选框展示
        if (this.tag.fieldFlag == 1 && this.tag.fieldType == 1) {
          let queryParam = 'tb_dic_czqk,tb_dic_hzqk,tb_dic_hyzgbm,tb_dic_ddzhzw,tb_dic_xczh,tb_dic_fx,tb_dic_qh,tb_dic_zqdj,tb_dic_jjlx,tb_dic_qhcslb' +
            'tb_dic_jzlb,tb_dic_jzwnhdj,tb_dic_jzjg,tb_dic_fhty,tb_dic_dcfs';
          let queryParam1 = 'jdjcqk,sgqtdcbm,sstd,yjck,yjsszm,jzyt,sflw,qydm,xfssqk';
          if(queryParam.indexOf(this.tag.dictCode) !== -1) {
            this.getSelectInfo(this.tag.dictCode, 'update')
          } else if(queryParam1.indexOf(this.tag.dictCode) !== -1) {
            if(this.tag.dictCode == 'qydm'){
              this.qydmOptions(this.tag.dictCode, 'update')
            }else{
              this.getTreeOptions(this.tag.dictCode, 'update')
            }
          } else if (this.tag.dictCode == 'zdmhxt' || this.tag.dictCode == 'fpyxt' || this.tag.dictCode == 'fhjl' || this.tag.dictCode == 'snxhsxt'){
            this.getTreeOptions('xfssqk', 'update')
          } else if(this.tag.dictCode == 'fhjj') {
            this.getSelectInfo('tb_dic_fhty', 'update')
          } else if(this.tag.dictCode == 'qhcsdm') {
            this.updateStatus = this.tag.dictCode;
          } else {
            this.updateRelateSelectItems = relateSelectItems[this.tag.dictCode]
          }
        }
        // 文本选框展示
        if (this.tag.fieldFlag == 1 && this.tag.fieldType == 2) {
          this.stringInputValue = this.tag.fieldValueEn;
          this.updateStatus = 'string'
        }
        // 数值选框展示
        console.log('123',this.tag)
        if (this.tag.fieldFlag == 1 && this.tag.fieldType == 3) {
          if(this.tag.fieldNameEn == 'isTimeoutCd'){
            this.numInputValue3 = this.tag.fieldValueEn;
            this.updateStatus = 'isTimeoutCd'
          }else if(this.tag.fieldNameEn == 'isTimeoutZq' ){
            this.numInputValue3 = this.tag.fieldValueEn;
            this.updateStatus = 'isTimeoutZq'
          }else{
            this.numInputValue1 = this.tag.fieldValueEn.split(',')[0];
          this.numInputValue2 = this.tag.fieldValueEn.split(',')[1];
          this.updateStatus = 'number'
          }
        }
        // 时间选框展示
        if (this.tag.fieldFlag == 1 && this.tag.fieldType == 4) {
          this.paramZqsjFrom = this.tag.fieldValueEn.split(',')[0];
          this.paramZqsjTo = this.tag.fieldValueEn.split(',')[1];
          this.updateStatus = 'date'
        }
        this.text = (this.text == '操作符')?'操作符':this.tag.label.substring(0,this.tag.label.indexOf(':'));
        this.updateTagDialogShow = true

      },
      update() {
        if(this.tag.fieldFlag == 2) {
          this.$set(this.tag, 'label', this.ljtj.label);
          this.$set(this.tag, 'fieldNameEn', this.ljtj.value);
          this.$set(this.tag, 'fieldNameCh', this.ljtj.label);
          this.$set(this.tag, 'fieldValueEn', this.ljtj.value);
          this.$set(this.tag, 'fieldValueCh', this.ljtj.label);
          this.$set(this.tag, 'fieldType', this.ljtj.fieldType)
        }

        if(this.tag.fieldFlag == 1 && this.tag.fieldType == 1) {
          if(this.tag.fieldNameEn == 'xzqydmSj'){
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.xzqyName);
            this.$set(this.tag, 'fieldValueEn', this.xzqydmSj)
          } else if(this.tag.fieldNameEn == 'sjlbdm') {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.checkNodeLabel);
            this.$set(this.tag, 'fieldValueEn', this.sjlbdm.toString())
          } else if(this.tag.fieldNameEn == 'jqtbzh') {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.duty);
            this.$set(this.tag, 'fieldValueEn', this.jqtbzh)
          } else if(this.tag.fieldNameEn == 'jqdj') {
                let  name = '';
                if(this.jqdj == 1 ){
                  name = '一级'
                }else if(this.jqdj == 2 ){
                  name = '二级'
                }else if(this.jqdj == 3 ){
                  name = '三级'
                }else if(this.jqdj == 4 ){
                  name = '四级'
                }else if(this.jqdj == 5 ){
                  name = '五级'
                }
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + name);
            this.$set(this.tag, 'fieldValueEn', this.jqdj)
          } else if(this.tag.fieldNameEn == 'xfdwdm') {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.xfdwdmName);
            this.$set(this.tag, 'fieldValueEn', this.xfdwdm)
          } else if(this.tag.fieldNameEn == 'jqTagIds') {
             let jqbqName = '';
             this.jqbqList.forEach(item => {
             if(this.tagIds == item.value){
                 jqbqName = item.label
                 return
            }
          })
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + jqbqName);
            this.$set(this.tag, 'fieldValueEn', this.tagIds)
          } else if(this.tag.fieldNameEn == 'zqTagIds') {
             let hzbqName = '';
             this.hzbqList.forEach(item => {
             if(this.tagIds == item.value){
                 hzbqName = item.label
                 return
            }
          })
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + hzbqName);
            this.$set(this.tag, 'fieldValueEn', this.tagIds)
          } else if(this.tag.fieldNameEn == 'zrqdddm') {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.zrqdddmName);
            this.$set(this.tag, 'fieldValueEn', this.zrqdddm)
          } else if(this.tag.fieldNameEn == 'zzdw') {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.zzdwName);
            this.$set(this.tag, 'fieldValueEn', this.zzdw)
          } else if(this.tag.fieldNameEn == 'qhwfldm') {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.qhwms);
            this.$set(this.tag, 'fieldValueEn', this.qhwfldm)
          } else if(this.tag.fieldNameEn == 'hzyydm') {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.hzyyms);
            this.$set(this.tag, 'fieldValueEn', this.hzyydm)
          } else if(this.tag.fieldNameEn == 'qhcsms') {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.qhcsms);
            this.$set(this.tag, 'fieldValueEn', this.qhcslb + ',' + this.qhcsdm)
          } else {
            this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.updateRelateValue.dictLabel);
            this.$set(this.tag, 'fieldValueEn', this.updateRelateValue.dictValue)
          }
        }
        if(this.tag.fieldFlag == 1 && this.tag.fieldType == 2) {
          this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.stringInputValue);
          this.$set(this.tag, 'fieldValueEn', this.stringInputValue)
        }
        if(this.tag.fieldFlag == 1 && this.tag.fieldType == 3) {
           if(this.tag.fieldNameEn == 'isTimeoutCd'){
             var note = '';
             if(this.numInputValue3 == '0'){ 
               note = "0~24小时"
             }else{
               note = "24-99小时"
             }
              this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + note);
          this.$set(this.tag, 'fieldValueEn', note)
           }else   if(this.tag.fieldNameEn == 'isTimeoutZq' ){
             var note1 = '';
             if(this.numInputValue3 == '0'){
               note1 = "0~48小时"
             }else{
               note1 = "48-99小时"
             }
              this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + note);
          this.$set(this.tag, 'fieldValueEn', note1)
           }else{
              this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.numInputValue1 + '-' + this.numInputValue2);
          this.$set(this.tag, 'fieldValueEn', this.numInputValue1 + ',' + this.numInputValue2)
           }
        }
        if(this.tag.fieldFlag == 1 && this.tag.fieldType == 4) {
          this.$set(this.tag, 'label', this.tag.label.substring(0,this.tag.label.indexOf(':')+1) + this.paramZqsjFrom + '-' + this.paramZqsjTo);
          this.$set(this.tag, 'fieldValueEn', this.paramZqsjFrom + ',' + this.paramZqsjTo)
        }
        this.updateTagDialogShow = false
      },
      /**** 行政区域 ****/
      openProvModal() {
        this.$refs.provModal.toggle()
      },
      setProvValue(area, fullPaths) {
        var areaId = [];
        area.forEach(item => {
          areaId.push(item.areaId)
        });
        this.xzqydmSj = areaId.join(',');
        this.selectedAreaInfo = area;
        this.xzqyName = fullPaths
      },
      /**** 警情类型 ****/
      lazyLoad(node, resolve) {
        if (node.level === 0) {
          getJqcdlb({
            dictType: "jqcjlb",
            parentValue: "0"
          }).then(res => {
            if (res.code !== 200) {
              return;
            }
            resolve(this.handle(res.data));
          }).catch(res => {
            resolve([]);
          });
        } else {
          getJqcdlb({
            dictType: "jqcjlb",
            parentValue: node.value
          }).then(res => {
            if (res.code !== 200) {
              return;
            }
            resolve(this.handle(res.data));
          }).catch(res => {
            resolve([]);
          });
        }
        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
      },
      // 设置叶子节点
      handle(arr) {
        // console.log(arr);
        arr.forEach(item => {
          if (item.isLast === "1") {
            item["leaf"] = true;
          }
        });
        return arr;
      },
      getLabel(node,label) {
        if(node.parent != null || (node.parent == null && node.level == 1)) {
          if(label == '') {
            label = node.label
          } else {
            label = node.label + '/' + label
          }
          if(node.parent != null){
            this.getLabel(node.parent,label);
            return
          }
        }
        this.checkNodeLabel = label
      },
      jqlxChange(val) {
        setTimeout( f => {
          let node = this.$refs['cascader'].getCheckedNodes();
          this.checkNodeLabel = [];
          let label = '';
          node.forEach(item => {
            if(item.parent != null) {
              if(label == '') {
                label = item.label
              } else {
                label = item.parent.label + '/' + item.label + '、' + label
              }
            }else if((item.parent == null && item.level == 1)){
              if(label == '') {
                label = item.label
              } else {
                label = item.label + '、' + label
              }
            }
          });
          this.checkNodeLabel = label
        }, 0);
        // console.log(this.sjlbdm);
        // console.log(this.$refs['cascader'].getCheckedNodes()[0])
      },
      /**** 发送单位 ****/
      openDutyModal() {
        this.$refs.modal.echo(this.jqtbzh);
        this.$refs.modal.toggle()
      },
      // 将树形中的值赋值给责任大区 input id 付给hidden input
      setDutyValue(data) {
        this.jqtbzh = data.deptId;
        this.duty = data.deptName
      },
      cleanDutyModal() {
        this.jqtbzh = '';
        this.duty = ''
      },
      /**** 出动队伍 ****/
      openMulModal(type) {
        this.$refs.mulModal.echo(this.xfdwdmId);
        this.$refs.mulModal.toggle()
      },
      // 将多选框的值赋给input
      setMulValue(arr) {
        let nameArr = [],
          idArr = [];
        arr.forEach(item => {
          nameArr.push(item.deptName);
          idArr.push(item.deptId)
        });
        this.xfdwdmId = idArr;
        this.xfdwdm = idArr.join(',');
        this.xfdwdmName = nameArr.join(',')
      },
      // 清空出动队伍
      cleanMulModal(){
        this.xfdwdmId = [];
        this.xfdwdm = '';
        this.xfdwdmName = ''
      },
      /**** 责任区大队 ****/
      openDutyMulModal(){
        this.$refs.modal.echo(this.zrqdddmId);
        this.$refs.dutyModal.toggle()
      },
      setDutyMulValue(arr) {
        let nameArr = [],
          idArr = [];
        arr.forEach(item => {
          nameArr.push(item.deptName);
          idArr.push(item.deptId)
        });
        this.zrqdddmId = idArr;
        this.zrqdddm = idArr.join(',');
        this.zrqdddmName = nameArr.join(',')
      },
      // 清空责任区队伍
      cleanDutyMulModal(){
        this.zrqdddmId = [];
        this.zrqdddm = '';
        this.zrqdddmName = ''
      },
      /**** 主战队伍 ****/
      openZzMulModal(type) {
        this.$refs.zzMulModal.echo(this.zzdwId);
        this.$refs.zzMulModal.toggle()
      },
      //将多选框的值赋给input
      setZzMulVal(arr) {
        let nameArr = [],
          idArr = [];
        arr.forEach(item => {
          nameArr.push(item.deptName);
          idArr.push(item.deptId)
        });
        this.zzdwId = idArr;
        this.zzdw = idArr.join(',');
        this.zzdwName = nameArr.join(',')
      },
      // 清空主战队伍
      cleanZzMulModal(){
        this.zzdwId = [];
        this.zzdw = '';
        this.zzdwName = ''
      },
      /**** 起火物 ****/
      openQhwMul() {
        this.$refs.fireObjecMul.toggle();
        this.$refs.fireObjecMul.echo(this.qhwfldm)
      },
      // 接受起火物数据
      setFireMulVal(arr) {
        var arrLabel = [];
        var arrDm = [];
        arr.forEach(item => {
          arrLabel.push(item.dictLabel);
          arrDm.push(item.dictValue)
        });
        this.qhwfldm = '';
        this.qhwms = '';
        this.qhwms = arrLabel.join(',');
        this.qhwfldm = arrDm.join(',')
      },
      // 清空起火物数据
      cleanQhwMul() {
        this.qhwfldm = '';
        this.qhwms = ''
      },
      /**** 火灾原因 ****/
      openQhyyMul() {
        this.$refs.fireReasonMul.toggle();
        this.$refs.fireReasonMul.echo(this.hzyydm)
      },
      // 接受起火原因数据
      setFireReasonMulVal(arr) {
        const fireReasonLabels = [];
        const fireReasonValues = [];
        arr.map(r => {
          fireReasonLabels.push(r.dictLabel);
          fireReasonValues.push(r.dictValue);
        });
        this.hzyyms = fireReasonLabels.join(','); // 控件展示的文本
        this.hzyydm = fireReasonValues.join(','); // 查询提交的入参
      },
      // 清空起火原因数据
      cleanQhyyMul() {
        this.hzyyms = '';
        this.hzyydm = ''
      },
      getSelectInfo(value, status) {
        getSelectOptions(value).then(res => {
          if (status == 'update') {
            this.updateRelateSelectItems = res.data
          } else {
            this.relateSelectItems = res.data
          }
        }).catch(res => {
          console.error(res);
        });
      },
      getTreeOptions(dictCode, status) {
        getTreeOptions({
          dictType: dictCode,
          parentValue: ''
        }).then(res => {
          if (res.code == 200) {
            if(status == 'update') {
              this.updateRelateSelectItems = res.data
            } else {
              this.relateSelectItems = res.data
            }
          }
        });
      },
      selectChange(item) {
        let queryParam = 'tb_dic_czqk,tb_dic_hzqk,tb_dic_hyzgbm,tb_dic_ddzhzw,tb_dic_xczh,tb_dic_fx,tb_dic_qh,tb_dic_zqdj,tb_dic_jjlx,tb_dic_qhcslb' +
          'tb_dic_jzlb,tb_dic_jzwnhdj,tb_dic_jzjg,tb_dic_fhty,tb_dic_dcfs,tb_dic_hylb';
        let queryParam1 = 'jdjcqk,sgqtdcbm,sstd,yjck,yjsszm,jzyt,sflw,xfssqk';
        if(queryParam.indexOf(item.dictCode) !== -1) {
          this.getSelectInfo(item.dictCode)
        } else if(queryParam1.indexOf(item.dictCode) !== -1) {
          this.getTreeOptions(item.dictCode)
        } else if (item.dictCode == 'zdmhxt' || item.dictCode == 'fpyxt' || item.dictCode == 'fhjl' || item.dictCode == 'snxhsxt'){
          this.getTreeOptions('xfssqk')
        } else if(item.dictCode == 'fhjj') {
          this.getSelectInfo('tb_dic_fhty')
        } else if(item.dictCode == 'qydm') {
          this.qydmOptions(item.dictCode)
        } else {
          this.relateSelectItems = relateSelectItems[item.dictCode]
        }
        this.selectShow = item.dictLabel;
        // 清空选项值
        this.xzqyName = '', // 行政区域名称
          this.tagIds = '';//清空火灾标签、警情标签
          this.selectedAreaInfo = [], // 行政区域选择对象
          this.xzqydmSj = '',// 行政区域ID
          this.jqdj = '', // 警情等级
          this.sjlbdm = '', // 警情类型
          this.checkNodeLabel = [],
          this.jqtbzh = '', // 发送单位ID
          this.duty = '', // 发送单位名称
          this.xfdwdmId = '', // 出动队伍对象
          this.xfdwdm = '', // 出动队伍ID
          this.xfdwdmName = '', // 出动队伍名称
          this.zrqdddmId = '', // 责任区大队对象
          this.zrqdddm = '', // 责任区大队ID
          this.zrqdddmName = '', // 责任区大队名称
          this.zzdwId = '', // 主战队伍对象
          this.zzdw = '', // 主战队伍ID
          this.zzdwName = '', // 主战队伍名称
          this.qhwfldm = '', // 起火物ID
          this.qhwms = '', // 起火物名称
          this.hzyyms = '', // 火灾原因名称
          this.hzyydm = '', // 火灾原因ID
          this.qhcsms = '', // 起火场所名称
          this.qhcsdm = '', // 起火场所ID
          this.zqxxQhcsList = [], // 起火场所list
          this.qhcslb = '',
          this.selectRelateValue = ''
      },
      qydmOptions(value,status) {
        let arrQydm = [];
        getTreeOptions({
          dictType: value,
          parentValue: ''
        }).then(res => {
          if(res.code == '200'){
            if(res.data.length > 0){
              arrQydm = res.data;
            }
            getTreeOptions({
                dictType: 'qydm',
                parentValue: 6,
              }).then(res => {
                let arrQt = res.data;
                arrQt.map(item => {
                  item.dictLabel =  `其他/${item.dictLabel}`
                })
                if(status){
                  this.updateRelateSelectItems = [...arrQydm,...res.data]
                }else{
                  this.relateSelectItems = [...arrQydm,...res.data]
                }
            }).catch(res => {
              console.error(res);
            })
          }
        }).catch(res => {
          console.error(res);
        });
      },
      /**** 起火场所 ****/
      // 获取下拉框数据
      getSelectData() {
        // 遍历普通字典表查询下拉列表数据
        fireOption.forEach(item => {
          this.getDicts(item).then(res => {
            if (res.code == 200) {
              this.options[item] = res.data;
            }
          })
        })
      },
      openQhcsMul() {
        if (this.qhcslb == "") {
          this.$message.warning("请先选择起火场所类型");
          return
        }
        this.$refs.Mulmodel.toggle();
        this.$refs.Mulmodel.echo(this.zqxxQhcsList)
      },
      // 接收起火场所数据
      setMulVals(arr) {
        this.qhcsms = '';
        this.qhcsdm = '';
        this.zqxxQhcsList = [];
        this.zqxxQhcsList = arr;
        var arrLabel = [];
        var arrVal = [];
        arr.forEach(item => {
          arrLabel.push(item.dictLabel);
          arrVal.push(item.dictValue)
        });
        this.qhcsms = arrLabel.join(',');
        this.qhcsdm = arrVal.join(',')
      },
      // 清空起火场所数据
      cleanQhcsMul() {
        this.qhcsms = '';
        this.qhcsdm = '';
        this.zqxxQhcsList = []
      },
      // 时间范围判断
      paramZqsjTimeChange(val) {
        let nowChangeGettime = new Date(val).getTime();
        if (this.paramZqsjFrom && this.paramZqsjTo) {
          let paramZqsjFromGettime = new Date(
            this.paramZqsjFrom
          ).getTime();
          let paramZqsjToGettime = new Date(this.paramZqsjTo).getTime();
          if (paramZqsjFromGettime > paramZqsjToGettime) {
            this.$message.warning("起火开始时间不能大于起火结束时间");
            if (nowChangeGettime == paramZqsjFromGettime) {
              //如果当前选的是开始时间，开始时间置空
              this.paramZqsjFrom = "";
              // this.formData.paramZqsjFrom = getNearlyRecentDays(30)[0]; // 起火起止时间
            } else if (nowChangeGettime == paramZqsjToGettime) {
              //如果当前选的是结束时间，结束时间置空
              this.paramZqsjTo = "";
              // this.formData.paramZqsjTo = getNearlyRecentDays(30)[1]; // 起火截止时间
            }
          }
        }
      },
      // 添加
      addSearchPoint() {
        // 判断条件
        let returnInfo = this.judgeChoice('1', null);
        if(!returnInfo.returnFlag) {
          this.$alert(returnInfo.returnMsg, '提示', {confirmButtonText: '确定'});
          return
        }
        let lable;
        let id;
        if( this.selectValue){
            id = this.selectValue.id;
        }else{
           this.$message.error('请勿添加空对象');
           return
        }
        // let id = this.selectValue.id;
        // let name = this.selectValue.dictLabel
        let value;
        let  name = '';
          if(this.jqdj == 1 ){
            name = '一级'
          }else if(this.jqdj == 2 ){
            name = '二级'
          }else if(this.jqdj == 3 ){
            name = '三级'
          }else if(this.jqdj == 4 ){
            name = '四级'
          }else if(this.jqdj == 5 ){
            name = '五级'
          }
        if(this.selectShow === '行政区域') {
          lable = this.selectShow + ':' + this.xzqyName;
          value  = this.xzqydmSj
        } else if(this.selectShow === '警情类型') {
          lable = this.selectShow + ':' + this.checkNodeLabel;
          value  = this.sjlbdm.toString()
        }
        else if(this.selectShow === '警情等级') {
          lable = this.selectShow + ':' + name;
          value  = this.jqdj
        }
        else if(this.selectShow === '发送单位') {
          lable = this.selectShow + ':' + this.duty;
          value  = this.jqtbzh
        }
        else if(this.selectShow === '出动队伍') {
          lable = this.selectShow + ':' + this.xfdwdmName;
          value  = this.xfdwdm
        }
        else if(this.selectShow === '责任区大队') {
          lable = this.selectShow + ':' + this.zrqdddmName;
          value  = this.zrqdddm
        }
        else if(this.selectShow === '主战队伍') {
          lable = this.selectShow + ':' + this.zzdwName;
          value  = this.zzdw
        }
        else if(this.selectShow === '起火物') {
          lable = this.selectShow + ':' + this.qhwms;
          value  = this.qhwfldm
        } else if(this.selectShow === '火灾原因') {
          lable = this.selectShow + ':' + this.hzyyms;
          value  = this.hzyydm
        } else if(this.selectShow === '起火场所') {
          lable = this.selectShow + ':' + this.qhcsms;
          value  = this.qhcslb + ',' + this.qhcsdm
        } else if(this.selectShow === '警情标签') {
          let jqbqName = '';
          this.jqbqList.forEach(item => {
            if(this.tagIds == item.value){
                jqbqName = item.label
                return
            }
          })
          lable = this.selectShow + ':' + jqbqName;
          value  = this.tagIds
        } else if(this.selectShow === '火灾标签') {
          let hzbqName = '';
          this.hzbqList.forEach(item => {
            if(this.tagIds == item.value){
                hzbqName = item.label
                return
            }
          })
          lable = this.selectShow + ':' + hzbqName;
          value  = this.tagIds
        } else {
          lable = this.selectShow + ':' + (this.selectRelateValue.dictLabel == undefined? '':this.selectRelateValue.dictLabel);
          value = this.selectRelateValue.dictValue
        }
        if(lable.indexOf(':') === lable.length - 1) {
          this.$alert('请选择选项后进行添加', '提示', {confirmButtonText: '确定'});
          return
        }
        this.tags.push({ type: 'info', label: lable,dictCode: this.selectValue.dictCode, fieldFlag: '1', fieldNameEn: id,fieldNameCh: '',fieldType: '1',fieldValueEn: value, fieldValueCh: '', extendValue1: '', extendValue2: '' });
      },
      addNumSearchPoint() {
        console.log('xxxxxxxx',this.numberValue)
        // 判断条件
        let returnInfo = this.judgeChoice('1', null);
        if(!returnInfo.returnFlag) {
          this.$alert(returnInfo.returnMsg, '提示', {confirmButtonText: '确定'});
          return
        }
        let id = this.numberValue.id;
        let name22;
        let lable;
        if(this.numInputValue3 == '1' && id == "isTimeoutCd"){
          name22 = '24,99'
        }else if(this.numInputValue3 == '0' && id == "isTimeoutCd"){
         name22 = '0,24'
        }else if(this.numInputValue3 == '1' && id == "isTimeoutZq"){
          name22 = '48,99'
        }else if(this.numInputValue3 == '0' && id == "isTimeoutZq"){
         name22 = '0,48'
        }
        else{
          name22 = this.numInputValue1 + ',' + this.numInputValue2
        };
        if(this.numberValue.id == "isTimeoutCd" || this.numberValue.id == "isTimeoutZq" ){
        lable = this.numberValue.dictLabel + ':' + name22 + '小时';

        } else{
        lable = this.numberValue.dictLabel + ':' + this.numInputValue1 + '-' + this.numInputValue2
        }
        this.tags.push({ type: 'info', label: lable,dictCode: this.numberValue.dictCode, 
                         fieldFlag: '1', fieldNameEn: id,fieldNameCh: '',fieldType: '3',
                         fieldValueEn: name22, 
                         fieldValueCh: '', extendValue1: '', extendValue2: '' ,
                         });
      },
      addStringSearchPoint() {
        // 判断条件
        let returnInfo = this.judgeChoice('1', null);
        if(!returnInfo.returnFlag) {
          this.$alert(returnInfo.returnMsg, '提示', {confirmButtonText: '确定'});
          return
        }
        let id = this.stringValue.id;
        if(this.stringInputValue === ''){
          this.$alert('请填写后进行添加', '提示', {confirmButtonText: '确定'});
          return
        }
        let lable = this.stringValue.dictLabel + ':' + this.stringInputValue;
        this.tags.push({ type: 'info', label: lable,dictCode: this.stringValue.dictCode, fieldFlag: '1', fieldNameEn: id,fieldNameCh: '',fieldType: '2',fieldValueEn: this.stringInputValue, fieldValueCh: '', extendValue1: '', extendValue2: '' });
      },
      addDateSearchPoint() {
        // 判断条件
        let returnInfo = this.judgeChoice('1', null);
        if(!returnInfo.returnFlag) {
          this.$alert(returnInfo.returnMsg, '提示', {confirmButtonText: '确定'});
          return
        }
        let id = this.dateValue.id;
        if(this.paramZqsjFrom === '' || this.paramZqsjTo === ''){
          this.$alert('请填写后进行添加', '提示', {confirmButtonText: '确定'});
          return
        }
        let lable = this.dateValue.dictLabel + ':' + this.paramZqsjFrom + '至' + this.paramZqsjTo;
        this.tags.push({ type: 'info', label: lable,dictCode: this.dateValue.dictCode, fieldFlag: '1', fieldNameEn: id,fieldNameCh: '',fieldType: '4',fieldValueEn: this.paramZqsjFrom + ',' + this.paramZqsjTo, fieldValueCh: '', extendValue1: '', extendValue2: '' });
      },
      /************************************** 查询 ********************************************************/
      getTabList() {
        this.listLoading = true;
        let url;
        // 综合查询
        if(this.tabName == 'first') {
          url = '/customData/allCustomizingQuery'
        }
        // 警情查询
        if(this.tabName == 'second') {
          url = '/customData/jqInfoQuery'
        }
        // 出动查询
        if(this.tabName == 'third') {
          url = '/customData/cdInfoQuery'
        }
        // 火灾查询
        if(this.tabName == 'fourth') {
          url = '/customData/fireCustomQuery'
        }
        selectTableData(this.formData,url).then(res => {
          if (res.code == 200) {
            this.total = res.data.table == undefined ? 0 : res.data.table.total;
            this.tableData = res.data.table == undefined ? [] : res.data.table.rows;
            this.tableSql = res.data.sqlkey;
            this.listLoading = false
          }
        }).finally(() => {
          this.listLoading = false;
          this.showDownBtn = true;
        })
      },
      downloadData() {
        this.listLoading = true;
        let url, title;
        // 综合查询
        if(this.tabName == 'first') {
          title = '综合查询-';
          url = '/customData/allCustomizingQueryDownload';
        }
        // 警情查询
        if(this.tabName == 'second') {
          title = '警情查询-';
          url = '/customData/jqInfoQueryDownload';
        }
        // 出动查询
        if(this.tabName == 'third') {
          title = '出动查询-';
          url = '/customData/cdInfoQueryDownload';
        }
        // 火灾查询
        if(this.tabName == 'fourth') {
          title = '火灾查询-';
          url = '/customData/fireCustomQueryDownload';
        }

        let originProto = Object.getPrototypeOf(this.formData);
        let params =  Object.assign(Object.create(originProto), this.formData);

        // 不是火灾查询时，删除分页参数，火灾的后台接口分页和其它不一样
        if(this.tabName != 'fourth') {

          delete params['pageNum'];
          delete params['pageSize']
        }


        selectTableDataDownload(params, url).then(res => {
          if (res.code == 200) {
            downloadFile(title, res.data.stream);
          }
        }).finally(() => {
          this.listLoading = false;
        })
      },


      getCommomCountSearch() {
        let url;
        // 综合查询
        if(this.tabName == 'first') {
          url = '/customData/selectJqxxCommonCount'
        }
        // 警情查询
        if(this.tabName == 'second') {
          url = '/customData/jqxxCommomCountSearch'
        }
        // 出动查询
        if(this.tabName == 'third') {
          url = '/customData/cdxxCommomCountSearch'
        }
        // 火灾查询
        if(this.tabName == 'fourth') {
          url = '/customData/fireCustomQueryCommon'
        }
        selectCommonCount(this.formData, url).then(res => {
          if (res.code == 200) {
            this.resultData = res.data[0];
            this.countSql = res.data.sqlkey;
          }
        }).finally(() => {
        })
      },
      jjsjJduge() {
        let jjsjJduge = true;
        this.tags.forEach(item => {
          if(item.fieldNameEn == 'jjsj') {
            jjsjJduge = false
          }
        });
        return jjsjJduge
      },
      zqsjDuge() {
        let jjsjJduge = true;
        this.tags.forEach(item => {
          if(item.fieldNameEn == 'zqsj') {
            jjsjJduge = false
          }
        });
        return jjsjJduge
      },
      tableSearch(event, download=false) {
        if(this.jjsjJduge() && this.tabName != 'fourth') {
         this.$alert('请选择接警时间！！！', '提示', {confirmButtonText: '确定'})
         return
        }else if(this.zqsjDuge() && this.tabName === 'fourth'){
          this.$alert('请选择起火时间！！！', '提示', {confirmButtonText: '确定'})
          return
        }
        /*********** 判断所选条件是否符合要求start  ***********/
        let allLabel = '';
        if(this.tags.length > 0 ){
          for(let j = 0; j < this.tags.length; j++) {
            // 1代表条件
            if(this.tags[j].fieldFlag == 1) {
              allLabel += '1'
            }
            // 2代表连接符(而且，或者，除了)
            if(this.tags[j].fieldFlag == 2 && (this.tags[j].fieldType == 1 || this.tags[j].fieldType == 2 || this.tags[j].fieldType == 3)) {
              allLabel += '2'
            }
            if(this.tags[j].fieldFlag == 2 && this.tags[j].fieldType == 4) {
              allLabel += 'a'
            }
            if(this.tags[j].fieldFlag == 2 && this.tags[j].fieldType == 5) {
              allLabel += 'b'
            }
          }
        }

        // 连续2个连接符(不包含括号)或者连续2个条件
        if(allLabel.replace(/a/g,'').replace(/b/g,'').indexOf('11') != -1 || allLabel.replace(/a/g,'').replace(/b/g,'').indexOf('22') != -1) {
          this.$alert('条件选择错误,不能连续选择2个连接符或连续选择2个条件(括号除外)', '提示', {confirmButtonText: '确定'});
          return
        }
        // 判断括号是否成对出现(点击查询时判断)
        if(allLabel.replace(/a/g,'').length != allLabel.replace(/b/g,'').length){
          this.$alert('条件选择错误,括号未成对出现', '提示', {confirmButtonText: '确定'});
          return
        }
        // 判断括号中有无内容(点击查询时判断)
        if(allLabel.indexOf("ab") != -1){
          this.$alert('条件选择错误,括号中无内容', '提示', {confirmButtonText: '确定'});
          return
        }
        //判断括号不以连接符开始结束(点击查询时判断)
        if(allLabel.indexOf("a2") != -1){
          this.$alert('条件选择错误,左括号后不能以连接符开始', '提示', {confirmButtonText: '确定'});
          return;
        }
        //判断括号不以连接符开始结束(点击查询时判断)
        if(allLabel.indexOf("2b") != -1){
          this.$alert('条件选择错误,右括号前不能以连接符结束', '提示', {confirmButtonText: '确定'});
          return;
        }
        // 判断选择条件是否以连接符开始
        if(this.tags.length > 0 ){
          if(this.tags[0].fieldFlag == 2 && (this.tags[0].fieldType == 1 || this.tags[0].fieldType == 2)){
            this.$alert('条件选择错误,不能以连接符开始或结束(除了和括号除外)', '提示', {confirmButtonText: '确定'});
            return
          }
          // 判断选择条件是否以连接符结束
          if(allLabel.substring(allLabel.length -1) == '2' || allLabel.substring(allLabel.length -1) == 'a'){
            this.$alert('条件选择错误,不能以连接符结束', '提示', {confirmButtonText: '确定'});
            return
          }
        }

        /*********** 判断所选条件是否符合要求end  ***********/
        this.formData.pageNum = 1;
        this.formData.customingConDetails = [];  
        if(this.numberValue.id == "isTimeoutCd"){
             this.formData.isTimeoutCd = 1
        };
        if(this.numberValue.id == "isTimeoutZq"){
          this.formData.isTimeoutZq = 1
        };
        this.tags.forEach(item => {
          this.formData.customingConDetails.push(item)
        });

        if (download) {
          this.downloadData();
          return;
        } else {
          this.showDownBtn = false;
        }


        this.getTabList();
        this.getCommomCountSearch();
      },
      /**
       * 分页
       * @param
       * param{page: 2, limit: 20}
       * page 当前页数
       * limit 每页多少条数据
       */
      tableSizeChange: function(val) {
        this.formData.pageSize = val;
        this.getTabList();
        this.getCommomCountSearch()
      },
      tableCurrentChange: function(val) {
        this.formData.pageNum = val;
        this.getTabList();
        this.getCommomCountSearch()
      },
      /************************************** 重置 ********************************************************/
      reset(value){
        if(value != 'changeTab') {
          this.tabName = 'first';
          this.tabNameCh = 'zhcx'
        }
        this.activeName = 'first';
        this.tags = [];
        this.tabShow = 'showZhcx',
          this.xzqyName = '',
          this.selectedAreaInfo = [],
          this.xzqydmSj = '',
          this.jqdj = '',
          this.sjlbdm =  '',
          this.jqtbzh = '',
          this.duty = '',
          this.xfdwdmId = '',
          this.xfdwdm = '',
          this.xfdwdmName = '',
          this.zrqdddmId = '',
          this.zrqdddm = '',
          this.zrqdddmName = '',
          this.zzdwId = '',
          this.zzdw = '',
          this.zzdwName = '',
          this.qhwfldm = '',
          this.qhwms = '',
          this.hzyyms = '',
          this.hzyydm = '',
          this.qhcsms = '',
          this.qhcsdm = '',
          this.zqxxQhcsList = [],
          this.qhcslb = '',
          this.numberTabShow = true,
          this.numInputValue1 = '',
          this.numInputValue2 = '',
          this.numInputValue3 = '',
          // 字符串选项
          this.stringInputValue = '',
          // 时间选择
          this.paramZqsjFrom = '',
          this.paramZqsjTo = '',
          this.selectValue = selectItems[0],
          this.selectShow = '行政区域',
          this.numberValue = '',
          this.stringValue = '',
          this.dateValue = {
              dictCode: '1',
              dictLabel: '接警起止时间',
              id: 'jjsj'
          },
          this.selectRelateValue = '',
          this.relateSelectItems = undefined;
        this.formData = {
          pageNum: 1,
          pageSize: 20,
          customingConDetails: [],
          params: [{
            // 依据排序的属性名称（从 table 返回的数据中获取）
            sortField: "tbsj",
            sortOrder: "desc"
          }]
        },
          this.tableData = [],
          this.resultData = {
            总警情数: '-',
            火灾扑救: '-',
            抢险救援: '-',
            社会救助: '-',
            公务执勤: '-',
            反恐排爆: '-',
            其他出动: '-',
            出动次数: '-',
            出动车辆次: '-',
            出动人次: '-',
            cdcsjl: '-',
            cdcl: '-',
            cdjl: '-',
            qjbkry: '-',
            ssbkry: '-',
            qqccjz: '-',
            czrysw: '-',
            czryss: '-',
            jqxx: '-',
            swrs: '-',
            ssrs: '-',
            ccss: '-',
            ghmj: '-'
          },
          this.total = 0,
          this.listLoading = false,
          this.tableSql = '',
          this.countSql = ''
      },
      /************************************** 保存 ********************************************************/
      saveTemplate() {
        if(this.tags&&this.tags.length>0){
          this.saveTemplateDialogShow = true
        }else{
          this.msgInfo("没有可以保存的模板条件!");
        }
      },
      radioChange(val) {
        if (val == 1) {
          this.addOrUpdateShow = 'add';
          this.templateName="";
          this.overwriteExist="";
          this.templateId="";
        }
        if (val == 2) {
          this.addOrUpdateShow = 'update'
        }
      },
      // 查看
      toDetailClick(data) {
        this.$router.push({
          path: "/showDetail/jqxxShowDetail",
          query: {
            jqbh: data.jqbh
          }
        })
      }
      /**模板功能 ***************************************************************/
      ,tempPageChage(val) {
        this.tempQueryForm.pageNum = val;
        this.selectTempList();
        // tempQueryForm:{ pageNum:1,  pageSize:10,  queryType:0,  hasShare:0,  },
      }
      ,selectTempList(){
        this.haveData = [];
        this.haveTabList="数据加载，请稍后......";
        this.tempQueryForm.queryType=this.tabType;
        this.tempQueryForm.hasShare=this.temp_share;
        tempQry.tempListQuery(this.tempQueryForm).then(res=>{
          //  {"TEMP_ID":"2","TEMP_NAME":"模板二","JSON_CONTENE":"模板二<pre>参战形式：主战111","TEMP_SHARE":1},
          let owenTemp = res.data.owenTemps;
          let sharedTemp = res.data.sharedTemps;
          let temps0 = [];
          let temps1 = [];
          for(let i in owenTemp){
            //   console.log(i);
            let temp = owenTemp[i];
            let node = {
              "TEMP_ID":temp.temp_id,
              "TEMP_NAME":temp.temp_name,
              "JSON_CONTENE":temp.jsonStr,
              "JSON_HTML":temp.htmlStr,
              "IS_SHARE":temp.temp_share,
              "TEMP_SHARE":0
            };
            temps0.push(node);
          }
          for(let i in sharedTemp){
            //   console.log(i);
            let temp = sharedTemp[i];
            let node = {
              "TEMP_ID":temp.temp_id,
              "TEMP_NAME":temp.temp_name,
              "JSON_CONTENE":temp.jsonStr,
              "JSON_HTML":temp.htmlStr,
              "IS_SHARE":temp.temp_share,
              "TEMP_SHARE":1
            };
            temps1.push(node);
          }
          //console.log(res);
          this.owenTemp= temps0;
          this.sharedTemp= temps1;
          this.haveTabList="暂无数据";
          if(this.temp_share=='0'){
            this.haveData = temps0;
          }else{
            this.haveData = temps1;
          }
        })
      },
      addTemp(){
        console.log(this.tags);
        if(this.isNewTemp==2||this.isNewTemp=='2'){
          if(!this.templateId){
            this.msgInfo("请先选择需要覆盖的已有模板！");
            return false;
          }
        }

        if(!this.templateName){
          this.msgInfo("请先填写模板名称！");
          return false;
        }
        this.tempSaveModelLoading=true;
        //JSON.parse
        //0、综合查询  1、警情查询  2、出动查询  3、火灾查询
        let htmls = JSON.stringify(this.tags);
        let jsonStr="";
        for(let i in this.tags){
          jsonStr+=" "+this.tags[i].label;
        }
        let param={
          "tempId":this.templateId,
          "queryType":this.tabType,
          "modelName":this.templateName,
          "shareFlag":this.fitScope==''?0:this.fitScope,
          "operaType": this.isNewTemp,//this.addOrUpdateShow == 'add'? 1:2,
          "jsonStr":jsonStr,
          "htmlStr":htmls
        };
        tempQry.saveTemplate(param).then(res=>{
          // console.log(res);
          if(res.code===200){
            this.msgSuccess("保存成功");
            this.selectTempList();
            this.saveTemplateDialogShow = false
          }
        }).finally(() => {
          this.tempSaveModelLoading = false;
        })

      }
      ,isOverWrite(value){
        if(value){
          // console.log(value);
          let vals = value.split("^,_,^");
          //  console.log( vals[0],vals[1]);
          this.templateName=vals[1];
          this.templateId=vals[0];
        }
      },
      /*数据同步***********************************************************/
      async dataSynchronize() {
        this.btnLoading = true;
        const res1 = await synchronizeData().finally(() => {
          this.btnLoading = false;
        });
        if (res1.code === 200) {
          this.$message.success('数据同步成功！');
          const res2 = await getSynchronizeDataTime();
          if (res2.code === 200) {
            this.synchronizationTime = res2.data.cdtime;
            // TODO 将返回的同步时间填到页面上
          } else {
            this.$message.error(res2.msg);
          }
        } else {
          this.$message.error(res1.msg);
        }
      },
      /**
       * [getLastTime 获取最后一次同步时间]
       * @Author       Miliky
       * @DateTime     2020-01-21T23:31:45+0800
       * @Description: [一行代码一行诗]
       * @return       {void}
       */
      getLastTime() {
        getLastEtlTime().then(res => {
          if (res.code == 200) this.synchronizationTime = res.data.cdtime || "";
        });
      },
      /************************************** 生成报表 ********************************************************/
      // 报表按钮
      toReport() {
        let beginTime;
        let endTime;
        this.cdbgzt = '';
        this.hzbgzt = '';
        this.bgzt = '';
        if(this.tableSql == '') {
          this.$alert('无数据不能生成报表', '提示', {confirmButtonText: '确定'});
          return
        }
        if(this.tabName === 'first') {
          this.$alert('综合查询不能生成报表', '提示', {confirmButtonText: '确定'});
          return
        }
        //if(this.jjsjJduge()) {
        //  this.$alert('请选择接警时间！！！', '提示', {confirmButtonText: '确定'})
        //  return
        //}
        for(let j = 0; j < this.tags.length; j++) {
          // 接警时间参数拼凑
          if(this.tags[j].fieldNameEn == 'jjsj') {
            beginTime = this.tags[j].fieldValueEn.split(',')[0];
            endTime = this.tags[j].fieldValueEn.split(',')[1];
          }
          //起火时间
          if(this.tags[j].fieldNameEn == 'zqsj' && this.tabName === 'fourth') {
            beginTime = this.tags[j].fieldValueEn.split(',')[0];
            endTime = this.tags[j].fieldValueEn.split(',')[1];
          }
          // 出动信息里的报告状态参数拼凑
          if(this.tags[j].fieldNameEn == 'shztArr') {
            this.bgzt = this.tags[j].fieldValueEn;
          }
          // 火灾信息里的报告状态参数拼凑
          if(this.tags[j].fieldNameEn == 'tbZqxxQueryVoshzt') {
            this.bgzt = this.tags[j].fieldValueEn;
          }
        }
        const params = {};
        params.tableSql = this.tableSql;
        params.countsql = this.countsql;
        params.beginTime = beginTime;
        params.endTime = endTime;
        params.bgzt = this.bgzt;
        sessionStorage.setItem(
          'customSearch_to_dataReport_params',
          JSON.stringify(params)
        );
        let type = '';
        if(this.tabName === 'second') {
          type = 'jq'
        } else if(this.tabName === 'third') {
          type = 'cd'
        } else if(this.tabName === 'fourth') {
          type = 'hz'
        }
        this.$router.push({
          path: '/eqw/dataReport',
          query: { rptSource: type, isCustomize: true }
        })
      },
    }
  };
</script>
<style>
  .position{
    padding-top: 30px;
    padding-left: 30px
  }
  .searchContentStyle{
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215,215,215,1);
    font-size: 13px;
    color: rgba(153,153,153,0.8);
    text-align: center;
    line-height: 50px;
  }
  .buttonStyle{
    width: 100px;
  }
  .divStyle{
    background-color: #fafafa;
  }
  .dashedLine{
    border-bottom: 1px dashed;
    border-color: rgba(153,153,153,0.8);
  }
  .textColor{
    color: darkorange;
  }
  .title {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    padding-left: 10px;
    margin-bottom: 10px;
    position: relative;
    border-left: 2px solid #437fdf;
  }
  .el-col-1 {
    width: 4.16667%;
    text-align: center;
  }
  .div_box{
    height: 318px;
    width: 100%;
  }
  .el-col-tab{
    float: right;
    z-index: 9999;
    position: absolute;
    pointer-events: none;
  }
  .el-table .cell.el-tooltip {
    white-space: pre-wrap;
  }
  .pic {
    position: relative;
    padding-left: 18px;
  }
  .pic img {
    width: 14px;
    height: 14px;
    position: absolute;
    left: 0px;
    top: 4px;
  }
</style>
