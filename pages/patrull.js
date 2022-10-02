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

import sum from "../UI/sum"
import findFirstAndSecond from "../UI/firstAndSecond"
import addSums from '../UI/addSums';
import findHeaders  from "../UI/findHeaders"

export default function Home() {
  const preDefinedHeaders = Object.keys({
    "Plac.": "ONLY_NAME","Patruller": "ONLY_NAME","Start#": "ONLY_NAME", "Avdelning": "ONLY_NAME", "Scoutkår": "ONLY_NAME", "Distrikt": "ONLY_NAME", "Patrull": "ONLY_NAME", "Resultat": "RESULT", "Summa": "RESULT"
  })
  const years = [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2009, 2010, 2011, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022]
  const [contestantsData, setContestantsData] = useState(false);
  const [sortOn, setSortOn] = useState({col:'Plac.',dirk:'DESC'});
  const { query } = useRouter();
  const router = useRouter()
  const [year, setYear] = useState(query.year ? query.year : 2022);
  useEffect(
    () => {
      if (year){
        fetch('/api/alghornet?year=' + year+ '&type=pat')
          .then(response => response.json())
          .then(data => {
            let bigestAvd = 0
            const avds = data.contestants.reduce((prevContestants, contestant) => {
              if (!prevContestants || !prevContestants[contestant['Scoutkår']+contestant['Avdelning']]){
                
                return {
                  ...prevContestants, [contestant['Scoutkår']+contestant['Avdelning']] : [contestant]
                }
              }
              const newData = {...prevContestants}
              newData[contestant['Scoutkår']+contestant['Avdelning']].push(contestant)
              if (bigestAvd < newData[contestant['Scoutkår']+contestant['Avdelning']].length) {
                bigestAvd = newData[contestant['Scoutkår']+contestant['Avdelning']].length
              }
              return newData
            }
            , {})
        
            let contestants = Object.keys(avds).map((avdkey) => {
                return Object.keys(avds[avdkey]).reduce((prevPatrulls, patrull) => {
                  if (Object.keys(prevPatrulls).length > 0) {
                    const newData = {...prevPatrulls}
                    Object.keys(avds[avdkey][patrull]).forEach((key)=>{
                      if (preDefinedHeaders.indexOf(key) === -1){
                        newData[key] = Number(newData[key]) + Number(avds[avdkey][patrull][key])
                      }
                    })
                    newData['Patruller'] = newData['Patruller'] + 1;
                    return newData
                  }
                  return {...avds[avdkey][patrull], Patruller: 1}
                  
                }, {})
            }).map((contestant)=>{
              return Object.keys(contestant).reduce((prevCol, key) =>{
                if (preDefinedHeaders.indexOf(key) === -1){
                  return {...prevCol,[key]: Math.round(contestant[key] / avds[[contestant['Scoutkår']+contestant['Avdelning']]].length* bigestAvd )}
                } 
                return {...prevCol,[key]:contestant[key]}
              },{})
            })
            contestants = sum(contestants, preDefinedHeaders)
            setContestantsData(contestants)
          });
      }
    }, [year]
  );
  useEffect(
    () => {
      if (query.year) {
        setYear(query.year)
      }
    }, [query]
  );
  if (contestantsData.length > 0) {
    const contestants = contestantsData
    const headers = findHeaders(contestants, preDefinedHeaders)
    const pointHeaders = Object.keys(contestants[0]).filter((header) => preDefinedHeaders.indexOf(header) === -1)
    const sums = addSums(contestants, pointHeaders)
    const firstAndSecond = findFirstAndSecond(contestants, pointHeaders)
    const total = sums.reduce((prevSum, sum, i) => sums[i][Object.keys(sum)[0]] + prevSum, 0)

    return (
      <>
        <div>{years.map((buttonYear) => (
          <button key={buttonYear} style={{
            background: Number(buttonYear) === Number(year) ? "#ffd8b8" : "#f8ab67",
            borderRadius: "3px",
            padding: "0px 6px",
            border: Number(buttonYear) === Number(year) ?  'none' : "1px solid #361703",
            margin: "3px",
            height: "32px",
            textDecoration: "none",
            cursor:'pointer'
          }} onClick={
            (e) => {
              router.push('/patrull?year=' + buttonYear, undefined, { shallow: true })
              setYear(buttonYear)
            }
          }>{buttonYear}</button>
        ))}</div>
        <h1>Kalkulerat resultat om man delar gämnt {year}</h1>
        <table style={{ marginTop: "24px" }}>
          <SumOfPoints {...{ headers, sums }} />
          <AverageScore {...{ headers, sums, contestants }} />
          <AverageScoreOfTotal {...{ headers, sums, total }} />
          <DiffFirstAndSecond {...{ headers, firstAndSecond }} />
          <AverageAgainstTheWinner {...{ headers, sums, firstAndSecond,contestants }} />
          <DiffFirstAndSecondAgainstControl {...{ headers, sums, firstAndSecond }} />
          <DiffFirstAndSecondAgainstTotal {...{ headers, firstAndSecond, total }} />

          <TableHeaders {...{ setContestantsData, contestantsData, pointHeaders, headers, sortOn, setSortOn }}></TableHeaders>

          <TableBody contestants={contestants} headers={headers}></TableBody>
        </table>
      </>
    )
  } return null
}
