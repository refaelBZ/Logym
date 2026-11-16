import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../Button';
import { LEGAL_URLS } from '../../constants/legal';
import apiClient from '../../api';

export default function HealthDisclaimerModal({ onAccepted }) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleAccept = async () => {
    if (!checked) return;
    setLoading(true);
    try {
      await apiClient.post('/user/me/health-disclaimer');
      if (typeof onAccepted === 'function') onAccepted();
    } catch (err) {
      console.error('Failed to acknowledge health disclaimer:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="health-disclaimer-title">
      <div className={styles.modal}>
        <h2 id="health-disclaimer-title" className={styles.title}>Health disclaimer</h2>
        <p className={styles.body}>
          Logym helps you track workouts. It is not medical advice. Consult a qualified professional
          before starting or changing an exercise program, especially if you have a health condition.
          See our{' '}
          <a href={LEGAL_URLS.health} target="_blank" rel="noopener noreferrer">
            Health Disclaimer
          </a>
          .
        </p>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            disabled={loading}
          />
          <span>I understand and acknowledge the health disclaimer.</span>
        </label>
        <Button
          title="Continue"
          type="primary"
          onClick={handleAccept}
          disabled={!checked || loading}
          loadingTitle="Saving..."
        />
      </div>
    </div>
  );
}
