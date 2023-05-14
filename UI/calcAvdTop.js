export default function calcAvd(avdContestants, preDefinedHeaders, patrulScores) {

  return avdContestants.map((avd) => {
    let cleanAvd = Object.keys(avd)
      .filter((key) => (preDefinedHeaders.find((keaderKey) => (key === keaderKey || key === 'Organisation' || key === 'AL' || key === 'Stil' || key === 'Funkt'))))
      .reduce((avds, item) => ({ ...avds, [item]: avd[item] }), {})
    const p = [1,2,3]
      p.forEach((index)=>{
      const patrulScore = patrulScores[cleanAvd['Scoutkår'] + ' ' + cleanAvd['Avdelning']] ? patrulScores[cleanAvd['Scoutkår'] + ' ' + cleanAvd['Avdelning']][index - 1] : 0 
      cleanAvd['Patrull ' + (index)] = patrulScore ? patrulScore : 0
    })
    return cleanAvd
  })
}