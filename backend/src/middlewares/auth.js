// import {Clerk} from '@clerk/clerk-sdk-node'
import { verifyToken } from '@clerk/clerk-sdk-node';

// This function validates JWT tokens and extracts user information.
// This is a custom authentication middleware that verifies JWT tokens from Clerk. It extracts the Bearer token from the Authorization header, verifies it using Clerk's public key, and attaches the user ID to the request object. If the token is invalid or missing, it returns a 401 error. I use this middleware on specific routes that require authentication, providing an additional layer of security beyond the global authentication setup.

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // decoded = jwt.verify(tokenCrossOrigin, publicKey, options)
   const verifiedToken=await verifyToken(token, {jwtKey: process.env.CLERK_JWT_KEY});
   req.userId=verifiedToken.sub;
   next();
  } catch (error) {
    console.error('Token verification failed: ',error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
