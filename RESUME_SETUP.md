# Resume Setup Guide

## How to Add a Downloadable Resume PDF

### Step 1: Add Your PDF
1. Export your resume as a PDF.
2. Rename it exactly to `Kanishk-Chhabra-Resume.pdf`.
3. Put that file in the `public/` folder.

### Step 2: Confirm the Portfolio Link
The homepage reads the resume path from `app/data/portfolio.json`:

```json
"resumeHref": "/resume"
```

That path uses a Next.js route that reads the PDF from:

```text
public/Kanishk-Chhabra-Resume.pdf
```

and sends it with a download attachment header, so browsers should download it instead of opening the PDF viewer.

### Step 3: Verify the Download
1. Run the site.
2. Open the homepage.
3. Click `Download Resume`.
4. The browser should download `Kanishk-Chhabra-Resume.pdf`.

---

## What Gets Committed

- **Portfolio content**: `app/data/portfolio.json`
- **Resume PDF**: `public/Kanishk-Chhabra-Resume.pdf`
- **Fallback project images**: `public/project-fallbacks/`

---

## Troubleshooting

### Download Opens Instead of Downloading
The `/resume` route sends `Content-Disposition: attachment`, which is stronger than a normal PDF link. If a browser extension still overrides it, visitors can save it from the PDF viewer.

### Download Shows 404
Make sure the file exists at `public/Kanishk-Chhabra-Resume.pdf` and the filename matches the JSON path exactly.

### Updating Resume Content
Replace the PDF in `public/` with a newer file using the same filename, then rebuild and redeploy.
