import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";
import AskQuestionCard from "../Dashboard/AskQuestionCard";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import React from "react";
import useProject from "@/hooks/use-project";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../Dashboard/CodeReferences";
import Payment from "../Payment/Billing";


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

const QaComponent=()=>{
    const {getToken}= useAuth();
    const {selectedProject}=useProject();
    const [questions,setQuestions]=useState([]);
    const [questionIndx,setQuestionIndex]=useState(0);
    const question=questions?.[questionIndx];
console.log("Uppar wala: ",questions);
const formattedDate = question?.createdAt
    ? new Date(question?.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
    : "Unknown Date";


    const getQuestions=async()=>{

        try{
            const token=await getToken();
            const response=await axios.get(`${API_BASEURL}/getquestions/${selectedProject.id}`,{

                headers:{
                    "Content-Type":"application/json",
                 Authorization:`Bearer ${token}`
                 }
            });
if(response.status===200){
    setQuestions(response.data.questions);
}
            
        }
        catch(error){
console.error(error);

        }
    }

useEffect(()=>{
    const helper=async ()=>{
        await getQuestions();
    }

    helper();
    console.log(questions);
    

},[selectedProject]);

    return (
        <Sheet>
            <AskQuestionCard/>
            <div className="h-4"></div>
            <h1 className="text-xl font-semibold">Saved Questions</h1>
            <div className="h-2"></div>
            <div className="flex flex-col gap-2">
                {questions.map((question,index)=>{
                    return <React.Fragment key={question.id}>
                        <SheetTrigger onClick={()=> setQuestionIndex(index)}>
                            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
                            <img className="rounded-full" height={30} width={30} src={question.user.imageUrl ?? ""}/>

                            <div className="text-left flex flex-col">
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-700 line-clamp-1">
                                        {question.questionAsked}
                                    </p>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {formattedDate}
                                    </span>
                                </div>
                                <p className="text-gray-500 line-clamp-1 text-sm">
                                    {question.answer}
                                </p>
                            </div>
                            </div>
                        </SheetTrigger>
                    </React.Fragment>
                })}
            </div>

            {question && (
                <SheetContent className="sm:max-w-[80vw] max-h-[80vh] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <MDEditor.Markdown source={question.answer} />
                        <CodeReferences filesReferences={(question.filesReferences ?? [])} />
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}

export default QaComponent;