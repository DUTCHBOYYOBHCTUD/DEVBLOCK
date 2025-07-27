import React, { useState, useEffect, useRef } from 'react';

const Wallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [promptTokenBalance, setPromptTokenBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const vantaRef = useRef(null);

  // PROMPT token contract address - Use the one from your debug info
  const PROMPT_TOKEN_ADDRESS = '0x0c8432F1680BD45aF1C2f3E316f8750aE2813Dab';

  // Add network detection
  const [networkInfo, setNetworkInfo] = useState({ chainId: null, name: 'Unknown' });

  // Get network info
  const getNetworkInfo = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainId, 16);
      
      let networkName = 'Unknown';
      switch (chainIdDecimal) {
        case 1337:
        case 5777:
          networkName = 'Ganache';
          break;
        case 1:
          networkName = 'Ethereum Mainnet';
          break;
        case 11155111:
          networkName = 'Sepolia Testnet';
          break;
        default:
          networkName = `Network ${chainIdDecimal}`;
      }
      
      setNetworkInfo({ chainId: chainIdDecimal, name: networkName });
      console.log('Connected to network:', networkName, 'Chain ID:', chainIdDecimal);
    } catch (error) {
      console.error('Error getting network info:', error);
    }
  };

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
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true);
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        await getNetworkInfo();
        await getBalances(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert('Please install MetaMask to connect your wallet!');
    }
  };

  // Get ETH and PROMPT token balances
  const getBalances = async (address) => {
    try {
      // Get ETH balance
      const ethBalance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const ethInEther = parseInt(ethBalance, 16) / Math.pow(10, 18);
      setBalance(ethInEther.toFixed(4));

      // Get PROMPT token balance (ERC-20)
      if (PROMPT_TOKEN_ADDRESS !== '0x...') {
        const tokenBalance = await getTokenBalance(address, PROMPT_TOKEN_ADDRESS);
        setPromptTokenBalance(tokenBalance);
      }
    } catch (error) {
      console.error('Error getting balances:', error);
    }
  };

  // Get ERC-20 token balance with extensive debugging
  const getTokenBalance = async (address, tokenAddress) => {
    try {
      console.log('=== TOKEN BALANCE DEBUG ===');
      console.log('User address:', address);
      console.log('Token contract:', tokenAddress);
      console.log('Network info:', networkInfo);
      
      // Test if contract exists first
      const codeCheck = await window.ethereum.request({
        method: 'eth_getCode',
        params: [tokenAddress, 'latest']
      });
      console.log('Contract code check:', codeCheck);
      
      if (!codeCheck || codeCheck === '0x') {
        console.log('❌ Contract not found at this address');
        return '0.00';
      }
      
      // Try to get decimals first
      console.log('Getting token decimals...');
      const decimalsData = '0x313ce567'; // decimals() function signature
      const decimalsResult = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: decimalsData
        }, 'latest']
      });
      
      let tokenDecimals = 18; // default
      if (decimalsResult && decimalsResult !== '0x') {
        tokenDecimals = parseInt(decimalsResult, 16);
      }
      console.log('Token decimals:', tokenDecimals);
      
      // Now get the balance
      console.log('Getting balance...');
      const data = '0x70a08231000000000000000000000000' + address.slice(2).toLowerCase();
      console.log('Balance call data:', data);
      
      const result = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: data
        }, 'latest']
      });
      
      console.log('Raw balance result:', result);
      console.log('Result type:', typeof result);
      
      if (!result || result === '0x' || result === '0x0') {
        console.log('❌ No balance returned');
        return '0.00';
      }
      
      // Convert the result
      try {
        const balanceWei = BigInt(result);
        console.log('Balance in Wei:', balanceWei.toString());
        
        const divisor = BigInt(10) ** BigInt(tokenDecimals);
        console.log('Divisor:', divisor.toString());
        
        const balance = Number(balanceWei) / Number(divisor);
        console.log('Final calculated balance:', balance);
        
        if (isNaN(balance)) {
          console.log('❌ Balance calculation resulted in NaN');
          return '0.00';
        }
        
        return balance >= 1000 ? balance.toLocaleString('en-US', { maximumFractionDigits: 0 }) : balance.toFixed(2);
        
      } catch (conversionError) {
        console.error('❌ Conversion error:', conversionError);
        return '0.00';
      }
      
    } catch (error) {
      console.error('❌ Complete token balance error:', error);
      return '0.00';
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setPromptTokenBalance('0');
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await getBalances(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          getBalances(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return (
    <div ref={vantaRef} style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
      <div className="container" style={{ paddingTop: '5rem', position: 'relative', zIndex: 10 }}>
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card" style={{ 
              background: 'rgba(26, 26, 26, 0.9)', 
              border: '1px solid #333',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="card-body" style={{ padding: '2rem' }}>
                <h2 className="text-center mb-4" style={{ color: '#8d2be2', fontSize: '2.5rem', fontWeight: 'bold' }}>
                  My Wallet
                </h2>
                
                {!account ? (
                  // Not connected state
                  <div className="text-center" style={{ color: '#fff' }}>
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #8d2be2, #a855f7)',
                        borderRadius: '50%',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}>
                        🦊
                      </div>
                      <h4>Connect Your Wallet</h4>
                      <p style={{ color: '#ccc', marginBottom: '2rem' }}>
                        Connect your MetaMask wallet to view your PROMPT token balance
                      </p>
                    </div>
                    
                    <button 
                      onClick={connectWallet}
                      disabled={isConnecting}
                      className="btn" 
                      style={{
                        background: isConnecting ? '#666' : 'linear-gradient(135deg, #8d2be2, #a855f7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 30px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: isConnecting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                    </button>
                  </div>
                ) : (
                  // Connected state
                  <div style={{ color: '#fff' }}>
                    {/* Account Info */}
                    <div className="text-center mb-4">
                      {/* Network Info */}
                      <div style={{
                        background: networkInfo.name === 'Ganache' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${networkInfo.name === 'Ganache' ? '#22c55e' : '#ef4444'}`,
                        borderRadius: '8px',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: networkInfo.name === 'Ganache' ? '#22c55e' : '#ef4444' }}>
                          📡 {networkInfo.name} (Chain ID: {networkInfo.chainId})
                        </span>
                      </div>

                      <div style={{
                        background: 'rgba(141, 43, 226, 0.1)',
                        border: '1px solid #8d2be2',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                      }}>
                        <small style={{ color: '#ccc' }}>Connected Account</small>
                        <div style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '0.9rem',
                          color: '#8d2be2',
                          wordBreak: 'break-all'
                        }}>
                          {account}
                        </div>
                      </div>
                    </div>

                    {/* Debug Info (remove this after fixing) */}
                    {account && (
                      <div style={{
                        background: 'rgba(255, 193, 7, 0.1)',
                        border: '1px solid #ffc107',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace'
                      }}>
                        <div style={{ color: '#ffc107', marginBottom: '0.5rem' }}>🔍 Debug Info:</div>
                        <div style={{ color: '#fff' }}>
                          Contract: {PROMPT_TOKEN_ADDRESS}<br/>
                          Network: {networkInfo.name} ({networkInfo.chainId})<br/>
                          Valid Contract: {PROMPT_TOKEN_ADDRESS && PROMPT_TOKEN_ADDRESS !== '0x...' && PROMPT_TOKEN_ADDRESS.length === 42 ? '✅' : '❌'}
                        </div>
                      </div>
                    )}

                    {/* Balances */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div style={{
                          background: 'rgba(141, 43, 226, 0.1)',
                          border: '1px solid #8d2be2',
                          borderRadius: '8px',
                          padding: '1.5rem',
                          textAlign: 'center'
                        }}>
                          <h5 style={{ color: '#8d2be2', marginBottom: '0.5rem' }}>ETH Balance</h5>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {balance} ETH
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div style={{
                          background: 'rgba(168, 85, 247, 0.1)',
                          border: '1px solid #a855f7',
                          borderRadius: '8px',
                          padding: '1.5rem',
                          textAlign: 'center'
                        }}>
                          <h5 style={{ color: '#a855f7', marginBottom: '0.5rem' }}>PROMPT Tokens</h5>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {promptTokenBalance} PROMPT
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center mt-4">
                      <button 
                        onClick={() => getBalances(account)}
                        className="btn me-3" 
                        style={{
                          background: 'linear-gradient(135deg, #8d2be2, #a855f7)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          marginRight: '1rem'
                        }}
                      >
                        Refresh Balance
                      </button>
                      
                      <button 
                        onClick={disconnectWallet}
                        className="btn" 
                        style={{
                          background: 'transparent',
                          color: '#ff6b6b',
                          border: '1px solid #ff6b6b',
                          borderRadius: '8px',
                          padding: '10px 20px'
                        }}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;







