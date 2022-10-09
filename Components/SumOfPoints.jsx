export default function SumOfPoints({ headers, sums }) {
    return (
        <tr>
            {headers.map((header, i) => {
                const sum = sums.find((sum) => !!sum[header])
                return (<th key={header}>{sum ? Math.round(sum[header]*10)/10 : ''}</th>)
            })
            }
            <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{'⇦ Summa av poäng på kontrollen'}</th>
        </tr>
    )
}