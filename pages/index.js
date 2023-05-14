import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Header from "../Components/Header"


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
  return (
    <div style={{ padding: '12px' }}>
      <div style={{ minHeight: '100vh' }}>
        <Header {...{ branches, setBranch, maxMinYears, setYear, branch, year, type, setType, info, idToName, years, router, types, dimensions, compact, setCompact, showNav: true, setShowNav, showStatInfo: true, header: 'Tävlingar i Stockholm Scoutdistrikt', showCompact: false }} />
      </div>

      <div style={{ margin: '12px', display: 'flex', gap: '3px', flexDirection: 'column' }}>
        <span style={{ display: 'flex' }}>Detta är en sida gjord av sakparen av: <a href="https://www.snabbfot.org" style={{ display: 'flex', gap: '3px', color: "#a74300", textDecoration: 'underline' }}>
          <img alt="Loggotyp" src="/fot.svg" height='20px' /> snabbfot.org
        </a>
        </span>
        <span>Om du har funderingar kring hur denna sida fungerar så ligger koden uppe på <a style={{ color: "#a74300", textDecoration: 'underline' }} href='https://github.com/rubine/scouternasdag'>GitHub</a> </span>
      </div>
    </div>
  )
}
