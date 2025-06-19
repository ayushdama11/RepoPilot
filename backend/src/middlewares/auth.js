// import {Clerk} from '@clerk/clerk-sdk-node'
import { verifyToken } from '@clerk/clerk-sdk-node';


export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  

  try {
    // decoded = jwt.verify(tokenCrossOrigin, publicKey, options)
   const verifiedToken=await verifyToken(token,{jwtKey: process.env.CLERK_JWT_KEY});
   req.userId=verifiedToken.sub;
    next();
  } catch (error) {
    console.error('Token verification failed: ',error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
