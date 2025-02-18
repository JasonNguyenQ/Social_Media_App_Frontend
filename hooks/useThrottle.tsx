import { useState, useRef, useCallback } from 'react'

export function useThrottle<T>(init: T, interval: number){
    const [ throttledValue, setThrottle ] = useState<T>(init)
    let { current : lastCall } = useRef(0)

    type Setter = (value: T, cb? : Function) => void
    
    let timer: NodeJS.Timeout;
    const throttleSetter: Setter = useCallback(function(value: T, cb : Function = ()=>{}){
        clearTimeout(timer)
        if(Date.now()-lastCall >= interval){
            setThrottle(()=>value)
            cb()
            lastCall = Date.now()
        }
        timer = setTimeout(()=>{
            setThrottle(()=>value)
            cb()
            lastCall = Date.now()
        }, interval)
    }, [lastCall])
    
    const returnedValues: [v: T, fn: Setter] = [ throttledValue , throttleSetter ]
    return returnedValues
} 