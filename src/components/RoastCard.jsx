const RoastCard = ({
    artist,
    roast,
    showFirstRoast,
    isTransitioning,
    nextArtist,
    nextRoast,
    onCardClick,
    canClick
  }) => {
    return (
      <div 
        className="w-full max-w-xl mx-auto h-64 relative overflow-hidden cursor-pointer"
        onClick={onCardClick}
      >
        <div className={`absolute w-full transition-all duration-500 ease-in-out
          ${!showFirstRoast ? '-translate-y-full opacity-0' : 
            isTransitioning ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-green-500">
              About {artist}...
            </h2>
            <div className="bg-zinc-800 rounded-lg p-6 shadow-lg mx-4">
              <p className="text-lg leading-relaxed">
                {roast}
              </p>
            </div>
          </div>
        </div>
        
        {isTransitioning && nextArtist && (
          <div className="absolute w-full transition-all duration-500 ease-in-out translate-y-full opacity-0">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-green-500">
                About {nextArtist}...
              </h2>
              <div className="bg-zinc-800 rounded-lg p-6 shadow-lg mx-4">
                <p className="text-lg leading-relaxed">
                  {nextRoast}
                </p>
              </div>
            </div>
          </div>
        )}
        {canClick && (
          <div className="absolute bottom-2 left-0 right-0 text-center text-zinc-400 text-sm">
            Click anywhere to continue
          </div>
        )}
      </div>
    );
  };
  
  export default RoastCard;