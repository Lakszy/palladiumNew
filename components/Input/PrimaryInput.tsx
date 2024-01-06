'use client';
import { ReactNode } from "react"

interface IPrimaryInput extends React.InputHTMLAttributes<HTMLInputElement>  {
    label ?: string,
    LeftComp ?: ReactNode,
    RightComp ?: ReactNode,
}
const PrimaryInput = ({
    label,
    LeftComp,
    RightComp,
    ...props
}: IPrimaryInput ) => {
    return(
        <div className="flex flex-col">
            {!!label && <label className="text-sm text-gray-600">{label}</label>}
            <div className="flex items-center border border-gray-300 rounded-lg py-2 bg-white ">
                {LeftComp && LeftComp}
                <input
                 className= "block bg-white p-2 border flex-1  "
                 {...props}  />
                {RightComp && RightComp}
            </div>  
        </div>
    )
    
}

export default PrimaryInput