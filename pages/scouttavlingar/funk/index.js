import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import TableHeaders from "../../../Components/TableHeaders"

import corps from '../../../JSONDATA/corps'
import NavBar from '../../../Components/NavBar'
export default function Home() {

  const [contestantsData, setContestantsData] = useState([]);
  const [alghornetYears, setAlghornetYears] = useState([]);
  const [bjornYears, setBjornYears] = useState([]);
  const [myrstigenYears, setMyrstigenYears] = useState([]);
  const [sortOn, setSort] = useState({ col: 'Antal sakade poäng', dirk: 'DESC' });
  const [totalFunkAndStil, setTotalFunk] = useState(0);
  const branches = [
    "myrstigen",
    "bjorn",
    "alghornet",
    "silv"
  ]
  const headers = {
    'Scoutkår': 'Scoutkår',
    'antalTävlingar': 'Antal tävlande avdelningar',
    'Funkt': 'Stil och funk poäng',
    'maxFunk': 'Maximalt stil och funk poäng',
    'ofMax': 'Andelar maximalt mot intjänade poäng',
    'diff': 'Antal sakade poäng'
  }
  const router = useRouter()

  const idToName = {
    myrstigen: 'Myrstigen',
    alghornet: 'Älghornet',
    pat: 'Patrull',
    kalkpat: 'Projicerad avd.',
    kalkavdpat: 'Kalkylerad P. 1-3',
    kalkavdcontrol: 'Kalkylerad Kont.',
    avd: 'Avdelning',
    silv: 'Silverugglan',
    bjorn: 'Björnklon'
  }
  useEffect(
    () => {
      if (contestantsData) {
        const sortOnColumn = Object.keys(headers).find((col) => (sortOn.col === headers[col]))
        setContestantsData([...contestantsData.sort((contestantA, contestantB) => {
          let sortA = !isNaN(Number(contestantA[sortOnColumn])) ? Number(contestantA[sortOnColumn]) : contestantA[sortOnColumn]
          let sortB = !isNaN(Number(contestantB[sortOnColumn])) ? Number(contestantB[sortOnColumn]) : contestantB[sortOnColumn]
          if (sortOn.dirk === 'DESC') {
            sortB = !isNaN(Number(contestantA[sortOnColumn])) ? Number(contestantA[sortOnColumn]) : contestantA[sortOnColumn]
            sortA = !isNaN(Number(contestantB[sortOnColumn])) ? Number(contestantB[sortOnColumn]) : contestantB[sortOnColumn]
          }
          if (sortA >= sortB) {
            return -1
          } else if (sortA <= sortB) {
            return 1
          }
          else 0
        })])
      }
    }, [sortOn]
  );
  useEffect(
    () => {
      fetch('/api/years?branch=alghornet&type=avd')
        .then(response => response.json())
        .then(data => {
          setAlghornetYears(data.years)
        })
      fetch('/api/years?branch=bjorn&type=avd')
        .then(response => response.json())
        .then(data => {
          setBjornYears(data.years)
        })
      fetch('/api/years?branch=myrstigen&type=avd')
        .then(response => response.json())
        .then(data => {
          setMyrstigenYears(data.years)
        })
    }, []
  );

  useEffect(
    () => {
      if (alghornetYears.length > 0 && bjornYears.length > 0) {
        const requests =

          Promise.all([
            ...alghornetYears.map((year) => fetch('/api/alghornet?year=' + year + '&type=avd').then(response => response.json())),
            ...bjornYears.map((year) => fetch('/api/bjorn?year=' + year + '&type=avd').then(response => response.json())),
            ...myrstigenYears.map((year) => fetch('/api/myrstigen?year=' + year + '&type=avd').then(response => response.json()))]
          )
            .then((responses) => {
              let totalFunk = 0
              setContestantsData(responses.reduce((allContestant, response) => {
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
              }, []))
              setTotalFunk(totalFunk)
            })
      }
    }, [alghornetYears, bjornYears, myrstigenYears]
  );
  return (
    <div style={{ padding: '12px' }}>
      <h1>Funktionärspoäng för scouternasdag</h1>
      <p>Här nedan så har jag räknat ut hur många stil och funktionärspoäng som scoutkårer har sakat under åren.</p>
      <p>Alla tävlingar har inte haft stil eller funk poäng där av så har vissa kårer inte sakat några poäng </p>
      <NavBar {...{ branches, idToName, year: 2022, type: 'avd', router, funk: true, setBranch: () => { } }} />
      <h3>Totalpoäng om du har en avdelning per gren på scouternas dag: {totalFunkAndStil}</h3>
      <table>

        <TableHeaders {...{
          pointHeaders: [...Object.values(headers).filter((value) => (value !== 'Scoutkår'))], headers: [...Object.values(headers)], sortOn, setSortOn: setSort
        }} />
        <tbody>{contestantsData.map((contestant, index) => (
          <tr key={contestant + index}>
            <td>{contestant.Scoutkår}</td>
            <td>{contestant.antalTävlingar}</td>
            <td>{Math.round(contestant.Funkt)}</td>
            <td>{Math.round(contestant.maxFunk)}</td>
            <td>{contestant.ofMax}%</td>
            <td>{Math.round(contestant.diff)}</td>
          </tr>))}</tbody>

      </table>
    </div>
  )

}