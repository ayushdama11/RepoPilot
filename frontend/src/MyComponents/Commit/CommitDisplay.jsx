import useProject from "@/hooks/use-project";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { pullCommits } from "@/lib/github";


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;
const CommitDisplay=()=>{
    const {getToken}=useAuth(); 
    const {selectedProject}=useProject();
    const [commitsToDisplay,setCommitsToDisplay]=useState([]);

    const getCommits=async ()=>{
        try{
            const token=await getToken();
            const response=await axios.get(`${API_BASEURL}/getCommits/${selectedProject?.id}`,
                {
                    headers:{
                       "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                    }
                }
            )
            const commits=response.data;
            return commits
        }
        catch(error){
            console.log("Error in fetching commits inside commit display",error);
            
        }
        
    }

    useEffect(() => {
        const fetchCommits = async () => {
            
            
            const commits = await getCommits(); 
            
            if (commits) {

                setCommitsToDisplay(commits);
            }
        };
        
        if (selectedProject) {
            fetchCommits();
        }
    }, [selectedProject]);
    
    useEffect(()=>{
        const pullNewCommits=async ()=>{
            const token=await getToken();

            await pullCommits(selectedProject.id,token);   // maybe optimization needed here
        }

        if(selectedProject){
            pullNewCommits()
        }
    },[selectedProject])
    
  
// console.log("Selected Project in commit display: ",selectedProject);
// console.log("commits",commitsToDisplay);


return (
    <>
    <ul className="space-y-6">
 {commitsToDisplay?.map((commit,commitIdx)=>{
    return <li key={commit.id} className="relative flex gap-x-4">
        <div className={clsx(commitIdx===commitsToDisplay.length-1 ? 'h-6' : '-bottom-6','absolute left-0 top-0 flex w-6 justify-center')}>

            <div className="w-px tranlate-x-1 bg-gray-200"></div>

        </div>
        <>
        <img src={commit.commitAuthorAvatar}  alt="commit avatar" className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"/>
        <div className="flex-auto rounded-mg bg-white p-3 ring-1 ring-inset ring-gray-200">
            <div className="flex justify-between gap-x-4">
            <Link target='_blank' to={`${selectedProject?.githubUrl}/commits/${commit.commitHash}`} className="py-0.5 text-xs leading-5 text-gray-500" >
            <span className="font-medium text-gray-900">
                {commit.commitAuthorName}
            </span>{" "}
            <span className="inline-flex items-center">
                commited
                <ExternalLink className="ml-1 size-4" />
                    </span>
                </Link>
            </div>
            <span className="font-semibold">
            {commit.commitMessage}
        </span>
        <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
            {commit.summary}
        </pre>

        </div>
     
        </>
    </li>
 })}
    </ul>
        
    </>
);


}

export default CommitDisplay