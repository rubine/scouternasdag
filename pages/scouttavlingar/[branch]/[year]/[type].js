import React, { useState, useEffect } from 'react';
import routers, { useRouter } from "next/router";
import TableBody from "../../../../Components/TableBody"
import TableHeaders from "../../../../Components/TableHeaders"
import SumOfPoints from "../../../../Components/SumOfPoints"
import AverageScore from "../../../../Components/AverageScore"
import AverageScoreOfTotal from "../../../../Components/AverageScoreOfTotal"
import DiffFirstAndSecond from "../../../../Components/DiffFirstAndSecond"
import AverageAgainstTheWinner from "../../../../Components/AverageAgainstTheWinner"
import DiffFirstAndSecondAgainstControl from "../../../../Components/DiffFirstAndSecondAgainstControl"
import DiffFirstAndSecondAgainstTotal from "../../../../Components/DiffFirstAndSecondAgainstTotal"
import Header from "../../../../Components/Header"

import corps from '../../../../JSONDATA/corps.mjs'
import sum from "../../../../UI/sum"
import calcAvd from "../../../../UI/calcAvd"
import calcAvdAverage from "../../../../UI/calcAvdAverage"
import calcAvdControll from "../../../../UI/calcAvdControll"
import calcAvdControllMyr from "../../../../UI/calcAvdControllMyr"
import calcAvdTop from "../../../../UI/calcAvdTop"
import findFirstAndSecond from "../../../../UI/firstAndSecond"
import addSums from '../../../../UI/addSums';
import findHeaders from "../../../../UI/findHeaders"
import years from "../../../../JSONDATA/year.json"
const preDefinedHeaders = Object.keys({
  "Plac.": "ONLY_NAME", "Patruller": "ONLY_NAME", "Start#": "ONLY_NAME", "Distrikt": "ONLY_NAME", "Scoutkår": "ONLY_NAME", "Avdelning": "ONLY_NAME", "Lag/Patrull": "ONLY_NAME", "Patrull": "ONLY_NAME", "Resultat": "RESULT", "Summa": "RESULT"
})
export async function getStaticPaths() {
  let paths = [];
  Object.keys(years).forEach((branch) => {
    Object.keys(years[branch]).forEach((type) => {
      years[branch][type].forEach((year) => {
        if (year) { paths = [...paths, { params: { branch, type, year: year.toString() } }] }
      })
    })
  })
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  let { years, propMinMaxYars, propSortOn } = await fetchYears('http://localhost:3001/', context.params.branch, context.params.type)
  let { contestantsData, info } = await fetchResult('http://localhost:3001/', context.params.branch, context.params.type, context.params.year)
  return {
    props: { propYears: years, propMinMaxYars, propSortOn, propContestantsData: contestantsData, infoProp: info },
  };
}

const fetchYears = async (path, branch, type) => {
  let years = []
  let propMinMaxYars = []
  let propSortOn = {}

  if ((branch === 'silv' || branch === 'hajk') && type !== 'pat') {
    type = 'pat'
  }
  await fetch(path + '/api/years?branch=' + branch + '&type=' + type)
    .then(response => response.json())
    .then(data => {
      years = data.years
      propMinMaxYars = Array.apply(null, Array(data.maxMinYears.max - data.maxMinYears.min))
        .reduce((years) => ([...years, years[years.length - 1] + 1]), [data.maxMinYears.min])
      propSortOn = { col: 'Plac.', dirk: 'DESC' }
    })
  return { years, propMinMaxYars, propSortOn }
}

