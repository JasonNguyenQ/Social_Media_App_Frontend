import Love_Icon from "/love_icon.svg"
import Like_Icon from "/like_icon.svg"
import Filled_Love_Icon from "/filled_love_icon.svg"
import Filled_Like_Icon from "/filled_like_icon.svg"
import { forwardRef } from "react"
import "./Menu.css"

const ReactionMenu = 
forwardRef<HTMLDivElement, {LikeStatus: boolean, LoveStatus: boolean, ReactionHandler: Function}>((
    {LikeStatus, LoveStatus, ReactionHandler}, ref
) =>
{
    return(
        <div id="reaction-menu" className="menu" ref={ref} style={{display: "none"}}>
            <img 
                src={
                    LikeStatus ? 
                    Filled_Like_Icon : Like_Icon
                } 
                alt="Like"
                onClick={()=>{ReactionHandler("Like")}}
            />
            <img 
                src={
                    LoveStatus ? 
                    Filled_Love_Icon : Love_Icon
                } 
                alt="Love"
                onClick={()=>{ReactionHandler("Love")}}
            />
        </div>
    )
})

export default ReactionMenu