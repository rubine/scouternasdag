import yearsData from '../../JSONDATA/year.json'

export default (request, response) => {
  const types = ['avd', 'pat', 'kalkpat', 'kalkavdpat', 'kalkavdcontrol', 'kalkavdcontrolmyr']
  let type = types.find((type)=> type === request.query.type)
  const branchs = ['myrstigen', 'alghornet', 'silv', 'bjorn', 'hajk']
  const branch = branchs.find((branch)=> branch === request.query.branch)
  let max = false
  let min = false
  Object.keys(yearsData).map((branch)=>{
    Object.keys(yearsData[branch]).map((type)=>{
      const maxInType = yearsData[branch][type][yearsData[branch][type].length - 1]
      const minInType = yearsData[branch][type][0]
      max = ((!max && maxInType)|| maxInType > max) ? maxInType : max
      min = ((!min && minInType) || minInType < min) ? minInType : min
    })
  })
  return response.status(200).json({years: yearsData[branch][(type === 'kalkpat' ||  type === 'kalkavdcontrolmyr' ||type === 'kalkavdpat'|| type === 'kalkavdcontrol'  ? 'pat' : type)], maxMinYears: {max, min}});
};