// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const activeLinkClass = "text-primary-500 font-semibold";
  const inactiveLinkClass = "text-light-200 hover:text-primary-500 transition-colors duration-300";

  return (
    <header className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-lg border-b border-dark-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="text-2xl font-bold gradient-text logo-animation">
            LUC-AI.COM
          </NavLink>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-light-200 hover:text-primary-500 transition-colors rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-dark-800 rounded-xl shadow-2xl p-2 border border-dark-700 mobile-menu-animated">
            <nav className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                 <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) => 
                        `block px-4 py-3 rounded-lg transition-colors duration-200 ${
                            isActive ? 'bg-primary/10 text-primary-500 font-semibold' : 'hover:bg-dark-700 text-light-100'
                        }`
                    }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;