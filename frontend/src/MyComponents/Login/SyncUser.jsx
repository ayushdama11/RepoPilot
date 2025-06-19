
import { useAuth, useUser } from "@clerk/clerk-react"
import axios from "axios"
import { useEffect, useState } from "react"
import { Navigate, redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

const SyncUser=()=>{
    const navigate = useNavigate();
    const [status,setStatus]=useState('syncing user data')
    // console.log('redirected by signin');
    
    const {isSignedIn,user}=useUser();
    // const {userId}=useAuth();    
    const userId=user.id;
    console.log("user id: ",userId);
    

    const { getToken } = useAuth();

    
    
    useEffect(()=>{
        if(isSignedIn && user){
            const syncUser=async()=>{
                try{
                    // const token= await getToken();
                    await axios.post(`${API_BASEURL}/sync-user`,{
                        userId:userId,
                        emailAddress:user.emailAddresses[0]?.emailAddress,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        imageUrl:user.imageUrl
                    },
                    {
                        headers:{
                            "Content-Type":"application/json"
                         }
                    }
                );
                
                   
                   navigate('/dashboard');

                  
                }
                catch(error){
                    console.error('Error Syncing user: ',error);
                    setStatus(`Error: ${error.message}`);
                }
            };

            syncUser();
            
        }
        else{
            setStatus('Not signed in. Redirecting to sign-in...');
            navigate('/signin');
        }


  },[isSignedIn,user]);

  return <div>{status}</div>
};

export default SyncUser;