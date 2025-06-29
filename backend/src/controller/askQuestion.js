import prisma from "../prismaClient.js";

export const askQuestion = async (req, res) => {
    try {
        const { question, projectId } = req.body;

        if (!question || !projectId) {
            return res.status(400).json({ error: "Question and projectId are required" });
        }

        const embeddings = await prisma.embedding.findMany({
            where: { projectId: projectId }
        });

        if (embeddings.length === 0) {
            return res.status(404).json({ error: "No embeddings found for this project" });
        }

        const questionEmbedding = await generateEmbedding(question);
        
        const similarEmbeddings = findSimilarEmbeddings(questionEmbedding, embeddings, 5);
        
        const context = similarEmbeddings.map(emb => emb.content).join('\n\n');
        
        const answer = await generateAnswer(question, context);

        res.json({ answer, context: similarEmbeddings });
    } catch (error) {
        console.error("Error asking question:", error);
        res.status(500).json({ error: "Failed to process question" });
    }
};
