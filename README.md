# chully-co.github.io

Personal site for Mitchell Johnson — a single static HTML page, no build step.

Live at **https://chully-co.github.io**

## Editing

Everything lives in `index.html`: content, styles, and the small scroll script are
all in that one file. Edit, commit, push to `main`, and GitHub Pages republishes.

| What to change | Where |
|---|---|
| Copy, job bullets, projects | the `<main>` sections, top to bottom |
| Colors, type, spacing | the `:root` block at the top of `<style>` |
| Dark mode | the `prefers-color-scheme: dark` block |
| Print / PDF resume styling | the `@media print` block at the bottom of `<style>` |
| Links, email | hero `.hero-meta` and the `#contact` section |

`.nojekyll` disables GitHub's Jekyll processing — not needed for plain HTML, but it
stops any file named with an underscore from being silently dropped.
