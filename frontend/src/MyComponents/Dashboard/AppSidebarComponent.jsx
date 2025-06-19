//sidebar on the dashboard

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import clsx from "clsx";
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { useSelectedProjectContext } from "@/hooks/selectProjectProvider";

function AppSidebarComponent() {

   const location=useLocation();
   const { pathname }=location;
  const {open}=useSidebar();
    const items=[
        {title:"Dashboard",
        url:"/dashboard",
        icon: LayoutDashboard,},
        {title:"Q&A",
            url:"/qa",
            icon: Bot,},
            {title:"Meetings",
                url:"/meetings",
                icon: Presentation,},
                {title:"Billing",
                    url:"/billing",
                    icon: CreditCard,},

    ]

    const {projects}=useProject();
    const queryClient=new QueryClient();
    const { selectedProjectId,setProjectId } = useSelectedProjectContext();

   

  return (
    <div>
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <img src='logo.png' alt='logo' width={40} height={40}/>
            {open && (<h1 className="text-x1 font-bold text-primary/80">
              RepoPilot</h1>)}
            
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                {items.map(item=>{
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link to={item.url} className={clsx({
                                    '!bg-primary !text-white': pathname===item.url
                                })}>

                                    <item.icon/>
                                    <span>{item.title}</span>
                                </Link>

                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
                </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              Your Projects
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{
                projects?.map(project=>{
                  return(
                    <SidebarMenuItem key={project.name}>
                      <SidebarMenuButton asChild>
                        <div onClick={() => setProjectId(project.id)}>
                          <div className={clsx(
                            'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',{
                              '!bg-primary !text-white' : project.id ===selectedProjectId
                            }
                          )}>
                            {project.name[0]}

                          </div>
                          <span>{project.name}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
                }

                <div className="h-2"></div>
                {open && (
                    <SidebarMenuItem>
                    <Link to='/create'>
                    <Button size='sm' variant={'outline'} className="w-fit">
                      <Plus/>
                    Create Project
                  </Button>
                    </Link>
                  </SidebarMenuItem>
                )}

                
              
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      
      </Sidebar>
    </div>
  );
}

export default AppSidebarComponent;
