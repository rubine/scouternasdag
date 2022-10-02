export default function calcAvdAverage(contestantsData, preDefinedHeaders) {
    let bigestAvd = 0
    const avds = contestantsData.reduce((prevContestants, contestant) => {
        if (!prevContestants || !prevContestants[contestant['Scoutkår'] + contestant['Avdelning']]) {

            return {
                ...prevContestants, [contestant['Scoutkår'] + contestant['Avdelning']]: [contestant]
            }
        }
        const newData = { ...prevContestants }
        newData[contestant['Scoutkår'] + contestant['Avdelning']].push(contestant)
        if (bigestAvd < newData[contestant['Scoutkår'] + contestant['Avdelning']].length) {
            bigestAvd = newData[contestant['Scoutkår'] + contestant['Avdelning']].length
        }
        return newData
    }, {})
    
    let contestants = Object.keys(avds).map((avdkey) => {
        return Object.keys(avds[avdkey]).reduce((prevPatrulls, patrull) => {
            if (Object.keys(prevPatrulls).length > 0) {
                const newData = { ...prevPatrulls }
                Object.keys(avds[avdkey][patrull]).forEach((key) => {
                    if (preDefinedHeaders.indexOf(key) === -1) {
                        newData[key] = Number(newData[key]) + Number(avds[avdkey][patrull][key])
                    }
                })
                newData['Patruller'] = newData['Patruller'] + 1;
                return newData
            }
            return { ...avds[avdkey][patrull], Patruller: 1 }

        }, {})
    }).map((contestant) => {
        return Object.keys(contestant).reduce((prevCol, key) => {
            if (key === 'Resultat' || 	key === 'Patrull'){
                return { ...prevCol}
            }
            if (preDefinedHeaders.indexOf(key) === -1) {
                return { ...prevCol, [key]: Math.round(contestant[key] / avds[[contestant['Scoutkår'] + contestant['Avdelning']]].length * bigestAvd) }
            }
            return { ...prevCol, [key]: contestant[key] }
        }, {})
    })
    return contestants
}