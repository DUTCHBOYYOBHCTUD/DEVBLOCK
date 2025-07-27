import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SavedPrompts = () => {
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const vantaRef = useRef(null);

  // Sample random prompts for demo
  const samplePrompts = [
    "Create a detailed character description for a cyberpunk detective in Neo-Tokyo",
    "Write a compelling product description for an eco-friendly water bottle",
    "Generate a creative social media caption for a sunset beach photo",
    "Develop a professional email template for following up with clients",
    "Create an engaging opening paragraph for a mystery novel",
    "Write a persuasive pitch for a mobile app that helps with meditation",
    "Generate creative names for a coffee shop in a small mountain town",
    "Create a detailed recipe for fusion tacos with Asian flavors"
  ];

  useEffect(() => {
    loadSavedPrompts();
  }, []);

  // Initialize Vanta NET background
  useEffect(() => {
    let vantaEffect = null;
    
    const initVanta = () => {
      if (window.VANTA && window.THREE && vantaRef.current) {
        vantaEffect = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x8d2be2,
          backgroundColor: 0x000000,
          points: 8,
          maxDistance: 18,
          spacing: 20,
          showDots: true
        });
      }
    };

    // Load scripts if not already loaded
    if (!window.THREE) {
      const script1 = document.createElement('script');
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      script1.onload = () => {
        if (!window.VANTA) {
          const script2 = document.createElement('script');
          script2.src = 'https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js';
          script2.onload = initVanta;
          document.head.appendChild(script2);
        } else {
          initVanta();
        }
      };
      document.head.appendChild(script1);
    } else if (!window.VANTA) {
      const script2 = document.createElement('script');
      script2.src = 'https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js';
      script2.onload = initVanta;
      document.head.appendChild(script2);
    } else {
      initVanta();
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []);

  const loadSavedPrompts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, show sample prompts
        setSavedPrompts(samplePrompts);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userSavedPrompts = response.data.savedPrompts || [];
      // If user has no saved prompts, show sample prompts
      setSavedPrompts(userSavedPrompts.length > 0 ? userSavedPrompts : samplePrompts);
    } catch (error) {
      console.error('Error loading saved prompts:', error);
      // On error, show sample prompts
      setSavedPrompts(samplePrompts);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedPrompt = (indexToRemove) => {
    setSavedPrompts(savedPrompts.filter((_, index) => index !== indexToRemove));
  };

  if (loading) {
    return (
      <div 
        ref={vantaRef}
        style={{ 
          minHeight: '100vh',
          backgroundColor: '#000000',
          position: 'relative'
        }}
      >
        <div className="container" style={{ 
          position: 'relative',
          zIndex: 1,
          paddingTop: '5rem'
        }}>
          <div className="text-center" style={{ color: '#fff' }}>
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading saved prompts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={vantaRef}
      style={{ 
        minHeight: '100vh',
        backgroundColor: '#000000',
        position: 'relative'
      }}
    >
      <div className="container" style={{ 
        position: 'relative',
        zIndex: 1,
        paddingTop: '2rem'
      }}>
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="text-center mb-5">
              <h1 style={{ 
                color: '#8d2be2', 
                fontSize: '3rem', 
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(141, 43, 226, 0.5)',
                marginBottom: '1rem'
              }}>
                💾 Saved Prompts
              </h1>
              <p style={{ color: '#ccc', fontSize: '1.2rem' }}>
                Your collection of favorite prompts
              </p>
            </div>
            
            {savedPrompts.length > 0 ? (
              <div className="row">
                {savedPrompts.map((prompt, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div 
                      className="card h-100" 
                      style={{ 
                        background: 'rgba(42, 42, 42, 0.9)', 
                        border: '2px solid #8d2be2',
                        borderRadius: '15px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(141, 43, 226, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <span style={{ 
                            color: '#8d2be2', 
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}>
                            Prompt #{String(index + 1).padStart(3, '0')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedPrompt(index);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ff4757',
                              fontSize: '1.2rem',
                              cursor: 'pointer',
                              padding: '0',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Remove prompt"
                          >
                            ×
                          </button>
                        </div>
                        <p 
                          className="card-text flex-grow-1" 
                          style={{ 
                            color: '#fff', 
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            marginBottom: '1rem'
                          }}
                        >
                          {prompt}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <button
                            className="btn btn-sm"
                            style={{
                              background: 'linear-gradient(45deg, #8d2be2, #a855f7)',
                              border: 'none',
                              color: '#fff',
                              borderRadius: '20px',
                              padding: '8px 16px',
                              fontSize: '0.9rem',
                              fontWeight: '500'
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(prompt);
                            }}
                          >
                            📋 Copy
                          </button>
                          <span style={{ 
                            color: '#666', 
                            fontSize: '0.8rem' 
                          }}>
                            Saved
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ 
                background: 'rgba(42, 42, 42, 0.9)',
                borderRadius: '15px',
                padding: '3rem',
                border: '2px solid #444'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ color: '#8d2be2', marginBottom: '1rem' }}>No saved prompts yet</h3>
                <p style={{ color: '#ccc', fontSize: '1.1rem' }}>
                  Save prompts you like to access them later!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPrompts;