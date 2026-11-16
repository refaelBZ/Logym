# Authentication

## Overview

Email/password accounts with JWT sessions. Supports signup, login, profile updates (including weight `stepSize`), and password forgot/reset via email.

## Behavior

- **Signup** — validates email, password (≥6), username; hashes password; returns `{ user, token }`; may send welcome email.
- **Login** — same generic error for unknown user or bad password (`401`); returns `{ token }`.
- **Session** — client stores `logym_token` and `logym_userEmail`; Layout treats presence of token as logged in.
- **Protected APIs** — Bearer JWT; payload includes `userId`. Invalid/expired token → `403`.
- **Forgot password** — always responds with a generic success message; emails a reset link when the account exists.
- **Reset password** — token + new password; returns a fresh JWT for immediate login.
- **Logout** — client clears localStorage keys (Settings).
- **401 on API** — interceptor clears token and reloads if a prior session existed (avoids stale UI).

## Architecture

- Routes: [Server/User/user.router.js](../../Server/User/user.router.js)
- Auth helpers / middleware: [Server/User/auth.js](../../Server/User/auth.js)
- User persistence: [Server/User/user.service.js](../../Server/User/user.service.js), [Server/User/user.model.js](../../Server/User/user.model.js)
- Email: [Server/User/emailService.js](../../Server/User/emailService.js)
- Client pages: Login, Signup, Forgot, Reset, Settings under [Client/src/pages/](../../Client/src/pages/)
- API client: [Client/src/api.js](../../Client/src/api.js)

## Edge Cases

- Emails are normalized to lowercase/trim before lookup and storage.
- Password and reset fields are excluded from default queries (`select: false`).
- Reset link base depends on configured client origins (`CLIENT_ORIGIN` / `CLIENT_ORIGINS`).

## Source References

- [user.router.js](../../Server/User/user.router.js)
- [auth.js](../../Server/User/auth.js)
- [user.model.js](../../Server/User/user.model.js)
- [emailService.js](../../Server/User/emailService.js)
- [Layout (auth gate)](../../Client/src/components/Layout/index.jsx)
- [Login page](../../Client/src/pages/Login/index.jsx)
- [Signup page](../../Client/src/pages/Signup/index.jsx)
- [Forgot page](../../Client/src/pages/Forgot/index.jsx)
- [Reset page](../../Client/src/pages/Reset/index.jsx)
- [Settings page](../../Client/src/pages/Settings/index.jsx)

## Related Documentation

- [Integrations](../integrations.md)
- [Data model](../data-model.md)
- [Features index](INDEX.md)
