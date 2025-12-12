import React, { useState, useEffect } from 'react';
import { Eye, Hand, Ear, Coffee, Smile, Play, Pause, RefreshCw, Wind, Sparkles } from 'lucide-react';
import { GroundingStep } from '../types';

const STEPS: GroundingStep[] = [
  { id: 5, instruction: "Acknowledge 5 things you see around you.", placeholder: "I see...", color: "bg-red-100 text-red-700" },
  { id: 4, instruction: "Acknowledge 4 things you can touch.", placeholder: "I can touch...", color: "bg-orange-100 text-orange-700" },
  { id: 3, instruction: "Acknowledge 3 things you hear.", placeholder: "I hear...", color: "bg-yellow-100 text-yellow-700" },
  { id: 2, instruction: "Acknowledge 2 things you can smell.", placeholder: "I smell...", color: "bg-green-100 text-green-700" },
  { id: 1, instruction: "Acknowledge 1 thing you can taste.", placeholder: "I can taste...", color: "bg-blue-100 text-blue-700" },
];

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            if (phase === 'Inhale') {
              setPhase('Hold');
              return 7;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 8;
            } else {
              setPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setPhase('Inhale');
      setTimer(4);
    }
  };

  return (
    <div className="bg-indigo-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-80 shadow-lg">
      <div className={`absolute w-64 h-64 bg-indigo-500 rounded-full opacity-20 transition-transform duration-[4000ms] ease-in-out ${isActive && phase === 'Inhale' ? 'scale-150' : 'scale-100'}`} />
      <div className={`absolute w-48 h-48 bg-indigo-400 rounded-full opacity-30 transition-transform duration-[4000ms] ease-in-out ${isActive && phase === 'Inhale' ? 'scale-125' : 'scale-100'}`} />
      
      <div className="z-10 text-center">
        <Wind size={48} className="mx-auto mb-4 text-indigo-200" />
        <h3 className="text-2xl font-bold mb-2">4-7-8 Breathing</h3>
        
        {isActive ? (
          <div className="mb-6">
            <div className="text-5xl font-mono font-bold mb-2">{timer}</div>
            <div className="text-xl uppercase tracking-widest text-indigo-200">{phase}</div>
          </div>
        ) : (
          <p className="mb-6 text-indigo-200">Relax your mind and body.</p>
        )}

        <button 
          onClick={toggle}
          className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 mx-auto"
        >
          {isActive ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
        </button>
      </div>
    </div>
  );
};

const FiveFourThreeTwoOne: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const reset = () => setCurrentStepIndex(0);

  const step = STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-80 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">5-4-3-2-1 Grounding</h3>
        <button onClick={reset} className="text-gray-400 hover:text-teal-600 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="w-full bg-gray-100 h-2 rounded-full mb-6">
        <div 
          className="bg-teal-500 h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${step.color} bg-opacity-20`}>
           {step.id === 5 && <Eye size={32} className="text-red-500" />}
           {step.id === 4 && <Hand size={32} className="text-orange-500" />}
           {step.id === 3 && <Ear size={32} className="text-yellow-500" />}
           {step.id === 2 && <Coffee size={32} className="text-green-500" />}
           {step.id === 1 && <Smile size={32} className="text-blue-500" />}
        </div>
        
        <h4 className="text-2xl font-bold text-gray-800 mb-2">{step.instruction}</h4>
        <p className="text-gray-500 mb-6">Take your time. Say them out loud or in your head.</p>
        
        {currentStepIndex < STEPS.length - 1 ? (
          <button 
            onClick={nextStep}
            className="w-full bg-teal-50 text-teal-700 py-3 rounded-xl font-semibold hover:bg-teal-100 transition-colors"
          >
            I've done this
          </button>
        ) : (
          <div className="text-teal-600 font-bold flex flex-col items-center">
            <Sparkles className="mb-2" />
            <p>You did great. How do you feel?</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Grounding: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto">
      <BreathingExercise />
      <FiveFourThreeTwoOne />
      
      <div className="md:col-span-2 bg-amber-50 rounded-2xl p-6 border border-amber-100">
        <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
           <Coffee size={20} /> Quick Distractions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {['Count backwards from 100 by 7', 'Find 5 blue objects', 'Name all your favorite movies', 'Drink a glass of cold water'].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl text-center shadow-sm border border-amber-100 text-sm text-gray-700 hover:shadow-md transition-shadow cursor-pointer">
                    {item}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Grounding;