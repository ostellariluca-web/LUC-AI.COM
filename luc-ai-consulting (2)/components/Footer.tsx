// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-dark-700 bg-dark-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <p className="text-light-400">
              © {new Date().getFullYear()} LUC.AI –{' '}
              <NavLink to="/" className="hover:text-primary transition-colors">
                luc-ai.com
              </NavLink>{' '}
              |{' '}
              <a href="#/datenschutz" className="hover:text-primary transition-colors">
                Datenschutz
              </a>
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://linkedin.com/in/lucaostellari"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-400 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:hello@lucaconsulting.ai"
              className="text-light-400 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;