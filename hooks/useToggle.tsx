import { useThrottle } from './useThrottle'

export function useToggle(initialValue: boolean, interval: number = 0): [boolean, ()=>void]{
    const [ toggle, setState ] = useThrottle(initialValue, interval)

    function setToggle(): void {
        setState(!toggle)
    }

    return [ toggle, setToggle ]
}