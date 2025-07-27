import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Generate = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [contentType, setContentType] = useState('');
  const vantaRef = useRef(null);
  const navigate = useNavigate();

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
          points: 10,
          maxDistance: 20,
          spacing: 15,
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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');
    setGeneratedImage('');
    setContentType('');

    try {
      const response = await axios.post('http://localhost:5001/api/generate', {
        idea: prompt.trim()
      });

      if (response.data.idea) {
        setGeneratedContent(response.data.idea);
        
        // Detect content type based on prompt keywords
        const lowerPrompt = prompt.toLowerCase();
        if (lowerPrompt.includes('story') || lowerPrompt.includes('tale') || lowerPrompt.includes('narrative')) {
          setContentType('story');
        } else if (lowerPrompt.includes('image') || lowerPrompt.includes('photo') || lowerPrompt.includes('picture')) {
          setContentType('image');
          // Generate image for image prompts
          await generateImage(response.data.idea);
        } else if (lowerPrompt.includes('code') || lowerPrompt.includes('program') || lowerPrompt.includes('function')) {
          setContentType('code');
        } else if (lowerPrompt.includes('poem') || lowerPrompt.includes('poetry')) {
          setContentType('poem');
        } else {
          setContentType('text');
        }
      } else {
        alert('Failed to generate content');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (imagePrompt) => {
    try {
      const response = await axios.post('http://localhost:5001/api/generate-image', {
        prompt: imagePrompt
      });
      
      if (response.data.imageUrl) {
        setGeneratedImage(response.data.imageUrl);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      // Don't show error for image generation failure
    }
  };

  const handlePost = async () => {
    if (!generatedContent.trim()) {
      alert('No content to post');
      return;
    }

    setIsPosting(true);
    try {
      console.log('Posting content:', generatedContent.trim());
      
      const response = await axios.post('http://localhost:5001/api/prompts', {
        prompt: generatedContent.trim()
      });
      
      console.log('Post response:', response.data);
      alert('Content posted successfully! Check the homepage to see it.');
      navigate('/');
    } catch (error) {
      console.error('Post failed:', error.response?.data || error.message);
      alert(`Failed to post content: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  const getContentIcon = () => {
    switch (contentType) {
      case 'story': return '📚';
      case 'image': return '🖼️';
      case 'code': return '💻';
      case 'poem': return '🎭';
      default: return '✨';
    }
  };

  const getContentTitle = () => {
    switch (contentType) {
      case 'story': return 'Generated Story';
      case 'image': return 'Image Description';
      case 'code': return 'Generated Code';
      case 'poem': return 'Generated Poem';
      default: return 'Generated Content';
    }
  };

  return (
    <div 
      ref={vantaRef}
      style={{ 
        minHeight: '100vh',
        backgroundColor: '#000000',
        position: 'relative'
      }}
    >
      <div className="container-fluid" style={{ 
        position: 'relative',
        zIndex: 1,
        paddingTop: '2rem'
      }}>
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="card" style={{ 
              background: '#1a1a1a', 
              border: '1px solid #333',
              borderRadius: '12px'
            }}>
              <div className="card-body">
                <h3 className="card-title text-center mb-4" style={{ color: '#8d2be2' }}>
                   AI Content Creator
                </h3>
                <p className="text-center mb-4" style={{ color: '#666' }}>
                  Create stories, images, code, poems, and more with AI!
                </p>
                
                {/* Input Section */}
                <div className="mb-4">
                  <label className="form-label" style={{ color: '#fff', fontWeight: 'bold' }}>
                    What would you like to create?
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Examples:
• Write a short story about a magical forest
• Create an image of a sunset over mountains  
• Generate Python code for a calculator
• Write a poem about friendship"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    disabled={isGenerating}
                  />
                </div>
                
                {/* Generate Button */}
                <div className="text-center mb-4">
                  <button
                    className="btn btn-lg"
                    style={{
                      background: isGenerating ? '#666' : 'linear-gradient(90deg, #661f9f 0%, #8720ff 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '15px 40px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(130,32,255,0.3)'
                    }}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Generating...
                      </>
                    ) : (
                      <>✨ Create Content</>
                    )}
                  </button>
                </div>

                {/* Generated Content Display */}
                {generatedContent && (
                  <div className="mt-4">
                    <div className="card" style={{
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '12px'
                    }}>
                      <div className="card-header" style={{ 
                        background: '#333', 
                        borderBottom: '1px solid #444',
                        borderRadius: '12px 12px 0 0'
                      }}>
                        <h5 className="mb-0" style={{ color: '#8d2be2' }}>
                          {getContentIcon()} {getContentTitle()}
                        </h5>
                      </div>
                      <div className="card-body">
                        <div style={{ 
                          color: '#fff', 
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          fontFamily: contentType === 'code' ? 'monospace' : 'inherit'
                        }}>
                          {generatedContent}
                        </div>
                        
                        {/* Generated Image Display */}
                        {generatedImage && contentType === 'image' && (
                          <div className="mt-4">
                            <h6 style={{ color: '#8d2be2' }}>Generated Image:</h6>
                            <img 
                              src={generatedImage} 
                              alt="Generated content" 
                              style={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                border: '1px solid #444'
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="d-flex gap-2 mt-4">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleCopy}
                          >
                            📋 Copy
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={handlePost}
                            disabled={isPosting}
                          >
                            {isPosting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                Posting...
                              </>
                            ) : (
                              <>📤 Post to Community</>
                            )}
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setPrompt(generatedContent)}
                          >
                            🔄 Use as New Prompt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Examples */}
                <div className="mt-5">
                  <h6 style={{ color: '#8d2be2' }}>Quick Examples:</h6>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <button 
                        className="btn btn-outline-secondary btn-sm w-100"
                        onClick={() => setPrompt('Write a short story about a time traveler who gets stuck in the past')}
                        disabled={isGenerating}
                      >
                        📚 Story Example
                      </button>
                    </div>
                    <div className="col-md-6 mb-2">
                      <button 
                        className="btn btn-outline-secondary btn-sm w-100"
                        onClick={() => setPrompt('Create an image of a futuristic city at night with neon lights')}
                        disabled={isGenerating}
                      >
                        🖼️ Image Example
                      </button>
                    </div>
                    <div className="col-md-6 mb-2">
                      <button 
                        className="btn btn-outline-secondary btn-sm w-100"
                        onClick={() => setPrompt('Write Python code for a simple to-do list application')}
                        disabled={isGenerating}
                      >
                        💻 Code Example
                      </button>
                    </div>
                    <div className="col-md-6 mb-2">
                      <button 
                        className="btn btn-outline-secondary btn-sm w-100"
                        onClick={() => setPrompt('Write a poem about the beauty of nature in spring')}
                        disabled={isGenerating}
                      >
                        🎭 Poem Example
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;







