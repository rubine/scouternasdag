export default function calcAvdAverage(contestantsData, preDefinedHeaders, avdContestants) {

    const avds = contestantsData.sort((a, b) => (b.Resultat - a.Resultat)).reduce((prevContestants, contestant) => {
        if (!prevContestants || !prevContestants[contestant['Scoutkår'] + contestant['Avdelning']]) {
            return {
                ...prevContestants, [contestant['Scoutkår'] + contestant['Avdelning']]: [contestant]
            }
        }
        const newData = { ...prevContestants }
        const results = newData[contestant['Scoutkår'] + contestant['Avdelning']]
        if (results.length <= 2) {
            newData[contestant['Scoutkår'] + contestant['Avdelning']].push(contestant)
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
        let mergedContestant = { ...contestant}
        const avd = avdContestants.find((contes) => (contes['Avdelning'] === contestant['Avdelning'] && contes['Scoutkår'] === contestant['Scoutkår']))
        if (avd){
            if(avdContestants[0].AL){
                mergedContestant.AL = avd.AL
            }
            if(avdContestants[0].Organisation){
                mergedContestant.Organisation = avd.Organisation
            }
            if(avdContestants[0].Stil){
                mergedContestant.Stil = avd.Stil
            }
            if(avdContestants[0].Funkt){
                mergedContestant.Funkt = avd.Funkt
            }
            if(avdContestants[0].Resultat){
                mergedContestant.Resultat = avd.Resultat
            }
            if(avdContestants[0]['Plac.']){
                mergedContestant['Plac.'] = avd['Plac.']
            }
        } else {
            if(avdContestants[0].AL){
                mergedContestant.AL = 0
            }
            if(avdContestants[0].Organisation){
                mergedContestant.Organisation = 0
            }
            if(avdContestants[0].Stil){
                mergedContestant.Stil = 0
            }
            if(avdContestants[0].Funkt){
                mergedContestant.Funkt = 0
            }
            if(avdContestants[0].Resultat){
                mergedContestant.Resultat = 0
            }
            if(avdContestants[0]['Plac.']){
                mergedContestant['Plac.'] = 0
            }
        }
        delete mergedContestant.Patrull
        delete mergedContestant.Patruller
        return mergedContestant
    })
    return contestants
}