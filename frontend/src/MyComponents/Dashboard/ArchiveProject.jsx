import { Button } from "@/components/ui/button";
import { useState } from "react";
import useProject from "@/hooks/use-project";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, LoaderPinwheel } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";



const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

const ArchiveProject = () => {
    const { selectedProject } = useProject();
    const { getToken } = useAuth();
    const [isArchiving, setIsArchiving] = useState(false); 
    const queryClient=useQueryClient();

    const archive = async () => {
        try {
            setIsArchiving(true); 
            const token = await getToken();

            const response = await axios.put(
                `${API_BASEURL}/archiveproject/${selectedProject.id}`,
                {}, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {

                toast.success("Project archived successfully!");
                await queryClient.invalidateQueries({queryKey:['projects']});
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to archive project!");
        } finally {
            setIsArchiving(false); 
        }
    };

    return (
        <Button 
            size="sm" 
            variant="destructive" 
            onClick={async () => {
                const confirm = window.confirm("Are you sure you want to archive this project?");
                if (confirm) await archive();
            }} 
            disabled={isArchiving} 
        >
          Archive
        </Button>
    );
};

export default ArchiveProject;
