# Bzzy Partners static-site operations

The partner page is intentionally deployable without a database. Inquiries are delivered to `brian@bzzy.app` through FormSubmit.

## First production submission

FormSubmit may send an activation email to the recipient address the first time the form is used. Complete that one-time activation before inviting partner traffic. Do not test with confidential or sensitive information.

## Local preview

From the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/partners/`.

## Verification

Run the dependency-free static checks:

```powershell
node scripts/check-partners.mjs
node --check partners/partners.js
git diff --check
```

## Current limitations

- Email delivery is not database persistence.
- Duplicate prevention is browser-local and lasts 24 hours.
- Shared inquiry statuses and audit history require a backend or CRM.
- Analytics hooks emit `bzzy:analytics` browser events and push to `dataLayer` when one exists; an analytics provider still needs to be configured.
- Product illustrations are representative previews. Replace them with approved screenshots when available.
