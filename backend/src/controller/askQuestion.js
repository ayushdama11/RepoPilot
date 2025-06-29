import prisma from "../prismaClient.js";

export const askQuestion = async (req, res) => {
    try {
        const { vectorQuery } = req.body;
        const projectId = req.params.projectId;

        if (!Array.isArray(vectorQuery)) {
            return res.status(400).json({ message: "Invalid vector format. Expected an array." });
        }

        // First, try to find relevant files using vector similarity
        let result = await prisma.$queryRawUnsafe(`
            SELECT "fileName", "sourceCode", "summary",
            1 - ("summaryEmbedding" <=> $1::vector) AS similarity
            FROM "SourceCodeEmbedding"
            WHERE "projectId" = $2
            ORDER BY similarity DESC
            LIMIT 10;
        `, JSON.stringify(vectorQuery), projectId);

        // If we don't have enough relevant results, provide some general context
        if (!result || result.length < 3) {
            // Get some general files from the project for context
            const generalContext = await prisma.$queryRawUnsafe(`
                SELECT "fileName", "sourceCode", "summary"
                FROM "SourceCodeEmbedding"
                WHERE "projectId" = $1
                ORDER BY "fileName" ASC
                LIMIT 5;
            `, projectId);

            // Combine results if we have both
            if (result && result.length > 0) {
                result = [...result, ...generalContext.slice(0, 5 - result.length)];
            } else {
                result = generalContext;
            }
        }

        // Add project metadata for better context
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { name: true, githubUrl: true }
        });

        return res.json({ 
            message: "Vector Query match result.", 
            result,
            project: project || null
        });
    } catch (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
