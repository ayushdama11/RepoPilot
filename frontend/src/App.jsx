import { useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";

import { CardWithForm } from "./CardWithForm";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import { SignUpComponent } from "./MyComponents/Login/SignUpComponent";
import { SignInComponent } from "./MyComponents/Login/SignInComponent";
import SyncUser from "./MyComponents/Login/SyncUser";
import ProtectedRoute from "./MyComponents/ProtectedRoute";
import Dashboard from "./MyComponents/Dashboard/Dashboard";
import DashboardMainContentComponent from "./MyComponents/Dashboard/DashboardMainContentComponent";
import QaComponent from "./MyComponents/Qa/QaComponent";
import SidebarLayoutComponent from "./MyComponents/Dashboard/SidebarLayoutComponent";
import CreateProjectComponent from "./MyComponents/Create/CreateProjectComponent";
import Billing from "./MyComponents/Payment/Billing";
import LandingPage from "./MyComponents/Landing Page/LandingPage";
import Meeting from "./MyComponents/Meeting/Meeting";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/meetings" element={<Meeting/>}></Route>
        <Route path="/join" element={<Meeting/>}></Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SidebarLayoutComponent>
                <DashboardMainContentComponent />
              </SidebarLayoutComponent>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/qa"
          element={
            <ProtectedRoute>
              <SidebarLayoutComponent>
                <QaComponent />
              </SidebarLayoutComponent>
            </ProtectedRoute>
          }
        ></Route>

<Route path="/billing" element={<ProtectedRoute>
  <SidebarLayoutComponent>
    <Billing/>
  </SidebarLayoutComponent>
</ProtectedRoute>}></Route>

        <Route
          path='/create'
          element={
            <ProtectedRoute>
              <SidebarLayoutComponent>
                <CreateProjectComponent/>
              </SidebarLayoutComponent>
            </ProtectedRoute>
          }
          ></Route>

        <Route path="/signup" element={<SignUpComponent />}></Route>
        <Route path="/signin" element={<SignInComponent />}></Route>

        <Route
          path="/sync-user"
          element={
            <ProtectedRoute>
              {" "}
              <SyncUser />{" "}
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
      <ToastContainer
position="top-right" 
autoClose={5000} 
hideProgressBar={false}
newestOnTop={false}
closeOnClick
pauseOnHover
/>
    </div>
  );
}

export default App;
