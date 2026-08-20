The old GitHub Pages workflow (nextjs.yml.bak) is disabled because this
project no longer uses `output: "export"` — the CMS needs a live Node.js
server (for admin login, file uploads, and dynamic content), which GitHub
Pages (static hosting only) cannot run.

Deploy instead to a Node-capable host: Railway, Render, Fly.io, a VPS, or
Vercel. See README-CMS.md in the project root for details.
