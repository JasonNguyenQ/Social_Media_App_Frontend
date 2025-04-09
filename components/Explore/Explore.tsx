import { Helmet } from 'react-helmet-async';
import Navbar from '../Navbar/Navbar';
import { Link } from "react-router-dom"
import { APP_NAME } from '../../constants/globals'
import Right_Arrow_Icon from "/right_arrow_icon.svg"
import New_Tab_Icon from "/new_tab_icon.svg"
import Post from './Post.tsx'
import "./Explore.css"

export default function Explore(){

    return (
        <div id="explore-page">
            <Helmet>
                <title>Explore | {APP_NAME}</title>
                <meta name='description' content='Explore a Wide Variety of User Created Content' />
            </Helmet>
            <Navbar/>
            <div className="explore-container">
                <ul className="actions">
                    <li>
                        Filters
                        <img src={Right_Arrow_Icon}/>
                        <div className="filters">
                            Placeholder
                        </div>
                    </li>
                    <li>
                        <Link to={""} target='_blank'>
                            How it works
                            <img src={New_Tab_Icon}/>
                        </Link>
                    </li>
                    <li>
                        <Link to={""} target='_blank'>
                            Rules and Regulations
                            <img src={New_Tab_Icon}/>
                        </Link>
                    </li>
                    <li>
                        <Link to={""} target='_blank'>
                            Report
                            <img src={New_Tab_Icon}/>
                        </Link>
                    </li>
                </ul>
                <div className="content-container">
                <Post PostInfo={{
                    title: "First Post of the Website", 
                    from: "Owner", 
                    caption: "Hello, this is the first post of the website."}}/>

                <Post PostInfo={{
                    title: "Testing 1 2 3", 
                    from: "Tester", 
                    caption: "This is a test."}}/>
                
                <Post PostInfo={{
                title: "...", 
                from: "...", 
                caption: "..."}}/>
                </div>
                <div>Placeholder</div>
            </div>
        </div>
    )
}