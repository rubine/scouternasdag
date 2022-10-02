export default function firstAndSecond(contestants, pointHeaders) {
    let firstAndSecond = pointHeaders.reduce((prevHeader, header) => {
        return {
            ...prevHeader, [header]: { firstPoint: 0, secondPoint: 0 }
        }
    }, {})
    contestants.forEach((contestant) => {
        Object.keys(contestant).forEach((col) => {
            if (firstAndSecond[col]) {
                if (firstAndSecond[col].firstPoint < contestant[col]) {
                    firstAndSecond[col].secondPoint = Number(firstAndSecond[col].firstPoint)
                    firstAndSecond[col].firstPoint = Number(contestant[col])
                } else if (firstAndSecond[col].secondPoint < contestant[col]) {
                    firstAndSecond[col].secondPoint = Number(contestant[col])
                }
            }
        })
    })
    return firstAndSecond
}