import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'
import { generateEmbedding, summarizeCode } from './gemini'
import axios from 'axios'
import { Octokit } from 'octokit'
import { octokit } from './github'


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;


const getFileCount=async (path,octokit,githubOwner,githubRepo,acc=0)=>{

    const {data}=await octokit.rest.repos.getContent({
        owner:githubOwner,
        repo:githubRepo,
        path
    })

    if(!Array.isArray(data) && data.type==='file'){ //if data is not array that means it is a file there are no directory
        return acc+1;
    }

    if(Array.isArray(data)){
        let fileCount=0;
        const directories=[];

        for(const item of data){
            if(item.type==='dir'){
                directories.push(item.path)
            }
            else{
                fileCount++;
            }
        }
        if(directories.length>0){
            const directoryCounts=await Promise.all(
                directories.map(dirPath=> getFileCount(dirPath,octokit,githubOwner,githubRepo,0))
            )
            fileCount+=directoryCounts.reduce((acc,count)=> acc+count,0);
        }

        return acc+fileCount;
    }
    return acc;
}


export const checkCredits=async (githubUrl,githubToken)=>{
    const ocktokit=new Octokit({ auth: import.meta.env.VITE_GITHUB_TOKEN,});
    const githubOwner=githubUrl.split('/')[3];
    const githubRepo=githubUrl.split('/')[4];
    if(!githubOwner || !githubRepo){
        return 0; 
    }

    const fileCount=await getFileCount('',ocktokit,githubOwner,githubRepo,0);
    return fileCount;
}

export const loadGithubRepo=async (githubUrl,githubToken)=>{
const loader=new GithubRepoLoader(githubUrl,{
    accessToken: githubToken || '',
    branch:'main',
    ignoreFiles: ['package-lock.json','yarn.lock','pnpm-lock.yaml','bun.lockb', 'node_modules/**','dist/**','build/**',],
    recursive: true,
    unknown:'warn',
    maxConcurrency:5
})

const docs=await loader.load()
return docs;

}

export const indexGithubRepo=async(githubUrl,githubToken,token,projectId)=>{
    const docs=await loadGithubRepo(githubUrl,githubToken)
    const allEmbeddings = await generateEmbeddings(docs); 

const processedEmbeddings = await Promise.all(
    allEmbeddings.map(async (embedding) => ({
        summary: embedding.summary,
        sourceCode: embedding.sourceCode,
        fileName: embedding.fileName,
        projectId:projectId,
        embedding: embedding.embedding
    }))
);

const embedds = await axios.post(`${API_BASEURL}/addEmbeddings`, {
    embeddings: processedEmbeddings 
}, {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }
});

    return embedds.data;
}

const generateEmbeddings=async (docs)=>{

// Inner return	returns 1 object { summary, embedding, sourceCode, fileName } for each doc	1 Promise per doc
// Outer return	waits for all Promises to finish using Promise.all()	Final Array of all processed docs

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const batchSize=10;
const summaryResponses=[];

for(let i=0;i<docs.length;i+=batchSize){
    const batch=docs.slice(i,i+batchSize);

    try{
        const summarizes=await summarizeCode(batch.join("\n\n"));
        const summaryList = summarizes.split(/\*\s+/).filter(Boolean);

        batch.forEach((summary,index)=>{
            summaryResponses.push({status:"fulfilled",
                value:summaryList[index] || ""
            });
        })
    }
    catch(error){
        console.log("batch failed: index Repo: ",error);
        batch.forEach(summary => {
            summaryResponses.push({ status: "rejected", reason: error.message });
        });
    }
    await delay(10000);
}

const summaries = summaryResponses?.map(response =>
    response.status === 'fulfilled' ? response.value : ""
);

return await Promise.all(docs.map(async (doc, index) => {
    const summary = summaries[index];
    const embedding = await generateEmbedding(summary);

    return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
    }
    }))
}