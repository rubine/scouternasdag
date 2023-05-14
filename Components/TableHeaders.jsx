export default function TableHeaders({ pointHeaders, headers, sortOn, setSortOn, compact }) {
    return (
        <thead>
            <tr><th> </th></tr>
            <tr style={{ cursor: 'pointer' }}>
                {headers.map((header) => {
                    return (<th key={header} onClick={(e) => {
                        if (header === sortOn.col && sortOn.dirk === 'DESC' || header !== sortOn.col) {
                            setSortOn({ col: header, dirk: 'ASC' });
                        } else {
                            setSortOn({ col: header, dirk: 'DESC' });
                        }
                    }} style={{
                        ...pointHeaders.indexOf(header) !== -1 || header === 'Summa' ?
                            { transform: "rotate(-180deg)", writingMode: 'vertical-rl', textOrientation: 'mixed', textAlign: "start", padding: '5px 0 0 0' } :
                            { verticalAlign: 'bottom' },
                        ...header === sortOn.col ? { color: '#000' } : {}
                    }
                    } title={header}>
                        <span style={{ ...pointHeaders.indexOf(header) !== -1 || header === 'Summa' ? { display: "inline-block", transform: "rotate(-180deg)" } : {} }}>{header === sortOn.col ? sortOn.dirk === 'ASC' ? ' ⌄' : ' ⌃' : ''}</span>
                        {header === 'Scoutkår' ? 'Kår' : header}</th>)
                })
                }
            </tr>

        </thead>)
}