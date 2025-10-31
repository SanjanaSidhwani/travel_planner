# Itinero — Travel Planner

Itinero is a simple and responsive travel planning website built using HTML, CSS, and JavaScript.  
It’s a static multi-page site that allows users to explore destinations, plan trips, calculate costs, manage travel checklists, and handle basic authentication (login/signup) — all without any backend setup.

## Key features

- Multi-page static website with no backend required  
- Fully responsive design for mobile, tablet, and desktop (via `responsive.css`)  
- Destination browsing with interactive cards and modal details  
- Itinerary builder to plan and organize trips  
- Trip cost calculator for budgeting  
- Travel checklist to keep track of essentials  
- Authentication UI for login and signup

## Folder structure (important files)

- `HOME/` - Home page files (index.html, style.css, script.js)
- `DESTINATIONS/` - Destinations page and assets
- `ITINERARY/` - Itinerary builder page and scripts
- `TRIP CALC/` - Trip Calculator pages and styles
- `CHECKLIST/` - Trip checklist page
- `AUTH/` - Authentication pages (login / signup) and shared auth styles/scripts
- `ABOUT/` - About page
- `responsive.css` - Global responsive overrides added to make layouts adapt across devices

> Note: `responsive.css` was added and linked from the main HTML pages to improve responsive behavior across the site.

## How to run locally

This is a static site — you can simply open the pages in a browser, but to avoid issues with CORS or when testing relative paths it’s best to serve it with a simple static server.

Node (http-server):

```powershell
# If you have Node.js installed
npx http-server -p 8000
# Then open http://localhost:8000
```

Or just double-click `HOME/index.html` (or any page) to open locally in a browser for quick checks.

## Notes on responsiveness

- A single shared `responsive.css` file provides breakpoints for 1024px, 768px, 480px, and smaller devices.
- Grids change from 3 columns → 2 columns → 1 column depending on width.
- Navbar collapses into stacked layout on smaller screens and utilities center for touch devices.
- Buttons become full-width on small screens for easier tapping.

If you want different behavior for a specific page, you can extend that page's local stylesheet (e.g., `DESTINATIONS/style.css`) and place overrides after the existing imports.

## Development notes

- HTML files were updated to include `../responsive.css` (relative path) — keep the file at project root.
- If you add new pages, include `../responsive.css` (or appropriate path) after the page's own stylesheet.
- CSS variables are defined across pages; if you change theme colors, update the `:root` variables in the page-specific CSS files or create a central variables file.

## Contributing

- Fork the repo, create a feature branch, and open a pull request explaining changes.
- Keep styles modular and prefer using variables where possible.
- Run quick manual checks by resizing the browser to common breakpoints (mobile/tablet/desktop).

## Tests

No automated tests are included. Manual checks:

- Resize the browser to mobile/tablet widths and verify layout stacks correctly.
- Open each page and check for overflow or horizontal scrolling.


