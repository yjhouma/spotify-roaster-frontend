// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import HomeScreen from './HomeScreen';
import LoadingState from './LoadingState';
import RoastCard from './RoastCard';
import FinalVerdict from './FinalVerdict';

const TRANSITION_DURATION = 1200;
const PARAGRAPH_DELAY = 1500;

const SpotifyRoaster = () => {
  const [step, setStep] = useState('home');
  const [currentRoastIndex, setCurrentRoastIndex] = useState(0);
  const [showFullRoast, setShowFullRoast] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFirstRoast, setShowFirstRoast] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [roastData, setRoastData] = useState(null);
  
  // useEffect(() => {
  //   // Check if we're on the callback route
  //   if (window.location.pathname === '/callback') {
  //     fetchRoasts();
  //   }
  // }, []);

  useEffect(() => {
    const checkSession = async () => {
      if (window.location.pathname === '/callback') {
        // Add a small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Debug: check if session is valid
        try {
          const debugResponse = await fetch(`http://0.0.0.0:8000/api/debug/session`, {
            credentials: 'include'
          });
          const debugData = await debugResponse.json();
          console.log('Session debug:', debugData);
            
          if (debugData.is_valid) {
            fetchRoasts();
          } else {
            console.error('No valid session found');
            setStep('home');
          }
        } catch (error) {
          console.error('Session check failed:', error);
          setStep('home');
        }
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (showFullRoast && roastData) {
      const paragraphs = roastData.final_verdict.split('\n\n').filter(p => p.trim());
      let currentParagraph = 0;
      
      const showNextParagraph = () => {
        if (currentParagraph < paragraphs.length) {
          setVisibleParagraphs(prev => prev + 1);
          currentParagraph++;
          if (currentParagraph < paragraphs.length) {
            setTimeout(showNextParagraph, PARAGRAPH_DELAY);
          }
        }
      };

      setTimeout(showNextParagraph, TRANSITION_DURATION);
    }
  }, [showFullRoast, roastData]);

  const handleSpotifyConnect = async () => {
    setStep('connecting');
    try {
      const response = await fetch('http://0.0.0.0:8000/api/spotify/login', {
        credentials: 'include'
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to connect:', error);
      setStep('home');
    }
  };

  const fetchRoasts = async () => {
    setStep('analyzing');
    try {
      const response = await fetch('http://0.0.0.0:8000/api/spotify/top-artists', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch roasts');
      }
      
      const data = await response.json(); 
      setRoastData(data);
      setStep('roasting');
    } catch (error) {
      console.error('Failed to fetch roasts:', error);
      setStep('home');
    }
  };

  const handleRoastClick = () => {
    if (!canClick || isTransitioning || !roastData) return;
    
    setCanClick(false);
    if (!showFirstRoast) {
      setShowFirstRoast(true);
      setTimeout(() => setCanClick(true), TRANSITION_DURATION);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      if (currentRoastIndex < roastData.artist_comments.length - 1) {
        setCurrentRoastIndex(prev => prev + 1);
        setIsTransitioning(false);
        setCanClick(true);
      } else {
        setShowFullRoast(true);
      }
    }, TRANSITION_DURATION);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-4">
      {step === 'home' && (
        <HomeScreen onConnect={handleSpotifyConnect} />
      )}

      {step === 'connecting' && (
        <LoadingState 
          message="Connecting to Spotify..." 
        />
      )}

      {step === 'analyzing' && (
        <LoadingState 
          message="Analyzing your questionable music taste..."
          submessage="This might hurt a little"
        />
      )}

      {step === 'roasting' && !showFullRoast && roastData && (
        <RoastCard
          artistRoast={roastData.artist_comments[currentRoastIndex]}
          showFirstRoast={showFirstRoast}
          isTransitioning={isTransitioning}
          nextArtistRoast={currentRoastIndex < roastData.artist_comments.length - 1 ? 
            roastData.artist_comments[currentRoastIndex + 1] : null}
          onCardClick={handleRoastClick}
          canClick={canClick}
        />
      )}

      {showFullRoast && roastData && (
        <FinalVerdict 
          text={roastData.final_verdict}
          visibleParagraphs={visibleParagraphs}
        />
      )}
    </div>
  );
};

export default SpotifyRoaster;