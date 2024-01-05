"use client"
import { ReactNode } from "react"
import Card from "../card"
import { PrimaryButton } from "../Button"

type CrudWrapperProps = {
    children ?: ReactNode,
    RightComp ?: ReactNode,
    LeftComp ?: ReactNode,
    btnLabel ?: string,
    onClickBtn ?: () => void,
    isBtnLoading ?: boolean
}

const CrudWrapper= ({
    children,
    RightComp,
    LeftComp,
    btnLabel = "Create",
    onClickBtn = () => {},
    isBtnLoading = false
}: CrudWrapperProps) => {
    return(
        <Card extra="p-4 h-[80vh] overflow-y-hidden text-black">
        <div className="flex  justify-between px-2 text-black">
            <div className="flex flex-1 text-black">
                {LeftComp ? LeftComp : null}
            </div>
                
          <PrimaryButton
            lable={btnLabel}
            onCLick={onClickBtn}
            loadings={isBtnLoading}
          />
        </div>
        {children}
      </Card>
    )
}


export default CrudWrapper