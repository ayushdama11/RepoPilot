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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <SignUp 
          path="/signup" 
          routing="path" 
          signInUrl="/signin"
          afterSignUpUrl="/dashboard"
          afterSignInUrl="/dashboard"
        />
      </div>
    )
}

