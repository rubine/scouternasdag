import { useState } from 'react';

export default function TableBody({ contestants, headers }) {
    const [isHover, setIsHover] = useState(false);

    const handleMouseEnter = (i) => {
        setIsHover(i);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const boxStyle = {
        background: 'rgb(255, 230, 216)',
        cursor: 'default'
    };

    return (<tbody>{contestants.map((contestant, index) => {
        const hoverStyle = isHover === index ? boxStyle : {}
        return (
            <tr
                key={contestant + index}
                style={hoverStyle}
                onMouseEnter={() => { handleMouseEnter(index) }}
                onMouseLeave={handleMouseLeave}>
                {Object.keys(contestant).map((_, i) => {
                    if (headers[i] !== 'Summa') {
                        return (<td key={headers[i]}>{contestant[headers[i]]}</td>)
                    } else {
                        return (<td key={headers[i]} style={Number(contestant[headers[i]]) !== Number(contestant['Resultat']) ? { "fontWeight": '800' } : {}}>{contestant[headers[i]]}</td>)
                    }
                })
                }
            </tr>
        )
    })}
    </tbody>)
}