// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
  }
}

const VantaBackground: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(window.VANTA.WAVES({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x7c3aed,
        shininess: 0.00,
        waveHeight: 10.00,
        waveSpeed: 0.75,
        zoom: 0.85
      }));
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="absolute top-0 left-0 w-full h-full -z-10 opacity-15" />;
};

export default VantaBackground;