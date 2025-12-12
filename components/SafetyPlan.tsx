import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Edit2, Plus } from 'lucide-react';
import { SafetyPlan as SafetyPlanType } from '../types';

const INITIAL_PLAN: SafetyPlanType = {
  warningSigns: ['Feeling restless', 'Isolating from friends', 'Changes in sleep'],
  copingStrategies: ['Deep breathing (4-7-8)', 'Listening to soothing music', 'Walking the dog'],
  supporters: [
    { name: 'Sarah (Sister)', phone: '555-0123' },
    { name: 'Tom (Best Friend)', phone: '555-0124' }
  ],
  professionals: [
    { name: 'Dr. Smith', phone: '555-0199' },
    { name: 'Crisis Line', phone: '988' }
  ],
  reasonsToLive: ['My cat Luna', 'Seeing the ocean again', 'Finish reading my book series']
};

const Section: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    icon: React.ReactNode; 
    color: string 
}> = ({ title, children, icon, color }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 flex items-center justify-between ${isOpen ? 'bg-gray-50' : 'bg-white'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${color} bg-opacity-20 text-gray-700`}>
                        {icon}
                    </div>
                    <span className="font-bold text-gray-800">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-100 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

const SafetyPlan: React.FC = () => {
  const [plan, setPlan] = useState<SafetyPlanType>(INITIAL_PLAN);

  return (
    <div className="h-full overflow-y-auto pb-20">
        <div className="bg-indigo-600 p-6 rounded-2xl text-white mb-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
                <Shield size={28} className="text-indigo-200" />
                <h2 className="text-2xl font-bold">My Safety Plan</h2>
            </div>
            <p className="text-indigo-100 opacity-90">
                A prioritized list of coping strategies and supports to use during a crisis.
            </p>
        </div>

        <Section title="1. Warning Signs" icon={<span className="text-lg">⚠️</span>} color="bg-yellow-100">
            <ul className="space-y-2">
                {plan.warningSigns.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        {item}
                    </li>
                ))}
            </ul>
        </Section>

        <Section title="2. Internal Coping Strategies" icon={<span className="text-lg">🧘</span>} color="bg-blue-100">
             <ul className="space-y-2">
                {plan.copingStrategies.map((item, i) => (
                    <li key={i} className="p-3 bg-gray-50 rounded-lg text-gray-700">
                        {item}
                    </li>
                ))}
            </ul>
        </Section>

        <Section title="3. People to Ask for Help" icon={<span className="text-lg">👥</span>} color="bg-green-100">
            <div className="grid gap-3">
                {plan.supporters.map((p, i) => (
                    <a key={i} href={`tel:${p.phone}`} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                        <span className="font-semibold text-gray-800">{p.name}</span>
                        <span className="text-green-700 bg-white px-3 py-1 rounded-full text-sm font-mono">{p.phone}</span>
                    </a>
                ))}
            </div>
        </Section>

        <Section title="4. Professional Support" icon={<span className="text-lg">🏥</span>} color="bg-purple-100">
             <div className="grid gap-3">
                {plan.professionals.map((p, i) => (
                    <a key={i} href={`tel:${p.phone}`} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                        <span className="font-semibold text-gray-800">{p.name}</span>
                        <span className="text-purple-700 bg-white px-3 py-1 rounded-full text-sm font-mono">{p.phone}</span>
                    </a>
                ))}
            </div>
        </Section>

        <Section title="5. Reasons for Living" icon={<span className="text-lg">🌟</span>} color="bg-orange-100">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.reasonsToLive.map((item, i) => (
                    <div key={i} className="p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 shadow-sm flex items-center justify-center text-center font-medium text-gray-800">
                        {item}
                    </div>
                ))}
            </div>
        </Section>

        <button className="w-full py-4 mt-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
            <Edit2 size={18} /> Edit Plan
        </button>
    </div>
  );
};

export default SafetyPlan;