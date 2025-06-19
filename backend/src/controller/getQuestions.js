import prisma from "../prismaClient.js"

export const getQuestions=async (req,res)=>{
    const {projectId}=req.params

    try{
        const questions=await prisma.question.findMany(
            {
                where: {projectId:projectId},
                include:{user:true},
                orderBy:{createdAt:'desc'}
            }
            
        );
    
        return res.status(200).json({message:"List of questions and Answers.",questions});
    }
catch(error){
    console.error(error);
    res.status(500).json({ error: "getQuestion Route", details: error.message });
}
   
}