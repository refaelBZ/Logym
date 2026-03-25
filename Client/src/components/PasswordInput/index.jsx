import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './style.module.scss';

export default function PasswordInput({ className, value, onChange, placeholder, disabled }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <input
        className={`${className} ${styles.input}`}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <div 
        className={styles.icon} 
        onClick={() => !disabled && setShowPassword(!showPassword)}
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </div>
    </div>
  );
}
