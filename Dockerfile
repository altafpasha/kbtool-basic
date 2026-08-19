# ─────────────────────────────────────────────────────────────
# KBTool — Dockerfile
# Serves the static site using nginx (lightweight alpine image)
# ─────────────────────────────────────────────────────────────

FROM nginx:1.27-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy static files
COPY index.html  /usr/share/nginx/html/
COPY style.css   /usr/share/nginx/html/
COPY app.js      /usr/share/nginx/html/

# Ensure nginx worker can read them
RUN chmod 644 /usr/share/nginx/html/index.html \
              /usr/share/nginx/html/style.css   \
              /usr/share/nginx/html/app.js

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
