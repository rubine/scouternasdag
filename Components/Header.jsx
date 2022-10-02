import Head from 'next/head'
import NavBar from './NavBar'
export default function Header({ branches,  maxMinYears, branch, year, type, info, idToName, years, setType, setYear, setBranch, router, types }) {
  return (
    <>
      <h2 style={{ maxWidth: '600px', margin: '12px' }}>Tävlingar i Stockholm Scoutdistrikt</h2>
      <div style={{ maxWidth: '600px', margin: '18px' }}>
        <p>
          Under våen 2022 så höll Stockholm Scoutdistrikt i tävlingen scouternasdag.
          Jag va teveksam till en kontroll som min dåvarande kår höll i.
          När avadelningen som en av baskontrollnterna fick över 50 poäng mer än tvåan, så fick jag idén till att skapa denna sida.
          Jag har givitevis medelat mina misstankar om fusk till destriktstyrelsen, det är dom som kan göra något åt fusk.
          De va inte det minsta intresserade utom lämnade över allt till TOIS som svarade att de inte kunde göra något i efter hand.
          Det va därför jag hade tagit kontakt med styrelsen i första hand det är bara dom som kan utesluta folk/kårer som fuskar från tävlingar enligt regelverket.
        </p>
        <p>
          Nu har jag vidareutveckalat så att man enkelt kan sortera på olika kontroller och gämföra poäng och även få uträkningar för avdelningar på alla nivåer av tävlingar på scouternas dag.
          Jag har även lagt in all data jag kan hitta/orkar för de olika tvälingarna TOIS arrangerar.
          Dock så tycker jag att det är viktigt att persondata inte sprids på nätet så jag har inte lagt upp tävlingar där deltagarna står med deras namn.
        </p>
      </div>
      <NavBar {...{ branch, branches, maxMinYears, year, years, idToName, setType, setYear, setBranch, router, types,type  }} />
      <Head>
        <title>Resultat {idToName[branch]} {year} för {idToName[type]}</title>
        <meta name="description" content="" />
      </Head>
      <h1 style={{ margin: '12px' }}>Resultat {idToName[branch]} {year} för {idToName[type]}</h1>
      <div style={{ maxWidth: "480px", display: "block", position: "absolute", paddingLeft: "18px" }}>
        {type === 'kalkavdpat' && <span><b>Kalkulerad patrull poäng: </b>
          Detta är en kontrllräkning av resultatet för avdelning om "Summan" är fetsilad så tyder det på att jag och tävlingsledningen har räknat olika.
        </span>}
        {type === 'kalkavdcontrol' && <span><b>Kalkulerad kontroller poäng: </b>
          Detta är en kontrllräkning av resultatet för avdelning om "Summan" är fetsilad så tyder det på att jag och tävlingsledningen har räknat olika.
        </span>}
        {type === 'kalkpat' && <span><b>Projicerad poäng för avdelningar: </b>
          Här kan man se hur bra alla avdelningar är om dom skulle ha lika många patruller som den avdelning som har flest antal patruller.
        </span>}
        <span>{info}</span>
      </div></>
  )
}
