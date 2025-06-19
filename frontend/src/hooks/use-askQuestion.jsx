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
   useEffect(()=>{
    if(!question) return;

    async function fetchData(){
        setLoading(true);
        try{
            const token=await getToken();
            const queryVector=await generateEmbedding(question);
            
            

            // const vectorQuery=`[${queryVector.join(',')}]`; //converted in string to execute in raw sql query later we will cast in vector again

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

            const {textStream}=await streamText({
                model: google('gemini-1.5-flash'),
                prompt: `
                You are a ai code assistant who answers questions about the codebase. Your target audience is a technical interns
        AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness. cleverness, and articulateness.
        AI is a well -behaved and well-mannered individual .
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic.
        If the question is asking about code or a specific file. AI will provide the detailed answer, giving step by step instruction.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        START QUESTION
        ${question}
        END OF QUESTION
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question. the AI assistant will say, - I'm sorry,
        but I don't know the answer to this question. Please Provide more context!
        AI assistant will not apologize for previous responses, but instead will indiacted new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
        Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering.
                `
                
            });
            let fullResponse="";
            for await(const delta of textStream){
                fullResponse+=delta; //streaming the ai generated content
                setOutput(fullResponse);
            }
           
            
        }
        catch(error){
            setOutput("Error fetching response.");
        }
        finally{
            setLoading(false);
        }
        
    }

    fetchData();
},[question,projectId]);

return {output,setOutput,fileReferences,setFileReferences,loading};
   
}