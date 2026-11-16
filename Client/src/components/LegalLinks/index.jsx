import React from 'react';
import styles from './style.module.scss';
import { LEGAL_URLS, SUPPORT_EMAIL, PRIVACY_EMAIL } from '../../constants/legal';

const LINKS = [
  { href: LEGAL_URLS.terms, label: 'Terms' },
  { href: LEGAL_URLS.privacy, label: 'Privacy' },
  { href: LEGAL_URLS.cookies, label: 'Cookies' },
  { href: LEGAL_URLS.health, label: 'Health' },
  { href: LEGAL_URLS.accessibility, label: 'Accessibility' },
  { href: LEGAL_URLS.contact, label: 'Contact' },
];

export default function LegalLinks({ compact = false }) {
  return (
    <nav className={compact ? styles.compact : styles.legalNav} aria-label="Legal">
      <ul className={styles.list}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      {!compact && (
        <p className={styles.emails}>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          {' · '}
          <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
        </p>
      )}
    </nav>
  );
}
