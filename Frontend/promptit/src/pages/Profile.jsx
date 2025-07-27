import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [account, setAccount] = useState(null);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Updated contract addresses to match deployed.json
  const NFT_CONTRACT_ADDRESS = '0x6eD0045C2245D200a4e70411f1Ad4107b94f9371';
  const PROMPT_TOKEN_ADDRESS = '0xDE2B385Ef08239B60Ea1cc28ee0A101e47E21d02';

  // NFT metadata
  const nftMetadata = {
    1: { name: "PromptMaster #1", image: "/images/1.jpeg", description: "Awarded to the most innovative prompter" },
    2: { name: "PromptMaster #2", image: "/images/2.jpeg", description: "Excellence in AI prompt engineering" },
    3: { name: "PromptMaster #3", image: "/images/3.jpeg", description: "Master of creative AI interactions" },
    4: { name: "PromptMaster #4", image: "/images/4.jpeg", description: "Advanced prompt strategist" },
    5: { name: "PromptMaster #5", image: "/images/5.jpeg", description: "Ultimate AI prompt architect" }
  };

  useEffect(() => {
    checkConnection();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Token from localStorage:', token);
      
      if (token) {
        console.log('📡 Making request to profile API...');
        const response = await fetch('http://localhost:5001/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('📊 Response status:', response.status);
        
        if (response.ok) {
          const profileData = await response.json();
          console.log('✅ Profile data received:', profileData);
          setUserProfile(profileData);
        } else {
          console.log('❌ Profile request failed:', response.status);
          const errorText = await response.text();
          console.log('Error details:', errorText);
        }
      } else {
        console.log('❌ No token found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
    }
  };

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await loadOwnedNFTs(accounts[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking connection:', error);
        setLoading(false);
      }
    }
  };

  const loadOwnedNFTs = async (address) => {
    try {
      const owned = [];
      
      // Check each NFT ID (1-5) to see if user owns it
      for (let tokenId = 1; tokenId <= 5; tokenId++) {
        try {
          const data = '0x6352211e' + tokenId.toString(16).padStart(64, '0'); // ownerOf(tokenId)
          const result = await window.ethereum.request({
            method: 'eth_call',
            params: [{
              to: NFT_CONTRACT_ADDRESS,
              data: data
            }, 'latest']
          });

          if (result && result !== '0x') {
            const owner = '0x' + result.slice(-40);
            if (owner.toLowerCase() === address.toLowerCase()) {
              owned.push({
                tokenId,
                ...nftMetadata[tokenId]
              });
            }
          }
        } catch (error) {
          // NFT doesn't exist or other error, skip
          console.log(`NFT ${tokenId} check failed:`, error);
        }
      }

      setOwnedNFTs(owned);
    } catch (error) {
      console.error('Error loading owned NFTs:', error);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  if (!account) {
    return (
      <div className="profile-container">
        <div className="connect-message">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to view your NFT collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>🎭 My Profile</h1>
        <div className="wallet-address">
          📍 {account.slice(0, 6)}...{account.slice(-4)}
        </div>
        
        {userProfile && (
          <div className="user-info">
            <h2>👤 {userProfile.username}</h2>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-label">📝 Saved Prompts:</span>
                <span className="stat-value">{userProfile.savedPrompts?.length || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="nft-collection">
        {ownedNFTs.length > 0 ? (
          <div className="owned-nfts">
            <h2>Your PromptMaster NFTs ({ownedNFTs.length})</h2>
            <div className="nft-grid">
              {ownedNFTs.map((nft) => (
                <div key={nft.tokenId} className="owned-nft-card">
                  <div className="nft-image">
                    <img src={nft.image} alt={nft.name} />
                    <div className="token-id">#{nft.tokenId}</div>
                  </div>
                  <div className="nft-details">
                    <h3>{nft.name}</h3>
                    <p>{nft.description}</p>
                    <div className="ownership-badge">✅ Owned</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-nfts">
            <h2>🎨 No NFTs Yet</h2>
            <p>You don't own any PromptMaster NFTs yet.</p>
            <p>Visit the NFT Shop to purchase your first NFT!</p>
            <a href="/nft-shop" className="shop-link">
              🛒 Browse NFT Shop
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;







