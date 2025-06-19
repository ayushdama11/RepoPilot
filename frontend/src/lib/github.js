import axios from "axios";
import { Octokit } from "octokit";
import { aiSummarizeCommit } from "./gemini";

export const octokit= new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
})
// const githubUrl="";


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

export const getCommitHashes=async (githubUrl)=>{

    const [owner,repo]=githubUrl.split('/').slice(-2);   // sliced owner and repo from url
    if(!owner || !repo){
        throw new Error("Invalid github url");
    }
    const {data}=await octokit.rest.repos.listCommits({  //fetched all commits in data using api sort of
        owner,repo
    })
   
    
    const sortedCommits=data.sort((a,b) => new Date(b.commit.author.date).getTime()- new Date(a.commit.author.date).getTime()); 
    
    return sortedCommits.slice(0, 10).map((commit)=>({
        commitHash:commit.sha,
        commitMessage:commit.commit.message ?? "",
        commitAuthorName: commit.commit.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate:commit.commit?.author?.date ?? ""
    }))
};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const pullCommits = async (projectId, getToken) => {
    const token=await getToken();
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId, token);
    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes, token);

    if (unprocessedCommits.length === 0) {
        // console.log("No new commits to process.");
        return; 
    }

    const batchSize = 10; 
    const summaryResponses = [];

    for (let i = 0; i < unprocessedCommits.length; i += batchSize) {
        const batch = unprocessedCommits.slice(i, i + batchSize);

        try {
            // console.log(`Processing batch: ${i / batchSize + 1}`);

            // Fetch all commit diffs in parallel
            const commitDiffs = await Promise.all(batch.map(commit => 
                 fetchCommitDiff(githubUrl, commit.commitHash)
            ));
            // console.log("commit diff in pull commits ",commitDiffs);
            
            // Send all commit diffs as a single request for summarization
            const summaries = await aiSummarizeCommit(commitDiffs.join("\n\n"));
            // console.log("Summaries in pull comits ",summaries);
            
            const summaryList = summaries.split(/\*\s+/).filter(Boolean);
            
            batch.forEach((commit, index) => {
                summaryResponses.push({ 
                    status: "fulfilled", 
                    value: summaryList[index] || ""  
                });
            });

        } catch (error) {
            console.log("Batch failed:", error.message);
            batch.forEach(commit => {
                summaryResponses.push({ status: "rejected", reason: error.message });
            });
        }

        await delay(10000); // Delay to avoid rate limiting
    }

    // console.log(summaryResponses.length);
    // console.log("SummaryResponses: ", summaryResponses);

    // Prepare commit summaries for storage
    const summaries = summaryResponses?.map(response =>
        response.status === 'fulfilled' ? response.value : ""
    );

    const commits = await axios.post(`${API_BASEURL}/addCommit`,
        {  
            commits: summaries?.map((summary, index) => ({
                projectId: projectId,
                commitMessage: unprocessedCommits[index]?.commitMessage,
                commitHash: unprocessedCommits[index]?.commitHash,
                commitAuthorName: unprocessedCommits[index]?.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]?.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]?.commitDate,
                summary: summary
            }))
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    return commits.data;

//     else{
// return
//     }
};

// Fetch commit diff
async function fetchCommitDiff(githubUrl, commitHash) {

    try{
    const githubUrlToPass=`${githubUrl}/commit/${commitHash}.diff`;
    const {data} = await axios.get(`${API_BASEURL}/githubproxy?url=${encodeURIComponent(githubUrlToPass)}`);
    // console.log("data in fetchCommitdiff: ",data);

    return data;

}
catch (error) {
    console.error("Error fetching commit diff:", error);
    return null;
}
}


// async function summarizeCommit(githubUrl,commitHash){
//     const {data}=await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
//         headers:{
//             Accept: 'application/vnd.github.v3.diff'
//         }
//     })

//     return await aiSummarizeCommit(data) || "";
// }

async function fetchProjectGithubUrl(projectId,token){
   
    const response=await axios.get(`${API_BASEURL}/getProject/${projectId}`,{
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    });

    const project=response.data;
    const githubUrl=project?.project.githubUrl
    // console.log('Inside fetch url',project);
    

    if(!githubUrl){
        throw new Error("Project has no github url");
    }

    return {project, githubUrl}

}

async function filterUnprocessedCommits(projectId,commitHashes,token){

    const response=await axios.get(`${API_BASEURL}/getCommits/${projectId}`,
        {
            headers:{
               "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
            }
        }
    )

 const processedCommits=response.data;

 const unprocessedCommits=commitHashes.filter((commit) => !processedCommits.some((processedCommit)=>processedCommit.commitHash === commit.commitHash))

return unprocessedCommits;

}