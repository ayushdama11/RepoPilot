import { SignedIn,UserButton } from "@clerk/clerk-react";
import AppSidebarComponent from "./AppSidebarComponent";
import SidebarLayoutComponent from './SidebarLayoutComponent'
import DashboardMainContentComponent from "./DashboardMainContentComponent";
function Dashboard(){
    return(
        <div>
            <h1>DashBoard</h1>
            <SidebarLayoutComponent>
                
            </SidebarLayoutComponent>

       

            {/* <AppSidebarComponent/> */}
            {/* <SignedIn>
             <UserButton />
        </SignedIn> */}
        </div>
    )
}

export default Dashboard;