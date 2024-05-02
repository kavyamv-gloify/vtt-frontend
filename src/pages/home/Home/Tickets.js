import React, { useEffect } from 'react'
import SmsIcon from '@mui/icons-material/Sms';
import RecentActorsIcon from '@mui/icons-material/RecentActors';

const TicketContent=()=>{
    return(
        <>
        <div style={{display:"flex", flexDirection:"column", justifyContent:"space-evenly", marginTop:"4vh", position:'relative', borderBottom: "2px solid #c1c1c1",}}>
        <div style={{display:"flex", flexDirection:"row"}}>
          <SmsIcon/>
          <h5 style={{marginLeft:"5vh"}}>I had an issue with the cab quality</h5>
        </div>
        <div style={{display:"flex", flexDirection:"row"}}>
        <div style={{display:"flex", flexDirection:"row", marginLeft:'9vh'}}>
          <RecentActorsIcon/>
          <h5 style={{marginTop:"0.4vh", marginLeft:"2vh"}}>TID2215478</h5>
        </div>
        <div>
         <h5 style={{marginLeft:"8vh", marginTop:"0.5vh", position:"absolute"}}>Sun, Jul, 17, 09:03 PM</h5>
       </div>
        </div>      
      </div>
      
      </>
    )
        
}

export default TicketContent;