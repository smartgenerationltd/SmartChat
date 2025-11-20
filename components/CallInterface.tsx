import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface CallInterfaceProps {
  participant: User;
  isVideo: boolean;
  onEnd: () => void;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({ participant, isVideo, onEnd }) => {
  const [callStatus, setCallStatus] = useState<'RINGING' | 'CONNECTED'>('RINGING');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  // Auto-connect simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 2000); // Connect after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // Call Timer
  useEffect(() => {
    let interval: any;
    if (callStatus === 'CONNECTED') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Camera handling for video calls
  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    const startMedia = async () => {
        if (isVideo && !isCamOff) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (mounted && localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
              setMediaError(null);
            } else {
              // If component unmounted or state changed, stop tracks immediately
              if (stream) stream.getTracks().forEach(track => track.stop());
            }
          } catch (err: any) {
            console.error("Error accessing media devices:", err);
            if (mounted) {
                // If video fails (timeout or permission), force cam off UI
                setIsCamOff(true);
                setMediaError("Camera access failed or timed out. Switched to audio-only.");
                // Clear error message after a few seconds
                setTimeout(() => setMediaError(null), 5000);
            }
          }
        }
    };

    startMedia();

    return () => {
        mounted = false;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
    };
  }, [isVideo, isCamOff]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center text-white font-sans overflow-hidden">
       {/* Background Layer (Blur Effect) */}
       <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
         <img src={participant.avatar} alt="bg" className="w-full h-full object-cover blur-2xl transform scale-110" />
       </div>

       {/* Header Info */}
       <div className="z-10 flex flex-col items-center mt-10 w-full px-4">
          <div className="flex items-center gap-2 mb-3 bg-black/20 px-3 py-1 rounded-full">
             <span className="material-icons text-[14px] text-gray-300">lock</span>
             <span className="text-xs text-gray-300">End-to-end encrypted</span>
          </div>
          <h2 className="text-3xl font-medium mb-2 text-center drop-shadow-md">{participant.name}</h2>
          <p className="text-gray-200 font-medium tracking-wide drop-shadow-md">
            {callStatus === 'RINGING' ? 'Ringing...' : formatTime(duration)}
          </p>
          {mediaError && (
             <div className="mt-4 bg-red-500/90 text-white text-xs px-3 py-1.5 rounded-md animate-bounce shadow-lg">
                {mediaError}
             </div>
          )}
       </div>

       {/* Main Visual Content (Video/Avatar) */}
       <div className="z-10 flex-1 flex items-center justify-center w-full relative p-4 pb-32">
          {isVideo ? (
             <div className="relative w-full max-w-lg aspect-[3/4] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                {/* Remote View (Simulated with Avatar) */}
                <img src={participant.avatar} alt="remote" className="w-full h-full object-cover" />
                
                {/* Local View (PiP) */}
                <div className="absolute bottom-4 right-4 w-28 h-40 bg-black rounded-xl overflow-hidden border-2 border-gray-600 shadow-xl z-20">
                   {!isCamOff ? (
                     <video 
                        ref={localVideoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover transform scale-x-[-1]" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gray-800">
                       <span className="material-icons text-gray-500 text-3xl">videocam_off</span>
                     </div>
                   )}
                </div>
             </div>
          ) : (
             /* Audio Call Visual */
             <div className="relative">
                 <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-gray-700/50 shadow-2xl z-20 relative bg-gray-800">
                    <img src={participant.avatar} alt="avatar" className="w-full h-full object-cover" />
                 </div>
                 {callStatus === 'RINGING' && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse delay-75"></div>
                    </>
                 )}
             </div>
          )}
       </div>

       {/* Fixed Control Bar at Bottom */}
       <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-gray-900/95 backdrop-blur-xl rounded-t-3xl pb-8 pt-6 px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border-t border-gray-800">
          <div className="max-w-md mx-auto flex justify-around items-center">
              {/* Camera Toggle */}
              <button 
                onClick={() => setIsCamOff(!isCamOff)} 
                className={`p-4 rounded-full transition-all duration-200 ${isCamOff ? 'bg-white text-gray-900' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'}`}
                title="Toggle Camera"
              >
                <span className="material-icons text-2xl">{isVideo ? (isCamOff ? 'videocam_off' : 'videocam') : 'videocam'}</span>
              </button>

              {/* Mute Toggle */}
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`p-4 rounded-full transition-all duration-200 ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'}`}
                title="Mute Microphone"
              >
                <span className="material-icons text-2xl">{isMuted ? 'mic_off' : 'mic'}</span>
              </button>

              {/* Speaker (Mock) */}
              <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 transition-all" title="Speaker">
                 <span className="material-icons text-2xl">volume_up</span>
              </button>

              {/* End Call Button - Prominent Red */}
              <button 
                onClick={onEnd} 
                className="p-5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/40 transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
                title="End Call"
                aria-label="End Call"
              >
                <span className="material-icons text-3xl">call_end</span>
              </button>
          </div>
       </div>
    </div>
  );
};