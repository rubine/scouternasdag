export default function DiffFirstAndSecondAgainstTotal({ headers, total, firstAndSecond }) {
  return (
    <tr >
      {headers.map((header, i) => {
        const FAS = firstAndSecond[header]
        const diffTotal = FAS ? Math.round((Number(firstAndSecond[header].firstPoint) - Number(firstAndSecond[header].secondPoint)) / total * 10000) : 0
        return (<th key={header + i} style={{
          background: FAS ? diffTotal >= 18 ? '#f00' : diffTotal >= 12 ? '#a74300' : diffTotal >= 7 ? '#f8ab67' : '#ffd8b8' : 'inherit',
          color: diffTotal < 12 ? '#000000' : '#ffffff'
        }}>{FAS ? diffTotal + '‱' : ''}</th>)
      })
      }
      <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{'⇦ Andlar diff. mellan no1&2 total'}</th>
    </tr>
  )
}