export default function findHeaders(contestants, preDefinedHeaders, compact) {
    return Object.keys(contestants[0]).sort((headerA, headerB) => {
        const pointsA = preDefinedHeaders.indexOf(headerA) >= 0 ? preDefinedHeaders.indexOf(headerA) : Object.keys(contestants[0]).length + 1
        const pointsB = preDefinedHeaders.indexOf(headerB) >= 0 ? preDefinedHeaders.indexOf(headerB) : Object.keys(contestants[0]).length + 1
        if (pointsA >= pointsB) {
          return 1
        } else if (pointsA <= pointsB) {
          return -1
        }
        else 0
      }).filter((header)=>{
        if (!compact){
          return true
        }
        if(!(header === "Start#" || header === "Distrikt" || header === "Resultat")){
          return true
        }
        return false
      })
}