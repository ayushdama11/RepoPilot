


import { Dialog,DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import useProject from "@/hooks/use-project";


const API_BASEURL=import.meta.env.VITE_BACKEND_API_BASEURL;

const InviteButton=()=>{
    const {selectedProject}=useProject()
    const [open,setOpen]=useState(false);
    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
<DialogContent>
    <DialogHeader>
        <DialogTitle>Invite Team Members</DialogTitle>
    </DialogHeader>
    <p className='text-sm text-gray-500'>
        Ask them to copy and paste this link
    </p>
    <Input className='mt-4' readOnly onClick={()=>{
        navigator.clipboard.writeText(`${API_BASEURL}/join/${selectedProject?.id}`)
        toast.success("Copied to clipboard.")
    }}
    value={`${API_BASEURL}/join/${selectedProject?.id}`} />

</DialogContent>
        </Dialog>
        <Button size='sm' onClick={()=> setOpen(true)}>Invite Members</Button>
        </>
    )
}

export default InviteButton;