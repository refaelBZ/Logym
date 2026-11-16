import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './style.module.scss';
import useClickOutside from '../../hooks/useClickOutside';

export default function Menu({ options, onClose }) {
  const anchorRef = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useClickOutside(menuRef, () => {
    if (onClose) onClose();
  });

  return (
    <>
      <div ref={anchorRef} style={{ position: 'absolute', top: '100%', right: 0, width: 0, height: 0 }} />
      {coords && createPortal(
        <div 
          ref={menuRef}
          className={styles.menu}
          style={{ top: coords.top, right: coords.right }}
          role="menu"
        >
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={(e) => {
                e.stopPropagation();
                if (option.onClick) option.onClick(e);
                if (onClose) onClose();
              }}
            >
              <span className={styles.name}>{option.name}</span>
              <span className={styles.icon}>{option.icon}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
