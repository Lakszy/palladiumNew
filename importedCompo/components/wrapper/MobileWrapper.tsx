"use client"
import { ReactNode } from "react"
// import mockup from "assets/img/qrcodes/mockup2.png"

import { styled } from "@mui/material";

const MobileContainer = styled('div')<{bgImage : string}>(({ theme, bgImage }: any) => ({
    width: 400,
    height: 800,
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative', // Added to position the inner content div
    [theme.breakpoints.down('md')]: {
        width: 300,
        height: 600,
    },
    // Styles for the real-time content container
    '#realtime-content': {
        position: 'absolute',
        top: '10%', // Adjust according to your mockup frame
        left: '13%', // Adjust according to your mockup frame
        width: '80%', // Adjust according to your mockup frame
        height: '82%', // Adjust according to your mockup frame
        overflow: 'auto hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for better visibility of content
        borderRadius: '30px', // Optional: to make the corners rounded
        // overflow : 'hidden',
    },
}));

type MobileWrapperProps = {
    children : ReactNode
}
const MobileWrapper = ({ children }: MobileWrapperProps) => {
    return (
        <MobileContainer bgImage="https://www.bing.com/th?id=OIP.6L7shpwxVAIr279rA0B1JQHaE7&w=174&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" >
            <div id="realtime-content" className="">
                {children}
            </div>
        </MobileContainer> 
    )
}


export default MobileWrapper