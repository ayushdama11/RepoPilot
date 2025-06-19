import prisma from "../prismaClient.js";

export const askQuestion = async (req, res) => {
    try {
        const { vectorQuery } = req.body;
        const projectId = req.params.projectId;

        if (!Array.isArray(vectorQuery)) {
            return res.status(400).json({ message: "Invalid vector format. Expected an array." });
        }

        // const result = await prisma.$queryRawUnsafe(`
        //     SELECT "fileName", "sourceCode", "summary",
        //     1 - ("summaryEmbedding" <=> $1::vector) AS similarity
        //     FROM "SourceCodeEmbedding"
        //     WHERE 1 - ("summaryEmbedding" <=> $1::vector) > 0.5
        //     AND "projectId" = $2
        //     ORDER BY similarity DESC
        //     LIMIT 10;
        // `, JSON.stringify(vectorQuery), projectId);
        
        const result = await prisma.$queryRawUnsafe(`
            SELECT "fileName", "sourceCode", "summary",
            1 - ("summaryEmbedding" <=> $1::vector) AS similarity
            FROM "SourceCodeEmbedding"
            WHERE "projectId" = $2
            ORDER BY similarity DESC
            LIMIT 10;
        `, JSON.stringify(vectorQuery), projectId);
        

//         const result = await prisma.$queryRaw`
//     SELECT "fileName", "sourceCode", "summary",
//     1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
//     FROM "SourceCodeEmbedding"
//     WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
//     AND "projectId" = ${projectId}
//     ORDER BY similarity DESC
//     LIMIT 10;
// `;

return res.json({ message: "Vector Query match result.", result });
    } catch (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
