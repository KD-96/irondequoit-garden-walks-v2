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

https://irondequoit-garden-walks-v2.vercel.app/

## Getting started (local)

Option A — Static site (no Node required)

1. Clone the repo:
   git clone https://github.com/KD-96/irondequoit-garden-walks-v2.git
2. Change into the project directory and serve the files:
   - Python 3: python3 -m http.server 8000
   - Or use a static server: npx serve.
3. Open http://localhost:8000 in your browser.

Option B — Node (if a package.json and dev server are added)

1. Clone the repo:
   git clone https://github.com/KD-96/irondequoit-garden-walks-v2.git
2. Install dependencies:
   npm install
3. Start the dev server:
   npm start
4. Open the URL shown by the dev server.

## Usage

- Open the site and click markers to view garden details.
- Use controls for zoom, locate, or toggling layers if available.
- Edit files in /data to add or update gardens and routes.

## Development

- Keep UI responsive: test across desktop and mobile form factors.
- Use semantic HTML and accessible popup content (alt text for images, proper headings).
- Optimize images for web (resize, compress) and use responsive images where useful.

## License

This project is provided under the MIT License by default. If you prefer a different license, update or add a LICENSE file.

## Acknowledgements

- Map libraries: Leaflet, Mapbox GL JS, or Google Maps (whichever is used).
- Thanks to contributors and the local Irondequoit garden community.

## Contact

Maintainer: KD-96 (https://github.com/KD-96)
