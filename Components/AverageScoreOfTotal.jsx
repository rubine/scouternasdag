export default function AverageScoreOfTotal({ headers, sums, total }) {
  return (
    <tr>
      {headers.map((header, i) => {
        const sum = sums.find((sum) => !!sum[header])
        return (<th key={header + i} style={sum && Math.round(Number(sum[header]) / total * 100) <= 7 ?  {background:'#f00', color:'#fff'} : {}}>{sum ? Math.round(Number(sum[header]) / total * 100) + '%' : ''}</th>)
      })
      }
      <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{'⇦ Andlar av toltal'}</th>
    </tr>
  )
}