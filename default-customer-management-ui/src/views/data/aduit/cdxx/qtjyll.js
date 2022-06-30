export const zzd = {
  value: '3',
  label: '专职队',
  children: [
    {
      value: '301',
      label: '城区县城政府专职消防队'
    },
    {
      value: '302',
      label: '乡镇政府专职消防队'
    },
    {
      value: '303',
      label: '企事业单位专职消防队'
    }
  ]
}
export const zyd = {
  value: '7',
  label: '志愿队',
  children: [
    {
      value: '701',
      label: '城区县城志愿消防队'
    },
    {
      value: '702',
      label: '乡镇志愿消防队'
    },
    {
      value: '703',
      label: '单位志愿消防队'
    },
    {
      value: '704',
      label: '民间志愿消防队'
    }
  ]
}
export const getZzd = value=>{
  if(!value) return '-';
  const { label } = zzd.children.find(r=>r.value===value)
  return `${zzd.label}/${label||'-'}`
}

export const getZyd = value=>{
  if(!value) return '-';
  const { label } = zyd.children.find(r=>r.value===value)
  return `${zyd.label}/${label||'-'}`
}

