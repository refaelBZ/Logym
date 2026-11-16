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

  useClickOutside(menuRef, (e) => {
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
        >
          {options.map((option, index) => (
            <div key={index} onClick={(e) => {
              e.stopPropagation();
              if (option.onClick) option.onClick(e);
              if (onClose) onClose();
            }} className={styles.menuItem}>
              <div className={styles.name}>{option.name}</div>
              <div className={styles.icon}>{option.icon}</div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
