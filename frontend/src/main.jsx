//lazyLoading , Suspense

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SelectedProjectProvider } from './hooks/selectProjectProvider'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient=new QueryClient();

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    

       <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/signup">
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
    <SelectedProjectProvider>
      <App />
      </SelectedProjectProvider>
      </QueryClientProvider>
    </BrowserRouter>
    </ClerkProvider>
   

  </StrictMode>,
)
