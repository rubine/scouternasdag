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
        fetch('/api/alghornet?year=' + year)
          .then(response => response.json())
          .then(data => {
            let bigestAvd = 0
            const avds = data.reduce((prevContestants, contestant) => {
              // console.warn(contestant['Scoutkår']+contestant['Avdelning'])
              if (!prevContestants || !prevContestants[contestant['Scoutkår']+contestant['Avdelning']]){
                let patrullPoints = 0;
                Object.keys(contestant).forEach((key)=>{
                  if (preDefinedHeaders.indexOf(key) === -1){
                    patrullPoints= Number(patrullPoints) + Number(contestant[key])
                  }
                })
                return {
                  ...prevContestants, [contestant['Scoutkår']+contestant['Avdelning']] : [patrullPoints]
                }
              }
              const newData = {...prevContestants}

              let patrullPoints = 0;
              Object.keys(contestant).forEach((key)=>{
                if (preDefinedHeaders.indexOf(key) === -1){
                  patrullPoints= Number(patrullPoints) + Number(contestant[key])
                }
              })
              newData[contestant['Scoutkår']+contestant['Avdelning']] = [...newData[contestant['Scoutkår']+contestant['Avdelning']], patrullPoints].sort((a, b)=>(b-a)).slice(0,3)
              

              if (bigestAvd < newData[contestant['Scoutkår']+contestant['Avdelning']].length) {
                bigestAvd = newData[contestant['Scoutkår']+contestant['Avdelning']].length
              }
              return newData
            }
            , {})
            
            setMyr(avds)
          });
      }
    }, [year]
  );
  useEffect(
    () => {
      setYear(query.year)
    }, [query]
    );
    if (Object.keys(myr).length > 0) {
      const myrstigen = Object.keys(myr).map((key)=>{
        return {name: key, patrulls:myr[key], summa: myr[key].reduce((prev, item)=>(prev+item))}
      }).sort((a, b)=>(b.summa-a.summa))
    return (
      <>
       <div>{years.map((buttonYear) => (
          <button style={{
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
            myrstigen.map((contestant) => {
              return (
                <tr>
                  <th>{contestant.name}</th>
                  <th>{contestant.summa}</th>
                  {contestant.patrulls.map((value) => {
                    return (<td>{value}</td>)
                  })
                  }
                </tr>
              )
            })}
        </table>
         {/* <table style={{ marginTop: "24px" }}>
          <tr>
            {headers.map((header, i) => {
              const sum = sums.find((sum) => !!sum[header])
              return (<th>{sum ? sum[header] : ''}</th>)
            })
            }
            <th style={{textAlign:'left'}}>{'<-Summa av poäng'}</th>
          </tr>
          <tr>
            {headers.map((header, i) => {
              const sum = sums.find((sum) => !!sum[header])
              return (<th>{ sum ? Math.round(Number(sum[header]) / myrstigen.length) : ''}</th>)
            })
            }
            <th style={{textAlign:'left'}}>{'<-Medelpoäng'}</th>
          </tr>
          <tr>
            {headers.map((header, i) => {
              const sum = sums.find((sum) => !!sum[header])
              return (<th>{ sum ? Math.round(Number(sum[header]) / total * 100) + '%' : ''}</th>)
            })
            }
            <th style={{textAlign:'left'}}>{'<-Andlar av toltal'}</th>
          </tr>
          <tr>
            {headers.map((header, i) => {
              const FAS = firstAndSecond[header]
              return (<th>{FAS ? Number(firstAndSecond[header].firstPoint) - Number(firstAndSecond[header].secondPoint) : ''}</th>)
            })
            }
            <th style={{textAlign:'left'}}>{'<-Diff. mellan no1&2'}</th>
          </tr>
          <tr>
            {headers.map((header, i) => {
              const FAS = firstAndSecond[header]
              const sum = sums.find((sum) => !!sum[header])
              const diffControl = FAS ? Math.round((Number(firstAndSecond[header].firstPoint) -( Math.round(Number(sum[header]) / myrstigen.length))) / Number(sum ? sum[header] : 0) * 1000) : 0
              return (<th style={{
                background: FAS ?  diffControl > 50 ? '#f00' : diffControl >= 20 ? '#a74300' : diffControl > 15 ? '#f8ab67' : '#ffd8b8' : '',
                color: diffControl < 20? '#000000' :'#ffffff' 
             }}>{FAS ? diffControl + '‰' : '' }</th>)
            })
            }
            <th style={{textAlign:'left'}}>{'<-Andlar 1´an mot medel'}</th>
          </tr>
          <tr>
            {headers.map((header, i) => {
              const FAS = firstAndSecond[header]
              const sum = sums.find((sum) => !!sum[header])
              const diffControl = FAS ? Math.round((Number(firstAndSecond[header].firstPoint) - Number(firstAndSecond[header].secondPoint)) / Number(sum ? sum[header] : 0) * 1000) : 0
              return (<th style={{
                background: FAS ?  diffControl > 15 ? '#a74300' : diffControl > 10 ? '#f8ab67' : '#ffd8b8' : '',
                color: diffControl < 15? '#000000' :'#ffffff' 
             }}>{FAS ? diffControl + '‰' : '' }</th>)
            })
            }
            <th style={{textAlign:'left'}}>{'<-Andlar diff. mellan no1&2 kontroll summa'}</th>
          </tr>
          <tr >
            {headers.map((header, i) => {
              const FAS = firstAndSecond[header]
              const diffTotal = FAS ? Math.round((Number(firstAndSecond[header].firstPoint) - Number(firstAndSecond[header].secondPoint)) / total * 10000) :0
              return (<th style={{
                background: FAS ? diffTotal > 12 ? '#a74300' : diffTotal > 7 ? '#f8ab67' : '#ffd8b8' : '',
                color: diffTotal < 12 ? '#000000' :'#ffffff' 
             }}>{ FAS ? diffTotal + '‱':  ''}</th>)
            })
            }
          <th style={{textAlign:'left'}}>{'<-Andlar diff. mellan no1&2 total'}</th>
          </tr>
          <tr style={{ cursor: 'pointer' }}>
            {headers.map((header) => {
              return (<th onClick={(e) => {
                setMyr([...myr.sort((contestantA, contestantB) => {
                  let sortA = !isNaN(Number(contestantA[header])) ? Number(contestantA[header]) : contestantA[header]
                  let sortB = !isNaN(Number(contestantB[header])) ? Number(contestantB[header]) : contestantB[header]
                  
                  if (header === sortOn.col && sortOn.dirk === 'DESC' ||  header !== sortOn.col ){
                    setSortOn({col:header,dirk: 'ASC' });
                  } else {
                    sortB = !isNaN(Number(contestantA[header])) ? Number(contestantA[header]) : contestantA[header]
                    sortA = !isNaN(Number(contestantB[header])) ? Number(contestantB[header]) : contestantB[header]
                    setSortOn({col:header,dirk: 'DESC' });
                  }
                  if (sortA >= sortB) {
                    return -1
                  } else if (sortA <= sortB) {
                    return 1
                  }
                  else 0
                })])
              }} style={ pointHeaders.indexOf(header) !== -1 ? { transform: "rotate(-180deg)", writingMode: 'vertical-rl', textOrientation: 'mixed', textAlign: "start", padding: '5px 0 0 0' } : {
                verticalAlign: 'bottom'
              }}>{header}{header === sortOn.col ? sortOn.dirk === 'ASC' ? ' v' : ' ^' : ''}</th>)
            })
            }
          </tr>
          {
            myrstigen.map((contestant) => {
              return (
                <tr>
                  {Object.keys(contestant).map((key, i) => {
                    return (<td>{contestant[headers[i]]}</td>)
                  })
                  }
                </tr>
              )
            })}
        </table> */}
      </>
    )
  } return null
}
