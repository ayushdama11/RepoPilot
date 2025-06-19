// import readStreana
import {Button} from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import useProject from "@/hooks/use-project"
import { useState } from "react"
import { useAskQuestion } from "@/hooks/use-askQuestion"
import MDEditor from "@uiw/react-md-editor"
import CodeReferences from "./CodeReferences"
import { toast } from "react-toastify"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"
import useRefetch from "@/hooks/use-refetch"


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

const AskQuestionCard=()=>{

    const [saved, setSaved] = useState(false);

    const {selectedProject}=useProject();
    const [open,setOpen]=useState(false);
    const [question,setQuestion]=useState('');
    const [startQuery,setStartQuery]=useState(false);
    const shouldFetch = startQuery && !!question; // Only fetch if the user has started a query
const { output, setOutput, fileReferences, setFileReferences, loading } = useAskQuestion(
    shouldFetch ? question : "", 
    selectedProject?.id
);


let questionToPass=question;




const onSubmit=async(e)=>{
    
    e.preventDefault()
    if(!selectedProject?.id) return;
    if(question.length>1){
        questionToPass=question}
        setOutput("");  
        setFileReferences([]);
        setStartQuery(true);
    setOpen(true)

 

   
}
const {getToken}= useAuth();
const saveAnswer=async (outputPassed,fileReferencesPassed)=>{
    
    try{
        const token=await getToken();
     
    const result=await axios.post(`${API_BASEURL}/saveanswer`,{
       
            projectId:selectedProject?.id,
            question,
            answer:outputPassed,
            fileReferences:fileReferencesPassed
        
    },{
        headers:{
            "Content-Type":"application/json",
         Authorization:`Bearer ${token}`
         }
    });

    if(result.status===200){
        toast.success("Answer Saved!")
        setSaved(prev=> !prev) //just to rerender
        
    }

}
catch(error){
    console.error(error);
    toast.error('Failed to save answer!')
}
}

const handleSave=async(outputPassed,fileReferencesPassed)=>{
await saveAnswer(outputPassed,fileReferencesPassed);
}
//contitnue
    return (
        <>
     <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[80vw]'>
        <DialogHeader>
            <div className="flex items-center gap-2">
                <DialogTitle>
                    <img src='logo.png'  alt='Repo-Pilot' width={40} height={40}/>
                </DialogTitle>
        <Button variant={'outline'} onClick={()=>{
            
            handleSave(output,fileReferences)}}> Save Answer</Button>
                </div>
            </DialogHeader>
            <MDEditor.Markdown source={output} className="max-w-[70vw] !h-full max-h-[40vh] overflow-scroll"/>
            <div className="h-4"></div>
            {fileReferences && fileReferences.length > 0 && <CodeReferences filesReferences={fileReferences} />}


            <Button type='button' onClick={()=>{setOpen(false)}}>
                Close
            </Button>
           
        </DialogContent>
           
     </Dialog>
        <Card className='relative col-span-3'>
            <CardHeader>
                <CardTitle>Ask a question</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <Textarea placeholder="Which file should I edit to change the home page?" value={question} onChange={e=> setQuestion(e.target.value)} />
                    <div className="h-4"></div>
                    <Button type='submit' >  
                        Ask Repo-Pilot!
                    </Button>
                </form>
            </CardContent>
        </Card>
        </>
    )
}

export default AskQuestionCard;