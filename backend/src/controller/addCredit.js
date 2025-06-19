import { getAuth } from "@clerk/express"
import prisma from "../prismaClient.js";


export const addCredit=async(req,res)=>{
    const {creditsPurchased}=req.body

    const {userId}=getAuth(req);
    console.log(userId);
    

    // if(!userId || !creditsPurchased) return res.status(400).json({error:"Missing userId or credits"});

    const result=await prisma.razorpayTransactions.create({data:{userId,credits:creditsPurchased}});
    const updatedResult=await prisma.user.update({
        where:{clerkId:userId},data:{
            credits:{increment:creditsPurchased}
        }
    })
    return res.status(200).json({message:"Credits Added successfully",result});
}