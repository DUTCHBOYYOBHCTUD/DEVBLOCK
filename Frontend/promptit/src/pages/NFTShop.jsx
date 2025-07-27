import React, { useState, useEffect } from 'react';
import './NFTShop.css';

const NFTShop = () => {
  const [account, setAccount] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [promptBalance, setPromptBalance] = useState('0');

  // Contract addresses from deployed.json
  const PROMPT_TOKEN_ADDRESS = '0xDE2B385Ef08239B60Ea1cc28ee0A101e47E21d02';
  const NFT_CONTRACT_ADDRESS = '0x6eD0045C2245D200a4e70411f1Ad4107b94f9371';

  // NFT metadata (matching your mint-nfts.js)
  const nftMetadata = [
    {
      id: 1,
      name: "PromptMaster #1",
      description: "Awarded to the most innovative prompter in Proof-of-Brainstorm.",
      image: "/images/1.jpeg", // This will work from public folder
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
      image: "/images/2.png",
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
      image: "/images/3.jpg",
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
      image: "/images/4.jpg",
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
      image: "/images/5.jpg",
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
            // Get token URI from contract
            const tokenURIData = '0xc87b56dd' + nft.id.toString(16).padStart(64, '0'); // tokenURI(tokenId)
            const tokenURIResult = await window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: NFT_CONTRACT_ADDRESS,
                data: tokenURIData
              }, 'latest']
            });

            let metadata = nft; // fallback to hardcoded metadata
            
            if (tokenURIResult && tokenURIResult !== '0x') {
              try {
                // Decode the URI from hex
                const uri = window.web3.utils.hexToAscii(tokenURIResult).replace(/\0/g, '');
                
                // Fetch metadata from IPFS
                const ipfsGateway = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                const metadataResponse = await fetch(ipfsGateway);
                const ipfsMetadata = await metadataResponse.json();
                
                // Use IPFS metadata with IPFS gateway for image
                metadata = {
                  ...nft,
                  name: ipfsMetadata.name || nft.name,
                  description: ipfsMetadata.description || nft.description,
                  image: ipfsMetadata.image ? ipfsMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : nft.image,
                  attributes: ipfsMetadata.attributes || nft.attributes
                };
              } catch (metadataError) {
                console.log('Failed to fetch IPFS metadata for NFT', nft.id, metadataError);
              }
            }

            // Check if NFT is sold
            const ownerData = '0x6352211e' + nft.id.toString(16).padStart(64, '0');
            const ownerResult = await window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: NFT_CONTRACT_ADDRESS,
                data: ownerData
              }, 'latest']
            });
            
            return {
              ...metadata,
              sold: ownerResult && ownerResult !== '0x' && ownerResult !== '0x0000000000000000000000000000000000000000000000000000000000000000'
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
      
      console.log('🔍 Starting NFT purchase process...');

      // Check PROMPT balance first
      const balanceData = '0x70a08231000000000000000000000000' + account.slice(2).toLowerCase();
      const balanceResult = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: PROMPT_TOKEN_ADDRESS,
          data: balanceData
        }, 'latest']
      });
      
      const currentBalance = BigInt(balanceResult || '0x0');
      const balanceInTokens = Number(currentBalance) / Math.pow(10, 18);
      
      if (currentBalance < priceWei) {
        alert(`❌ Insufficient PROMPT tokens! You need ${nft.price} PROMPT but only have ${balanceInTokens.toFixed(2)}`);
        return;
      }

      // Approve PROMPT tokens
      const approveData = '0x095ea7b3' + 
        NFT_CONTRACT_ADDRESS.slice(2).toLowerCase().padStart(64, '0') + 
        priceWei.toString(16).padStart(64, '0');

      console.log('✅ Sending approval transaction...');
      
      const approveTx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: PROMPT_TOKEN_ADDRESS,
          data: approveData,
          gas: '0x15f90'
        }]
      });

      console.log('✅ Approval transaction hash:', approveTx);
      alert('⏳ Approval sent! Please wait...');

      // Wait for approval
      await new Promise(resolve => setTimeout(resolve, 8000));

      // Use the correct function selector for buyNFT(uint256)
      // keccak256("buyNFT(uint256)") = 0x96e494e8
      const buyData = '0x96e494e8' + nft.id.toString(16).padStart(64, '0');
      
      console.log('🛒 Buying NFT with data:', buyData);
      console.log('� Transaction details:', {
        from: account,
        to: NFT_CONTRACT_ADDRESS,
        data: buyData,
        tokenId: nft.id
      });

      const buyTx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: NFT_CONTRACT_ADDRESS,
          data: buyData,
          gas: '0x30d40'
        }]
      });

      console.log('✅ Purchase transaction hash:', buyTx);
      alert(`🎉 Successfully purchased ${nft.name}!`);
      
      // Refresh data
      await loadNFTs();
      await getPromptBalance(account);

    } catch (error) {
      console.error('❌ Purchase error:', error);
      
      if (error.code === -32603) {
        console.log('❌ Internal JSON-RPC error - checking if purchase was successful...');
        
        // Wait a bit for the transaction to be mined
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if the NFT is now owned by the user
        try {
          const ownerData = '0x6352211e' + nft.id.toString(16).padStart(64, '0');
          const ownerResult = await window.ethereum.request({
            method: 'eth_call',
            params: [{
              to: NFT_CONTRACT_ADDRESS,
              data: ownerData
            }, 'latest']
          });
          
          if (ownerResult && ownerResult !== '0x' && ownerResult !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
            const owner = '0x' + ownerResult.slice(-40);
            if (owner.toLowerCase() === account.toLowerCase()) {
              alert(`🎉 Successfully purchased ${nft.name}!`);
              // Refresh data
              await loadNFTs();
              await getPromptBalance(account);
              return;
            } else {
              alert('❌ This NFT is owned by someone else!');
            }
          } else {
            alert('❌ Transaction failed. The NFT was not minted.');
          }
        } catch (ownerError) {
          console.error('Error checking ownership:', ownerError);
          alert('✅ Purchase transaction completed! Please refresh to see your NFT.');
          // Still refresh the data
          await loadNFTs();
          await getPromptBalance(account);
        }
      } else if (error.code === 4001) {
        alert('❌ Transaction rejected by user');
      } else {
        alert('❌ Purchase failed: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="nft-shop">
        <div className="loading">Loading NFT Shop...</div>
      </div>
    );
  }

  return (
    <div className="nft-shop">
      <div className="shop-header">
        <h1>🎨 PromptMaster NFT Collection</h1>
        <div className="wallet-info">
          {account ? (
            <div className="balance-display">
              💰 {promptBalance} PROMPT
            </div>
          ) : (
            <div className="connect-prompt">Please connect your wallet</div>
          )}
        </div>
      </div>

      <div className="nft-grid">
        {nfts.map((nft) => (
          <div key={nft.id} className={`nft-card ${nft.sold ? 'sold' : ''}`}>
            <div className="nft-image">
              <img src={nft.image} alt={nft.name} />
              {nft.sold && <div className="sold-overlay">SOLD</div>}
            </div>
            
            <div className="nft-info">
              <h3>{nft.name}</h3>
              <p className="description">{nft.description}</p>
              
              <div className="attributes">
                {nft.attributes.map((attr, index) => (
                  <span key={index} className="attribute">
                    {attr.trait_type}: {attr.value}
                  </span>
                ))}
              </div>
              
              <div className="nft-footer">
                <div className="price">
                  💎 {nft.price} PROMPT
                </div>
                
                {!nft.sold ? (
                  <button 
                    className="buy-button"
                    onClick={() => buyNFT(nft)}
                    disabled={purchasing === nft.id || !account}
                  >
                    {purchasing === nft.id ? '⏳ Buying...' : '🛒 Buy Now'}
                  </button>
                ) : (
                  <button className="sold-button" disabled>
                    ✅ Sold
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTShop;










