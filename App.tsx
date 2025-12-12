import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, Shield, Activity, Anchor, Menu, ScanFace } from 'lucide-react';
import EmergencyButton from './components/EmergencyButton';
import Chatbot from './components/Chatbot';
import Grounding from './components/Grounding';
import SafetyPlan from './components/SafetyPlan';
import MoodTracker from './components/MoodTracker';
import EmotionAnalyzer from './components/EmotionAnalyzer';
import { View } from './types';
import { generatePositiveAffirmation } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [affirmation, setAffirmation] = useState<string>("Loading hope...");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Initial content generation
    generatePositiveAffirmation().then(setAffirmation);

    // Time-based greeting
    const hour = new Date().getHours();
    if (hour < 5) setGreeting("It's late. I'm glad you're here.");
    else if (hour < 12) setGreeting("Good morning.");
    else if (hour < 18) setGreeting("Good afternoon.");
    else setGreeting("Good evening.");
  }, []);

  const NavButton = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
        currentView === view ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={24} className={currentView === view ? 'fill-current' : ''} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (currentView) {
      case View.CHAT:
        return <Chatbot />;
      case View.GROUNDING:
        return <Grounding />;
      case View.SAFETY_PLAN:
        return <SafetyPlan />;
      case View.MOOD:
        return <MoodTracker />;
      case View.ANALYSIS:
        return <EmotionAnalyzer />;
      case View.HOME:
      default:
        return (
          <div className="space-y-6 h-full overflow-y-auto pb-20">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">{greeting}</h1>
                    <p className="text-teal-100 text-lg opacity-90 font-light italic">"{affirmation}"</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
                    <Anchor size={200} />
                </div>
            </div>

            <button 
                onClick={() => setCurrentView(View.ANALYSIS)}
                className="w-full bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 text-left">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <ScanFace className="text-violet-400" /> AI Check-in
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Analyze mood via voice & camera</p>
                </div>
                <div className="relative z-10 bg-slate-700 p-2 rounded-full text-white group-hover:bg-violet-600 transition-colors">
                    <Activity size={20} />
                </div>
            </button>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setCurrentView(View.CHAT)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                >
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                        <MessageCircle size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">3AM Friend</h3>
                    <p className="text-xs text-gray-500 mt-1">Chat with Lighthouse</p>
                </button>

                <button 
                    onClick={() => setCurrentView(View.GROUNDING)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                >
                    <div className="bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
                        <Anchor size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Ground Me</h3>
                    <p className="text-xs text-gray-500 mt-1">Calm down quickly</p>
                </button>

                 <button 
                    onClick={() => setCurrentView(View.SAFETY_PLAN)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                >
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <Shield size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Safety Plan</h3>
                    <p className="text-xs text-gray-500 mt-1">Your crisis toolkit</p>
                </button>

                 <button 
                    onClick={() => setCurrentView(View.MOOD)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                >
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                        <Activity size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Mood Log</h3>
                    <p className="text-xs text-gray-500 mt-1">Track your journey</p>
                </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      {/* Mobile-first Container */}
      <div className="w-full max-w-md bg-slate-50 relative flex flex-col h-[100dvh]">
        
        {/* Top Header (Only visible on sub-pages or sticky) */}
        <header className="p-6 pb-2 flex justify-between items-center bg-slate-50 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                <Anchor size={18} />
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">Lighthouse</span>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-hidden relative">
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-100 flex justify-around items-center px-2 pb-safe z-40">
          <NavButton view={View.HOME} icon={Home} label="Home" />
          <NavButton view={View.MOOD} icon={Activity} label="Mood" />
          <div className="w-12"></div> {/* Spacer for FAB if needed, or just visual balance */}
          <NavButton view={View.CHAT} icon={MessageCircle} label="Chat" />
          <NavButton view={View.SAFETY_PLAN} icon={Shield} label="Safety" />
        </nav>

        {/* Emergency Button Overlay */}
        <EmergencyButton />
      </div>
    </div>
  );
};

export default App;