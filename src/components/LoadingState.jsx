import { Loader2 } from 'lucide-react';

const LoadingState = ({ message, submessage }) => {
  return (
    <div className="text-center space-y-4">
      <Loader2 className="animate-spin w-12 h-12 mx-auto text-green-500" />
      <p className="text-xl">{message}</p>
      {submessage && (
        <p className="text-zinc-400 text-sm">{submessage}</p>
      )}
    </div>
  );
};

export default LoadingState;