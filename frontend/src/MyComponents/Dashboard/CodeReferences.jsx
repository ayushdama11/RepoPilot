import { useState } from "react"
import { Tabs,TabsContent } from "@/components/ui/tabs"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {lucario} from 'react-syntax-highlighter/dist/esm/styles/prism'
import clsx from "clsx"



const CodeReferences=({filesReferences=[]})=>{
    
    // console.log("fileReferences in codeReferences: ",filesReferences);
    const [tab,setTab]=useState(filesReferences.length>0? filesReferences[0].fileName : "");

    if(filesReferences.length===0) return null


return (
    <div className="max-w-[70vw]">
        <Tabs value={tab} onValueChange={setTab}>
            <div className="overflow-scroll flex gap-2 bg-gray-200 p-1 rounded-md">
                {filesReferences.map(file=>(
                    <button onClick={()=>setTab(file.fileName)} key={file.fileName} className={clsx(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted',{
                            'bg-primary text-primary-foreground': tab===file.fileName,
                        }
                    )}>
                       {/* { console.log(file.fileName)} */}
                        
                        {file.fileName}
                    </button>
//                     <button 
//     onClick={() => setTab(file.fileName)} 
//     key={file.fileName} 
//     className={clsx(
//         "px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap", // Keep base styles
//         tab === file.fileName 
//             ? "bg-primary text-primary-foreground" 
//             : "text-muted-foreground hover:bg-muted"
//     )}
// >
//     {console.log(file.fileName)}
//     {file.fileName}
// </button>

                ))}

            </div>
            {filesReferences.map(file=> (
<TabsContent key={file.fileName} value={file.fileName} className="max-h-[40vh] overflow-scroll max-w-7xl rounded-md">
<SyntaxHighlighter language="typescript" style={lucario}>
    {file.sourceCode}
</SyntaxHighlighter>
</TabsContent>
            ))}
        </Tabs>

    </div>

)

}

export default CodeReferences;