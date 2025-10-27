// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.

import React, { useRef } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';

interface AnimatedElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <div
      ref={ref}
      className={`${className} animate-on-scroll ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedElement;