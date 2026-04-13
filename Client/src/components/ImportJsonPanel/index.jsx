import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../Button';

const SAMPLE_JSON = JSON.stringify(
  [
    {
      exerciseName: 'Bench Press',
      muscleGroup: 'Chest',
      sets: 3,
      reps: 10,
      weight: 60,
      notes: 'Keep back flat'
    },
    {
      exerciseName: 'Squat',
      muscleGroup: 'Legs',
      sets: 4,
      reps: 8,
      weight: 100,
      notes: 'Knees over toes'
    }
  ],
  null,
  2
);

export default function ImportJsonPanel({ onImport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleImport = () => {
    setValidationError('');

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setValidationError('Invalid JSON. Please check your format.');
      return;
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      setValidationError('JSON must be a non-empty array of exercises.');
      return;
    }

    const validated = [];
    for (let i = 0; i < parsed.length; i++) {
      const ex = parsed[i];
      if (!ex.exerciseName || typeof ex.exerciseName !== 'string' || !ex.exerciseName.trim()) {
        setValidationError(`Exercise ${i + 1}: "exerciseName" (string) is required.`);
        return;
      }
      if (!ex.muscleGroup || typeof ex.muscleGroup !== 'string' || !ex.muscleGroup.trim()) {
        setValidationError(`Exercise ${i + 1}: "muscleGroup" (string) is required.`);
        return;
      }
      if (typeof ex.sets !== 'number' || ex.sets < 1) {
        setValidationError(`Exercise ${i + 1}: "sets" must be a positive number.`);
        return;
      }
      if (typeof ex.reps !== 'number' || ex.reps < 1) {
        setValidationError(`Exercise ${i + 1}: "reps" must be a positive number.`);
        return;
      }
      validated.push({
        exerciseName: ex.exerciseName.trim(),
        muscleGroup: ex.muscleGroup.trim(),
        sets: ex.sets,
        reps: ex.reps,
        weight: typeof ex.weight === 'number' ? ex.weight : 0,
        notes: typeof ex.notes === 'string' ? ex.notes : '',
      });
    }

    onImport(validated);
    setIsOpen(false);
    setJsonText('');
    setShowSample(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setJsonText('');
    setValidationError('');
    setShowSample(false);
  };

  if (!isOpen) {
    return (
      <Button title="Import JSON" type="secondary" onClick={() => setIsOpen(true)} />
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>Import Exercises from JSON</div>
      <textarea
        className={styles.textarea}
        value={jsonText}
        onChange={e => {
          setJsonText(e.target.value);
          setValidationError('');
        }}
        placeholder="Paste your JSON array here..."
        rows={8}
      />
      {validationError && (
        <div className={styles.error}>{validationError}</div>
      )}
      <button
        type="button"
        className={styles.sampleToggle}
        onClick={() => setShowSample(prev => !prev)}
      >
        {showSample ? 'Hide Sample JSON' : 'Show Sample JSON'}
      </button>
      {showSample && (
        <pre className={styles.sampleJson}>{SAMPLE_JSON}</pre>
      )}
      <div className={styles.actions}>
        <Button title="Import" type="primary" onClick={handleImport} />
        <Button title="Cancel" type="secondary" onClick={handleCancel} />
      </div>
    </div>
  );
}
