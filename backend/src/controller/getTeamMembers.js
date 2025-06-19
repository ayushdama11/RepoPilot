import prisma from "../prismaClient.js";

export const getTeamMembers=async (req,res)=>{
    const {projectId}=req.params;
try {
    const result=await prisma.userToProject.findMany({where:{projectId:projectId},include:{user:true}});
    console.log("Result: ",result);
    
    return res.status(200).json({message:"Team members are fetched.",result});
} catch (error) {
    console.error(error);
    return res.status(500).json({message:"Error fetching team Members"});
}
  
}