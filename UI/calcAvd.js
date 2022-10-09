export default function calcAvd(contestantsData, preDefinedHeaders) {
    let bigestAvd = 0
    const avds = contestantsData.reduce((prevContestants, contestant) => {
      const uid = contestant['Scoutkår']+ ' ' + contestant['Avdelning']
      if (!prevContestants || !prevContestants[uid]){
        let patrullPoints = 0;
        Object.keys(contestant).forEach((key)=>{
          if (preDefinedHeaders.indexOf(key) === -1){
            patrullPoints= Number(patrullPoints) + Number(contestant[key])
          }
        })
        return {
          ...prevContestants, [uid] : [patrullPoints]
        }
      }
      const newData = {...prevContestants}

      let patrullPoints = 0;
      Object.keys(contestant).forEach((key)=>{
        if (preDefinedHeaders.indexOf(key) === -1){
          patrullPoints= Number(patrullPoints) + Number(contestant[key])
        }
      })
      newData[uid] = [...newData[uid], patrullPoints].sort((a, b)=>(b-a)).slice(0,3)
      

      if (bigestAvd < newData[uid].length) {
        bigestAvd = newData[uid].length
      }
      return newData
},{})
return avds

}