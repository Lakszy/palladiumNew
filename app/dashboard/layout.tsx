import NavBar from "@/components/navbar";
import { TabsDemo } from "@/components/sidebar";
import { ReactNode } from "react"

const DashboardLayout = ({ children } : {children : ReactNode}) => {
    return(
        <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
            <TabsDemo />
            <div className="body text-black  overflow-y-scroll ">
                <div className="sticky z-50 mainT top-0 bg-gray-800 overflow-auto">
                    <NavBar />
                </div>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout;