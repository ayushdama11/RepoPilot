import { getAuth,clerkClient } from '@clerk/express';
import prisma from '../prismaClient.js';

const createProject = async (req, res) => {
  try {
    const { projectName, repoUrl, githubToken, creditNeeded } = req.body;
    const userId = req.user.id;

    if (!projectName || !repoUrl) {
      return res.status(400).json({ error: "Project name and repository URL are required" });
    }

    const project = await prisma.project.create({
      data: {
        name: projectName,
        githubUrl: repoUrl,
        userId: userId,
        creditNeeded: creditNeeded || 0
      }
    });

    res.status(201).json({ 
      message: "Project created successfully", 
      project 
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export default createProject;


