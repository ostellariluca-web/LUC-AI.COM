/// <reference types="react" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { ThreeElements } from '@react-three/fiber';

// FIX: Centralized JSX namespace declaration to resolve widespread 'Property does not exist on type JSX.IntrinsicElements' errors. This ensures that TypeScript correctly recognizes standard HTML elements and react-three-fiber primitives as valid JSX tags.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add react-three-fiber elements used in the project
      ambientLight: ThreeElements['ambientLight'];
      directionalLight: ThreeElements['directionalLight'];
      group: ThreeElements['group'];
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);