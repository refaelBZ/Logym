import React, { createContext, useState, useContext, useCallback } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = useCallback((message) => {
    setError(message);
    // Optional: auto-hide after a few seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);

  const hideError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    error,
    showError,
    hideError
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
