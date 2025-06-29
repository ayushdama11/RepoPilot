import express from 'express';
import cors from 'cors';
import prisma from './prismaClient.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv'
import { clerkMiddleware, getAuth } from '@clerk/express';

dotenv.config();

const app=express();
const PORT=process.env.PORT || 5000;

// Updated CORS configuration for Vercel deployment
app.use(cors({
    origin: ["https://repo-pilot-seven.vercel.app", "http://localhost:5173", "https://repopilot.netlify.app"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
}));

app.use((req, res, next) => {
    const allowedOrigins = ["https://repo-pilot-seven.vercel.app", "http://localhost:5173"];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    
    // Allow preflight responses
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
  
    next();
  });
  
app.use(clerkMiddleware());
app.use(express.json());
app.use((req,res,next)=>{
    const { userId } = getAuth(req) || {};
    // Now, in any controller or route, you can easily get the current user's ID with req.user.clerkId instead of calling getAuth(req) every time.
    req.user={clerkId:userId};
    next();
})

app.get('/',(req,res)=>{
    res.send("App running");
});

app.use(userRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
