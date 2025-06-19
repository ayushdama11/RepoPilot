import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useProject from '@/hooks/use-project';
import { pullCommits } from '@/lib/github';
import { checkCredits, indexGithubRepo } from '@/lib/github-Repo-Loader';
import { useAuth } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import {useForm} from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL; 

const CreateProjectComponent=()=>{
    const {register,handleSubmit,reset}=useForm();
    const [creditsBalance,setCreditBalance]=useState(null);
    const [creditNeeded,setCreditNeeded]=useState(null);
    const [hasEnoughCreditsState,setHasEnough]=useState(true);

    // const {projects,fetchAllProjects}=useProject();
    const {isLoading}=useProject();
    const queryClient=useQueryClient();
const {getToken}=useAuth();

        
            const getCredits=async()=>{
                const token=await getToken();
            
                const response=await axios.get(`${API_BASEURL}/getcredits`,{
                   
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    
                    setCreditBalance(response.data.credits);
                }
               
           
                useEffect(()=>{
                    const fetchCreditHelper=async()=>{
                       await getCredits();
                    }

                    fetchCreditHelper();


                },[])


   
 
    
    // useEffect(()=>{
    //     const helper=async()=>{
    //         await fetchCredits();
    //     }
    //     helper();
    // },[]);

    if (isLoading) {
        return <div>Loading projects...</div>;
    }

   

    
    const createProject=async (data)=>{
        try{
            const token=await getToken();
            const response =await axios.post(`${API_BASEURL}/create-project`,{
            projectName:data.projectName,
            repoUrl:data.repoUrl,
            githubToken:data.githubToken,
            creditNeeded: creditNeeded.value
        },
    {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
    });

    // console.log(response);

    
    if(response.status===200){

        // console.log("refetching...");
        
        // await refetch()
        await queryClient.invalidateQueries({queryKey:['projects']});
        toast.success('Project created successfully!');
      
        reset();
        // console.log('fetching and adding commits...');
        await pullCommits(response.data.project.id,getToken);
        await indexGithubRepo(data.repoUrl,data.githubToken,token,response.data.project.id);

    }
    
    // console.log("response: ",JSON.stringify(response.data));

    }
    catch(error){
        if (error.response) {
            console.error("Error response:", error.response.data);
            toast.error('Unable to create project');
          } else if (error.request) {
            console.error("No response received:", error.request);
            toast.error('No response from server');
          } else {
            console.error("Error:", error.message);
            toast.error('An error occurred');
          }
    }
        }


    function onSubmit(data){
        // window.alert(JSON.stringify(data))
      
        if(creditsBalance && creditNeeded){
             createProject(data);
            }
            else{
              
                getCredits();
                const creditNeed=checkCredits(data.repoUrl,data.githubToken);
                setCreditNeeded(creditNeed);
                const hasEnoughCredits= creditsBalance ? creditNeeded<=creditsBalance :true;
                setHasEnough(hasEnoughCredits);
                
            }
            // console.log("Credit Needed:", creditNeeded);
            // console.log("Credits Balance:", creditsBalance);
            // console.log("Has Enough Credits:", hasEnoughCreditsState);

    }

    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            <img src='/undraw_github.svg' className='h-56 w-auto' />
            <div>
                <div>
                    <h1 className='font-semibold text-2xl'>
                        Link your Github Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter the URL of your repository to link it to RepoPilot
                    </p>
                </div>
                <div className="h-4"></div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input {...register('projectName' ,{required:true})}
                        placeholder='Project Name' type='text'/>
                        <div className="h-2"></div>
                        <Input {...register('repoUrl' ,{required:true})}
                        placeholder='Github Repository URL' type='url'/>
                         <div className="h-2"></div>
                        <Input {...register('githubToken')}
                        placeholder='Github Token (Optional)'/>

                        {creditNeeded && (
                            <>
                            <div className='mt-4 bg-orange px-4 py-2 rounded-md border border-orange-200 text-orange-700'>
                                <div className='flex items-center gap-2'>
                                    <Info className='size-4'/>
                                    <p className='text-sm'> You will be charged <strong>{creditNeeded}</strong> credits for this repository.</p>
                                    </div>
                                    <p className='text-sm text-blue-600 ml-6'>You have <strong>{creditsBalance}</strong>credits remaining.</p>
                                    </div></>
                        )}
                        <div className="h-4"></div>

                        <Button type='submit' disabled={createProject.isPending || !hasEnoughCreditsState}>
                            {creditNeeded ? "Create Project":"Check Credits"}
                           
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    )
};


export default CreateProjectComponent;