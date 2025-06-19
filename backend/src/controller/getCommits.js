import prisma from "../prismaClient.js";


export const getCommits=async (req,res)=>{

    try{
    const {projectId}=req.params;
    const processedCommits=await prisma.commit.findMany({
        where:{
            projectId:projectId
        }
    });

    // if(processedCommits.length==0){
    //     console.log("inside get commits backend",processedCommits);
        
    //     return res.status(404).json({message:"No commits for the project"});        
    // }

    return res.json(processedCommits);

}
catch(error){
    console.error("Error fetching commits: ",error);
    return res.status(500).json({message:"Internal Server Error"});
    
}
}

