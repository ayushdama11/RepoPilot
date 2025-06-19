import { SignInButton,SignedOut,SignUp, useAuth } from "@clerk/clerk-react"
import { useEffect } from "react";

export function SignUpComponent() {

  // const {getToken}=useAuth();
  //   useEffect(()=>{

  //       const helper=async()=>{
  //           const token=await getToken();
  //           window.localStorage.setItem("token",token);
  //       }
  //       helper();
  //   },[]);

    return(
        <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      
           <SignUp 
        path="/signup" 
        routing="path" 
        forceRedirectUrl="/sync-user"
        signInUrl="/signin"
          />
        </header>
    )
}

