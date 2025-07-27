import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');

  // TEST: Add this console log to verify this file is being used
  console.log('🔥 PAGES/HOME.JSX IS LOADING');

  const fetchPosts = async (sortType = 'trending') => {
    setLoading(true);
    try {
      let endpoint = 'http://localhost:5001/api/prompts';
      
      // Different endpoints for different sorting
      switch(sortType) {
        case 'trending':
          endpoint = 'http://localhost:5001/api/prompts?sort=trending';
          break;
        case 'recent':
          endpoint = 'http://localhost:5001/api/prompts?sort=recent';
          break;
        case 'top':
          endpoint = 'http://localhost:5001/api/top';
          break;
        default:
          endpoint = 'http://localhost:5001/api/prompts';
      }

      const response = await axios.get(endpoint);
      const prompts = response.data.map(prompt => ({
        id: prompt._id,
        title: `Prompt #${prompt._id.slice(-4)}`,
        prompt: prompt.prompt,
        description: prompt.prompt.substring(0, 100) + '...',
        author: 'user',
        timeAgo: new Date(prompt.createdAt).toLocaleDateString(),
        votes: prompt.votes,
        comments: 0,
        category: 'General'
      }));
      setPosts(prompts);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      setPosts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchPosts(tab);
  };

  useEffect(() => {
    let vantaEffect = null;

    const initVanta = () => {
      const element = document.getElementById("vanta-background");
      if (window.VANTA && window.THREE && element) {
        vantaEffect = window.VANTA.DOTS({
          el: element,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x661f9f,
          color2: 0x8720ff,
          backgroundColor: 0x000000
        });
      }
    };

    const loadScripts = () => {
      if (!window.THREE) {
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        script1.onload = () => {
          if (!window.VANTA) {
            const script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/gh/tengbao/vanta/dist/vanta.dots.min.js';
            script2.onload = () => {
              setTimeout(initVanta, 100);
            };
            document.head.appendChild(script2);
          } else {
            setTimeout(initVanta, 100);
          }
        };
        document.head.appendChild(script1);
      } else if (!window.VANTA) {
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/gh/tengbao/vanta/dist/vanta.dots.min.js';
        script2.onload = () => {
          setTimeout(initVanta, 100);
        };
        document.head.appendChild(script2);
      } else {
        setTimeout(initVanta, 100);
      }
    };

    fetchPosts('trending');
    loadScripts();

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <div 
        id="vanta-background" 
        style={{ 
          height: '100vh', 
          width: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          paddingLeft: '7vw',
          paddingTop: '12vh',
          backgroundColor: '#000000'
        }}
      >
        <div className="text-white" style={{ textAlign: 'left', zIndex: 1 }}>
          <h1 className="display-4 fw-bold mb-4" style={{ 
            textAlign: 'left',
            letterSpacing: '2px',
            fontFamily: "'JetBrains Mono', 'Raleway', monospace",
            fontWeight: 900,
            fontSize: '4rem',
            color: '#8720ff',
            textShadow: `
              1px 1px 0 #661f9f,
              2px 2px 0 #5a1a8a,
              3px 3px 0 #4d1575,
              4px 4px 0 #401060,
              5px 5px 0 #330b4b,
              6px 6px 0 #260636,
              7px 7px 0 #190121,
              8px 8px 10px rgba(0,0,0,0.4),
              10px 10px 20px rgba(135, 32, 255, 0.3)
            `,
            transform: 'perspective(1000px) rotateX(15deg) rotateY(-5deg)',
            display: 'inline-block',
            transition: 'all 0.3s ease'
          }}>
            PromptHub
          </h1>
          <p className="lead mb-4" style={{ 
            textAlign: 'left',
            fontFamily: "'JetBrains Mono', 'Raleway', monospace",
            fontSize: '1.3rem',
            fontWeight: 400
          }}>
            Prompt.Rank.Earn.Repeat
          </p>
        </div>
      </div>

      <div className="container-fluid py-5" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-white" style={{ 
                fontFamily: "'JetBrains Mono', 'Raleway', monospace",
                fontSize: '1.8rem',
                fontWeight: 600,
                letterSpacing: '1px'
              }}>
                {activeTab === 'trending' && '🔥 Trending Prompts'}
                {activeTab === 'recent' && '⚡ Recent Prompts'}
                {activeTab === 'top' && '⭐ Top Rated Prompts'}
              </h2>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleTabChange('trending')}
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    background: activeTab === 'trending' ? 'linear-gradient(135deg, #ff6b9d, #c44569)' : 'transparent',
                    border: activeTab === 'trending' ? 'none' : '2px solid #ff6b9d',
                    color: activeTab === 'trending' ? '#fff' : '#ff6b9d',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔥 Hot
                </button>
                
                <button 
                  onClick={() => handleTabChange('recent')}
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    background: activeTab === 'recent' ? 'linear-gradient(135deg, #74b9ff, #0984e3)' : 'transparent',
                    border: activeTab === 'recent' ? 'none' : '2px solid #74b9ff',
                    color: activeTab === 'recent' ? '#fff' : '#74b9ff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ⚡ New
                </button>
                
                <button 
                  onClick={() => handleTabChange('top')}
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    background: activeTab === 'top' ? 'linear-gradient(135deg, #a29bfe, #6c5ce7)' : 'transparent',
                    border: activeTab === 'top' ? 'none' : '2px solid #a29bfe',
                    color: activeTab === 'top' ? '#fff' : '#a29bfe',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ⭐ Top
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center text-white">Loading prompts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center text-white">No prompts yet. Be the first to create one!</div>
            ) : (
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
