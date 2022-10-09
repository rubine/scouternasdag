export default function NavButton({ disabled, activ, onClick, value }) {
    return (

        <button
            disabled={disabled} title={disabled ? 'Året finns tyvärr inte inlaggt här' : 'Klick här för att visa detta år'} style={{
                background: disabled ? "#ddd" : activ ? "#a74300" : "#f8ab67",
                color: activ || disabled ? '#fff' : '#000',
                borderRadius: "3px",
                padding: "0px 6px",
                border: activ || disabled ? '1px solid transparent' : "1px solid #361703",
                margin: "3px",
                height: "32px",
                textDecoration: "none",
                cursor: disabled ? 'inherit' : 'pointer',
            }} onClick={onClick}>
            {value}</button>
    )
}