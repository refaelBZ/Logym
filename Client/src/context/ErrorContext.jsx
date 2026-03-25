import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

const STANDARD_DURATION = 5000;

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const showError = useCallback((message, options = {}) => {
    // Clear any running timer so a new error never gets wiped by an old one
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setError(message);

    // Persistent errors (e.g. network failure) must be dismissed manually
    if (!options.persistent) {
      timerRef.current = setTimeout(() => {
        setError(null);
        timerRef.current = null;
      }, STANDARD_DURATION);
    }
  }, []);

  const hideError = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
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
