import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry } from '../types';
import { Frown, Meh, Smile, Plus } from 'lucide-react';

const MOCK_DATA: MoodEntry[] = [
  { date: 'Mon', value: 3 },
  { date: 'Tue', value: 2 },
  { date: 'Wed', value: 4 },
  { date: 'Thu', value: 3 },
  { date: 'Fri', value: 4 },
  { date: 'Sat', value: 5 },
  { date: 'Sun', value: 4 },
];

const MoodTracker: React.FC = () => {
  const [data, setData] = useState<MoodEntry[]>(MOCK_DATA);
  const [todayMood, setTodayMood] = useState<number | null>(null);

  const handleAddMood = (value: number) => {
    setTodayMood(value);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    setData(prev => [...prev.slice(1), { date: today, value }]);
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">How are you feeling today?</h3>
        <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
                <button
                    key={val}
                    onClick={() => handleAddMood(val)}
                    className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                        todayMood === val 
                        ? 'bg-teal-600 text-white transform scale-105 shadow-md' 
                        : 'bg-gray-50 text-gray-400 hover:bg-teal-50 hover:text-teal-600'
                    }`}
                >
                    {val === 1 && <Frown className="mb-1" />}
                    {val === 2 && <Frown className="mb-1 opacity-70" />}
                    {val === 3 && <Meh className="mb-1" />}
                    {val === 4 && <Smile className="mb-1 opacity-70" />}
                    {val === 5 && <Smile className="mb-1" />}
                    <span className="text-xs font-bold">{val}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Week</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis hide domain={[1, 5]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0d9488" 
                strokeWidth={3} 
                dot={{ fill: '#0d9488', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 mb-2">Sleep</h4>
              <p className="text-indigo-700 text-sm">7.5 hrs avg this week</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <h4 className="font-semibold text-emerald-900 mb-2">Micro-Wins</h4>
              <div className="flex gap-2 flex-wrap">
                  <span className="bg-white px-2 py-1 rounded text-xs text-emerald-700 shadow-sm">Made bed</span>
                  <span className="bg-white px-2 py-1 rounded text-xs text-emerald-700 shadow-sm">Drank water</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MoodTracker;