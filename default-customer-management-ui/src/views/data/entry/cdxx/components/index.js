const cdxxFnc = {
  addSwqk() {
    return {
      // 人员伤亡情况 0 死亡  1 受伤
      SWFL: "0",
      rylbdm: '', //人员身份
      xm: '', //姓名
      sex: '', //性别
      personalId: '', //身份证号
      personalCode: '', //人员编号
      age: '', //人员年龄
      rwny: '', //入伍年月
      rzny: '', //入职年月
      ryxj: '', //衔级
      ryzj: '', //职级
      position: '', //岗位
      ssbwdm: '', //伤亡部位
      location: '', //伤亡地点
      swdddm: '', //伤亡位置
      swyydm: '', //伤亡原因
      equipt: '', //防护装备
    }
  },

  checkData(data, $this) {
    let cdxx = data.cdxx;
    //是否首到验证
    if (cdxx.isFirstarrive == 'Y' && cdxx.arriveTime == '') {
      $this.$message.warning("请检查首到时间!");
      return true;
    }
    //气象
    if (cdxx.qw == "" || cdxx.fxdm == "" || cdxx.windForce == "") {
      $this.$message.warning("请检查当日天气情况!");
      return true;
    }

    //行业主管部门
    // if (cdxx.hyzgbm == '') {
    //   $this.$message.warning("请选择行业主管部门!");
    //   return true;
    // }

    //战术措施验证
    if (cdxx.sjlbdm == '010000000000' && cdxx.hzJzscsdm == "") {
      $this.$message.warning("请选择火灾技战术措施!");
      return true;
    } else if (cdxx.sjlbdm == '020000000000' && cdxx.qxjyJzscsdm == "") {
      $this.$message.warning("请选择抢险救援技战术措施!");
      return true;
    }

    if (cdxx.sjlc == '' || cdxx.dcshzqkdm == '') {
      this.$message.warning("请填写实际距离或火灾情况!");
      return true;
    }

    //主战字段验证
    if (cdxx.respondType == '010000') {
      //带队指挥员信息
      if (cdxx.zhy == '' || cdxx.zhyzw == '') {
        $this.$message.warning("请填写带队指挥员信息!");
        return true;
      }
      //处置（执勤）经过
      if (cdxx.czjg == '') {
        $this.$message.warning("请填写处置（执勤）经过!");
        return true;
      }
      if (cdxx.xcrybkqkdm == '' || cdxx.gdxfssyyqkdm == '') {
        $this.$message.warning("请填写必填项!");
        return true;
      }
      if (cdxx.useHydrant == '1') {
        if (cdxx.hydrantSupply == '') {
          $this.$message.warning("请填写公用消防栓供水情况!");
          return true;
        }
      } else {
        if (cdxx.hydrantNotuse == '') {
          $this.$message.warning("请填写不使用公用消防栓原因!");
          return true;
        }
      }
    }
    if (cdxx.czqkdm == '') {
      $this.$message.warning("请选择处置情况!");
      return true;
    } else if (cdxx.czqkdm == '01') {
      if (cdxx.zlsj == '' || cdxx.fdsj == '') {
        $this.$message.warning("请填写处置时间!");
        return true;
      }
    } else if (cdxx.czqkdm == '02') {
      if (cdxx.fdsj == '' || cdxx.dcsj == '' || cdxx.clsj == '') {
        $this.$message.warning("请填写处置时间!");
        return true;
      }
    } else {
      if (cdxx.fdsj == '' || cdxx.dcsj == '' || cdxx.clsj == '' ||
        cdxx.zksj == '' || cdxx.cssj == '' || cdxx.kzsj == '' || cdxx.xmsj == '' || cdxx.jssj == '') {
        $this.$message.warning("请填写处置时间!");
        return true;
      }
    }
    return false;
  }

}

export {
  cdxxFnc
}
