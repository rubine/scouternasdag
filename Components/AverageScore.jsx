export default function AverageScore({ headers, sums, contestants }) {
  return (<tr>
    {headers.map((header, i) => {
      const sum = sums.find((sum) => !!sum[header])
      return (<th key={header + i}>{sum ? Math.round(Number(sum[header]) / contestants.length) : ''}</th>)
    })
    }
    <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{'⇦ Medelpoäng på kontrollen'}</th>
  </tr>
  )
}