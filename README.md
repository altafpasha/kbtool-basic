# KBTool — Transaction ID Formatter

A zero-dependency static web tool that formats and copies transaction IDs.  
Ported from React + Tailwind to pure **HTML / Vanilla CSS / JS** and packaged with **Docker + Docker Compose**.

---

## Features

- **Format IDs** — `loanId:count:id1,id2,…`
- **Auto-mode** — convert on every keystroke / paste
- **Auto-reset** — clear fields 5 s after copy
- **Duplicate Detector** — warns when the same ID appears more than once
- **Clipboard copy** — instant copy with toast notification
- **Reset counter** — tracks how many times you've reset

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
