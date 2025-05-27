import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 50);
    
    // Start exit animation before duration ends
    const exitTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 200);
      }, 200);
    }, duration - 200);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    }, 200);
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-emerald-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-amber-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getStyles = () => {
    const baseStyles = "backdrop-blur-md border shadow-xl";
    switch (type) {
      case 'success':
        return `${baseStyles} bg-white/90 dark:bg-gray-900/90 border-emerald-200/50 dark:border-emerald-800/50 shadow-emerald-500/10`;
      case 'error':
        return `${baseStyles} bg-white/90 dark:bg-gray-900/90 border-red-200/50 dark:border-red-800/50 shadow-red-500/10`;
      case 'warning':
        return `${baseStyles} bg-white/90 dark:bg-gray-900/90 border-amber-200/50 dark:border-amber-800/50 shadow-amber-500/10`;
      default:
        return `${baseStyles} bg-white/90 dark:bg-gray-900/90 border-blue-200/50 dark:border-blue-800/50 shadow-blue-500/10`;
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`max-w-sm w-full ${
        isVisible && !isLeaving 
          ? 'toast-enter' 
          : isLeaving
          ? 'toast-exit'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`rounded-xl overflow-hidden ${getStyles()} group hover:scale-[1.02] transition-transform duration-200`}>
        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-200/30 dark:bg-gray-700/30 relative overflow-hidden">
          <div 
            className={`h-full ${getProgressBarColor()} toast-progress`}
            style={{
              '--duration': `${duration}ms`
            } as React.CSSProperties}
          />
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        
        {/* Content */}
        <div className="p-4 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent" />
          </div>
          
          <div className="flex items-start gap-3 relative">
            {/* Icon with pulse animation */}
            <div className="flex-shrink-0 mt-0.5">
              <div className={`transition-all duration-300 ${isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-12'}`}>
                <div className="relative">
                  {getIcon()}
                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 ${getProgressBarColor()} opacity-20 blur-sm rounded-full scale-150`} />
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                {message}
              </p>
            </div>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 hover:scale-110 active:scale-95"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast; 