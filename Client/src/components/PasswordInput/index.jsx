import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './style.module.scss';

export default function PasswordInput({
  id,
  className,
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <input
        id={id}
        className={`${className} ${styles.input}`}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-required="true"
      />
      <button
        type="button"
        className={styles.icon}
        onClick={() => !disabled && setShowPassword(!showPassword)}
        disabled={disabled}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <FiEyeOff size={20} aria-hidden="true" /> : <FiEye size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}
