import prisma from "../prismaClient.js";

export const deleteProjectController = async (req, res) => {
  const { projectId } = req.params;
  console.log("Received delete request for project:", projectId);
  try {
    // Delete all related data first
    await prisma.commit.deleteMany({ where: { projectId } });
    await prisma.sourceCodeEmbedding.deleteMany({ where: { projectId } });
    await prisma.question.deleteMany({ where: { projectId } });
    await prisma.userToProject.deleteMany({ where: { projectId } });
    // Finally, delete the project itself
    await prisma.project.delete({ where: { id: projectId } });
    console.log("Project deleted successfully:", projectId);
    res.status(200).json({ message: "Project deleted permanently" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
}; 