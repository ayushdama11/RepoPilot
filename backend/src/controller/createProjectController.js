
import { getAuth,clerkClient } from '@clerk/express';
import prisma from '../prismaClient.js';

export const createProjectController=async (req,res)=>{
    const {projectName,repoUrl,githubToken,creditNeeded}=req.body;
    const {userId}=getAuth(req);
    console.log('create',userId);
    

  
    // res.json({user});
    const project=await prisma.project.create({
        data:{
          name:projectName,
          githubUrl:repoUrl,
          userToProjects:{
            create:{
                user:{connect:{clerkId:userId}}
            }
          }
        }
    });

    const userUpdated=await prisma.user.update({
      where:{clerkId:userId},data:{
        credits:{decrement:creditNeeded}
      }
    })
    return res.status(200).json({ project })
    
}


