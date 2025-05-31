import Filled_Delete_Icon from "/filled_delete_icon.svg"
import { forwardRef } from "react"
import "./Menu.css"

const ActionMenu = 
forwardRef<HTMLDivElement, {ActionHandler: Function}>((
    {ActionHandler}, ref
) =>
{
    return(
        <div id="action-menu" className="menu" ref={ref} style={{display: "none"}}>
            <img 
                src={Filled_Delete_Icon} 
                alt="Delete"
                onClick={()=>{ActionHandler("Delete")}}
            />
        </div>
    )
})

export default ActionMenu