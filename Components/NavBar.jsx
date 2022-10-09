import NavButton from "./NavButton"
export default function NavBar({ funk, branch, branches, maxMinYears, year, years, idToName, setType, setYear, setBranch, router, types, type }) {
    return (
        <>
            <hr id="tavlingar" />
            <div style={{ margin: '12px' }}>
                <h3 style={{ margin: '12px 6px 0 0', display: 'inline' }}>Tävlingar:</h3>
                {branches && branches.map((buttonBranch) => <NavButton
                    key={buttonBranch}
                    activ={buttonBranch === branch}
                    value={idToName[buttonBranch]}
                    onClick={() => {
                        router.push('/scouttavlingar/' + buttonBranch + '/' + year + (type ? '/' + (buttonBranch === 'silv' ? 'pat' : (buttonBranch === 'myrstigen' ? 'avd' : type)) : '') + '#tavlingar', undefined, { shallow: true })
                        setBranch(buttonBranch)
                    }}
                />
                )}
                <h3 style={{ margin: '12px 6px 0 12px', display: 'inline' }}>Statistik:</h3>
                <NavButton
                    activ={funk}
                    value="Funktionärpoäng"
                    onClick={() => {
                        router.push('/scouttavlingar/funk', undefined, { shallow: true })
                    }}
                />
            </div>
            <hr />
            {maxMinYears && <><div style={{ margin: '12px' }}>
                <h3 style={{ margin: '12px 6px 0 0', display: 'inline' }}>År:</h3>
                {maxMinYears.map((buttonYear) => <NavButton
                    key={buttonYear}
                    disabled={years && !years.find((year) => buttonYear === year)}
                    activ={Number(buttonYear) === Number(year)}
                    value={buttonYear}
                    onClick={() => {
                        router.push('/scouttavlingar/' + branch + '/' + buttonYear + '/' + type + '#tavlingar', undefined, { shallow: true })
                        setYear(buttonYear)
                    }}
                />
                )}</div>
                <hr /></>}
            {(branch === 'alghornet' || branch === 'bjorn' || branch === 'myrstigen') &&
                <>
                    <div style={{ margin: '12px' }}>
                        <h3 style={{ margin: '12px 6px 0 0', display: 'inline' }}>Enhet:</h3>
                        {types && types.map((buttonType) => (
                            <NavButton
                                key={buttonType}
                                activ={buttonType === type}
                                value={idToName[buttonType]}
                                onClick={() => {
                                    router.push('/scouttavlingar/' + branch + '/' + year + '/' + buttonType + '#tavlingar', undefined, { shallow: true })
                                    setType(buttonType)
                                }}
                            />))
                        }
                    </div>
                    <hr /></>
            }
            <div style={{ margin: '12px', display: 'flex', gap: '3px' }}>
                <span>Detta är en sida gjord av sakparen av:</span><a href="https://www.snabbfot.org" style={{ display: 'flex', gap: '3px', color: "#a74300", textDecoration: 'underline' }}> <img alt="Loggotyp" src="/fot.svg" height='20px' /> snabbfot.org</a>
                <span>Om du har funderingar kring hur denna sida fungerar så ligger koden uppe på <a style={{ color: "#a74300", textDecoration: 'underline' }} href='https://github.com/rubine/scouternasdag'>GitHub</a> </span>
            </div>
            <hr />
        </>
    )
}