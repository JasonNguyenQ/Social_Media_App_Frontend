import { useReducer } from 'react'

export function useToggle(initialValue: boolean): [boolean, ()=>void]{
    const [ toggle, setToggle ] = useReducer((state)=>!state, initialValue)
    return [ toggle, setToggle ]
}