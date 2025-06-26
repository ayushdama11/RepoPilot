import { useUser } from "@clerk/clerk-react";
import { SignIn } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SignInComponent() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isSignedIn, navigate]);

  if (isSignedIn) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn path="/signin" routing="path" signUpUrl="/signup" afterSignInUrl="/dashboard" />
    </div>
  );
}

