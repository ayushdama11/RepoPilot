import { useAuth, useUser } from "@clerk/clerk-react"
import axios from "axios"
import { useEffect, useState } from "react"
import { Navigate, redirect } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

const SyncUser=()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get("redirect_url") || "/dashboard";
    const [status,setStatus]=useState('syncing user data')
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // console.log('redirected by signin');
    
    const {isSignedIn,user}=useUser();
    // const {userId}=useAuth();    
    const userId=user.id;
    console.log("user id: ",userId);
    

    const { getToken } = useAuth();

    
    
    useEffect(()=>{
        if(isSignedIn && user){
            const syncUser=async()=>{
                setLoading(true);
                setError(null);
                const source = axios.CancelToken.source();
                const timeout = setTimeout(() => source.cancel("Request timed out"), 10000);
                try{
                    console.log('Syncing user:', {
                        userId: user.id,
                        emailAddress: user.emailAddresses[0]?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageUrl: user.imageUrl
                    });
                    await axios.post(`${API_BASEURL}/sync-user`,{
                        userId:user.id,
                        emailAddress:user.emailAddresses[0]?.emailAddress,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        imageUrl:user.imageUrl
                    },
                    {
                        headers:{
                            "Content-Type":"application/json"
                        },
                        cancelToken: source.token
                    }
                );
                    clearTimeout(timeout);
                    setLoading(false);
                    navigate(redirectUrl, { replace: true });
                }
                catch(error){
                    clearTimeout(timeout);
                    setLoading(false);
                    setError(error.message || "Failed to sync user");
                }
            };
            syncUser();
        }
        else{
            setStatus('Not signed in. Redirecting to sign-in...');
            setLoading(false);
            navigate('/signin');
        }
    },[isSignedIn,user]);

    if (loading) return <div>Syncing user data...</div>;
    if (error) return <div>Error: {error} <button onClick={() => window.location.reload()}>Retry</button></div>;
    return <div>{status}</div>
};

export default SyncUser;