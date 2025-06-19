import prisma from "../prismaClient.js";


const syncUser=async (req,res)=>{
    const {userId,emailAddress,firstName,lastName,imageUrl}=req.body;

    try{
        const existingUser=await prisma.user.findUnique({where: {clerkId:userId}});

        if(existingUser){
            await prisma.user.update({
                where:{clerkId:userId},
                data:{emailAddress,firstName,lastName,imageUrl},
            });
            
      console.log(`User updated via sync: ${userId}`);
        }
        else{
            await prisma.user.create({
                data:{clerkId:userId,emailAddress,firstName,lastName,imageUrl},
            });

            console.log(`User created via sync: ${userId}`);
        }

        res.status(200).json({message:'User Synced Successfully'});
    }

    catch(error){
        console.error('Error Syncing user: ',error);
        res.status(500).json({error:'failed to sync user'});
    }
}

export default syncUser;