import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";

export default function Home() {
  const preDefinedHeaders = Object.keys({
    "Plac.": "ONLY_NAME", "Start#": "ONLY_NAME", "Avdelning": "ONLY_NAME", "Scoutkår": "ONLY_NAME", "Distrikt": "ONLY_NAME", "Patrull": "ONLY_NAME", "Resultat": "RESULT", "Summa": "RESULT"
  })
  const years = [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2009, 2010, 2011, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022]
   const [myr, setMyr] = useState(false);
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
              const uid = contestant['Scoutkår']+ ' ' + contestant['Avdelning']
              if (!prevContestants || !prevContestants[uid]){
                let patrullPoints = 0;
                Object.keys(contestant).forEach((key)=>{
                  if (preDefinedHeaders.indexOf(key) === -1){
                    patrullPoints= Number(patrullPoints) + Number(contestant[key])
                  }
                })
                return {
                  ...prevContestants, [uid] : [patrullPoints]
                }
              }
              const newData = {...prevContestants}

              let patrullPoints = 0;
              Object.keys(contestant).forEach((key)=>{
                if (preDefinedHeaders.indexOf(key) === -1){
                  patrullPoints= Number(patrullPoints) + Number(contestant[key])
                }
              })
              newData[uid] = [...newData[uid], patrullPoints].sort((a, b)=>(b-a)).slice(0,3)
              

              if (bigestAvd < newData[uid].length) {
                bigestAvd = newData[uid].length
              }
              return newData
            }
            , {})
            
      fetch('/api/alghornet?year=' + year+ '&type=avd')
      .then(response => response.json())
      .then((data)=>{
        data.contestants.map((contestant)=>{
          console.log(avds[contestant['Scoutkår'] + ' ' + contestant.Avdelning])
        })
      })
            setMyr(avds)
          });
      }
    }, [year]
  );
  useEffect(
    () => {
      if (query.year){
        setYear(query.year)
      }
    }, [query]
    );
    if (Object.keys(myr).length > 0) {
      const myrstigen = Object.keys(myr).map((key)=>{
        return {name: key, patrulls:myr[key], summa: myr[key].reduce((prev, item)=>(prev+item))}
      }).sort((a, b)=>(b.summa-a.summa))
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
              router.push('avd/?year=' + buttonYear, undefined, { shallow: true })
              setYear(buttonYear)
            }
          }>{buttonYear}</button>
        ))}</div>
        <h1>Resultat avdelning (Kalkulerade poäng) {year}</h1>
        <table style={{ marginTop: "24px" }}>
          {
            myrstigen.map((contestant, index) => {
              return (
                <tr key={contestant + index}>
                <th>{index + 1}</th>
                  <th>{contestant.name}</th>
                  <th>{contestant.summa}</th>
                  {contestant.patrulls.map((value) => {
                    return (<td key={value + index}>{value}</td>)
                  })
                  }
                </tr>
              )
            })}
        </table>
      </>
    )
  } return null
}
