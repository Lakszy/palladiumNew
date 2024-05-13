import React from 'react'
import '../app/App.css'
type Props = {}

const FullScreenLoader = (props: Props) => {
    return (
        <div>
            <div className="w-full h-screen bg-[#272315] bg-opacity-50 flex justify-center items-center">
                <div className="loader animate-ping ease-linear rounded-full border-8 border-t-8 h-24 w-24 animate-color-change">

                </div>
            </div>
        </div>
    )
}

export default FullScreenLoader
