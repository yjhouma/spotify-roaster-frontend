const HomeScreen = ({ onConnect }) => {
    return (
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-8">Roast My Spotify 🔥</h1>
        <p className="text-zinc-400 mb-8">
          Connect your Spotify and let AI roast your questionable music taste
        </p>
        <button
          onClick={onConnect}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
        >
          Connect Spotify
        </button>
      </div>
    );
  };
  
  export default HomeScreen;