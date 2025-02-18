export default function InputField({ name, type, placeholder, label, required=false, autocomplete="on" } : { 
    name: string, 
    type: string,
    placeholder?: string,
    label: string,
    required?: boolean,
    autocomplete?: string
}){
    return (
        <div className="input-field">
            <label htmlFor={name}>{label}</label>
            <input name={name} id={name} type={type} placeholder={placeholder} required={required} autoComplete={autocomplete}></input>
        </div>
    );
}