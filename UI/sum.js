export default function sum(data, preDefinedHeaders) {
    return data && data.length > 0 && data.map((contestant) => ({
      ...contestant, 'Summa': Object.keys(contestant).reduce((previousValue, currentValue) => {
        if (preDefinedHeaders.indexOf(currentValue) >= 0) {
          return previousValue
        }
        return previousValue + Number(contestant[currentValue])
      }, 0)})
    )
  }