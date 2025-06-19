
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { handlePayment } from "@/lib/razorpay";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

const Billing=()=>{
const [credits,setCredits]=useState(0);
const [creditsToBuy,setCreditsToBuy]=useState([100]);
const creditsToBuyAmount=creditsToBuy[0]
const price=(creditsToBuyAmount/50).toFixed(2);
// const token=window.localStorage.getItem("authToken");
const {getToken}=useAuth();


   const getCredits=async()=>{
    const token=await getToken();
    const response=await axios.get(`${API_BASEURL}/getcredits`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
        }
    });

setCredits(response.data.credits);

   }

   useEffect(()=>{
    const helper=async ()=>{
        await getCredits();
    }
    helper(); 
},[]);

    return (
        <div>
            <h1 className="text-xl font-semibold">Billing</h1>
            <div className="h-2"></div>
            <p className="text-sm text-gray-500">
                You currently have {credits} credits.
            </p>
            <div className="h-2"></div>
            <div className="bg-blue-50 px-4 py-2 rounded-md border border-blue-200 text-blue-700">
                <div className="gap-2">
                    <Info className="size-4"/>
                    <p className="text-sm">Each credit allows you to index 1 file in a repository.</p>
                </div>
                <p className="text-sm">E.g. If your project has 100 files, you will need 100 credits to index it.</p>
            </div>
            <div className="h-4"></div>
            <Slider defaultValue={[100]} max={1000} min={10} step={10} onValueChange={value=> setCreditsToBuy(value)}  value={creditsToBuy}/>
                <div className="h-4"></div>
                <Button onClick={async ()=>{
                  
                    
                await handlePayment(price,creditsToBuyAmount,getToken);
                }}>Buy {creditsToBuyAmount} credits for ${price}</Button>
        </div>
    )
    // <button onClick={handlePayment}>Pay Now</button>
}

export default Billing ;