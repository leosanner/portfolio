---
name: Project detail page vision
description: Project pages display markdown description, technologies, links (GitHub/website), and video
type: project
---

Each project page will have:
- Markdown-rendered description (admin writes markdown content)
- Technologies used (from the technology catalog)
- Links to GitHub repo and live website (if exists)
- Embedded video explanation (via Cloudflare Stream)

**Why:** The markdown description is the core content — it lets the user write rich project writeups. This will need a markdown editor in the admin UI and a renderer on the public page.

**How to apply:** The `description` field stores raw markdown. Frontend needs a markdown renderer (e.g., react-markdown). Admin UI will need a markdown editor. This is a future concern — the DB schema already supports it (text field).
