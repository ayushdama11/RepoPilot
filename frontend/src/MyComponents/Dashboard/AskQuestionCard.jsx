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
import { Loader2 } from "lucide-react"


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

const MAX_QUESTION_LENGTH = 200;

    return (
        <>
     <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[80vw] flex flex-col h-[80vh] p-0'>
            {/* Sticky Header */}
            <div className="flex items-center justify-between gap-2 p-4 border-b bg-background sticky top-0 z-10">
                <DialogTitle>
                    <img src='logo.png'  alt='Repo-Pilot' width={40} height={40}/>
                </DialogTitle>
                <Button variant={'outline'} onClick={()=>{handleSave(output,fileReferences)}}> Save Answer</Button>
            </div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-background">
                <div className="rounded-lg bg-gray-900 text-gray-100 p-4">
                  <MDEditor.Markdown source={output} className="max-w-[70vw] !h-full min-h-[10vh]" />
                </div>
                <div className="h-4"></div>
                {fileReferences && fileReferences.length > 0 && <CodeReferences filesReferences={fileReferences} />}
            </div>
            {/* Footer always at bottom */}
            <div className="flex justify-end gap-2 p-4 border-t bg-background mt-auto">
                <Button type='button' onClick={()=>{setOpen(false)}}>
                    Close
                </Button>
            </div>
        </DialogContent>
           
     </Dialog>
        <Card className='relative col-span-3 mb-8'>
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