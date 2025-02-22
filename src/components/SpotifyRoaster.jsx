// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import HomeScreen from './HomeScreen';
import LoadingState from './LoadingState';
import RoastCard from './RoastCard';
import FinalVerdict from './FinalVerdict';

const TRANSITION_DURATION = 1200; // Match CSS transition duration
const PARAGRAPH_DELAY = 1000;

const SpotifyRoaster = () => {
  const [step, setStep] = useState('home');
  const [currentRoastIndex, setCurrentRoastIndex] = useState(0);
  const [showFullRoast, setShowFullRoast] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFirstRoast, setShowFirstRoast] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [roastData, setRoastData] = useState(null);
  
  useEffect(() => {
    // Check if we're on the callback route
    if (window.location.pathname === '/callback') {
      fetchRoasts();
    }
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
      const response = await fetch('/api/spotify/login', {
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

    setRoastData(null); // Reset existing data
    setCurrentRoastIndex(0); // Reset to first item
    setShowFirstRoast(false); // Reset animation state
    setIsTransitioning(false); // Clear any transitions

    try {
      const response = await fetch('/api/spotify/top-artists', {
        credentials: 'include',
         headers: {
            'Accept': 'application/json',
        }

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
    if (!canClick || isTransitioning || !roastData?.artist_comment) return;
  
    setCanClick(false);
    
    if (!showFirstRoast) {
      setShowFirstRoast(true);
      setTimeout(() => setCanClick(true), TRANSITION_DURATION);
      return;
    }
  
    setIsTransitioning(true);
    
    // Wait for transition to complete before updating index
    setTimeout(() => {
      if (currentRoastIndex < roastData.artist_comment.length - 1) {
        setCurrentRoastIndex(prev => prev + 1);
      } else {
        setShowFullRoast(true);
      }
      setIsTransitioning(false);
      setCanClick(true);
    }, TRANSITION_DURATION);
  };


// Need to add cleaning
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
          transitionDurtaion={TRANSITION_DURATION}
          key={currentRoastIndex}
          artistRoast={roastData.artist_comment[currentRoastIndex]}
          showFirstRoast={showFirstRoast}
          isTransitioning={isTransitioning}
          nextArtistRoast={currentRoastIndex < roastData.artist_comment.length - 1 ? 
            roastData.artist_comment[currentRoastIndex + 1] : null}
          onCardClick={handleRoastClick}
          canClick={canClick}
        />
      )}

      {showFullRoast && roastData && (
        <FinalVerdict 
          text={roastData.final_verdict}
          verdictTitle={roastData.verdict_title}
          visibleParagraphs={visibleParagraphs}
        />
      )}
    </div>
  );
};

export default SpotifyRoaster;