import express from 'express';
import cors from 'cors';
import prisma from './prismaClient.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv'
import { clerkMiddleware, getAuth } from '@clerk/express';

dotenv.config();

const app=express();
const PORT=process.env.PORT || 5000;


// app.use(cors({
//     origin: "*",
//     methods: "GET,POST,PUT,DELETE",
//     credentials:false,
// }));

app.use(cors({
    origin: "https://repopilot.netlify.app",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://repopilot.netlify.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
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
