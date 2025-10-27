// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedElement from './AnimatedElement';

interface CtaSectionProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

const CtaSection: React.FC<CtaSectionProps> = ({ title, description, buttonText, buttonLink }) => {
  return (
    <section className="py-20 bg-dark-900">
      <div className="container mx-auto px-6">
        <AnimatedElement>
          <div className="bg-dark-800 rounded-xl p-8 md:p-12 text-center border border-dark-700 shadow-2xl shadow-primary/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-light-100">{title}</h2>
              <p className="text-lg text-light-400 mb-8 max-w-2xl mx-auto">
                {description}
              </p>
              <Link
                to={buttonLink}
                className="inline-block bg-primary hover:bg-primary-600/90 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/40"
              >
                {buttonText}
              </Link>
            </div>
        </AnimatedElement>
      </div>
    </section>
  );
};

export default CtaSection;