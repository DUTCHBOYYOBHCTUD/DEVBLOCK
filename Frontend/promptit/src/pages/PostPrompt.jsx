import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostPrompt = () => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5001/api/submit', {
        prompt: prompt.trim()
      });

      alert('Prompt posted successfully!');
      setPrompt('');
      navigate('/');
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to post prompt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card" style={{ 
            background: '#1a1a1a', 
            border: '1px solid #333',
            borderRadius: '12px'
          }}>
            <div className="card-body">
              <h3 className="card-title text-center mb-4" style={{ color: '#8d2be2' }}>
                Post New Prompt
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Enter your creative prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      color: '#fff',
                      borderRadius: '8px'
                    }}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      background: isSubmitting ? '#666' : '#8d2be2',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Prompt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPrompt;