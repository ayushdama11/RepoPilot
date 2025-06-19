import useProject from "@/hooks/use-project"
import { useAuth } from "@clerk/clerk-react";
import axios from "axios"
import { useEffect, useState } from "react";


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

const TeamMembers=()=>{
    const {selectedProject}=useProject();
const {getToken}=useAuth();
const [members,setMembers]=useState([]);

    const helper=async()=>{

        const token=await getToken();

        const response=await axios.get(`${API_BASEURL}/teammembers/${selectedProject.id}`,{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
             }
        });

        setMembers(response.data.result);
    }

    useEffect(()=>{
        const fnCaller=async ()=>{
            await helper();
        }
        fnCaller();
    },[selectedProject]);

    return (
        <div className="flex items-center gap-2">
            {members?.map(member=> (
                <img key={member?.id} src={member.user.imageUrl} alt={member.user.firstName} height={30} width={30} className="rounded-full" />
            ))}
        </div>
    )
  
}

export default TeamMembers;