import React, { useState, useEffect } from 'react';
import { mockTopArtists, mockRoasts, finalRoast } from '../constants/mockData';
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
  
  useEffect(() => {
    if (showFullRoast) {
      const paragraphs = finalRoast.split('\n\n').filter(p => p.trim());
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
  }, [showFullRoast]);

  const handleSpotifyConnect = () => {
    setStep('connecting');
    setTimeout(() => {
      setStep('analyzing');
      setTimeout(() => {
        setStep('roasting');
      }, 2000);
    }, 1500);
  };

  const handleRoastClick = () => {
    if (!canClick || isTransitioning) return;
    
    setCanClick(false);
    if (!showFirstRoast) {
      setShowFirstRoast(true);
      setTimeout(() => setCanClick(true), TRANSITION_DURATION);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      if (currentRoastIndex < mockRoasts.length - 1) {
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

      {step === 'roasting' && !showFullRoast && (
        <RoastCard
          artist={mockTopArtists[currentRoastIndex]}
          roast={mockRoasts[currentRoastIndex]}
          showFirstRoast={showFirstRoast}
          isTransitioning={isTransitioning}
          nextArtist={currentRoastIndex < mockRoasts.length - 1 ? mockTopArtists[currentRoastIndex + 1] : null}
          nextRoast={currentRoastIndex < mockRoasts.length - 1 ? mockRoasts[currentRoastIndex + 1] : null}
          onCardClick={handleRoastClick}
          canClick={canClick}
        />
      )}

      {showFullRoast && (
        <FinalVerdict 
          text={finalRoast}
          visibleParagraphs={visibleParagraphs}
        />
      )}
    </div>
  );
};

export default SpotifyRoaster;