# Integrations

## Overview

External systems and environment boundaries Logym depends on.

## MongoDB

- Connection string: `MONGO_URI`.
- Bootstrap: [Server/db.js](../Server/db.js).
- Process exits if URI is missing or initial connection fails.
- Mongoose reconnects on disconnect; errors are logged.

## Authentication secrets

- JWT signing secret: `SECRET_CODE` (used in [Server/User/auth.js](../Server/User/auth.js)).
- Tokens expire in 30 days.
- Passwords hashed with bcryptjs.

## Email (Nodemailer)

- Implementation: [Server/User/emailService.js](../Server/User/emailService.js).
- Used for welcome email on signup and password-reset emails.
- Configured via `EMAIL_SERVICE` **or** `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_SECURE`, plus `EMAIL_USER` / `EMAIL_PASS`.
- Optional branding: `APP_NAME`, `EMAIL_FROM`, `EMAIL_FROM_NAME`, `WELCOME_SUBJECT`, `EMAIL_DEBUG`.
- Transporter verification runs non-blocking at server startup.

## CORS / client origins

- Configured in [Server/index.js](../Server/index.js).
- Env: `CLIENT_ORIGIN` or comma-separated `CLIENT_ORIGINS`.
- Defaults include production hosts (`logym.vercel.app`, `app.logym.fit`) and local Vite ports.
- Also allows localhost/127.0.0.1 any port, plus `*.vercel.app` and `*.netlify.app`.

## Client API base URL

- `VITE_API_URL` in Client env (consumed by [Client/src/api.js](../Client/src/api.js)).

## Hosting

- Client: Vercel SPA rewrite to `index.html` ([Client/vercel.json](../Client/vercel.json)); `X-Robots-Tag: noindex, nofollow`.
- Server: Node HTTP process on `PORT` (default 2500). Bind behavior follows the hosting platform’s port injection.

## Unused / commented

- OpenAI recommendation generation exists only as commented code in the workout service; not an active integration.

## Related Documentation

- [Architecture](architecture.md)
- [Authentication](features/authentication.md)
