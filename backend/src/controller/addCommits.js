import prisma from "../prismaClient.js";


export const addCommitsController= async (req,res)=>{
    try{
        const {commits}=req.body;
        if(!Array.isArray(commits) || commits.length === 0){
            return res.status(400).json({error:"Invalid commits data"});
        }

        const createdCommits=await prisma.commit.createMany({
            data:commits,
            skipDuplicates:true
        });

        res.json({message:"Commits added successfully", createdCommits});
    }
    catch(error){
        console.error("Error adding commits:", error);
        res.status(500).json({error:"Internal Server Error"});
    }

}