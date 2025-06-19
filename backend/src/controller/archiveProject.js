import prisma from "../prismaClient.js"


export const archiveProject=async (req,res)=>{
const {projectId}=req.params;

try{
    const result=await prisma.project.update({
        where:{id:projectId}, data:{deletedAt: new Date()}
    });


    return res.status(200).json({message:"Project Archived Succesfully!",result})
}
catch(error){
    console.error(error);
    return res.status(500).send("Error in Archive project!");
}
   
}