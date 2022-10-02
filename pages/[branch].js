import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import TableBody from "../Components/TableBody"
import TableHeaders from "../Components/TableHeaders"
import SumOfPoints from "../Components/SumOfPoints"
import AverageScore from "../Components/AverageScore"
import AverageScoreOfTotal from "../Components/AverageScoreOfTotal"
import DiffFirstAndSecond from "../Components/DiffFirstAndSecond"
import AverageAgainstTheWinner from "../Components/AverageAgainstTheWinner"
import DiffFirstAndSecondAgainstControl from "../Components/DiffFirstAndSecondAgainstControl"
import DiffFirstAndSecondAgainstTotal from "../Components/DiffFirstAndSecondAgainstTotal"
import Header from "../Components/Header"

import corps from '../UI/corps.js'
import sum from "../UI/sum"
import calcAvd from "../UI/calcAvdControll"
import findFirstAndSecond from "../UI/firstAndSecond"
import addSums from '../UI/addSums';
import findHeaders from "../UI/findHeaders"

export default function Home() {
  const preDefinedHeaders = Object.keys({
    "Plac.": "ONLY_NAME", "Patruller": "ONLY_NAME", "Start#": "ONLY_NAME","Distrikt": "ONLY_NAME", "Scoutkår": "ONLY_NAME","Avdelning": "ONLY_NAME","Lag/Patrull": "ONLY_NAME", "Patrull": "ONLY_NAME", "Resultat": "RESULT", "Summa": "RESULT"
  })
  const idToName = {
    myrstigen: 'Myrstigen',
    alghornet: 'Älghornet',
    pat: 'Patrull',
    kalkpat: 'Kalkulerad avdelning',
    avd: 'Avdelning',
    silv: 'Silverugglan',
    bjorn: 'Björnklon'
  }
  const [info, setInfo] = useState('Ingen information')
  const [years, setYears] = useState([]);
  const [maxMinYears, setMaxMinYears] = useState([]);
  const [contestantsData, setContestantsData] = useState(false);
  const [sortOn, setSortOn] = useState({ col: 'Plac.', dirk: 'DESC' });
  const { query } = useRouter();
  const router = useRouter()
  const [year, setYear] = useState(query.year ? query.year : 2022);
  const [type, setType] = useState(query.type ? query.type : 'avd');
  const [branch, setBranch] = useState(query.branch);
  const branches = ['myrstigen', 'bjorn', 'alghornet', 'silv']
  const types = ['avd', 'pat', 'kalkpat']

  useEffect(
    () => {
      if (branch === 'myrstigen') {
        setType('avd')
      }
      if (branch === 'silv') {
        setType('pat')
      }
    }, [branch]
  );
  useEffect(
    () => {
      if (branch && type) {
        fetch('/api/years?branch=' + branch + '&type=' + type)
          .then(response => response.json())
          .then(data => {
            setYears(data.years)
            setMaxMinYears(Array.apply(null, Array(data.maxMinYears.max - data.maxMinYears.min))
              .reduce((years) => ([...years, years[years.length - 1] + 1]), [data.maxMinYears.min]))
          })
        setSortOn({ col: 'Plac.', dirk: 'DESC' })
      }
    }, [branch, type]
  );
  useEffect(
    () => {
      if (branch && type) {
        fetch('/api/' + branch + '?year=' + year + '&type=' + type)
          .then(response => response.json())
          .then(data => {
            if (data.contestants){
              const corpsList = Object.keys(corps).reduce((listOfCorps, oneCorps) => {
                return { ...listOfCorps, ...corps[oneCorps].names.reduce((names, name) => ({ ...names, [name]: oneCorps }), {}) }
              }, {})
              const contestants = data.contestants.map((contestant) => {
                return { ...contestant, Scoutkår: corps[corpsList[contestant.Scoutkår]] ? corps[corpsList[contestant.Scoutkår]].name : '' }
              })
  
              if (data.contestants) {
                if (type === 'kalkpat') {
                  setContestantsData(sum(calcAvd(contestants, preDefinedHeaders), preDefinedHeaders))
                } else {
                  setContestantsData(sum(contestants, preDefinedHeaders))
                }
              }
              setInfo(data.infoAboutScore)
            } else {
              setContestantsData([])
              setInfo('Jag har ingen lagt in eller hittat data än för dennna taväling detta år.')
            }
          }).catch(()=>{
            setContestantsData([])
          })
        setSortOn({ col: 'Plac.', dirk: 'DESC' })
      }
    }, [branch, year, type]
  );
  useEffect(
    () => {
      if (query.year) {
        setYear(query.year)
      }
      if (query.branch) {
        setBranch(query.branch)
      }
      if (query.type) {
        setType(query.type)
      }
    }, [query]
  );

  useEffect(
    () => {
      setContestantsData([...contestantsData.sort((contestantA, contestantB) => {
        let sortA = !isNaN(Number(contestantA[sortOn.col])) ? Number(contestantA[sortOn.col]) : contestantA[sortOn.col]
        let sortB = !isNaN(Number(contestantB[sortOn.col])) ? Number(contestantB[sortOn.col]) : contestantB[sortOn.col]
    
        // if (!(header === sortOn.col && sortOn.dirk === 'DESC' || header !== sortOn.col)){
        //     sortB = !isNaN(Number(contestantA[header])) ? Number(contestantA[header]) : contestantA[header]
        //     sortA = !isNaN(Number(contestantB[header])) ? Number(contestantB[header]) : contestantB[header]
        // }
        if (sortA >= sortB) {
            return -1
        } else if (sortA <= sortB) {
            return 1
        }
        else 0
    })])
    }, [sortOn]
  );

  if (contestantsData && contestantsData.length > 0) {
    const contestants = [...contestantsData]
    const headers = findHeaders(contestants, preDefinedHeaders)
    const pointHeaders = Object.keys(contestants[0]).filter((header) => preDefinedHeaders.indexOf(header) === -1)
    const sums = addSums(contestants, pointHeaders)

    const firstAndSecond = findFirstAndSecond(contestants, pointHeaders)
    const total = sums.reduce((prevSum, sum, i) => sums[i][Object.keys(sum)[0]] + prevSum, 0)
    return (
      <div style={{padding:'12px'}}>
        <Header {...{branches,setBranch,maxMinYears,setYear, branch,year,type,setType,info,idToName,years, router,types }} />
        <table style={{ marginTop: "24px", marginBottom: '100vh' }}>
          {
            branch === 'myrstigen' ||
            branch === 'alghornet' && (type === 'pat' || type === 'kalkpat') ||
            branch === 'silv' && (type === 'pat')||
            branch === 'bjorn'?
              <><SumOfPoints {...{ headers, sums }} />
                <AverageScore {...{ headers, sums, contestants }} />
                <AverageScoreOfTotal {...{ headers, sums, total }} />
                <DiffFirstAndSecond {...{ headers, firstAndSecond }} />
                <AverageAgainstTheWinner {...{ headers, sums, firstAndSecond, contestants }} />
                <DiffFirstAndSecondAgainstControl {...{ headers, sums, firstAndSecond }} />
                <DiffFirstAndSecondAgainstTotal {...{ headers, firstAndSecond, total }} />
              </> : <></>}

          <TableHeaders {...{ setContestantsData, contestantsData, pointHeaders, headers, sortOn, setSortOn }} />

          <TableBody contestants={contestants} headers={headers} />
        </table>
      </div>
    )
  } return <Header {...{branches,setBranch,maxMinYears,setYear, branch,year,type,setType,info,idToName,years, router,types }} />
        
}
