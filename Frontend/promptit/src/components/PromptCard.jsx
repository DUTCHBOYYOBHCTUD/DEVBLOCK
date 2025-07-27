import React, { useState } from 'react';
import axios from 'axios';

const PromptCard = ({ prompt, votes, onVoteUpdate }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [userVote, setUserVote] = useState(null);

  const handleVote = async (voteType) => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/vote', {
        prompt: prompt,
        voteType: voteType
      });
      
      setCurrentVotes(response.data.votes);
      setUserVote(voteType);
      if (onVoteUpdate) onVoteUpdate();
    } catch (error) {
      console.error('Vote failed:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleSavePrompt = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save prompts');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post('http://localhost:5000/api/profile/save-prompt', {
        prompt: prompt
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      alert('✅ Prompt saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      if (error.response?.status === 401) {
        alert('Please login to save prompts');
      } else {
        alert('Failed to save prompt. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card mb-3" style={{ background: '#2a2a2a', border: '1px solid #444' }}>
      <div className="card-body">
        <p className="card-text" style={{ color: '#fff', fontSize: '1.1rem' }}>
          {prompt}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${userVote === 'up' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => handleVote('up')}
              disabled={isVoting}
            >
              👍 {currentVotes > 0 ? currentVotes : ''}
            </button>
            
            <button
              className={`btn btn-sm ${userVote === 'down' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => handleVote('down')}
              disabled={isVoting}
            >
              👎 {currentVotes < 0 ? Math.abs(currentVotes) : ''}
            </button>
          </div>

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleSavePrompt}
            disabled={isSaving}
          >
            {isSaving ? '💾 Saving...' : '💾 Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
