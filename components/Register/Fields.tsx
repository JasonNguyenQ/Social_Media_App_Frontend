export default function InputField({ name, type, placeholder, label, required=false, autocomplete="on", issues=[] } : { 
    name: string, 
    type: string,
    placeholder?: string,
    label: string,
    required?: boolean,
    autocomplete?: string,
    issues?: Array<string>
}){
    return (
        <div className="input-field">
            <label htmlFor={name}>{label}</label>
            <ul className="issue-container">
                {issues.map((issue, index)=>{
                    return <li className="issue" key={index}>{issue}</li>
                })}
            </ul>
            <input name={name} id={name} type={type} placeholder={placeholder} required={required} autoComplete={autocomplete}></input>
        </div>
    );
}