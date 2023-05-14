import { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import NavBar from './NavBar'
export default function Header({ branches, maxMinYears, branch, year, type, info, idToName, years, setType, setYear, setBranch, router, types, dimensions, compact, setCompact, showNav, setShowNav, header, showStatInfo, showCompact= true }) {
  
  const [showInfo, setShowInfo] = useState(showStatInfo)
  return (
    <>
      <Head>
        <title>Resultat {idToName[branch]?.toLowerCase()} {year} för {idToName[type]?.toLowerCase()}</title>
        <meta name="description" content="En tävling annornad av Stockholm Scoutdistrikt" />
      </Head>
      <button style={{
                background: "#f8ab67",
                color:  '#000',
                borderRadius: "3px",
                padding: "0px 6px",
                border:  "1px solid #361703",
                margin: "3px",
                height: "32px",
                textDecoration: "none",
                cursor: 'pointer',
            }}  onClick={()=>{setShowNav(!showNav)}}>{!showNav ? 'Fler tävlingar' : 'Gömm lista med fler tävlingar'}</button>
      {showNav ? 
      <NavBar {...{ branch, branches, maxMinYears, year, years, idToName, setType, setYear, setBranch, router, types, type }} /> : ''}
      <h1 style={{ margin: '12px' }}>{header ? header : <>Resultat {idToName[branch]?.toLowerCase()} {year} för {idToName[type]?.toLowerCase()} <span style={{ cursor: 'pointer' }} onClick={() => setShowInfo(!showInfo)} >ⓘ</span> </>}</h1>
      {showInfo && <div style={{ maxWidth: '600px', margin: '18px' }}>
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
        </div>}
      <div style={{ maxWidth: "480px", display: "block", marginTop: '18px', zIndex:'100',
      position: (dimensions && dimensions.width > 1000) ? type === 'kalkavdpat' || (branch === 'alghornet' && type === 'avd')  || compact ?  "inherit": "absolute": 'inherit' , 
      paddingLeft: "18px" }}>
        {type === 'kalkavdpat' && <span><b>Kalkylerad patrull: </b>
          Detta är en kontrollräkning av resultatet för avdelning om "Summan" är fetstilade så tyder det på att jag och tävlingsledningen har räknat olika.
        </span>}
        {type === 'kalkavdcontrol' && <span><b>Kalkylerad kontroller: </b>
          Detta är en kontrollräkning av resultatet för avdelning om "Summan" är fetstilade så tyder det på att jag och tävlingsledningen har räknat olika.
          Här är räknara jag med de tre bästa patrullerna per avdelning. Ibland används denna metod men oftast på älghornet.
        </span>}
        {type === 'kalkpat' && <span><b>Projicerad poäng för avdelningar: </b>
          Här kan man se hur bra alla avdelningar är om dom skulle ha lika många patruller som den avdelning som har flest antal patruller.
        </span>}
        {type === 'kalkavdcontrolmyr' && <span><b>Kalkylerad kontroller max: </b>
          Detta är en kontrollräkning av resultatet för avdelning om "Summan" är fetstilade så tyder det på att jag och tävlingsledningen har räknat olika.
          Här är räknara jag med den bästa patrullen på varje kontroll. Ibland används denna metod men oftast på myrstigen.
        </span>}
        <span>{info}</span>
        {year === '2022' && branch === 'myrstigen' && <><br/><br/><Link href={'/scouttavlingar/myrstigen/20222/'+type+'#tavlingar'}>Uppdaterat resultat</Link></>}
      <br ></br>
      {showCompact && <label style={{ marginTop: '12px', display:'block' }}><input type='checkbox' onChange={()=>{setCompact(!compact)}} checked={compact} />Visa kompakt tabell</label>}
      </div>
      
      </>
  )
}
