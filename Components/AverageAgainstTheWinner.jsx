export default function AverageAgainstTheWinner({ headers, sums, firstAndSecond, contestants }) {
  return (<tr>
    {headers.map((header, i) => {
      const FAS = firstAndSecond[header]
      const sum = sums.find((sum) => !!sum[header])
      const diffControl = FAS && sum ? Math.round((Number(FAS.firstPoint) - (Math.round(Number(sum[header]) / contestants.length))) / Number(sum ? sum[header] : 0) * 1000) : 0
      return (<th key={header + i}  style={{
        background: FAS ? diffControl >= 62 ? '#f00' : diffControl >= 20 ? '#a74300' : diffControl > 15 ? '#f8ab67' : '#ffd8b8' : 'inherit',
        color: diffControl < 20 ? '#000000' : '#ffffff'
      }}>{FAS ? diffControl + '‰' : ''}</th>)
    })
    }
    <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{'⇦ Andlar 1´an mot medel'}</th>
  </tr>
  )
}