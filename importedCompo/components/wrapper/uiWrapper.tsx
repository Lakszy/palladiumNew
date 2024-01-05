import React from 'react'

const UiWrapper = ({children, className}:any) => {
  return (
    <div className={`bg-white border border-[#F0E4E4] rounded-3xl min-h-[80vh] m-4 p-4 ${className}`}>
        {children}
    </div>
  )
}

export default UiWrapper