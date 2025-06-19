import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Meeting=()=>{
const navigate=useNavigate();
    const handleClick=()=>{
       navigate('/dashboard');
    }
    return (
        <div>
            <Button onClick={handleClick}>Back to dashboard</Button>
            <h2>Under Development</h2>
        </div>
    )
}

export default Meeting;