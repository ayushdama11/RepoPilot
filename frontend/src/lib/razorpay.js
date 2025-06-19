
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;
export const handlePayment=async(price,credits,getToken)=>{
    try{

        const response=await axios.post(`${API_BASEURL}/payment/createorder`,{
            amount:price,
            currency: 'USD',
        });
        const {id:order_id,amount,currency}=response.data;

        const options={
            key: import.meta.env.VITE_RAZORPAY_KEYID,
            amount:amount,
            currency:currency,
            name:"Repo-Pilot",
            description:"Test Transaction",
            order_id:order_id,
            handler: async (response)=>{
                // console.log("razorpay response: ",response);
                // fnction which increments in db 
                try {
                    const token=await getToken();
                    const call = await axios.post(
                        `${API_BASEURL}/addcredits`,
                        { creditsPurchased: credits },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    // console.log("Credits Added: ", call.data);


                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

                    //redirect to createproject
                } catch (err) {
                    console.error("Error adding credits:", err);
                 
                }
               
            },
            prefill: {
                name: "Your Name",
                email: "your.email@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const paymentObject=new window.Razorpay(options);
        paymentObject.open();

       
    }
    catch(error){
        console.error(error);
        
    }
};