import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'
import { generateEmbedding, summarizeCode } from './gemini'
import axios from 'axios'
import { octokit } from './github'
import { apiClient } from './utils'
import { Octokit } from '@octokit/core'


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;


const getFileCount=async (path,octokitInstance,githubOwner,githubRepo,acc=0)=>{

    const {data}=await octokitInstance.rest.repos.getContent({
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
                directories.map(dirPath=> getFileCount(dirPath,octokitInstance,githubOwner,githubRepo,0))
            )
            fileCount+=directoryCounts.reduce((acc,count)=> acc+count,0);
        }

        return acc+fileCount;
    }
    return acc;
}


export const checkCredits=async (githubUrl,githubToken)=>{
    console.log('🔍 [DEBUG] checkCredits called with:', { githubUrl, hasToken: !!githubToken });
    
    const githubOwner=githubUrl.split('/')[3];
    const githubRepo=githubUrl.split('/')[4];
    
    console.log('🔍 [DEBUG] Parsed GitHub URL:', { githubOwner, githubRepo });
    
    if(!githubOwner || !githubRepo){
        console.log('❌ [DEBUG] Invalid GitHub URL format');
        return 0; 
    }

    try {
        const fileCount=await getFileCount('',octokit,githubOwner,githubRepo,0);
        console.log('✅ [DEBUG] File count calculated:', fileCount);
        return fileCount;
    } catch (error) {
        console.error('❌ [DEBUG] Error calculating file count:', error);
        return 0;
    }
}

export const loadGitHubRepo = async (repoUrl, accessToken) => {
  try {
    const octokit = new Octokit({
      auth: accessToken,
    });

    const { owner, repo } = extractRepoInfo(repoUrl);
    const files = await getAllFiles(octokit, owner, repo);
    const fileContents = await getFileContents(octokit, owner, repo, files);

    return fileContents;
  } catch (error) {
    console.error("Error loading GitHub repo:", error);
    throw error;
  }
};

export const indexGithubRepo=async(githubUrl,githubToken,token,projectId)=>{
    console.log('🔄 [DEBUG] indexGithubRepo called with:', { 
        githubUrl, 
        hasGithubToken: !!githubToken, 
        hasAuthToken: !!token,
        projectId 
    });
    
    try {
        console.log('📥 [DEBUG] Loading GitHub repo...');
        const docs=await loadGitHubRepo(githubUrl,githubToken)
        console.log('✅ [DEBUG] GitHub repo loaded, generating embeddings...');
        
        const allEmbeddings = await generateEmbeddings(docs); 
        console.log('✅ [DEBUG] Embeddings generated:', {
            totalEmbeddings: allEmbeddings.length,
            sampleEmbeddings: allEmbeddings.slice(0, 2).map(emb => ({
                fileName: emb.fileName,
                summaryLength: emb.summary.length,
                hasEmbedding: !!emb.embedding
            }))
        });

        const processedEmbeddings = await Promise.all(
            allEmbeddings.map(async (embedding) => ({
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId:projectId,
                embedding: embedding.embedding
            }))
        );

        console.log('📤 [DEBUG] Sending embeddings to backend...');
        const embedds = await apiClient.post(`${API_BASEURL}/addEmbeddings`, {
            embeddings: processedEmbeddings 
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        console.log('✅ [DEBUG] Embeddings saved to backend:', embedds.data);
        return embedds.data;
    } catch (error) {
        console.error('❌ [DEBUG] Error in indexGithubRepo:', error);
        throw error;
    }
}

const generateEmbeddings=async (docs)=>{
    console.log('🧠 [DEBUG] generateEmbeddings called with:', { totalDocs: docs.length });

// Inner return	returns 1 object { summary, embedding, sourceCode, fileName } for each doc	1 Promise per doc
// Outer return	waits for all Promises to finish using Promise.all()	Final Array of all processed docs

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const batchSize=10;
const summaryResponses=[];

for(let i=0;i<docs.length;i+=batchSize){
    const batch=docs.slice(i,i+batchSize);
    console.log(`📝 [DEBUG] Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(docs.length/batchSize)}`);

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
        console.log("❌ [DEBUG] batch failed: index Repo: ",error);
        batch.forEach(summary => {
            summaryResponses.push({ status: "rejected", reason: error.message });
        });
    }
    await delay(10000);
}

const summaries = summaryResponses?.map(response =>
    response.status === 'fulfilled' ? response.value : ""
);

console.log('🔗 [DEBUG] Generating final embeddings...');
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

export const pullCommits = async (projectId, getToken) => {
    console.log('📥 [DEBUG] pullCommits called with projectId:', projectId);
    
    try {
        const token = await getToken();
        console.log('🔑 [DEBUG] Got auth token for commits');
        
        const response = await apiClient.get(`${API_BASEURL}/getProject/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log('📊 [DEBUG] Project data retrieved:', {
            hasGithubUrl: !!response.data.githubUrl,
            githubUrl: response.data.githubUrl
        });
        
        const githubUrl = response.data.githubUrl;
        const githubOwner = githubUrl.split('/')[3];
        const githubRepo = githubUrl.split('/')[4];
        
        console.log('🔍 [DEBUG] Parsed GitHub URL:', { githubOwner, githubRepo });
        
        const commits = await octokit.rest.repos.listCommits({
            owner: githubOwner,
            repo: githubRepo,
            per_page: 10
        });
        
        console.log('✅ [DEBUG] Commits fetched:', {
            totalCommits: commits.data.length,
            sampleCommits: commits.data.slice(0, 3).map(commit => ({
                sha: commit.sha.substring(0, 7),
                message: commit.commit.message.substring(0, 50),
                author: commit.commit.author.name
            }))
        });
        
        const commitsData = commits.data.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
            projectId: projectId
        }));
        
        console.log('📤 [DEBUG] Sending commits to backend...');
        const response2 = await apiClient.post(`${API_BASEURL}/addCommits`, {
            commits: commitsData
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log('✅ [DEBUG] Commits saved to backend:', response2.data);
        return response2.data;
        
    } catch (error) {
        console.error('❌ [DEBUG] Error in pullCommits:', error);
        throw error;
    }
};