import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";

export default function Home() {
  const preDefinedHeaders = Object.keys({
    "Plac.": "ONLY_NAME", "Start#": "ONLY_NAME", "Avdelning": "ONLY_NAME", "Scoutkår": "ONLY_NAME", "Distrikt": "ONLY_NAME", "Patrull": "ONLY_NAME", "Resultat": "RESULT", "Summa": "RESULT"
  })
  const years = [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2018, 2019, 2021, 2022]
  const [myr, setMyr] = useState(false);
  const [sortOn, setSortOn] = useState({col:'Plac.',dirk:'DESC'});
  const { query } = useRouter();
  const router = useRouter()
  const [year, setYear] = useState(query.year ? query.year : 2022);
  useEffect(
    () => {
      if (year){
        fetch('/api/myrstigen?year=' + year)
          .then(response => response.json())
          .then(data => setMyr(data));
      }
    }, [year]
  );
  useEffect(
    () => {
      setYear(query.year)
    }, [query]
  );
  if (myr.length > 0) {
    const myrstigen = myr.map((contestant) => {
      return {
        ...contestant, 'Summa': Object.keys(contestant).reduce((previousValue, currentValue) => {
          if (preDefinedHeaders.indexOf(currentValue) >= 0) {
            return previousValue
          }
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
    const pointHeaders = Object.keys(myrstigen[0]).filter((header) => {
      return preDefinedHeaders.indexOf(header) === -1
    })
    let sums = pointHeaders.map((header) => ({
      [header]: 0
    }))
    myrstigen.forEach((contestant) => {
      sums.forEach((sum, i) => {
        sums[i][Object.keys(sum)[0]] = sums[i][Object.keys(sum)[0]] + Number(contestant[Object.keys(sum)[0]])
      })
    })
    const firstAndSecond = pointHeaders.reduce((prevHeader, header) => {
      return {
        ...prevHeader, [header]: { firstPoint: 0, secondPoint: 0 }
      }
    }, {})
    myrstigen.forEach((contestant) => {
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
    const total = sums.reduce((prevSum, sum, i) => sums[i][Object.keys(sum)[0]] + prevSum, 0)
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
              router.push('/?year=' + buttonYear, undefined, { shallow: true })
              setYear(buttonYear)
            }
          }>{buttonYear}</button>
        ))}</div>
        <h1>Resultat myrstigen {year}</h1>
        <table style={{ marginTop: "24px" }}>
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
        </table>
      </>
    )
  } return null
}
