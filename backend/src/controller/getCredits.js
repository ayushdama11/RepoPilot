import { getAuth } from "@clerk/express";
import prisma from "../prismaClient.js";

export const getCredits = async (req, res) => {
    const {userId}=getAuth(req)
  const result= await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { credits: true },
  });

  return res.status(200).json(result);
};
