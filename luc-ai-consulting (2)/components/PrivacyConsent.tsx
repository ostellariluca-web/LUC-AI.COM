// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyConsent: React.FC = () => {
  const [show, setShow] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('privacy-consent');
    if (!consent) {
      setConsentGiven(false);
      setTimeout(() => {
        setShow(true);
      }, 1000);
    }
  }, []);

  const handleConsent = (type: 'all' | 'necessary') => {
    localStorage.setItem('privacy-consent', type);
    setShow(false);
    setTimeout(() => {
      setConsentGiven(true);
    }, 400);
  };

  if (consentGiven) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-light-100 text-dark-900 border-t border-light-200 p-6 shadow-2xl z-[1000] transform transition-transform duration-400 ease-in-out ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container mx-auto flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-grow">
          <p className="font-bold">Datenschutz & Cookies</p>
          <p className="text-sm text-gray-700">
            Wir verwenden Cookies, um die Nutzererfahrung zu verbessern. Durch die Nutzung unserer Website stimmen Sie unserer Datenschutzerklärung zu.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => handleConsent('all')}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-5 rounded-lg transition-colors"
          >
            Alle akzeptieren
          </button>
          <button
            onClick={() => handleConsent('necessary')}
            className="bg-light-200 hover:bg-light-200/80 text-dark-800 font-medium py-2 px-5 rounded-lg transition-colors"
          >
            Nur notwendige
          </button>
          <Link to="/datenschutz" className="text-sm text-primary hover:underline">
            Datenschutz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsent;