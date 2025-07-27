import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef(null);
  const createDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5001/api/prompts`);
      const allPrompts = response.data;
      
      // Filter prompts based on search query or prompt ID
      const filtered = allPrompts.filter(prompt => {
        const promptText = prompt.prompt.toLowerCase();
        const searchTerm = query.toLowerCase();
        const promptId = prompt._id.slice(-4); // Last 4 characters of ID
        
        // Search by prompt content OR prompt ID
        return promptText.includes(searchTerm) || promptId.includes(searchTerm);
      }).slice(0, 5); // Show max 5 results
      
      setSearchResults(filtered);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSearchResultClick = (prompt) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate('/');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Only add listener when dropdown is open
    if (dropdownOpen) {
      // Use a small delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Close create dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target)) {
        setCreateDropdownOpen(false);
      }
    };

    if (createDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [createDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', 
      borderBottom: '1px solid #333',
      padding: '12px 0'
    }}>
      <div className="container-fluid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Brand with Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/final/logo.png" 
            alt="PromptHub Logo" 
            style={{ 
              width: '40px', 
              height: '40px', 
              objectFit: 'contain',
              filter: 'brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(2000%) hue-rotate(270deg) brightness(120%) contrast(110%)'
            }} 
          />
          <a 
            className="navbar-brand" 
            href="/" 
            style={{ 
              color: '#8d2be2',
              fontSize: '1.5rem', 
              fontWeight: 700, 
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif', 
              letterSpacing: '0.5px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              margin: 0
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            PromptHub
          </a>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }} ref={searchRef}>
          <input
            type="search"
            className="form-control navbar-search-input"
            placeholder="🔍 search prompts"
            value={searchQuery}
            onChange={handleSearchInputChange}
            style={{
              background: '#23232a',
              border: '2px solid #000',
              borderRadius: 6,
              color: '#fff',
              width: 600,
              fontSize: '1.2rem',
              marginRight: 8,
              outline: 'none',
              boxShadow: 'none',
              padding: '3px 20px',
              textAlign: 'left'
            }}
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            background: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '4px'
          }}>
            {searchResults.map((prompt, index) => (
              <div
                key={prompt._id}
                onClick={() => handleSearchResultClick(prompt)}
                style={{
                  padding: '12px 16px',
                  borderBottom: index < searchResults.length - 1 ? '1px solid #444' : 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#3a3a3a'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: '#8d2be2',
                    fontWeight: 'bold'
                  }}>
                    Prompt #{prompt._id.slice(-4)}
                  </span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: '#888' 
                  }}>
                    {prompt.votes || 0} votes
                  </span>
                </div>
                <div style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {prompt.prompt.length > 80 ? prompt.prompt.substring(0, 80) + '...' : prompt.prompt}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Button */}
        <button
          className="btn create-btn"
          style={{
            background: 'linear-gradient(90deg, #661f9f 0%, #8720ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            fontSize: '1.2rem',
            fontWeight: 700,
            padding: '6px 28px 6px 20px',
            marginLeft: 16,
            marginRight: 24,
            boxShadow: '0 2px 12px 0 rgba(130,32,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'box-shadow 0.2s',
          }}
          onClick={() => navigate('/generate')}
        >
          <span style={{ fontSize: '1.5rem', fontWeight: 400, marginRight: 6 }}>+</span>
          <span style={{ fontWeight: 700 }}>Create</span>
        </button>

        {/* Login/Profile Section */}
        {isLoggedIn ? (
          <div className="dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="btn"
              style={{
                background: '#8d2be2',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.2rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                outline: 'none',
                boxShadow: 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Current dropdown state:', dropdownOpen);
                setDropdownOpen(prev => !prev);
              }}
            >
              {username.charAt(0).toUpperCase()}
            </button>
            {dropdownOpen && (
              <ul 
                className="dropdown-menu dropdown-menu-end show" 
                style={{ 
                  position: 'absolute', 
                  top: '100%',
                  right: 0,
                  zIndex: 1000,
                  minWidth: '200px',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  padding: '8px 0'
                }}
              >
                <li><span className="dropdown-item-text" style={{ padding: '8px 16px', color: '#333' }}>Hello, {username}!</span></li>
                <li><hr className="dropdown-divider" style={{ margin: '8px 0' }} /></li>
                <li><a className="dropdown-item" href="/profile" style={{ padding: '8px 16px', color: '#333', textDecoration: 'none' }}>Profile</a></li>
                <li><a className="dropdown-item" href="/wallet" style={{ padding: '8px 16px', color: '#333', textDecoration: 'none' }}>My Wallet</a></li>
                <li><a className="dropdown-item" href="/savedprompt" style={{ padding: '8px 16px', color: '#333', textDecoration: 'none' }}>Saved Prompts</a></li>
                <li><hr className="dropdown-divider" style={{ margin: '8px 0' }} /></li>
                <li><span className="dropdown-item-text" style={{ fontSize: '0.9rem', color: '#666', padding: '8px 16px' }}>Signed in as: <strong>{username}</strong></span></li>
                <li><button className="dropdown-item" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '8px 16px', border: 'none', background: 'none', color: '#333' }}>Logout</button></li>
              </ul>
            )}
          </div>
        ) : (
          <button
            className="btn"
            style={{
              background: '#8d2be2',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: '1.2rem',
              fontWeight: 500,
              padding: '3px 10px',
              marginLeft: 0
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
