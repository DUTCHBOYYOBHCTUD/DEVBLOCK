import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Submit from './components/Submit';
import Wallet from './pages/Wallet';
import SavedPrompts from './pages/SavedPrompts';
import PostPrompt from './pages/PostPrompt';
import Shop from './pages/Shop';
import Generate from './pages/Generate';
import Profile from './pages/Profile';
import LoadingPage from './components/LoadingPage';
import NFTShop from './pages/NFTShop';
import Categories from './pages/Categories';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const sidebarRef = useRef(null);

  // Check if app has loaded before (using sessionStorage for this session only)
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('appHasLoaded');
    if (hasLoaded) {
      setShowLoading(false);
      setHasLoadedOnce(true);
    }
  }, []);

  // Sidebar hover handlers
  const handleSidebarMouseEnter = () => setSidebarOpen(true);
  const handleSidebarMouseLeave = () => setSidebarOpen(false);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setHasLoadedOnce(true);
    // Remember that loading has completed for this session
    sessionStorage.setItem('appHasLoaded', 'true');
  };

  // Only show loading screen on first visit of the session
  if (showLoading && !hasLoadedOnce) {
    return <LoadingPage onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/savedprompt" element={<SavedPrompts />} />
        <Route path="/post" element={<PostPrompt />} />
        <Route path="/shop" element={<NFTShop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nft-shop" element={<NFTShop />} />
      </Routes>
      {/* Fixed Right Sidebar */}
      <div
        ref={sidebarRef}
        className={`right-sidebar${sidebarOpen ? ' open' : ''}`}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: '#111',
            color: '#fff',
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            boxShadow: sidebarOpen ? '-4px 0 16px rgba(0,0,0,0.2)' : 'none',
            width: sidebarOpen ? 220 : 32,
            transition: 'width 0.25s cubic-bezier(.4,2,.6,1)',
            height: '50vh',
            marginRight: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: sidebarOpen ? 'flex-start' : 'center',
            padding: sidebarOpen ? '24px 0 24px 18px' : '0',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* Tab/Handle */}
          {!sidebarOpen && (
            <div style={{ width: 50, height: 400, background: '#8720ff', borderRadius: 6, marginLeft: 20 }} />
          )}
          {/* Sidebar Content */}
          {sidebarOpen && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
              <li 
                style={{ 
                  margin: '24px 0', 
                  fontSize: 18, 
                  fontWeight: 500,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'left center',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.15) translateX(5px)';
                  e.target.style.fontSize = '20px';
                  e.target.style.letterSpacing = '0.5px';
                  e.target.style.textShadow = '0 0 10px rgba(135, 32, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateX(0)';
                  e.target.style.fontSize = '18px';
                  e.target.style.letterSpacing = '0px';
                  e.target.style.textShadow = 'none';
                }}
              >
                <a href="/savedprompt" style={{ color: '#fff', textDecoration: 'none' }}>Saved Prompts</a>
              </li>
              <li 
                style={{ 
                  margin: '24px 0', 
                  fontSize: 18, 
                  fontWeight: 500,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'left center',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.15) translateX(5px)';
                  e.target.style.fontSize = '20px';
                  e.target.style.letterSpacing = '0.5px';
                  e.target.style.textShadow = '0 0 10px rgba(135, 32, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateX(0)';
                  e.target.style.fontSize = '18px';
                  e.target.style.letterSpacing = '0px';
                  e.target.style.textShadow = 'none';
                }}
              >
                <a href="/categories" style={{ color: '#fff', textDecoration: 'none' }}>Categories</a>
              </li>
              <li 
                style={{ 
                  margin: '24px 0', 
                  fontSize: 18, 
                  fontWeight: 500,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'left center',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.15) translateX(5px)';
                  e.target.style.fontSize = '20px';
                  e.target.style.letterSpacing = '0.5px';
                  e.target.style.textShadow = '0 0 10px rgba(135, 32, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateX(0)';
                  e.target.style.fontSize = '18px';
                  e.target.style.letterSpacing = '0px';
                  e.target.style.textShadow = 'none';
                }}
              >
                <a href="/shop" style={{ color: '#fff', textDecoration: 'none' }}>Shop</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;





















