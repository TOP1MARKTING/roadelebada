# Whimsy To Wonder

lets make it

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bbc096e8-a8af-4e70-b259-75d1fcdef26d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

> If `npm i` fails on the `overrides` field, install with Bun instead: `npx bun@1 install`.

## Prototype notes (frontend only)

- Public site: `/`, `/about`, `/services`, `/services/:slug`, `/portfolio`, `/contact`, `/quote`, `/privacy` — Arabic (RTL) by default with an English (LTR) switch.
- Admin dashboard: `/admin/login` (also linked from the lock icon in the footer).
  - Demo credentials: `admin@demo.local` / `Demo123!`
  - This is **not** real authentication: it only sets a flag in `sessionStorage`.
- All admin edits, quote requests and contact messages are stored in the browser's `localStorage` only. Nothing is sent to a server. Use **Website settings → Reset all data** to restore the defaults.
- Business details live in `src/config/site.ts`. Verify these before going live:
  - the domain (`siteUrl`)
  - that the phone number is registered on WhatsApp
  - business hours, social links and the map embed URL, which are intentionally left empty
