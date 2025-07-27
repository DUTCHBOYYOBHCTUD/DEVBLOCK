import React, { useState, useEffect } from 'react';

const LoadingPage = ({ onLoadingComplete }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Start transition after animations complete
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      // Call the callback function to notify parent component
      setTimeout(() => {
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, 1000); // 1 second fade out delay
    }, 4000); // 4 seconds of loading animation

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#000000',
      fontFamily: 'Raleway, sans-serif'
    }}>
      {/* Animated Network Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, #1a0b2e 0%, #000000 100%)',
        zIndex: 1
      }}>
        {/* Animated Network Nodes */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: '#8b5cf6',
              borderRadius: '50%',
              left: `${10 + (i * 3) % 80}%`,
              top: `${10 + (i * 7) % 80}%`,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0.6,
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
            }}
          />
        ))}
        
        {/* Connecting Lines */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`line-${i}`}
            style={{
              position: 'absolute',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
              left: `${i * 6}%`,
              top: `${20 + (i * 4) % 60}%`,
              width: `${20 + (i % 3) * 10}%`,
              animation: `slide ${4 + i % 3}s linear infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
      
      {/* Loading Content */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        {/* Main Title with Falling Animation */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {['P', 'r', 'o', 'm', 'p', 't', 'H', 'u', 'b'].map((letter, index) => (
              <span
                key={index}
                style={{
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  fontWeight: 100,
                  background: 'linear-gradient(135deg, #ddd6fe, #c084fc, #ffffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                  margin: '0 0.1em',
                  animation: `fallIn 0.8s ease-out ${index * 0.1}s both`,
                  fontFamily: 'Raleway, sans-serif'
                }}
              >
                {letter}
              </span>
            ))}
          </div>
          
          {/* Subtitle */}
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              color: '#ddd6fe',
              fontWeight: 100,
              letterSpacing: '0.3em',
              textAlign: 'center',
              animation: 'slideUp 1s ease-out 1.5s both',
              fontFamily: 'Raleway, sans-serif'
            }}>
              Where Innovation Meets Intelligence
            </p>
          </div>
        </div>

        {/* Loading Indicator */}
        <div style={{
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'center',
          animation: 'fadeIn 1s ease-out 2.5s both'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  background: 'linear-gradient(135deg, #c084fc, #ddd6fe)',
                  borderRadius: '50%',
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
                }}
              />
            ))}
          </div>
        </div>

        {/* Fade out overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000000',
          transition: 'opacity 1s ease',
          opacity: animationComplete ? 1 : 0,
          zIndex: 20
        }} />
      </div>

      <style>{`
        @keyframes fallIn {
          0% {
            opacity: 0;
            transform: translateY(-100px) rotateX(-90deg);
          }
          50% {
            opacity: 1;
            transform: translateY(0px) rotateX(-45deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) rotateX(0deg);
          }
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-15px) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;