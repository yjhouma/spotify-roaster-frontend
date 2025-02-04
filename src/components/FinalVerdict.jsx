// import html2canvas from 'html2canvas';
// import { Share2 } from 'lucide-react';
// import { useRef } from 'react';


// const FinalVerdict = ({ text, visibleParagraphs }) => {
//     const verdictRef = useRef(null);

//     const paragraphs = text.split('\n\n').filter(p => p.trim());

//     const handleShare = async () => {
//         try {
//           // Wait for all paragraphs to be visible
//           if (visibleParagraphs < paragraphs.length) return;
    
//           // Create canvas from the verdict card
//           const verdictCard = verdictRef.current;
//           const canvas = await html2canvas(verdictCard, {
//             backgroundColor: '#27272a', // zinc-800
//             scale: 2, // Higher resolution
//           });
    
//           // Convert canvas to blob
//           const blob = await new Promise(resolve => 
//             canvas.toBlob(resolve, 'image/png')
//           );
    
//           // Create file from blob
//           const file = new File([blob], 'spotify-roast.png', { type: 'image/png' });
    
//           // Check if Web Share API is supported
//           if (navigator.share) {
//             await navigator.share({
//               files: [file],
//               title: 'My Spotify Roast',
//               text: 'Check out this brutal roast of my music taste! 🔥',
//             });
//           } else {
//             // Fallback: Download the image
//             const link = document.createElement('a');
//             link.href = canvas.toDataURL('image/png');
//             link.download = 'spotify-roast.png';
//             link.click();
//           }
//         } catch (error) {
//           console.error('Error sharing:', error);
//           // You might want to show a user-friendly error message here
//         }
//       };
  
//     return (
//       <div className="max-w-2xl mx-auto p-8 bg-zinc-800 rounded-lg shadow-xl">
//         <h2 className={`text-3xl font-bold mb-8 text-center transition-all duration-800 transform
//           ${visibleParagraphs >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
//           The Final Verdict 🔥
//         </h2>
//         <div className="space-y-6 text-lg leading-relaxed">
//           {paragraphs.map((paragraph, index) => (
//             paragraph.trim() && (
//               <p 
//                 key={index} 
//                 className={`text-zinc-300 transition-all duration-800 transform
//                   ${index < visibleParagraphs 
//                     ? 'opacity-100 translate-y-0' 
//                     : 'opacity-0 translate-y-8'
//                   }`}
//               >
//                 {paragraph.trim()}
//               </p>
//             )
//           ))}
//         </div>
//         <div className={`mt-8 text-center transition-all duration-800 transform
//           ${visibleParagraphs >= paragraphs.length
//             ? 'opacity-100 translate-y-0'
//             : 'opacity-0 translate-y-4'
//           }`}>
//           <button
//           onClick={handleShare}
//           className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
//         >
//           <Share2 size={20} />
//           Share this roast
//         </button>
//         <p className="text-zinc-400 text-sm ml-4">
//           Emotionally damage your friends too
//         </p>
//       </div>
//     </div>
//   );
//   };
  
//   export default FinalVerdict;


import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Loader2 } from 'lucide-react';

const FinalVerdict = ({ text, visibleParagraphs }) => {
  const verdictRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const paragraphs = text.split('\n\n').filter(p => p.trim());

  const handleShare = async () => {
    try {
      // Wait for all paragraphs to be visible
      if (visibleParagraphs < paragraphs.length) return;

      setIsSharing(true);

      // Ensure the element is in the DOM
      if (!verdictRef.current) {
        console.error('Verdict card element not found');
        return;
      }

      // Create canvas from the verdict card
      const canvas = await html2canvas(verdictRef.current, {
        backgroundColor: '#27272a', // zinc-800
        scale: 2, // Higher resolution
        logging: true, // Enable logging for debugging
        useCORS: true // Enable CORS for any images
      });

      // Convert canvas to blob
      const blob = await new Promise(resolve => 
        canvas.toBlob(resolve, 'image/png')
      );

      // Create file from blob
      const file = new File([blob], 'spotify-roast.png', { type: 'image/png' });

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'My Spotify Roast',
          text: 'Check out this brutal roast of my music taste! 🔥',
        });
      } else {
        // Fallback: Download the image
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'spotify-roast.png';
        link.click();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Sorry, there was an error generating the image. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  // Only render content when paragraphs start becoming visible
  if (visibleParagraphs < 0) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div 
        ref={verdictRef}
        className="bg-zinc-800 rounded-lg p-8 shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          The Final Verdict 🔥
        </h2>
        <div className="space-y-6 text-lg leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            paragraph.trim() && (
              <p 
                key={index} 
                className={`text-zinc-300 transition-all duration-800 transform
                  ${index < visibleParagraphs 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                  }`}
              >
                {paragraph.trim()}
              </p>
            )
          ))}
        </div>
      </div>

      <div className={`mt-6 flex justify-center items-center transition-all duration-800 transform
        ${visibleParagraphs >= paragraphs.length
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
        }`}>
        <button
          onClick={handleShare}
          disabled={isSharing || visibleParagraphs < paragraphs.length}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSharing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating image...
            </>
          ) : (
            <>
              <Share2 size={20} />
              Share this roast
            </>
          )}
        </button>
        <p className="text-zinc-400 text-sm ml-4">
          Emotionally damage your friends too
        </p>
      </div>
    </div>
  );
};

export default FinalVerdict;