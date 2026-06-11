# Stretch — after cycling 🚴

A minimal offline-first PWA with a post-cycling stretching routine. Each
stretch is held for 30 seconds: tap the circle to start the timer, a chime
plays when the time is up, then tap **Next** for the following stretch.
Single-leg stretches indicate which leg and run left → right back to back.

## Use it

- Open the GitHub Pages URL once while online, then **Add to Home Screen**
  (iOS Safari: Share → Add to Home Screen; Android Chrome: Install app).
- After that the app works fully offline — illustrations are inline SVG and
  the chime is generated with the Web Audio API, so nothing needs a network.

## Develop

```bash
npm install
npm run dev      # local dev server
npm test         # vitest
npm run build    # production build into dist/
npm run icons    # regenerate the PNG app icons in public/
```

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: it installs
dependencies, runs the tests, builds the app, and force-pushes the build
output to the `pwa` branch under `/docs`.

One-time setup in the repository settings: **Settings → Pages → Source:
Deploy from a branch → Branch: `pwa`, folder `/docs`.** The app is then
served at `https://<user>.github.io/stretch/` (the Vite `base` is set to
`/stretch/`; change it in `vite.config.js` if the repo is renamed).

## Routine

Based on the cycling page ("Važiavimas dviračiu") of the classic stretching
chart — hamstrings, calves, quads, hips, groin, lower back, spine, shoulders
and feet. Exercises marked per-leg appear twice in the sequence, left leg
first.
