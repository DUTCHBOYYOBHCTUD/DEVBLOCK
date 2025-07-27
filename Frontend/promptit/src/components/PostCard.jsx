import React, { useState } from 'react';
import axios from 'axios';

const PostCard = ({ post, onVoteUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentVotes, setCurrentVotes] = useState(post.votes);
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState(null);

  const handleVote = async (voteType, e) => {
    e.stopPropagation(); // Prevent card expansion when voting
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      const response = await axios.post('http://localhost:5001/api/vote', {
        prompt: post.prompt,
        voteType: voteType
      });
      
      setCurrentVotes(response.data.votes);
      setUserVote(voteType);
      if (onVoteUpdate) onVoteUpdate(); // Refresh the list to reorder
    } catch (error) {
      console.error('Vote failed:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleExpand = async () => {
    setIsExpanded(!isExpanded);
    
    // Generate AI response when expanding (if not already generated)
    if (!isExpanded && !aiResponse) {
      setIsGenerating(true);
      try {
        const response = await axios.post('http://localhost:5001/api/generate', {
          idea: post.prompt
        });
        
        if (response.data.idea) {
          setAiResponse(response.data.idea);
        }
      } catch (error) {
        console.error('Failed to generate AI response:', error);
        setAiResponse('Failed to generate AI response. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div style={{
      background: '#181818',
      color: '#fff',
      borderRadius: 10,
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}>
      {/* Header - Always visible */}
      <div onClick={handleExpand}>
        <div style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: 6 }}>
          {post.title}
        </div>
        <div style={{ 
          fontSize: '0.98rem', 
          color: '#bbb', 
          marginBottom: 10,
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'none' : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {isExpanded ? post.prompt : post.description}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.92rem', 
          color: '#aaa',
          alignItems: 'center'
        }}>
          <span>by {post.author} • {post.timeAgo}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Cute Voting Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={(e) => handleVote('up', e)}
                disabled={isVoting}
                style={{
                  background: userVote === 'up' ? '#ff6b9d' : 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  cursor: isVoting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: isVoting ? 0.6 : 1,
                  transform: userVote === 'up' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(255, 107, 157, 0.3)'
                }}
              >
                💖 {currentVotes > 0 ? currentVotes : 0}
              </button>
              
              <button
                onClick={(e) => handleVote('down', e)}
                disabled={isVoting}
                style={{
                  background: userVote === 'down' ? '#74b9ff' : 'linear-gradient(135deg, #74b9ff, #0984e3)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  cursor: isVoting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: isVoting ? 0.6 : 1,
                  transform: userVote === 'down' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(116, 185, 255, 0.3)'
                }}
              >
                💙
              </button>
            </div>
            
            <span>💬 {post.comments}</span>
            <span style={{ color: '#8720ff', fontSize: '0.8rem' }}>
              {isExpanded ? '▲ Collapse' : '▼ Expand'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Original Prompt Box */}
            <div style={{
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h6 style={{ color: '#8720ff', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                📝 Original Prompt
              </h6>
              <div style={{ 
                color: '#fff', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap'
              }}>
                {post.prompt}
              </div>
            </div>

            {/* AI Response Box */}
            <div style={{
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h6 style={{ color: '#8720ff', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                🤖 AI Generated Response
              </h6>
              <div style={{ 
                color: '#fff', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
                minHeight: '100px'
              }}>
                {isGenerating ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100px',
                    color: '#8720ff'
                  }}>
                    <div>🔄 Generating response...</div>
                  </div>
                ) : aiResponse || (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                    Click to generate AI response for this prompt
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            marginTop: '1rem', 
            display: 'flex', 
            gap: '0.5rem',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(post.prompt);
                alert('Prompt copied to clipboard!');
              }}
              style={{
                background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(162, 155, 254, 0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📋 Copy Prompt
            </button>
            {aiResponse && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(aiResponse);
                  alert('AI response copied to clipboard!');
                }}
                style={{
                  background: 'linear-gradient(135deg, #fd79a8, #e84393)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(253, 121, 168, 0.3)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                📋 Copy Response
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
