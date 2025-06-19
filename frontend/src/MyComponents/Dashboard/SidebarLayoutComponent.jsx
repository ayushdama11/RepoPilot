
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebarComponent from './AppSidebarComponent'

import { UserButton } from "@clerk/clerk-react";

import PropTypes from "prop-types";



const SidebarLayoutComponent=({children})=>{
    
    return(
        <SidebarProvider>
            <AppSidebarComponent/>

            <main className='w-full m-2'>
                <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-1 p-4'>
                    {/* <SearchBarComponent/> */}

                    <div className="ml-auto"></div>
                    <UserButton/>
                </div>
                <div className="h-4"></div>
                {/* main content */}
        <div className='.border-sidebar-border bg-sidebar border shadow rounded-mg overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
            {children}
        </div>
            </main>
        </SidebarProvider>
    )
};

SidebarLayoutComponent.propTypes={
    children: PropTypes.node.isRequired,
}

export default SidebarLayoutComponent;