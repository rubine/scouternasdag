export default function DiffFirstAndSecond({ headers, firstAndSecond }) {
  return (
    <tr>
      {headers.map((header, i) => {
        const FAS = firstAndSecond[header]
        return (<th key={header + i}>{FAS ? Number(FAS.firstPoint) - Number(FAS.secondPoint) : ''}</th>)
      })
      }
      <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{'⇦ Diff. mellan no1&2'}</th>
    </tr>
  )
}