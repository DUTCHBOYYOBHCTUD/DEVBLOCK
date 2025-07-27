import React, { useState, useEffect } from 'react';
import './Shop.css';

const Shop = () => {
  const [account, setAccount] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [promptBalance, setPromptBalance] = useState('0');

  // Contract addresses from deployed.json
  const PROMPT_TOKEN_ADDRESS = '0x0c8432F1680BD45aF1C2f3E316f8750aE2813Dab';
  const NFT_CONTRACT_ADDRESS = '0x25E52077eF9c78AbDf1F847D1013FdaD3362bcc7';

  // NFT metadata
  const nftMetadata = [
    {
      id: 1,
      name: "PromptMaster #1",
      description: "Awarded to the most innovative prompter in Proof-of-Brainstorm.",
      image: "/images/1.jpeg",
      price: "100",
      attributes: [
        { trait_type: "Category", value: "Creativity" },
        { trait_type: "Rank", value: "Legendary" },
        { trait_type: "Token Reward", value: "100 POB" }
      ]
    },
    {
      id: 2,
      name: "PromptMaster #2",
      description: "Excellence in AI prompt engineering.",
      image: "/images/2.jpeg",
      price: "200",
      attributes: [
        { trait_type: "Category", value: "Technical" },
        { trait_type: "Rank", value: "Epic" },
        { trait_type: "Token Reward", value: "200 POB" }
      ]
    },
    {
      id: 3,
      name: "PromptMaster #3",
      description: "Master of creative AI interactions.",
      image: "/images/3.jpeg",
      price: "300",
      attributes: [
        { trait_type: "Category", value: "Innovation" },
        { trait_type: "Rank", value: "Rare" },
        { trait_type: "Token Reward", value: "300 POB" }
      ]
    },
    {
      id: 4,
      name: "PromptMaster #4",
      description: "Advanced prompt strategist.",
      image: "/images/4.jpeg",
      price: "400",
      attributes: [
        { trait_type: "Category", value: "Strategy" },
        { trait_type: "Rank", value: "Ultra Rare" },
        { trait_type: "Token Reward", value: "400 POB" }
      ]
    },
    {
      id: 5,
      name: "PromptMaster #5",
      description: "Ultimate AI prompt architect.",
      image: "/images/5.jpeg",
      price: "500",
      attributes: [
        { trait_type: "Category", value: "Mastery" },
        { trait_type: "Rank", value: "Mythic" },
        { trait_type: "Token Reward", value: "500 POB" }
      ]
    }
  ];

  useEffect(() => {
    checkConnection();
    loadNFTs();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await getPromptBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const getPromptBalance = async (address) => {
    try {
      const data = '0x70a08231000000000000000000000000' + address.slice(2).toLowerCase();
      const result = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: PROMPT_TOKEN_ADDRESS,
          data: data
        }, 'latest']
      });

      if (result && result !== '0x') {
        const balance = Number(BigInt(result)) / Math.pow(10, 18);
        setPromptBalance(balance.toLocaleString('en-US', { maximumFractionDigits: 0 }));
      }
    } catch (error) {
      console.error('Error getting PROMPT balance:', error);
    }
  };

  const loadNFTs = async () => {
    try {
      const nftStatuses = await Promise.all(
        nftMetadata.map(async (nft) => {
          try {
            const data = '0x6352211e' + nft.id.toString(16).padStart(64, '0'); // ownerOf(tokenId)
            const result = await window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: NFT_CONTRACT_ADDRESS,
                data: data
              }, 'latest']
            });
            
            return {
              ...nft,
              sold: result && result !== '0x' && result !== '0x0000000000000000000000000000000000000000000000000000000000000000'
            };
          } catch (error) {
            return { ...nft, sold: false };
          }
        })
      );

      setNfts(nftStatuses);
      setLoading(false);
    } catch (error) {
      console.error('Error loading NFTs:', error);
      setNfts(nftMetadata.map(nft => ({ ...nft, sold: false })));
      setLoading(false);
    }
  };

  const buyNFT = async (nft) => {
    if (!account) {
      alert('Please connect your wallet first!');
      return;
    }

    setPurchasing(nft.id);

    try {
      const priceWei = BigInt(nft.price) * BigInt(10 ** 18);

      // First approve the NFT contract to spend PROMPT tokens
      const approveData = '0x095ea7b3' + 
        NFT_CONTRACT_ADDRESS.slice(2).padStart(64, '0') + 
        priceWei.toString(16).padStart(64, '0');

      console.log('Approving PROMPT tokens...');
      const approveTx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: PROMPT_TOKEN_ADDRESS,
          data: approveData
        }]
      });

      console.log('Approval transaction:', approveTx);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Now buy the NFT
      const buyData = '0x96e494e8' + nft.id.toString(16).padStart(64, '0'); // buyNFT(tokenId)

      console.log('Buying NFT...');
      const buyTx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: NFT_CONTRACT_ADDRESS,
          data: buyData
        }]
      });

      console.log('Purchase transaction:', buyTx);
      alert(`🎉 Successfully purchased ${nft.name}!`);
      
      // Refresh data
      await loadNFTs();
      await getPromptBalance(account);

    } catch (error) {
      console.error('Error buying NFT:', error);
      alert('❌ Purchase failed: ' + error.message);
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="text-center" style={{ color: '#8d2be2', fontSize: '1.5rem' }}>
              Loading NFT Shop...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem',
      color: 'white'
    }}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 style={{
              fontSize: '2.5rem',
              background: 'linear-gradient(45deg, #8d2be2, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              🎨 PromptMaster NFT Shop
            </h1>
            {account && (
              <div style={{
                background: 'rgba(141, 43, 226, 0.2)',
                border: '2px solid #8d2be2',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                💰 {promptBalance} PROMPT
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        {nfts.map((nft) => (
          <div key={nft.id} className="col-lg-4 col-md-6 mb-4">
            <div className={`card h-100 ${nft.sold ? 'opacity-50' : ''}`} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(141, 43, 226, 0.3)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="card-img-top"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                {nft.sold && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 0, 0, 0.9)',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '10px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    SOLD
                  </div>
                )}
              </div>
              
              <div className="card-body" style={{ padding: '1.5rem' }}>
                <h5 className="card-title" style={{ color: '#8d2be2', marginBottom: '0.5rem' }}>
                  {nft.name}
                </h5>
                <p className="card-text" style={{ color: '#ccc', marginBottom: '1rem' }}>
                  {nft.description}
                </p>
                
                <div className="mb-3">
                  {nft.attributes.map((attr, index) => (
                    <span 
                      key={index}
                      className="badge me-2 mb-1"
                      style={{
                        background: 'rgba(141, 43, 226, 0.2)',
                        border: '1px solid #8d2be2',
                        color: '#fff',
                        fontSize: '0.8rem'
                      }}
                    >
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                    💎 {nft.price} PROMPT
                  </div>
                  
                  {!nft.sold ? (
                    <button 
                      className="btn"
                      style={{
                        background: 'linear-gradient(45deg, #8d2be2, #ff6b6b)',
                        border: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '25px',
                        padding: '0.75rem 1.5rem'
                      }}
                      onClick={() => buyNFT(nft)}
                      disabled={purchasing === nft.id || !account}
                    >
                      {purchasing === nft.id ? '⏳ Buying...' : '🛒 Buy Now'}
                    </button>
                  ) : (
                    <button 
                      className="btn"
                      style={{
                        background: '#666',
                        border: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '25px',
                        padding: '0.75rem 1.5rem'
                      }}
                      disabled
                    >
                      ✅ Sold
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
