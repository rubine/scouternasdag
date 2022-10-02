import NavButton from "./NavButton"
export default function NavBar({ funk ,branch, branches, maxMinYears, year, years, idToName, setType, setYear, setBranch, router, types, type }) {
    return (
        <>
        {<>
            <hr id="tavlingar" ></hr>
        <div style={{ margin: '12px' }}>
            <h3 style={{ margin: '12px 6px 0 0', display: 'inline' }}>Kalkuleringar:</h3>
                <NavButton
                    activ={funk}
                    value="Funktionärpoäng"
                    onClick={() => {
                        router.push('/funk', undefined, { shallow: true })
                    }}
                />
            <hr />
        </div></>}
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
                )}</div>
            <hr />
            {maxMinYears && <><div style={{ margin: '12px' }}>
                <h3 style={{ margin: '12px 6px 0 0', display: 'inline' }}>År:</h3>
                {maxMinYears.map((buttonYear) => <NavButton
                    key={buttonYear}
                    disabled={!years.find((year) => buttonYear === year)}
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
                <hr />
            </div>
            }
        </>
    )
}