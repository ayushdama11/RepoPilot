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
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, Trash } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { useSelectedProjectContext } from "@/hooks/selectProjectProvider";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

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

    const {projects, refetch} = useProject();
    const queryClient=new QueryClient();
    const { selectedProjectId,setProjectId } = useSelectedProjectContext();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const deleteProject = async (projectId, projectName) => {
      if(window.confirm(`Are you sure you want to permanently delete the project '${projectName}'? This action cannot be undone.`)) {
        try {
          console.log("Deleting project:", projectId, projectName);
          const token = await getToken();
          console.log("Token:", token);
          const response = await fetch(`${import.meta.env.VITE_BACKEND_API_BASEURL}/deleteproject/${projectId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          console.log("Delete response:", response.status, data);
          if (response.ok) {
            toast.success(`Project '${projectName}' deleted!`);
            refetch();
            window.location.reload();
          } else {
            toast.error('Failed to delete project!');
          }
        } catch (err) {
          toast.error('Failed to delete project!');
        }
      }
    };

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
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton asChild>
                        <div className="flex items-center justify-between w-full group cursor-pointer" onClick={() => { setProjectId(project.id); navigate('/dashboard'); }}>
                          <div className={clsx(
                            'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary transition-transform duration-200 group-hover:scale-110 cursor-pointer',{
                              '!bg-primary !text-white' : project.id ===selectedProjectId
                            }
                          )}>
                            {project.name[0]}
                          </div>
                          <span className="flex-1 ml-2">{project.name}</span>
                          <button
                            className="ml-2 p-1 hover:bg-red-100 rounded"
                            onClick={e => { e.stopPropagation(); deleteProject(project.id, project.name); }}
                            title="Delete project"
                          >
                            <Trash size={16} className="text-red-500" />
                          </button>
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
