// Home.jsx
import { useNavigate } from 'react-router-dom';
import React from 'react';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/router');
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-title">
          <span style={{ marginRight: '8px', fontSize: '24px' }}>⚡</span>
          Smart Route-Optimizer
        </div>
      </nav>

      <div className="hero-section">
        <div className="circle circle-top"></div>
        <div className="circle circle-bottom"></div>

        <div className="hero-content">
          <div>
            <h1 className="hero-heading">
              Route Optimizer
            </h1>
            <p className="hero-subtext">
               Plan efficient routes. Get smart location suggestions. Visualize paths on the map. Deliver faster, every time.
            </p>
          </div>

          <div>
            <button className="cta-button" onClick={handleGetStarted}>
              Get Started <span style={{ marginLeft: '8px', fontSize: '16px' }}>→</span>
            </button>
          </div>

          <div className="features">
            <div className="feature-code">
              <div className="feature-dot"></div>Optimized multi-stop
            </div>
            <div className="feature-ai">
              <div className="feature-dot"></div>Live map with path visualization
            </div>
            <div className="feature-lint">
              <div className="feature-dot"></div>Smart location
            </div>
          </div>
        </div>

        {window.innerWidth > 768 && (
          <>
            <div className="floating-snippet" style={{ top: '80px', left: '40px' }}>
              <div>Smart Routes, Faster Deliveries.</div>
            </div>
            <div className="floating-snippet" style={{ bottom: '80px', left: '40px' }}>
              <div>Optimized Paths. Real-time Precision.</div>
            </div>
            <div className="floating-snippet snippet-right" style={{ bottom: '80px', right: '40px' }}>
              <div>From A to B — Smarter, Not Harder.</div>
            </div>
          </>
        )}
      </div>

      <div className="footer">
        © 2025 Umer Jahangir. Empowering developers worldwide.
      </div>
    </div>
  );
};

export default Home;
