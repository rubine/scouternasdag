export default function calcAvdAverage(contestantsData, preDefinedHeaders, avdContestants) {

    const avds = contestantsData.sort((a, b) => (b.Resultat - a.Resultat)).reduce((prevContestants, contestant) => {
        if (!prevContestants || !prevContestants[contestant['Scoutkår'] + contestant['Avdelning']]) {
            return {
                ...prevContestants, [contestant['Scoutkår'] + contestant['Avdelning']]: [contestant]
            }
        }
        const newData = { ...prevContestants }
        newData[contestant['Scoutkår'] + contestant['Avdelning']].push(contestant)
        return newData
    }, {})
    let contestants = Object.keys(avds).map((avdkey) => {
        return Object.keys(avds[avdkey][0]).reduce((prevColumns, column) => {
            if (preDefinedHeaders.indexOf(column) === -1) {
                const control = avds[avdkey].map((patrull)=>(Number(patrull[column]))).sort((a, b) => (b - a)).slice(0, 3).reduce((partialSum, a) => partialSum + a, 0)
                return {...prevColumns, [column]: control}
            }
            return {...prevColumns, [column]: avds[avdkey][0][column]}
        }, {})
    }).map((contestant) => {
        let mergedContestant = { ...contestant }
        const avd = avdContestants.find((contes) => (contes['Avdelning'] === contestant['Avdelning'] && contes['Scoutkår'] === contestant['Scoutkår']))
        if (avd) {
            if (avdContestants[0].AL) {
                mergedContestant.AL = avd.AL
            }
            if (avdContestants[0].Organisation) {
                mergedContestant.Organisation = avd.Organisation
            }
            if (avdContestants[0].Stil) {
                mergedContestant.Stil = avd.Stil
            }
            if (avdContestants[0].Funkt) {
                mergedContestant.Funkt = avd.Funkt
            }
            if (avdContestants[0].Resultat) {
                mergedContestant.Resultat = avd.Resultat
            }
            if (avdContestants[0]['Plac.']) {
                mergedContestant['Plac.'] = avd['Plac.']
            }
        } else {
            if (avdContestants[0].AL) {
                mergedContestant.AL = 0
            }
            if (avdContestants[0].Organisation) {
                mergedContestant.Organisation = 0
            }
            if (avdContestants[0].Stil) {
                mergedContestant.Stil = 0
            }
            if (avdContestants[0].Funkt) {
                mergedContestant.Funkt = 0
            }
            if (avdContestants[0].Resultat) {
                mergedContestant.Resultat = 0
            }
            if (avdContestants[0]['Plac.']) {
                mergedContestant['Plac.'] = 0
            }
        }
        delete mergedContestant.Patrull
        delete mergedContestant.Patruller
        return mergedContestant
    })
    return contestants
}