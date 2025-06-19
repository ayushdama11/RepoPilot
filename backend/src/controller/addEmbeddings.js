import prisma from "../prismaClient.js"


export const addEmbeddings=async (req,res)=>{
    const {embeddings}=req.body
    if(!Array.isArray(embeddings) || embeddings.length === 0){
        return res.status(400).json({error:"Invalid allEmbeddings data"});
    }

    try{
        console.log("Inser");
        
        const createdEmbeddings=await prisma.sourceCodeEmbedding.createMany({
            data:embeddings.map(({summary,sourceCode,fileName,projectId})=>({
                summary,
                sourceCode,
                fileName,
                projectId
            })),
            skipDuplicates:true
           })

           // because createMany do not return ids 
           const insertedEmbeddings=await prisma.sourceCodeEmbedding.findMany({
            where:{
                fileName:{
                    in: embeddings.map((e)=> e.fileName),
                },
            },
            select:{id:true,fileName:true},
           })
        
           // adding vector embeddings through raw sql query because prisma do not have option for inserting vector
           for(const inserted of insertedEmbeddings){
            const embeddingData=embeddings.find((e)=>e.fileName===inserted.fileName);
console.log("Inserting ",embeddingData.embedding,"manual query in addEmbeddings");

            if(embeddingData && embeddingData.embedding){
                await prisma.$executeRaw`
                UPDATE "SourceCodeEmbedding"
                SET "summaryEmbedding"=${embeddingData.embeding}::vector
                WHERE "id" =${inserted.id}`;
                
            }
           }

           return res.json({msg:"embeddings added sucessfully",createdEmbeddings});
    }
    catch(error){
        console.error("Error adding commits:", error);
        res.status(500).json({error:"Internal Server Error"});
    }
   
}