import myrStart from '../pages/api/JSONDATA/Myr_avd_1999.json'
import React, { useState, useEffect } from 'react';

export default function Home() {
  const preDefinedHeaders = Object.keys({
    "Plac.": "ONLY_NAME",
    "Start#": "ONLY_NAME",
    "Avdelning": "ONLY_NAME",
    "Scoutkår": "ONLY_NAME",
    "Distrikt": "ONLY_NAME",
    "Resultat": "RESULT",
    "Summa": "RESULT"
  })
  const years = [
1997,
1998,
1999,
2000,
2001,
2002,
2003,
2004,
2005,
2006,
2007,
2008,
2010,
2011,
2012,
2013,
2014,
2015,
2016,
2018,
2019,
2021,
2022]
  const [myr, setMyr] = useState(myrStart);
  const [year, setYear] = useState(1997);

  useEffect(
    () => {
      fetch('/api/myrstigen?year='+year)
        .then(response => response.json())
        .then(data => console.log(setMyr(data)));
    }, [year]
  );
  const myrstigen = myr.map((contestant) => {
    return {
      ...contestant, 'Summa': Object.keys(contestant).reduce((previousValue, currentValue) => {
        if (preDefinedHeaders.indexOf(currentValue) >= 0) {
          return previousValue
        }
        console.log(currentValue)
        return previousValue + Number(contestant[currentValue])
      }, 0)
    }
  })
  let headers = Object.keys(myrstigen[0]).sort((headerA, headerB) => {
    const pointsA = preDefinedHeaders.indexOf(headerA) >= 0 ? preDefinedHeaders.indexOf(headerA) : Object.keys(myrstigen[0]).length + 1
    const pointsB = preDefinedHeaders.indexOf(headerB) >= 0 ? preDefinedHeaders.indexOf(headerB) : Object.keys(myrstigen[0]).length + 1
    if (pointsA >= pointsB) {
      return 1
    } else if (pointsA <= pointsB) {
      return -1
    }
    else 0
  })
  return (
    <>
    <h1>Resultat myrstigen {year}</h1>
    <div>{years.map((year)=>(
      <button onClick={
        (e)=>{
  
          setYear(year)}
      }>{year}</button>
    ))}</div>
    <table>
      <tr>
        {headers.map((header) => {
          return (<th>{header}</th>)
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
    </table>
  </>
  )
}
