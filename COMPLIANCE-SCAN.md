# Logym Compliance Scan

Scan date: 2026-11-16  
Scope: `Client/` + `Server/` (app at app.logym.fit / logym.vercel.app)  
Legal pages (separate repo): https://logym.fit/terms, /privacy, /cookies, /health, /accessibility, /contact  
Contacts: support@logym.fit, privacy@logym.fit  
Minimum age: 16 globally · No legal entity yet · No payment/subscription terms

Status legend: **Fixed in this PR** | **Open**

---

## Legal

| Severity | Finding | Paths | Status |
|----------|---------|-------|--------|
| Critical | No ToS / Privacy consent at signup; no stored consent timestamp or document version | `Client/src/pages/Signup/index.jsx`, `Server/User/auth.js`, `Server/User/user.model.js` | Fixed in this PR |
| Critical | No 16+ age confirmation at signup | `Client/src/pages/Signup/index.jsx`, `Server/User/auth.js` | Fixed in this PR |
| Critical | No health disclaimer acknowledgement in-app | `Client/src/components/HealthDisclaimerModal/`, `Client/src/pages/Signup/index.jsx`, `Server/User/user.router.js` | Fixed in this PR |
| Critical | No in-app links to legal pages | `Client/src/components/LegalLinks/`, Settings + auth screens | Fixed in this PR |
| High | No operating legal entity named in-app (entity lives on landing legal pages) | Landing: Logym-One-Pager | Open |
| Medium | Cookie / tracking notice not shown in app (no analytics SDKs found in Client) | Client | Open (low risk until analytics added) |
| Low | No payment / subscription terms | N/A by product design | Open (intentionally out of scope) |

---

## Privacy (GDPR / UK GDPR, CCPA/CPRA, COPPA)

| Severity | Finding | Paths | Status |
|----------|---------|-------|--------|
| Critical | No self-serve account deletion / erasure (Art. 17 / CCPA delete) | `Server/User/user.router.js` `DELETE /user/me`, Settings UI | Fixed in this PR |
| Critical | No data export / portability (Art. 20 / CCPA know) | `Server/User/user.router.js` `GET /user/me/export`, Settings UI | Fixed in this PR |
| Critical | Consent not recorded with timestamp + document version | `Server/User/user.model.js`, `Server/User/compliance.js` | Fixed in this PR |
| Critical | COPPA / under-16: no age gate (min age 16) | Signup age checkbox + server validation | Fixed in this PR |
| High | No DSR intake workflow beyond email (privacy@logym.fit) for non-account holders | Landing contact | Open |
| High | No retention / deletion schedule documented in-app | Privacy policy on logym.fit | Open |
| Medium | JWT + email in `localStorage` (XSS exposure risk) | `Client/src/api.js`, auth pages | Open |
| Medium | Welcome / reset emails process personal data; ensure privacy notice covers this | `Server/User/emailService.js` | Open |
| Low | No CCPA “Do Not Sell/Share” UI (no sale/share of personal data identified in code) | N/A | Open (policy-level) |

---

## Security (privacy-relevant)

| Severity | Finding | Paths | Status |
|----------|---------|-------|--------|
| Critical | IDOR on `GET /user/:id` — any auth user could read another user by email | `Server/User/user.router.js` | Fixed in this PR (`/user/me` + ownership check) |
| Critical | Mass-assignment on `PUT /user` (e.g. `permission`) | `Server/User/user.service.js`, `compliance.js` allowlist | Fixed in this PR |
| Critical | Open unauthenticated `POST /user/` registration bypassing `/signup` controls | `Server/User/user.router.js` | Fixed in this PR (route removed) |
| Critical | No rate limiting on auth endpoints | `Server/User/user.router.js` (`express-rate-limit`) | Fixed in this PR |
| High | `DELETE` exercise did not enforce workout ownership before mutation | `Server/workout/workoutService.js` | Fixed in this PR |
| High | Signup previously spread raw `userData` into the User model | `Server/User/auth.js` | Fixed in this PR |
| High | Password reset tokens / JWT secret strength depend on env; no rotation docs | `Server/User/auth.js` | Open |
| Medium | CORS allows `*.vercel.app` / `*.netlify.app` preview origins | `Server/index.js` | Open |
| Medium | No security headers (Helmet) / HSTS at app layer | `Server/index.js` | Open |
| Low | Verbose auth console logging may include emails | `Server/User/auth.js` | Open |

---

## Accessibility (WCAG 2.2 AA)

| Severity | Finding | Paths | Status |
|----------|---------|-------|--------|
| Critical | Auth forms used placeholder-only inputs (no programmatic labels) | Login, Signup, Forgot, Reset, PasswordInput | Fixed in this PR |
| Critical | Primary `Button` click handler on wrapping `div` — keyboard activation broken | `Client/src/components/Button/index.jsx` | Fixed in this PR |
| Critical | Password visibility control was non-keyboard `div` without name | `Client/src/components/PasswordInput/` | Fixed in this PR |
| Critical | Footer icon nav links had no accessible names | `Client/src/components/Footer/index.jsx` | Fixed in this PR |
| High | Form errors not reliably announced to assistive tech | `Client/src/components/ErrorItem/index.jsx` (`role="alert"`) | Fixed in this PR |
| High | Menu actions not keyboard-operable | `Client/src/components/Menu/index.jsx` | Fixed in this PR |
| High | Text/control contrast weak (`#98989c` on dark surfaces) | `Client/src/index.scss` | Fixed in this PR (stronger tokens) |
| Medium | Dialogs lacked `aria-modal` / dialog roles | `DialogBox`, HealthDisclaimerModal | Fixed in this PR |
| Medium | Focus outlines previously removed on several inputs | mixins + global `:focus-visible` | Fixed in this PR |
| Low | `lang="en"` already present on document | `Client/index.html` | Fixed in this PR (verified OK) |
| Low | Chart / progress visuals may lack text alternatives for score meaning | `Client/src/components/Chart/`, ScoreBar | Open |
| Low | Custom Picker may need richer ARIA spinbutton semantics | `Client/src/components/Picker/` | Open |

---

## Verification notes

- Critical items from the prior audit were re-checked against source and addressed in this PR.
- Server unit check: `npm test` in `Server/` (`User/compliance.test.js`).
- Client production build: `npm run build` in `Client/`.
- Legal copy / entity registration remain on the landing site (`refaelBZ/Logym-One-Pager`); this PR wires the app to those URLs and records consent versions (`LEGAL_DOC_VERSION = 2024-11-01`).
