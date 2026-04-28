import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const info = (message, duration) => addToast(message, 'info', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-300 text-blue-800';
    }
  };

  return (
    <div className={`px-4 py-3 border rounded shadow-lg flex items-center justify-between min-w-[300px] max-w-md ${getStyles()}`}>
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-4 text-current opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};
