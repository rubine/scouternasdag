import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
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
const preDefinedHeaders = Object.keys({ "Plac.": "ONLY_NAME", "Patruller": "ONLY_NAME", "Start#": "ONLY_NAME", "Distrikt": "ONLY_NAME", "Scoutkår": "ONLY_NAME", "Kår": "ONLY_NAME", "Avdelning": "ONLY_NAME", "Lag/Patrull": "ONLY_NAME", "Patrull": "ONLY_NAME", "Resultat": "RESULT", "Summa": "RESULT" })

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
  try {
    let { years, propMinMaxYars, propSortOn } = await fetchYears('http://localhost:3001/', context.params.branch, context.params.type)
    let { contestantsData, info } = await fetchResult('http://localhost:3001/', context.params.branch, context.params.type, context.params.year)
    return {
      props: { propYears: years, propMinMaxYars, propSortOn, propContestantsData: contestantsData, infoProp: contestantsData.length > 0 ? info : ''},
    };
  } catch (error) {
    return {}
  }
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

const fetchResult = async (path, branch, type, year, compact) => {
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
          return {
            ...contestant,
            Scoutkår: corps[corpsList[contestant.Scoutkår]] ? corps[corpsList[contestant.Scoutkår]].name : '',
            Kår: corps[corpsList[contestant.Scoutkår]] ? corpsList[contestant.Scoutkår] : ''
          }
        })

        if (data.contestants) {
          if (type === 'kalkavdpat') {
            await fetch('/api/' + branch + '?year=' + year + '&type=avd')
              .then(response => response.json())
              .then(avdData => {
                const patrulScores = calcAvd(contestants, preDefinedHeaders)
                const avdContestants = avdData.contestants.map((contestant) => {
                  return {
                    ...contestant, Scoutkår: corps[corpsList[contestant.Scoutkår]] ? corps[corpsList[contestant.Scoutkår]].name : '',
                    Kår: corps[corpsList[contestant.Scoutkår]] ? corpsList[contestant.Scoutkår] : ''
                  }
                })
                contestantsData = sum(calcAvdTop(avdContestants, preDefinedHeaders, patrulScores), preDefinedHeaders)
              }).catch((error) => {
                console.error(error)
                contestantsData = []
                info = (<div style={{ marginTop: '12px', background: '#f00', color: '#fff', padding: '6px' }}>Jag har ingen lagt in eller hittat data än för denna tävling detta år.</div>)
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
                info = (<div style={{ marginTop: '12px', background: '#f00', color: '#fff', padding: '6px' }}>Jag har ingen lagt in eller hittat data än för denna tävling detta år.</div>)
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
        info = (<div style={{ marginTop: '12px', background: '#f00', color: '#fff', padding: '6px' }}>Jag har ingen lagt in eller hittat data än för denna tävling detta år.</div>)
      }
    }).catch((error) => {
      console.error(error)
      contestantsData = []
      info = (<div style={{ marginTop: '12px', background: '#f00', color: '#fff', padding: '6px' }}>Jag har ingen lagt in eller hittat data än för denna tävling detta år.</div>)
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

  const [dimensions, setDimensions] = useState({ height: 0, width: 0 })
  const [info, setInfo] = useState(infoProp)
  const [years, setYears] = useState(propYears);
  const [maxMinYears, setMaxMinYears] = useState(propMinMaxYars);
  const [contestantsData, setContestantsData] = useState(propContestantsData);
  const [sortOn, setSortOn] = useState({ col: 'Plac.', dirk: 'DESC' });
  const { query } = useRouter();
  const router = useRouter()
  const [compact, setCompact] = useState(dimensions.width < 1000);
  const [year, setYear] = useState(query.year ? query.year : 2022);
  const [type, setType] = useState(query.type ? query.type : 'avd');
  const [branch, setBranch] = useState(query.branch);
  const [showNav, setShowNav] = useState(true)
  const branches = ['myrstigen', 'bjorn', 'alghornet', 'silv', 'hajk']
  const types = ['avd', 'pat', 'kalkpat', 'kalkavdpat', 'kalkavdcontrol', 'kalkavdcontrolmyr']
  useEffect(() => {
    if (window) {
      window.addEventListener('resize', () => {
        setDimensions({
          height: window.screen.availHeight,
          width: window.screen.availWidth
        })
      })
      setDimensions({
        height: window.screen.availHeight,
        width: window.screen.availWidth
      })
    }
  }, [])
  useEffect(() => {
    setCompact(dimensions.width < 1000)
    setShowNav(dimensions.width > 1000)
  }, [dimensions]
  );
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
      fetchResult('', branch, type, year, compact).then(({ contestantsData, info }) => {
        setContestantsData(contestantsData)
        setInfo(info)
        setSortOn({ col: 'Plac.', dirk: 'DESC' })
      })
    }
  }, [branch, year, type, compact]
  );

  useEffect(
    () => {
      if (query.year && year !== query.year) {
        setYear(query.year)
      }
      if (query.branch && branch !== query.branch) {
        setBranch(query.branch)
      }
      if (query.type && type !== query.type) {
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
    const headers = findHeaders(contestants, preDefinedHeaders, compact).filter((header) => {
      if (compact && header === "Scoutkår") {
        return false
      } else if (!compact && header === "Kår") {
        return false
      }
      return true
    })
    const pointHeaders = Object.keys(contestants[0]).filter((header) => preDefinedHeaders.indexOf(header) === -1)
    const sums = addSums(contestants, pointHeaders)

    const firstAndSecond = findFirstAndSecond(contestants, pointHeaders)
    const total = sums.reduce((prevSum, sum, i) => sums[i][Object.keys(sum)[0]] + prevSum, 0)
    return (
      <div style={{ padding: '12px' }}>
        <div style={{ minHeight: '100vh' }}>
          <Header {...{ branches, setBranch, maxMinYears, setYear, branch, year, type, setType, info, idToName, years, router, types, dimensions, compact, setCompact, showNav, setShowNav }} />
          <div style={{
            overflowX: 'auto',
            width: '100%',
            direction: 'rtl',
            transform: 'rotate(180deg)',
            marginTop: '12px'
          }}>
            <table style={{
              marginTop: "24px",
              direction: 'ltr',
              transform: 'rotate(180deg)'
            }}>
              {
                (branch === 'myrstigen' && (type === 'pat' || type === 'avd' || type === 'kalkpat' || type === 'kalkavdcontrol' || type === 'kalkavdcontrolmyr') ||
                  branch === 'alghornet' && (type === 'pat' || type === 'kalkpat' || type === 'kalkavdcontrol' || type === 'kalkavdcontrolmyr' || year === '2016') ||
                  branch === 'silv' && (type === 'pat') ||
                  branch === 'hajk' && (type === 'pat') ||
                  branch === 'bjorn' && (type === 'pat' || type === 'kalkpat' || type === 'kalkavdcontrol' || type === 'kalkavdcontrolmyr' || type === 'avd')) && !compact ?
                  <thead>
                    <SumOfPoints {...{ headers, sums }} />
                    <AverageScore {...{ headers, sums, contestants }} />
                    <AverageScoreOfTotal {...{ headers, sums, total }} />
                    <DiffFirstAndSecond {...{ headers, firstAndSecond }} />
                    <AverageAgainstTheWinner {...{ headers, sums, firstAndSecond, contestants }} />
                    <DiffFirstAndSecondAgainstControl {...{ headers, sums, firstAndSecond }} />
                    <DiffFirstAndSecondAgainstTotal {...{ headers, firstAndSecond, total }} />
                  </thead> : <></>}
              <TableHeaders {...{ pointHeaders, headers, sortOn, setSortOn, compact }} />

              <TableBody contestants={contestants} headers={headers} compact={compact} />
            </table>
          </div>
        </div>

        <div style={{ margin: '12px', display: 'flex', gap: '3px', flexDirection: 'column' }}>
          <span>Detta är en sida gjord av sakparen av: <a href="https://www.snabbfot.org" style={{ display: 'flex', gap: '3px', color: "#a74300", textDecoration: 'underline' }}>
            <img alt="Loggotyp" src="/fot.svg" height='20px' /> snabbfot.org
          </a>
          </span>
          <span>Om du har funderingar kring hur denna sida fungerar så ligger koden uppe på <a style={{ color: "#a74300", textDecoration: 'underline' }} href='https://github.com/rubine/scouternasdag'>GitHub</a> </span>
        </div>
      </div>
    )
  } return <div style={{ marginTop: "24px" }}> <Header {...{ branches, setBranch, maxMinYears, setYear, branch, year, type, setType, info, idToName, years, router, types, dimensions, compact, setCompact, showNav: true, setShowNav }} />
  </div>
}
