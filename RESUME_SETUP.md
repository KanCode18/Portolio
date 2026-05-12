# Resume Setup Guide

## How to Upload & Configure Your Resume

### Step 1: Access Admin Panel
1. Go to `/login` on your portfolio site
2. Enter credentials:
   - **Username**: `kanishk`
   - **Password**: `PortfolioLogin!23`

### Step 2: Upload Your Resume PDF
1. In the Admin Editor, scroll to "Upload resume PDF" section
2. Click the file input and select your resume PDF (the one you provided)
3. The PDF will be:
   - **Parsed** directly in your browser (no server upload)
   - **Extracted** for text content to populate the CV editor
   - **Stored** as a data URL in local storage
4. You'll see a confirmation message when complete

### Step 3: Verify & Download
1. Return to homepage
2. Click "View Resume" button - it will now download your uploaded PDF
3. Your resume is now persisted in browser local storage

---

## What Gets Stored

- **CV Text**: Used to auto-generate Experience timeline and Projects
- **Resume PDF**: Downloadable via the "View Resume" button
- **Personal Projects**: Manually added projects alongside company work

---

## Troubleshooting

### PDF Upload Fails
- **Issue**: "Could not parse that resume"
- **Solution**: Ensure your PDF contains selectable text (not a scanned image)
- **Alternative**: Export your PDF as "text-based" from your original document

### No Text Extracted
- **Issue**: PDF uploads but no text appears in CV editor
- **Solution**: Your PDF might have special formatting. Try these steps:
  1. Open PDF in your editor
  2. Select all text and copy
  3. Paste directly into the CV editor text area
  4. Click "Save CV"

### CV Not Syncing
- **Issue**: Changes don't appear on homepage
- **Solution**:
  1. Make sure to click "Save CV" button
  2. Refresh the homepage
  3. Check browser's local storage isn't full

---

## Local Storage Details

The site stores everything in your browser's local storage:
- `kanishk-portfolio-cv`: Your CV text
- `kanishk-portfolio-resume-pdf`: Your resume as data URL
- `kanishk-portfolio-personal-projects`: Your personal projects
- `kanishk-portfolio-auth`: Login session

No data is sent to any server.
