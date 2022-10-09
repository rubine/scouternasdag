export default function DiffFirstAndSecondAgainstControl({ headers, sums, firstAndSecond }) {
  return (
    <tr>
      {headers.map((header, i) => {
        const FAS = firstAndSecond[header]
        const sum = sums.find((sum) => !!sum[header])
        const diffControl = FAS ? Math.round((Number(firstAndSecond[header].firstPoint) - Number(firstAndSecond[header].secondPoint)) / Number(sum ? sum[header] : 0) * 1000) : 0
        return (<th key={header + i} style={{
          background: FAS ? diffControl >= 27 ? '#f00' : diffControl >= 15 ? '#a74300' : diffControl >= 10 ? '#f8ab67' : '#ffd8b8' : 'inherit',
          color: diffControl < 15 ? '#000000' : '#ffffff'
        }}>{FAS ? diffControl + '‰' : ''}</th>)
      })
      }
      <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{'⇦ Andlar diff. mellan no1&2 kontroll summa'}</th>
    </tr>
  )
}