# PWA Implementation Steps

To transform this application into a Progressive Web App (PWA), follow these steps:

## 1. Web App Manifest
Create a `manifest.json` file in the root directory to define how the app appears on the user's device.
- **Fields required**: `name`, `short_name`, `start_url`, `display`, `background_color`, `theme_color`, and `icons`.

## 2. Service Worker (`sw.js`)
Implement a Service Worker in the root directory to handle offline capabilities and caching.
- **Install Event**: Cache essential assets (HTML, CSS, JS, images).
- **Fetch Event**: Intercept network requests to serve cached content when offline.

## 3. Registration Script
Register the Service Worker in the main entry point (e.g., `script.js`).
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}
```

## 4. PWA Icons
Ensure icons are available in the `pwa/` folder.
- **192x192 px**: Home screen icon.
- **512x512 px**: Splash screen icon.
- Update `manifest.json` to point to these files.

## 5. HTML Metadata
Update the `<head>` of `index.html` to link the manifest and set mobile-specific tags.
- `<link rel="manifest" href="/manifest.json">`
- `<meta name="theme-color" content="#your-color">`
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `<link rel="apple-touch-icon" href="pwa/logo.png">`
