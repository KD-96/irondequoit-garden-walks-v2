# Irondequoit Garden Walks (v2)

Interactive garden-walk map for Irondequoit — a lightweight, client-side web app to view garden locations, photos, routes, and notes from local walks.

## Overview

- Purpose: Provide an interactive map of garden walks in Irondequoit for visitors and community members.
- Languages: JavaScript, CSS, HTML (mostly client-side JavaScript).
- Status: v2

## Features

- Interactive map with markers for garden locations
- Popups with descriptions, photos, and links
- Route drawing / sequenced walks (if route data provided)
- Responsive UI suitable for mobile and desktop
- Easy-to-update data (GeoJSON / JSON)

## Demo

If you have a live deployment (GitHub Pages, Netlify, etc.), add the Demo URL here.

Example: https://your-username.github.io/irondequoit-garden-walks-v2

## Getting started (local)

Option A — Static site (no Node required)

1. Clone the repo:
   git clone https://github.com/KD-96/irondequoit-garden-walks-v2.git
2. Change into the project directory and serve the files:
   - Python 3: python3 -m http.server 8000
   - Or use a static server: npx serve .
3. Open http://localhost:8000 in your browser.

Option B — Node (if a package.json and dev server are added)

1. Clone the repo:
   git clone https://github.com/KD-96/irondequoit-garden-walks-v2.git
2. Install dependencies:
   npm install
3. Start the dev server:
   npm start
4. Open the URL shown by the dev server.

## Project structure (typical)

- index.html — entry page
- css/ — stylesheets
- js/ — application JavaScript
- data/ — GeoJSON or JSON files with locations and routes
- images/ — photos used in popups

Adjust the above to match the repository's actual layout.

## Data & configuration

- Store locations as GeoJSON (FeatureCollection) or as a JSON array. Example feature properties:
  - name
  - description
  - photo (relative path or URL)
  - url (external link)
  - category

- Map provider:
  - If using Mapbox, add your Mapbox access token in a non-committed config file (e.g., config.js or .env) and reference it in your code. Do not commit secret keys.
  - If using Leaflet with public tile providers, no token may be required.

Example GeoJSON feature:

{
  "type": "Feature",
  "properties": {
    "name": "Example Garden",
    "description": "A short description.",
    "photo": "images/example.jpg",
    "url": "https://example.com"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-77.519, 43.180]
  }
}

## Usage

- Open the site and click markers to view garden details.
- Use controls for zoom, locate, or toggling layers if available.
- Edit files in /data to add or update gardens and routes.

## Development

- Keep UI responsive: test across desktop and mobile form factors.
- Use semantic HTML and accessible popup content (alt text for images, proper headings).
- Optimize images for web (resize, compress) and use responsive images where useful.

## Testing & linting

- Consider adding ESLint for JavaScript and stylelint for CSS to enforce a consistent code style.
- Add GitHub Actions workflows to run linting and basic checks (optional but recommended).

## Contributing

- Open issues for bugs, feature requests, or data corrections.
- For code or data changes: fork the repo, create a branch, make changes, and open a pull request with a clear description.
- When adding garden entries, include a short description and at least one photo or a photo URL.
- Consider adding CONTRIBUTING.md and CODE_OF_CONDUCT.md for community guidance.

## Deployment

- GitHub Pages: publish the site from the main branch or a gh-pages branch via repository settings.
- Other static hosts: Netlify, Vercel, Surge CLI are all suitable options.

## License

This project is provided under the MIT License by default. If you prefer a different license, update or add a LICENSE file.

## Acknowledgements

- Map libraries: Leaflet, Mapbox GL JS, or Google Maps (whichever is used).
- Thanks to contributors and the local Irondequoit garden community.

## Contact

Maintainer: KD-96 (https://github.com/KD-96)
