# chully-co.github.io

Personal portfolio for Mitchell Johnson, hosted at **https://chully-co.github.io**.

A static GitHub Pages site with no build step or JavaScript dependencies. It includes project case studies, full resume experience, a print/save-as-PDF stylesheet, light and dark themes, and a pointer-reactive systems map.

## Files

- `index.html` — content, metadata, and inline SVG connection paths
- `styles.css` — design system, responsive layouts, motion, and print styles
- `script.js` — theme toggle, reveal behavior, print button, and systems-map interaction
- `assets/social-card.png` — social sharing image
- `assets/favicon.svg` — browser icon
- `.nojekyll` — disables Jekyll processing

## Preview locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Update content

Edit the semantic sections in `index.html`:

- Hero and contact details
- Selected work case studies
- Full experience timeline
- Capabilities and background

Colors and typography live in `:root` and `:root[data-theme="dark"]` at the top of `styles.css`.

## Add a future project link

Each case study has a marked comment where public links can go. Add a `.project-links` block after the tags, for example:

```html
<div class="project-links">
  <a href="https://example.com/sharepoint-project" target="_blank" rel="noopener noreferrer">
    Open the SharePoint project <span aria-hidden="true">↗</span>
  </a>
  <a href="projects/document-automation.html">Read the technical write-up</a>
</div>
```

The existing styles support text links, screenshots, or links to future case-study pages. To add another project, copy a `.case-study` article and replace its copy, facts, tags, and visual.

## Interaction and accessibility

The hero systems map uses lightweight DOM transforms and SVG paths. Connections stay attached as nodes move. Pointer parallax responds to mouse and pen input, ambient motion pauses offscreen and in hidden tabs, and everything respects `prefers-reduced-motion`. Core content and static diagrams remain available without JavaScript.

## Publish

Commit and push to `main`; GitHub Pages republishes automatically.