const fetchResult = async (path, branch, type, year) => {
  let contestantsData = false
  let info = 'Ingen information'
  await fetch(path + '/api/' + branch + '?year=' + year + '&type=' + type)
    .then(response => response.json())
    .then(async data => {
      if (data.contestants) {
        const corpsList = Object.keys(corps).reduce((listOfCorps, oneCorps) => {
          return { ...listOfCorps, ...corps[oneCorps].names.reduce((names, name) => ({ ...names, [name]: oneCorps }), {}) }
        }, {})
        const contestants = data.contestants.map((contestant) => {
          return { ...contestant, Scoutkår: corps[corpsList[contestant.Scoutkår]] ? corps[corpsList[contestant.Scoutkår]].name : '' }
        })

        if (data.contestants) {
          if (type === 'kalkavdpat') {
            await fetch('/api/' + branch + '?year=' + year + '&type=avd')
              .then(response => response.json())
              .then(avdData => {
                const patrulScores = calcAvd(contestants, preDefinedHeaders)
                const avdContestants = avdData.contestants.map((contestant) => {
                  return { ...contestant, Scoutkår: corps[corpsList[contestant.Scoutkår]] ? corps[corpsList[contestant.Scoutkår]].name : '' }
                })
                contestantsData = sum(calcAvdTop(avdContestants, preDefinedHeaders, patrulScores), preDefinedHeaders)
              }).catch((error) => {
                console.error(error)
                contestantsData = []
                info = 'Jag har ingen lagt in eller hittat data än för denna tävling detta år.'
              })
          } else if (type === 'kalkavdcontrol' || type === 'kalkavdcontrolmyr') {
            await fetch('/api/' + branch + '?year=' + year + '&type=avd')
              .then(response => response.json())
              .then(avdData => {
                const avdContestants = avdData.contestants.map((contestant) => {
                  return { ...contestant, Scoutkår: corps[corpsList[contestant.Scoutkår]] ? corps[corpsList[contestant.Scoutkår]].name : '' }
                })
                if (type === 'kalkavdcontrolmyr') {
                  contestantsData = sum(calcAvdControllMyr(contestants, preDefinedHeaders, avdContestants), preDefinedHeaders)
                } else {
                  contestantsData = sum(calcAvdControll(contestants, preDefinedHeaders, avdContestants), preDefinedHeaders)
                }
              }).catch((error) => {
                console.error(error)
                contestantsData = []
                info = 'Jag har ingen lagt in eller hittat data än för denna tävling detta år.'
              })
          } else if (type === 'kalkpat') {
            contestantsData = sum(calcAvdAverage(contestants, preDefinedHeaders), preDefinedHeaders)
          } else {
            contestantsData = sum(contestants, preDefinedHeaders)
          }
        }
        info = data.infoAboutScore
      } else {
        contestantsData = []
        info = 'Jag har ingen lagt in eller hittat data än för denna tävling detta år.'
      }
    }).catch((error) => {
      console.error(error)
      contestantsData = []
      info = 'Jag har ingen lagt in eller hittat data än för denna tävling detta år.'
    })
  return { contestantsData, info: info ? info : '' }
}
export default function Home({ propYears, propMinMaxYars, propContestantsData, infoProp }) {

  const idToName = {
    myrstigen: 'Myrstigen',
    alghornet: 'Älghornet',
    pat: 'Patrull',
    kalkpat: 'Projicerad avd.',
    kalkavdpat: 'Kalkylerad P. 1-3',
    kalkavdcontrol: 'Kalkylerad Kont.',
    kalkavdcontrolmyr: 'Kalkylerad Kont.max',
    avd: 'Avdelning',
    silv: 'Silverugglan',
    hajk: 'Hajkbenet',
    bjorn: 'Björnklon'
  }
  const [info, setInfo] = useState(infoProp)
  const [years, setYears] = useState(propYears);
  const [maxMinYears, setMaxMinYears] = useState(propMinMaxYars);
  const [contestantsData, setContestantsData] = useState(propContestantsData);
  const [sortOn, setSortOn] = useState({ col: 'Plac.', dirk: 'DESC' });
  const { query } = useRouter();
  const router = useRouter()
  const [year, setYear] = useState(query.year ? query.year : 2022);
  const [type, setType] = useState(query.type ? query.type : 'avd');
  const [branch, setBranch] = useState(query.branch);
  const branches = ['myrstigen', 'bjorn', 'alghornet', 'silv', 'hajk']
  const types = ['avd', 'pat', 'kalkpat', 'kalkavdpat', 'kalkavdcontrol', 'kalkavdcontrolmyr']
  useEffect(() => {
    if ((branch === 'silv' || branch === 'hajk') && type !== 'pat') {
      router.push('/scouttavlingar/' + branch + '/' + year + '/pat#tavlingar', undefined, { shallow: true })
    }
  }, [branch]
  );
  useEffect(() => {
    if (branch && type) {
      fetchYears('', branch, type).then(({ years, propMinMaxYars }) => {
        setYears(years)
        setMaxMinYears(propMinMaxYars)
        setSortOn({ col: 'Plac.', dirk: 'DESC' })
      })
    }
  }, [branch, type]
  );
  useEffect(() => {
    if (branch && type) {
      fetchResult('', branch, type, year).then(({ contestantsData, info }) => {
        setContestantsData(contestantsData)
        setInfo(info)
        setSortOn({ col: 'Plac.', dirk: 'DESC' })
      })
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
  if (contestantsData && contestantsData.length > 0) {
    const contestants = [...contestantsData]
    const headers = findHeaders(contestants, preDefinedHeaders)
    const pointHeaders = Object.keys(contestants[0]).filter((header) => preDefinedHeaders.indexOf(header) === -1)
    const sums = addSums(contestants, pointHeaders)

    const firstAndSecond = findFirstAndSecond(contestants, pointHeaders)
    const total = sums.reduce((prevSum, sum, i) => sums[i][Object.keys(sum)[0]] + prevSum, 0)

    return (
      <div style={{ padding: '12px' }}>
        <h2 style={{ maxWidth: '600px', margin: '12px' }}>Tävlingar i Stockholm Scoutdistrikt</h2>
        <div style={{ maxWidth: '600px', margin: '18px' }}>
          <p>
            Under våren 2022 så höll Stockholm Scoutdistrikt i tävlingen scouternas dag.
            Jag va tveksam till en kontroll som min dåvarande kår höll i.
            När avdelningen som en av baskontrollanterna även är avdelningsledare för fick över 50 poäng mer än tvåan, så fick jag idén till att skapa denna sida. Sidan visar att detta är högst ovanligt med så stora poäng skillnader.
            Jag har givetvis meddelat mina misstankar om fusk till distriktsstyrelsen, det är dom som kan göra något åt fusk.
            De va inte det minsta intresserade utom lämnade över allt till TOIS som svarade att de inte kunde göra något i efterhand.
            Det va därför jag hade tagit kontakt med styrelsen i första hand det är bara dom som kan utesluta folk/kårer som fuskar från tävlingar enligt regelverket.
          </p>
          <p>
            Nu har jag vidareutvecklat så att man enkelt kan sortera på olika kontroller och jämföra poäng och även få uträkningar för avdelningar på alla nivåer av tävlingar på scouternas dag.
            Jag har även lagt in all data jag kan hitta/orkar för de olika tävlingarna TOIS arrangerar.
            Dock så tycker jag att det är viktigt att persondata inte sprids på nätet så jag har inte lagt upp tävlingar där deltagarna står med deras namn.
          </p>
        </div>
        <div style={{minHeight:'100vh'}}>
          
        <Header {...{ branches, setBranch, maxMinYears, setYear, branch, year, type, setType, info, idToName, years, router, types }} />
        <table style={{ marginTop: "24px" }}>
          {
            branch === 'myrstigen' && (type === 'pat' || type === 'avd'|| type === 'kalkpat' || type === 'kalkavdcontrol' || type === 'kalkavdcontrolmyr') ||
              branch === 'alghornet' && (type === 'pat' || type === 'kalkpat' || type === 'kalkavdcontrol' || type === 'kalkavdcontrolmyr' || year === '2016') ||
              branch === 'silv' && (type === 'pat') ||
              branch === 'hajk' && (type === 'pat') ||
              branch === 'bjorn' && (type === 'pat' || type === 'kalkpat' || type === 'kalkavdcontrol' || type === 'kalkavdcontrolmyr' || type === 'avd') ?
              <thead><SumOfPoints {...{ headers, sums }} />
                <AverageScore {...{ headers, sums, contestants }} />
                <AverageScoreOfTotal {...{ headers, sums, total }} />
                <DiffFirstAndSecond {...{ headers, firstAndSecond }} />
                <AverageAgainstTheWinner {...{ headers, sums, firstAndSecond, contestants }} />
                <DiffFirstAndSecondAgainstControl {...{ headers, sums, firstAndSecond }} />
                <DiffFirstAndSecondAgainstTotal {...{ headers, firstAndSecond, total }} />
              </thead> : <></>}
          <TableHeaders {...{ pointHeaders, headers, sortOn, setSortOn }} />

          <TableBody contestants={contestants} headers={headers} />
        </table>
        </div>
      </div>
    )
  } return <div style={{ marginTop: "24px" }}> <Header {...{ branches, setBranch, maxMinYears, setYear, branch, year, type, setType, info, idToName, years, router, types }} /> </div>

}
