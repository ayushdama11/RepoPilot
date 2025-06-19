import axios from "axios"

export const githubProxy=async(req,res)=>{
    try{
        const {url}=req.query;
        if(!url) return res.status(400).json({error:"Missing url parameter"});

        const response=await axios.get(url,{
            headers:{"User-Agent":"Repo-Pilot"},
        });
        res.set("Access-Control-Allow-Origin","*");
        res.send(response.data);
    }
    catch(error){
        res.status(500).json({ error: "Error fetching GitHub content" });
    }
}
