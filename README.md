# KBTool — Transaction ID Formatter

A zero-dependency static web tool that formats and copies transaction IDs.  
Ported from React + Tailwind to pure **HTML / Vanilla CSS / JS** and packaged with **Docker + Docker Compose**.

---

## Features

- **Format IDs** — `[loanId:]count:id1,id2,…`
- **Button-driven flow** — clean, controlled formatting via **Convert & Copy** and **Reset** buttons
- **Duplicate Detector** — alerts when duplicated IDs are present
- **Instant Clipboard Copy** — copies to clipboard with toast notification & in-button feedback
- **Quick Copy in Result Header** — dedicated copy button to re-copy formatted output
- **Reset counter** — tracks conversion batch resets

---

## Project Structure

```
kbtool-basic/
├── index.html          # Main UI
├── style.css           # Glassmorphism dark theme
├── app.js              # All logic (no framework, no dependencies)
├── Dockerfile          # nginx:alpine image
├── nginx.conf          # Production nginx config
└── docker-compose.yml  # One-command run
```

---

## Quick Start

### With Docker Compose (recommended)

```bash
# Build & start
docker compose up -d --build

# Open in browser
open http://localhost:8080

# Stop
docker compose down
```

### Without Docker (local browser)

Just open `index.html` directly in your browser. No build step needed.

---

## Port

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| kbtool  | **8080**  | 80             |

Change the host port in `docker-compose.yml` → `ports: - "YOURPORT:80"`.

---

## Usage

1. *(Optional)* Enter a **Loan / QID** prefix (e.g. `QID 106`)
2. Paste or type **Transaction IDs** (comma- or space-separated)
3. The formatted result is **auto-copied** to your clipboard
4. Output format: `QID 106:3:id1,id2,id3`
