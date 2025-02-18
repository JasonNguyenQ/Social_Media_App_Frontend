import { useState, useCallback } from "react";

export function useDebounce<T>(init: T, interval: number){
    const [ debounce, setDebounce ] = useState<T>(init)

    type Setter = (value: T) => void
    
    let timer: NodeJS.Timeout;
    const debounceSetter: Setter = useCallback(function(value: T){
        clearTimeout(timer)
        timer = setTimeout(()=>{
            setDebounce(()=>value)
        }, interval)
    }, [interval])
    
    const returnedValues: [v: T, fn: Setter] = [ debounce , debounceSetter ]
    return returnedValues
} 