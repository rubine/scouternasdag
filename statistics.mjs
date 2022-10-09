import fetch from "node-fetch";
import corps from './JSONDATA/corps.mjs'
import fs from 'fs';

function setContestantsData (data) {
    console.log(data)
}
function setTotalFunk (data) {
    console.log(data)
}


(async function () {
    const alghornetYears = await fetch('http://localhost:3001/api/years?branch=alghornet&type=avd').then(response => response.json())
    const bjornYears = await fetch('http://localhost:3001/api/years?branch=bjorn&type=avd') .then(response => response.json())
    const myrstigenYears = await fetch('http://localhost:3001/api/years?branch=myrstigen&type=avd') .then(response => response.json())
    let contestantsData = {}
    let totalFunk = 0
    await Promise.all([
        ...alghornetYears.years.map((year) => fetch('http://localhost:3001/api/alghornet?year=' + year + '&type=avd').then(response => response.json())),
        ...bjornYears.years.map((year) => fetch('http://localhost:3001/api/bjorn?year=' + year + '&type=avd').then(response => response.json())),
        ...myrstigenYears.years.map((year) => fetch('http://localhost:3001/api/myrstigen?year=' + year + '&type=avd').then(response => response.json()))]
      )
        .then((responses) => {
          contestantsData = responses.reduce((allContestant, response) => {
            let maxFunk = 0
            const corpsList = Object.keys(corps).reduce((listOfCorps, oneCorps) => {
              return { ...listOfCorps, ...corps[oneCorps].names.reduce((names, name) => ({ ...names, [name]: oneCorps }), {}) }
            }, {})
            response.contestants.forEach((contestant) => {
              if (Number(contestant.Funkt ? contestant.Funkt : 0) + Number(contestant.Stil ? contestant.Stil : 0) > maxFunk) {
                maxFunk = Number(contestant.Funkt ? contestant.Funkt : 0) + Number(contestant.Stil ? contestant.Stil : 0)
              }
            })
            totalFunk = totalFunk + maxFunk
            return [...allContestant, ...[...response.contestants].map((contestant) => {
              return {
                Scoutkår: corps[corpsList[contestant.Scoutkår]] ? corps[corpsList[contestant.Scoutkår]].name : '',
                maxFunk,
                Funkt: Number(contestant.Funkt ? contestant.Funkt : 0) + Number(contestant.Stil ? contestant.Stil : 0)
              }
            })].reduce((allCorps, contestant) => {
              if (allCorps.length === 0 || !allCorps.find(({ Scoutkår }) => Scoutkår === contestant.Scoutkår)) {
                return [...allCorps, contestant]
              }
              return allCorps.map(({ Scoutkår, Funkt, maxFunk, antalTävlingar }) => {
                if (Scoutkår === contestant.Scoutkår) {
                  return { Scoutkår, antalTävlingar: antalTävlingar && maxFunk > 0 ? antalTävlingar + 1 : 1, Funkt: Number(contestant.Funkt ? contestant.Funkt : 0) + Number(contestant.Stil ? contestant.Stil : 0) + Number(Funkt), maxFunk: Number(contestant.maxFunk ? contestant.maxFunk : 0) + Number(maxFunk ? maxFunk : 0) }
                } else {
                  return { Scoutkår, Funkt, maxFunk, antalTävlingar: antalTävlingar ? antalTävlingar : 1 }
                }
              })
            }, []).map((corp) => ({ ...corp, ofMax: Number(corp.Funkt) ? Math.round((Number(corp.Funkt) / Number(corp.maxFunk)) * 1000) / 10 : 0, diff: Number(corp.maxFunk) - Number(corp.Funkt) })).sort(function (a, b) { return (!isNaN(b.diff) ? b.diff : 0) - (!isNaN(a.diff) ? a.diff : 0) })
          }, [])
        })
        fs.writeFile('./JSONDATA/statistics.json', JSON.stringify({ contestantsData, totalFunk }), err => {
            if (err) {
                console.error(err);
            }
        });
})()