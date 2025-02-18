import { Helmet } from 'react-helmet-async';
import Navbar from '../Navbar/Navbar';
import { APP_NAME } from '../../constants/globals'
import { useEffect, useState } from 'react';
import { useThrottle } from '../../hooks/useThrottle';

export default function Explore(){
    const INTERVAL = 200
    const [ position, setPosition ] = useThrottle<[number,number]>([0,0],INTERVAL)
    const [ renders, setRenders ] = useState<number>(0)

    useEffect(()=>{
        const fn = (e: MouseEvent)=>{
            setPosition([e.clientX,e.clientY], ()=>{setRenders((r)=>r+1)})
        }
        window.addEventListener('mousemove', fn)
        return ()=>{
            window.removeEventListener('mousemove', fn)
        }
    },[])

    return (
        <>
            <Helmet>
                <title>Explore | {APP_NAME}</title>
                <meta name='description' content='Explore a Wide Variety of User Created Content' />
            </Helmet>
            <Navbar/>
            <p>The useThrottle hook only allows one event to fire within a certain time frame to prevent tons of rerenders from happening due to an event firing multiple times in rapid succession such as the mousemove event</p>
            <p>Current Interval: {INTERVAL/1000}s</p>
            <div>Position: {position[0]}, {position[1]}</div>
            <div>Number of Rerenders: {renders}</div>
        </>
    )
}