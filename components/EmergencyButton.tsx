import React, { useState } from 'react';
import { Phone, X, ShieldAlert } from 'lucide-react';

const EmergencyButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sticky Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          aria-label="Emergency Help"
        >
          <ShieldAlert size={24} />
          <span className="hidden md:inline font-bold">Help</span>
        </button>
      </div>

      {/* Full Screen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-red-50 z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow text-gray-600"
          >
            <X size={24} />
          </button>

          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-2 border-red-100">
            <ShieldAlert size={64} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You are not alone.</h2>
            <p className="text-gray-600 mb-8">
              Help is available right now. These services are free, confidential, and available 24/7.
            </p>

            <div className="space-y-4">
              <a 
                href="tel:988"
                className="block w-full bg-red-500 text-white py-4 rounded-xl font-bold text-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-3"
              >
                <Phone /> Call 988
              </a>
              
              <a 
                href="sms:741741&body=HOME"
                className="block w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-bold text-xl hover:bg-gray-200 transition-colors"
              >
                Text "HOME" to 741741
              </a>

              <button 
                onClick={() => window.open('https://findahelpline.com', '_blank')}
                className="block w-full border-2 border-red-100 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors mt-4"
              >
                Find International Helplines
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyButton;