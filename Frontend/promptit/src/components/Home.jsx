import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PromptCard from './PromptCard';

const Home = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/prompts');
      setPrompts(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      setError('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleVoteUpdate = () => {
    // Refresh prompts after voting to update order
    fetchPrompts();
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center" style={{ color: '#fff' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading prompts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="text-center" style={{ color: '#ff6b6b' }}>
          <p>{error}</p>
          <button 
            className="btn btn-outline-primary"
            onClick={fetchPrompts}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: '#fff' }}>Top Prompts</h2>
            <button 
              className="btn btn-outline-primary"
              onClick={fetchPrompts}
            >
              🔄 Refresh
            </button>
          </div>
          
          {prompts.length === 0 ? (
            <div className="text-center" style={{ color: '#666' }}>
              <p>No prompts yet. Be the first to create one!</p>
              <a href="/generate" className="btn btn-primary mt-2">
                ✨ Create First Prompt
              </a>
            </div>
          ) : (
            prompts.map((promptData, index) => (
              <PromptCard
                key={promptData._id}
                prompt={promptData.prompt}
                votes={promptData.votes}
                onVoteUpdate={handleVoteUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
