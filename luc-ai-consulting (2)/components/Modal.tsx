// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-dark-800 border border-dark-700 rounded-xl max-w-md w-full p-6 m-4 shadow-2xl shadow-primary/10 transform transition-all duration-300 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-light-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-light-400 hover:text-light-100 p-1 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out forwards;
  }
`;
document.head.append(style);

export default Modal;