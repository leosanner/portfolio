# Leonardo Sanner — portfolio

Static personal site in English and Portuguese, built with Astro and React Flow. No backend.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Editing content

All copy lives in typed data files, with an `en` and `pt` value for every string:

- `src/data/profile.ts` — name, bio, links, education
- `src/data/career.ts` — experience route: stops, phases and the Petrobras sub-projects
- `src/i18n/ui.ts` — interface strings

The experience diagram (`src/components/CareerRoute.tsx`) is laid out from that data by `src/lib/route-layout.ts`.
