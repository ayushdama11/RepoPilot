import prisma from "../prismaClient.js"
import { getAuth } from "@clerk/express";

export const getAllProjects=async (req,res)=>{
    const { userId } = getAuth(req);
    // console.log('User ID from Clerk:', userId);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No userId found' });
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId }
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found in the database' });
    }

    const allProjects=await prisma.project.findMany({
        where:{userToProjects:{
            some:{
                userId:user.id
            },
            
        },
        deletedAt: null},
        
    })
    console.log(allProjects);
    
    return res.status(200).json({"projects":allProjects});
}