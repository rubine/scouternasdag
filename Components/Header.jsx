import Head from 'next/head'
import NavBar from './NavBar'
export default function Header({ branches, maxMinYears, branch, year, type, info, idToName, years, setType, setYear, setBranch, router, types }) {
  return (
    <>
      <NavBar {...{ branch, branches, maxMinYears, year, years, idToName, setType, setYear, setBranch, router, types, type }} />
      <Head>
        <title>Resultat {idToName[branch]?.toLowerCase()} {year} för {idToName[type]?.toLowerCase()}</title>
        <meta name="description" content="En tävling annornad av Stockholm Scoutdistrikt" />
      </Head>
      <h1 style={{ margin: '12px' }}>Resultat {idToName[branch]?.toLowerCase()} {year} för {idToName[type]?.toLowerCase()}</h1>
      <div style={{ maxWidth: "480px", display: "block", position: type === 'kalkavdpat' || (branch === 'alghornet' && type === 'avd') ?  "inherit": "absolute" , paddingLeft: "18px" }}>
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
        {year === '2022' && branch === 'myrstigen' && <><br/><br/><a style={{ color: "#a74300", textDecoration: 'underline' }} href={'/scouttavlingar/myrstigen/20222/'+type+'#tavlingar'}>Uppdaterat resultat</a></>}
      </div></>
  )
}
