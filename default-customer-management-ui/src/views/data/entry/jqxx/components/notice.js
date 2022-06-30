import { MessageBox } from "element-ui"

//必填项没有填写时，点击提交，系统自动移到未填写的数据项
export const check = ()=>{
    let isError = document.getElementsByClassName('is-error')   // 适用于element
    isError[0].querySelector('input').focus()  // 只定位到第一个必填项位置
}

export const checkDwmchzm = (rule, value, callback) => {
    if (value == '无') {
      callback(new Error('单位名称/户主名可以选择填写报警人手机号码、姓名或警情发生地址！'))
    } else {
      callback()
    }
}

export const checkZrdz = (formData1,formData2)=>{
  if(formData2.sfzrqzz == 'N' && formData1.setOff.includes(formData1.mainTeamName) ){
      return true;
  }else{
      return false;
  }
}
export const noticeZrdz = ()=>{
  MessageBox.alert('非责任区主战时，责任队站不可选择已出动的队伍！', {
      confirmButtonText: '确定',
  });
}

/*
export const checkZrdz = (formData1,formData2)=>{
  return function (rule, value, callback)  {
    if(formData1.sfzrqzz != undefined){
      if(formData1.sfzrqzz != 'Y' && formData2.setOff.includes(value)){
        callback(new Error('非责任区主战时，责任队站不可选择已出动的队伍！'))
      } else {
        callback()
      }
    }
  }
}
*/