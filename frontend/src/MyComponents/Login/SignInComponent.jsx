import { SignedIn,useAuth,UserButton } from "@clerk/clerk-react";
import { SignIn } from "@clerk/clerk-react";
import { useEffect } from "react";

export function SignInComponent(){
    

    return (
        <div>
        <SignedIn>
             <UserButton />
        </SignedIn>
        
            <SignIn
            path="/signin" 
            routing="path" 
            forceRedirectUrl="/sync-user"
            signUpUrl="/signup"/>
            
        </div>
    )

}

