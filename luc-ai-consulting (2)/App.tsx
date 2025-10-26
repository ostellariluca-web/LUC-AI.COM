// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SolutionsPage from './pages/SolutionsPage';
import AboutPage from './pages/AboutPage';
import PrivacyConsent from './components/PrivacyConsent';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="bg-dark-950 text-light-100 font-sans antialiased overflow-x-hidden">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
        <PrivacyConsent />
      </div>
    </HashRouter>
  );
};

export default App;