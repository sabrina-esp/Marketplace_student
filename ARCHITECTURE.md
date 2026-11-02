# Application architecture

This is a Next.js 13.4.2 App Router application. Routes compose UI or adapt HTTP requests; reusable business operations live outside the route tree.

## Authentication

```
SignInDialog / RegisterDialog / VerificationPage
                  |
          app/api/auth/*/route.js
                  |
        lib/services/AuthService.js     production dependency wiring
                  |
           lib/auth/service.mjs        validated business operations
              /           \
       User model       Email service
           |                  |
        MongoDB              SMTP
```

- `lib/auth/service.mjs`: registration, login, verification, resend and password reset. Dependencies are injected for isolated tests.
- `lib/services/AuthService.js`: creates the one production auth service with MongoDB, User, JWT and email dependencies. It contains no second implementation.
- `lib/auth/http.js`: consistent JSON parsing and public error responses.
- `lib/models/User.js`: schema and the single password-hashing save hook. Pass plain passwords to model creation/save; do not pre-hash in routes or services.
- `lib/services/emailService.js`: verification, password-reset and contact emails.
- `app/components/auth/VerificationPage.tsx`: the only verification UI, including resend recovery.
- `app/hooks/useCurrentUser.ts`: shared browser user-state subscription for navigation and the retained `UserProfile.tsx`. Stored browser data controls presentation, not authorization.

Canonical endpoints:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/auth/register` | POST | Create an account and send verification email |
| `/api/auth/signin` | POST | Check password and verification, issue JWT |
| `/api/auth/me` | GET | Authenticate bearer JWT and return profile |
| `/api/auth/verify-email` | POST | Consume a verification token |
| `/api/auth/resend-verification` | POST | Rotate token and send a new link, with a one-minute cooldown |
| `/api/auth/forgot-password` | POST | Issue a one-hour reset link |
| `/api/auth/reset-password` | POST | Consume reset token and save a new password |

All POST operations return `success` and `message`; errors have an appropriate HTTP status. Registration returns `requiresVerification` and `emailSent`. If SMTP fails after account creation, the account remains and the response explicitly directs the user to request another link. Sign-in keeps the existing `{ token, user }` contract.

Verification uses a stored opaque token and a 24-hour expiry. Matching and consumption are atomic. Already-issued stored tokens remain accepted while valid. `isEmailVerified` is the canonical login check; `isVerified` is retained and mirrored on verification for compatibility with existing data and profile consumers. No account migration or data deletion was performed.

## Compatibility and removals

- Removed unused `/Apii/auth` handlers, the old Pages Router-style `app/api/auth/verify.js`, and `app/verify.js`.
- Removed the duplicate `UserProfile.jsx`, unused VerificationToken model, and unused token/code generator. No database collections were deleted.
- `/verify`, `/verifyy`, `/api/auth/verifyemail`, and `/api/auth/verify-code` redirect to `/verify-email`, preserving tokens.
- `/api/auth/verify` delegates to the canonical verification endpoint. Legacy GET verification returns JSON; new UI uses POST.
- The database diagnostic endpoint no longer registers a competing User schema or inserts accounts. It is disabled in production.
- Logout retains the existing browser-based behavior: remove the bearer token/user and broadcast the logout event. Already-issued JWTs are not revoked server-side. Moving to HttpOnly sessions and adding token revocation is a separate migration.

## Other shared code

- `app/page.tsx`: home-page composition.
- `app/components/Navbar/navigation.ts`: one shared desktop/mobile navigation definition.
- `lib/db/mongodb.js`: cached MongoDB connection; database URI is not logged.
- `tailwind.config.js`: standard color shades plus existing brand defaults.
- Push notification setup runs when a test notification is requested, not during route imports; missing keys return 503 instead of breaking compilation.

## Checks

```
npm run test:auth
npm run typecheck
npm run build
```

Auth tests use an in-memory persistence adapter and mocked email delivery. A separate test exercises the actual Mongoose password save hook. Coverage includes register/verify/login, malformed input, duplicate accounts, wrong passwords, token expiry/reuse, resend cooldown, SMTP failure and password reset. These tests do not contact live MongoDB or send email. End-to-end checks against configured MongoDB/SMTP are still required before deployment.

Next.js 13.4.2 rewrites `moduleResolution` to `node` during its build. Use the project's TypeScript 5.0.4 in the editor (VS Code: TypeScript: Select TypeScript Version → Use Workspace Version). Upgrading Next.js and TypeScript together is a separate task; adding a TypeScript 6-only suppression is incompatible with this project's compiler.

Remaining build warnings concern image optimization, hook dependencies in match/profile pages, outdated browser compatibility data, and the environment's disabled TLS verification. No dependency upgrades or environment-secret changes were made.
