export default function TableHeaders({ pointHeaders, headers, sortOn, setSortOn }) {
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
                        ...pointHeaders.indexOf(header) !== -1 ?
                            { transform: "rotate(-180deg)", writingMode: 'vertical-rl', textOrientation: 'mixed', textAlign: "start", padding: '5px 0 0 0' } :
                            { verticalAlign: 'bottom' },
                        ...header === sortOn.col ? { color: '#000' } : {}
                    }
                    }>{header === sortOn.col ? sortOn.dirk === 'ASC' ? ' ⌄' : ' ⌃' : ''}{header}</th>)
                })
                }
            </tr>

        </thead>)
}