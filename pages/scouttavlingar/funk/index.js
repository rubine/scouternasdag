import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from "next/router";
import TableHeaders from "../../../Components/TableHeaders"
import NavBar from '../../../Components/NavBar'
export async function getStaticProps(context) {
  const data = await fetch('http://localhost:3001/api/statistics').then(response => response.json())
  return {
    props: {contestants: data.contestantsData, totalFunk: data.totalFunk },
  }
}
export default function Funk({contestants, totalFunk}) {

  const [contestantsData, setContestantsData] = useState(contestants||[]);
  const [sortOn, setSort] = useState({ col: 'Antal sakade poäng', dirk: 'DESC' });
  const [totalFunkAndStil, setTotalFunk] = useState(totalFunk);
  const [isFetching, setIsfetching] = useState(contestantsData.length !== 0)
  if(contestantsData.length === 0 && !isFetching){
    setIsfetching(true)
    fetch('/api/statistics').then(response => response.json())
        .then(data => {
          debugger
          setIsfetching(false)
          setContestantsData(data.contestantsData)
          setTotalFunk(data.totalFunk)
        })
  }
  const branches = [
    "myrstigen",
    "bjorn",
    "alghornet",
    "silv",
    "hajk"
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
    bjorn: 'Björnklon',
    hajk: 'Hajkbenet'
  }
  useEffect(
    () => {
      if (contestantsData) {
        const sortOnColumn = Object.keys(headers).find((col) => (sortOn.col === headers[col]))
        setContestantsData([...contestantsData.sort((contestantA, contestantB) => {
          let sortA = !isNaN(Number(contestantA[sortOnColumn])) ? Number(contestantA[sortOnColumn]) : contestantA[sortOnColumn]
          let sortB = !isNaN(Number(contestantB[sortOnColumn])) ? Number(contestantB[sortOnColumn]) : contestantB[sortOnColumn]
          if (sortOn.dirk === 'ASC') {
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


  return (
    <div style={{ padding: '12px' }}>
      <Head>
    <title>Funktionärspoäng för scouternasdag</title>
    <meta name="description" content="Funktionärspoäng för scouternasdag" />
  </Head>
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