"use client"
import { styled } from "@mui/material"
// import networkIcon from "assets/img/qrcodes/networkIcon.png"
// import batteryIcon from "assets/img/qrcodes/batteryIcon.png"
import { useEffect, useState } from "react";
import { format } from "date-fns";

const StatusBarContainer = styled('div')<{bgColor ?: string}>(({ theme,bgColor }) => ({
    width: '100%',
    padding: '10px',
    backgroundColor:` ${bgColor}` , // Optional: for better visibility of content
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));
const StatusBar = () => {
    const  [time , setTime] = useState(new Date())
    const [timeSynced , setTimeSynced] = useState(false)
    
    useEffect(() => {
        const gapinNextMinute = 60 - time.getSeconds();
        const duration = timeSynced ? 60*1000 : gapinNextMinute * 1000;

        const interval = setInterval(() => {
            setTime(new Date())
        }, duration);
        setTimeSynced(true)
        return () => clearInterval(interval);
    },[]);
    return(
        <StatusBarContainer bgColor="white">
            <p style={{fontSize : 12, fontWeight: 600}} >{format(time,"hh:mm")}</p>
            <div className="flex gap-2">
                <img src={networkIcon} alt="network" style={{height:15}} />
                <img src={batteryIcon} alt="network" style={{height:15}} />
            </div>
        </StatusBarContainer>
    )
}

export default StatusBar