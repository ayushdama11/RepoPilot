import prisma from "../prismaClient.js"


export const addEmbeddings = async (req, res) => {
  try {
    const { projectId, documents } = req.body;

    if (!projectId || !documents || !Array.isArray(documents)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const embeddings = [];
    
    for (const doc of documents) {
      const embedding = await generateEmbedding(doc.pageContent);
      embeddings.push({
        content: doc.pageContent,
        metadata: doc.metadata,
        embedding: embedding,
        projectId: projectId
      });
    }

    await prisma.embedding.createMany({
      data: embeddings
    });

    res.json({ message: "Embeddings added successfully", count: embeddings.length });
  } catch (error) {
    console.error("Error adding embeddings:", error);
    res.status(500).json({ error: "Failed to add embeddings" });
  }
};