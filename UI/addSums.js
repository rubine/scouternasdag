export default function addSums(contestants, pointHeaders) {
    
  let sums = pointHeaders.map((header) => ({
    [header]: 0
  }))
  contestants.forEach((contestant) => {
    sums.forEach((sum, i) => {
      sums[i][Object.keys(sum)[0]] = sums[i][Object.keys(sum)[0]] + Number(contestant[Object.keys(sum)[0]])
    })
  })
  return sums
  }