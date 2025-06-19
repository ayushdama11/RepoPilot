import { getAuth } from "@clerk/express";
import prisma from "../prismaClient.js";

export const saveAnswer = async (req, res) => {
    console.log("Req.body: ",req.body);
    
    const { projectId, question, answer, fileReferences } = req.body;
    const { userId } = getAuth(req);
    console.log("userId: ",userId);
    
    console.log("Question Asked: ",question);
    

    // if (!question) {
    //     return res.status(400).json({ error: "questionAsked is required" });
    // }
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: No userId found" });
    }
    if (!projectId) {
        return res.status(400).json({ error: "projectId is required" });
    }

    try {
        const savedAnswer = await prisma.question.create({
            data: {
                answer: answer || "No answer provided",
                projectId,
                questionAsked:question,
                userId,
                filesReferences: fileReferences || "[]", 
            }
        });

        res.status(200).json({ message: "Answer saved in database", savedAnswer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
};
