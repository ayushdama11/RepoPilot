import {razorpayInstance} from "./razorpayInstance.js";


export const paymentController=async(req,res)=>{
    const {amount,currency}=req.body;

    try{
        const options={
            amount:amount*100,
            currency: currency || 'USD'
        };
        const order=await razorpayInstance.orders.create(options);
        console.log(order);
        
        res.status(200).json(order);
        
    }
    catch(error){
        console.error(error);
        res.status(500).send('Error creating RazorPay order');
    };
    
}