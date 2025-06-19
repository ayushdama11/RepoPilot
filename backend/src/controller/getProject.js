import prisma from "../prismaClient.js";

export const getProjectController=async (req,res)=>{
    
    try{
        const {projectId}=req.params;
        const project=await prisma.project.findUnique({
            where:{
                id:projectId
            }
        });

        return res.status(200).json({project:project});

}
catch(error){
    console.error("Error fetching project: ",error);
    return res.status(500).json({message:"Internal Server Error"});
}

}