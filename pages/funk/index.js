import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";

import corps from '../../JSONDATA/corps.js'
import NavBar from '../../Components/NavBar'
export default function Home() {

  const [contestantsData, setContestantsData] = useState([]);
  const [alghornetYears, setAlghornetYears] = useState([]);
  const [bjornYears, setBjornYears] = useState([]);
  const [myrstigenYears, setMyrstigenYears] = useState([]);
  const [sortOn, setSort] = useState({ col: 'Scoutkår', dirk: 'DESC' });
  const [totalFunkAndStil, setTotalFunk] = useState(0);
  const branches = [
    "myrstigen",
    "alghornet",
    "silv",
    "bjorn"
  ]
  const router = useRouter()

  const idToName = {
    myrstigen: 'Myrstigen',
    alghornet: 'Älghornet',
    pat: 'Patrull',
    kalkpat: 'Projicerad avd.',
    kalkavdpat: 'Kalkulerad P. 1-3',
    kalkavdcontrol: 'Kalkulerad Kont.',
    avd: 'Avdelning',
    silv: 'Silverugglan',
    bjorn: 'Björnklon'
  }
  useEffect(
    () => {
      if (contestantsData) {
        setContestantsData([...contestantsData.sort((contestantA, contestantB) => {
          let sortA = !isNaN(Number(contestantA[sortOn.col])) ? Number(contestantA[sortOn.col]) : contestantA[sortOn.col]
          let sortB = !isNaN(Number(contestantB[sortOn.col])) ? Number(contestantB[sortOn.col]) : contestantB[sortOn.col]
          if (sortOn.dirk === 'DESC') {
            sortB = !isNaN(Number(contestantA[sortOn.col])) ? Number(contestantA[sortOn.col]) : contestantA[sortOn.col]
            sortA = !isNaN(Number(contestantB[sortOn.col])) ? Number(contestantB[sortOn.col]) : contestantB[sortOn.col]
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
                }, []).map((corp) => ({ ...corp, ofMax: Number(corp.Funkt) / Number(corp.maxFunk), diff: Number(corp.maxFunk) - Number(corp.Funkt) })).sort(function (a, b) { return (!isNaN(b.diff) ? b.diff : 0) - (!isNaN(a.diff) ? a.diff : 0) })
              }, []))
              setTotalFunk(totalFunk)
            })
      }
    }, [alghornetYears, bjornYears, myrstigenYears]
  );
  return (
    <div style={{ padding: '12px' }}>
      <h1>Funktionärspoäng för scouternasdag</h1>
      <span>Här nedan så har jag räknat ut hur många stil och funktionärspoäng som scoutkårer har sakat under åren.</span>
      <br />
      <br />
      <NavBar {...{ branches, idToName, year: 2022, type: 'avd', router, funk: true, setBranch: () => { } }} />
      <h3>Total poäng om du har en avdelning per gren på scouternasdag: {totalFunkAndStil}</h3>
      <table>
        <thead>
          <tr><th style={{ cursor: 'pointer', color: '#000' }} onClick={() => { sortOn.col === 'Scoutkår' && sortOn.dirk === 'DESC' ? setSort({ col: 'Scoutkår', dirk: 'ASC' }) : setSort({ col: 'Scoutkår', dirk: 'DESC' }) }}>Scoutkår</th>
            <th style={{ cursor: 'pointer', color: '#000' }} onClick={() => { sortOn.col === 'antalTävlingar' && sortOn.dirk === 'DESC' ? setSort({ col: 'antalTävlingar', dirk: 'ASC' }) : setSort({ col: 'antalTävlingar', dirk: 'DESC' }) }}>Antal tävlande avdelningar</th>
            <th style={{ cursor: 'pointer', color: '#000' }} onClick={() => { sortOn.col === 'Funkt' && sortOn.dirk === 'DESC' ? setSort({ col: 'Funkt', dirk: 'ASC' }) : setSort({ col: 'Funkt', dirk: 'DESC' }) }}>Stil och funk poäng</th>
            <th style={{ cursor: 'pointer', color: '#000' }} onClick={() => { sortOn.col === 'maxFunk' && sortOn.dirk === 'DESC' ? setSort({ col: 'maxFunk', dirk: 'ASC' }) : setSort({ col: 'maxFunk', dirk: 'DESC' }) }}>Maximalt stil och funk poäng</th>
            <th style={{ cursor: 'pointer', color: '#000' }} onClick={() => { sortOn.col === 'ofMax' && sortOn.dirk === 'DESC' ? setSort({ col: 'ofMax', dirk: 'ASC' }) : setSort({ col: 'ofMax', dirk: 'DESC' }) }}>Andelar</th>
            <th style={{ cursor: 'pointer', color: '#000' }} onClick={() => { sortOn.col === 'diff' && sortOn.dirk === 'DESC' ? setSort({ col: 'diff', dirk: 'ASC' }) : setSort({ col: 'diff', dirk: 'DESC' }) }}>Antal sakade</th></tr>
        </thead>
        <tbody>{contestantsData.map((contestant, index) =>(<tr key={contestant + index}><td>{contestant.Scoutkår}</td><td>{contestant.antalTävlingar}</td><td>{Math.round(contestant.Funkt)}</td><td>{Math.round(contestant.maxFunk)}</td><td>{Math.round(contestant.ofMax * 1000) / 10}%</td><td>{Math.round(contestant.diff)}</td></tr>))}</tbody>

      </table>
    </div>
  )

}
