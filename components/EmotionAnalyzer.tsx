import React, { useRef, useState, useEffect } from 'react';
import { Loader2, XCircle, Sparkles } from 'lucide-react';
import { analyzeSentiment } from '../services/geminiService';

const EmotionAnalyzer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [hasAudio, setHasAudio] = useState(true);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support camera access.");
      return;
    }

    try {
      // Try getting both video and audio
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setHasAudio(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn("Could not access both camera and microphone:", err);
      
      // Fallback: Try Video only
      try {
        const videoOnlyStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(videoOnlyStream);
        setHasAudio(false);
        if (videoRef.current) {
          videoRef.current.srcObject = videoOnlyStream;
        }
        // Inform user but allow usage
        // We don't set 'error' string here to block UI, but we know hasAudio is false
      } catch (videoErr) {
        console.error("Could not access camera:", videoErr);
        setError("Unable to access camera. Please check permissions or device connection.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startAnalysis = () => {
    if (!stream) return;
    setResult(null);
    setIsRecording(true);
    setCountdown(5);
    audioChunksRef.current = [];

    // Only record audio if we have an audio track
    if (hasAudio) {
        try {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = processAnalysis;
            mediaRecorder.start();
        } catch (e) {
            console.error("Failed to start MediaRecorder", e);
            setHasAudio(false);
            // If recorder fails, we simulate the wait then process
            setTimeout(processAnalysis, 5000);
        }
    } else {
        // No audio, just wait for countdown then process
    }

    // Start Countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    // If no audio recorder was running, manually trigger process
    if (!hasAudio) {
        processAnalysis();
    }
    setIsRecording(false);
  };

  const processAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Capture Image Frame
      let imageBase64 = '';
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            if (dataUrl.includes(',')) {
                imageBase64 = dataUrl.split(',')[1];
            }
        }
      } else {
          console.warn("Video stream not ready or has 0 dimensions");
      }

      // Process Audio (if available)
      let audioBase64 = '';
      if (hasAudio && audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioBase64 = await blobToBase64(audioBlob);
      }

      // Call API
      const response = await analyzeSentiment(imageBase64, audioBase64);
      setResult(response);
    } catch (err) {
      setError("Something went wrong during analysis.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result.includes(',')) {
            resolve(result.split(',')[1]);
        } else {
            resolve('');
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden relative text-white">
      {/* Camera Feed */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {stream ? (
           <video 
             ref={videoRef} 
             autoPlay 
             playsInline 
             muted 
             className="absolute w-full h-full object-cover opacity-80"
           />
        ) : (
          <div className="text-gray-500 flex flex-col items-center p-6 text-center">
            {error ? <XCircle className="text-red-500 mb-2" size={32} /> : <Loader2 className="animate-spin mb-2" />}
            <p>{error || "Initializing camera..."}</p>
          </div>
        )}

        {/* Overlay Grid/Frame */}
        <div className="absolute inset-0 border-[20px] border-slate-900/50 pointer-events-none rounded-2xl z-10" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
             <div className="w-64 h-64 border-2 border-white/20 rounded-full border-dashed" />
        </div>

        {/* Recording Overlay */}
        {isRecording && (
          <div className="absolute inset-0 bg-red-500/20 z-20 flex items-center justify-center backdrop-blur-sm transition-all">
            <div className="text-6xl font-bold animate-pulse">{countdown}</div>
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="bg-slate-900 p-6 flex flex-col items-center min-h-[180px] z-30 shadow-2xl">
        
        {!result && !isAnalyzing && (
            <div className="text-center">
                <p className="text-slate-300 text-sm mb-4">
                  Center your face and press record. <br/>
                  {!hasAudio && <span className="text-yellow-400 text-xs block mt-1">(Microphone not detected - Visual only)</span>}
                  {hasAudio && <span className="opacity-50 text-xs">Say how you're feeling (5s)</span>}
                </p>
                <button
                    onClick={startAnalysis}
                    disabled={!stream}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ring-4 ring-red-500/30"
                >
                    <div className="w-6 h-6 bg-white rounded-full" />
                </button>
            </div>
        )}

        {isAnalyzing && (
            <div className="flex flex-col items-center">
                <Loader2 size={40} className="text-teal-400 animate-spin mb-3" />
                <p className="text-teal-100 font-medium animate-pulse">Sensing emotions...</p>
            </div>
        )}

        {result && (
            <div className="w-full animate-fade-in">
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-inner">
                    <div className="flex items-center gap-2 mb-2 text-teal-400">
                        <Sparkles size={18} />
                        <h3 className="font-bold uppercase text-xs tracking-wider">AI Insight</h3>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-sm">
                        "{result}"
                    </p>
                </div>
                <button 
                    onClick={() => setResult(null)}
                    className="mt-4 text-slate-400 hover:text-white text-sm font-medium transition-colors w-full"
                >
                    Check-in again
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default EmotionAnalyzer;