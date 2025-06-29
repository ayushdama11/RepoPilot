import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "../lib/gemini";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const google= new createGoogleGenerativeAI({
    apiKey: import.meta.env.VITE_GEMINI_KEY,
})
const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;
export function useAskQuestion(question,projectId){
   const [output,setOutput]=useState("") //streaming AI-generated text.
   const [loading,setLoading]=useState(false);
   const [fileReferences,setFileReferences]=useState([]);
   const {getToken}=useAuth();
   const [error, setError] = useState(null);
   const [answer, setAnswer] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(()=>{
    if(!question) return;

    async function fetchData(){
        setLoading(true);
        setError(null);
        setAnswer(null);
        
        try{ 
            const token=await getToken();
            
            const queryVector=await generateEmbedding(question);
            
            const vectorQuery=queryVector;
            
            const result=await axios.post(`${API_BASEURL}/askQuestion/${projectId}`,{
                vectorQuery
            },{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
           
            setFileReferences(result.data.result);
            
            let context=''
            for(const doc of result.data.result){
                context+=`source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
            }

            // Add project context if available
            let projectContext = '';
            if (result.data.project) {
                projectContext = `\nPROJECT: ${result.data.project.name}\nGITHUB URL: ${result.data.project.githubUrl}\n`;
            }

            const {textStream}=await streamText({
                model: google('gemini-1.5-flash'),
                prompt: `
                You are an expert AI code assistant helping developers understand and work with the RepoPilot codebase. 

                REPO PILOT PROJECT CONTEXT:
                - This is a full-stack AI-powered developer collaboration platform
                - Frontend: React.js with Vite, ShadCN UI, Tailwind CSS
                - Backend: Express.js with Node.js
                - Database: PostgreSQL (Neon) with pgvector for embeddings
                - Authentication: Clerk
                - AI: Google Gemini API for code analysis and embeddings
                - Payment: Razorpay integration
                - Repository: https://github.com/ayushdama11/RepoPilot
                ${projectContext}

                YOUR ROLE:
                - Provide detailed, actionable answers about the codebase
                - Explain code structure, patterns, and implementation details
                - Help with debugging, feature implementation, and best practices
                - Give step-by-step instructions when appropriate
                - Suggest improvements and optimizations

                IMPORTANT:
                - Never say you do not have access to the internet or files. Only answer based on the provided context and information.
                - If the answer is not in the context, provide your best guidance based on the context and your knowledge of codebases.

                CONTEXT FROM CODEBASE:
                ${context}

                USER QUESTION:
                ${question}

                INSTRUCTIONS:
                - If the context provides relevant information, give a comprehensive answer
                - If the context is limited but you can provide general guidance, do so
                - If you need more specific information, ask for clarification about which part of the codebase they're interested in
                - Always provide value - explain concepts, suggest approaches, or guide them to relevant files
                - Use markdown formatting with code snippets when helpful
                - Be specific about file locations and code patterns
                - If you can't answer the specific question, provide related information that might help
                - Never say you cannot access the internet or files; always answer based on the context provided.

                Remember: You're helping developers understand and work with this codebase. Always try to provide useful insights, even if the exact answer isn't in the provided context.
                `
                
            });
            let fullResponse="";
            for await(const delta of textStream){
                fullResponse+=delta; //streaming the ai generated content
                setOutput(fullResponse);
            }
            
            setAnswer(fullResponse);
            
        }
        catch(error){
            console.error('❌ [DEBUG] Error in useAskQuestion:', error);
            setError(error.message);
        }
        finally{
            setLoading(false);
        }
        
    }

    fetchData();
},[question,projectId]);

const askQuestion = async (question) => {
    if (!question.trim() || !projectId) {
      setError("Please enter a question and select a project");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput(null);
    setFileReferences([]);

    try {
      const token=await getToken();
      
      const queryVector=await generateEmbedding(question);
      
      const vectorQuery=queryVector;
      
      const result=await axios.post(`${API_BASEURL}/askQuestion/${projectId}`,{
          vectorQuery
      },{
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
      });
     
      setFileReferences(result.data.result);
      
      let context=''
      for(const doc of result.data.result){
          context+=`source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
      }

      // Add project context if available
      let projectContext = '';
      if (result.data.project) {
          projectContext = `\nPROJECT: ${result.data.project.name}\nGITHUB URL: ${result.data.project.githubUrl}\n`;
      }

      const {textStream}=await streamText({
          model: google('gemini-1.5-flash'),
          prompt: `
          You are an expert AI code assistant helping developers understand and work with the RepoPilot codebase. 

          REPO PILOT PROJECT CONTEXT:
          - This is a full-stack AI-powered developer collaboration platform
          - Frontend: React.js with Vite, ShadCN UI, Tailwind CSS
          - Backend: Express.js with Node.js
          - Database: PostgreSQL (Neon) with pgvector for embeddings
          - Authentication: Clerk
          - AI: Google Gemini API for code analysis and embeddings
          - Payment: Razorpay integration
          - Repository: https://github.com/ayushdama11/RepoPilot
          ${projectContext}

          YOUR ROLE:
          - Provide detailed, actionable answers about the codebase
          - Explain code structure, patterns, and implementation details
          - Help with debugging, feature implementation, and best practices
          - Give step-by-step instructions when appropriate
          - Suggest improvements and optimizations

          IMPORTANT:
          - Never say you do not have access to the internet or files. Only answer based on the provided context and information.
          - If the answer is not in the context, provide your best guidance based on the context and your knowledge of codebases.

          CONTEXT FROM CODEBASE:
          ${context}

          USER QUESTION:
          ${question}

          INSTRUCTIONS:
          - If the context provides relevant information, give a comprehensive answer
          - If the context is limited but you can provide general guidance, do so
          - If you need more specific information, ask for clarification about which part of the codebase they're interested in
          - Always provide value - explain concepts, suggest approaches, or guide them to relevant files
          - Use markdown formatting with code snippets when helpful
          - Be specific about file locations and code patterns
          - If you can't answer the specific question, provide related information that might help
          - Never say you cannot access the internet or files; always answer based on the context provided.

          Remember: You're helping developers understand and work with this codebase. Always try to provide useful insights, even if the exact answer isn't in the provided context.
          `
          
      });
      let fullResponse="";
      for await(const delta of textStream){
          fullResponse+=delta; //streaming the ai generated content
          setOutput(fullResponse);
      }
      
      setAnswer(fullResponse);
      
    }
    catch(error){
        console.error('❌ [DEBUG] Error in useAskQuestion:', error);
        setError(error.message);
    }
};

return {output,setOutput,fileReferences,setFileReferences,loading,error,answer,isLoading,askQuestion};
   
}