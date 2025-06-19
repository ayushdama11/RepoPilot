// import React from 'react';
import './landingPage.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-image">
            <img width="36" height="36" src='logo.png'/>
             
              
          </div>
          <span>Repo</span>
          <span className="highlight">Pilot</span>
        </div>
        <div className="nav-buttons">
            <Link to="/signin">
            <button className="login-btn">Log In</button>
            </Link>
            <Link to="/signup">
          <button className="register-btn">Register</button>
            </Link>
        </div>
      </nav>
      
      <header className="hero">
        <h1 className="title">
          <span>Repo</span>
          <span className="highlight">Pilot</span>
        </h1>
        <p className="subtitle">Navigate your repositories with intelligence and ease</p>
        <Link to='/dashboard'>
        <button className="cta-btn">Try AI-Powered RepoPilot</button>
        </Link>
      </header>
      
      <section className="features">
        <h2>Powerful Features for Developers</h2>
        
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#e0e7ff" />
                <path d="M4 14h4v3H4v-3zm6-3h4v6h-4v-6zm6-5h4v11h-4V6z" fill="#6366f1" />
              </svg>
            </div>
            <h3>Commit Summary</h3>
            <p>Get clear, concise summaries of commits to understand changes at a glance</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#e0e7ff" />
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#6366f1" />
              </svg>
            </div>
            <h3>Intelligent Code Search</h3>
            <p>Find code snippets, functions, and patterns with vector search </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#e0e7ff" />
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#6366f1" />
              </svg>
            </div>
            <h3>Repository Organization</h3>
            <p>Make your onboarding a cake walk</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#e0e7ff" />
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#6366f1" />
              </svg>
            </div>
            <h3>Developer Collaboration</h3>
            <p>Invite members to work seamlessly with you on your project</p>
          </div>
        </div>
      </section>
      
     
      <section className="pricing">
        <h2>Simple, Transparent Pricing</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Free</h3>
            <div className="price">$0</div>
            <ul>
              <li>Get started with 150 free credits</li>
              
            </ul>
            {/* <button className="pricing-btn">Get Started</button> */}
          </div>
          
          <div className="pricing-card highlighted">
            <h3>Pro</h3>
            <div className="price">$1<span>/50 credits</span></div>
        
            {/* <button className="pricing-btn">Try Pro</button> */}
          </div>
          
        </div>
      </section>
      
     
    </div>
  );
};

export default LandingPage;