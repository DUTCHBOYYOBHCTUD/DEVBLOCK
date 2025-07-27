import React, { useState } from 'react';
import { generateAPI } from '../services/api';

const Generate = () => {
  const [userIdea, setUserIdea] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await generateAPI.generateIdea(userIdea);
      
      if (response.idea) {
        setGeneratedIdea(response.idea);
      } else {
        setError('Failed to generate idea');
      }
    } catch (err) {
      setError('Error generating idea: ' + err.message);
      console.error('Generate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomGenerate = async () => {
    setUserIdea(''); // Clear input for random generation
    await handleGenerate();
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>🎯 AI Idea Generator</h3>
              <p className="mb-0">Get creative prompts from AI!</p>
            </div>
            <div className="card-body">
              {/* Input Section */}
              <div className="mb-3">
                <label className="form-label">Your Idea (optional):</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={userIdea}
                  onChange={(e) => setUserIdea(e.target.value)}
                  placeholder="Enter your idea or leave blank for a random prompt..."
                />
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 mb-3">
                <button
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : '✨ Generate Idea'}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleRandomGenerate}
                  disabled={loading}
                >
                  🎲 Random Idea
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {/* Generated Idea Display */}
              {generatedIdea && (
                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="card-title">💡 Generated Idea:</h5>
                    <p className="card-text">{generatedIdea}</p>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => navigator.clipboard.writeText(generatedIdea)}
                    >
                      📋 Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;