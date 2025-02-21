const RoastCard = ({
  transitionDurtaion,
  artistRoast,
  showFirstRoast,
  isTransitioning,
  nextArtistRoast,
  onCardClick,
  canClick
}) => {
  const current = artistRoast || {};
  const next = nextArtistRoast || {};

  return (
    <div 
      className="w-full max-w-xl mx-auto h-64 relative overflow-hidden cursor-pointer"
      onClick={onCardClick}
    >
      {/* Current Card */}
      <div className={`absolute w-full transition-all duration-${transitionDurtaion} ease-in-out
        ${!showFirstRoast ? '-translate-y-full opacity-0' : 
          isTransitioning ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-green-500">
            {current.snarky_introduction || "Loading roast..."}
          </h2>
          <div className="bg-zinc-800 rounded-lg p-6 shadow-lg mx-4">
            <p className="text-lg leading-relaxed">
              {current.comments || "No comments available"}
            </p>
          </div>
        </div>
      </div>

      {/* Next Card (pre-rendered but hidden) */}
      <div className={`absolute w-full transition-all duration-${transitionDurtaion} ease-in-out
        ${isTransitioning ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-green-500">
            {next.snarky_introduction || "Next up..."}
          </h2>
          <div className="bg-zinc-800 rounded-lg p-6 shadow-lg mx-4">
            <p className="text-lg leading-relaxed">
              {next.comments || "Loading next roast..."}
            </p>
          </div>
        </div>
      </div>

      {canClick && (
        <div className="absolute bottom-2 left-0 right-0 text-center text-zinc-400 text-sm">
          Click anywhere to continue
        </div>
      )}
    </div>
  );
};
export default RoastCard;
