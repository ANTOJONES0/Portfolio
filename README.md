# Anto Jones A B — AI Engineer Portfolio Website

A modern, production-grade, high-aesthetic portfolio website designed for **Anto Jones A B**, specializing in **LangGraph Multi-Agent Workflows, RAG Pipelines, FastAPI, and AWS Bedrock/ECS Cloud Deployments**.

---

## 🌟 Key Features

1. **Cyber-Obsidian Aesthetics & Glassmorphism Design System**:
   - Modern dark mode palette with electric cyan (`#00f2fe`) and cyber violet (`#9d4edd`) accents.
   - Interactive HTML5 Canvas background rendering a live 60fps neural network / agent graph with mouse proximity reactions.
   - Fluid typography featuring Google Fonts (*Plus Jakarta Sans*, *Outfit*, and *JetBrains Mono*).

2. **Featured Projects Showcase**:
   - Filterable projects gallery: *All*, *Agentic AI & LangGraph*, *RAG & Analytics*, *Full-Stack & Web*.
   - Rich project cards featuring system architecture metrics, core engineering bullets, and technology tags.

3. **Interactive Resume Viewer & 1-Click Print to PDF**:
   - In-app interactive Resume modal displaying the verified resume details.
   - Dedicated print stylesheet formatting the CV into a clean, printable document for recruiters.

4. **Direct Contact Hub**:
   - One-click copy buttons for email (`antojones2003@gmail.com`) and phone (`+91 9600890618`).
   - Direct links to LinkedIn (`linkedin.com/in/antojones15`) and GitHub (`github.com/ANTOJONES0`).
   - Interactive contact inquiry form with instant client-side feedback.

---

## 📂 Project Structure

```text
e:/Potfolio/
├── index.html                   # Core semantic HTML5 page with SEO meta tags
├── README.md                    # Documentation & setup guide
├── css/
│   └── style.css                # Custom Vanilla CSS design tokens & animations
├── js/
│   ├── main.js                  # Typewriter, modals, filters, toast notifications
│   └── background-canvas.js     # High-performance neural graph canvas animation
└── assets/
    └── images/
        ├── anto_avatar.jpg           # Professional AI Engineer portrait
        ├── project_rca.jpg           # LangGraph RCA dashboard banner
        ├── project_analytics.jpg     # Telecom Text-to-SQL dashboard banner
        ├── project_code_reviewer.jpg # Claude Agent SDK code reviewer banner
        ├── project_social_rag.jpg    # Multilingual social listening RAG banner
        └── project_catering.jpg      # Full-stack catering web application banner
```

---

## 🚀 Running Locally

You can run the portfolio locally using Python or any static web server:

```powershell
# Using Python
python -m http.server 3000 --directory "e:\Potfolio"
```

Then open your browser at:
```
http://localhost:3000
```

---

## 🚢 Deployment Options

- **GitHub Pages**: Push this directory to your GitHub repository `ANTOJONES0/portfolio` and enable GitHub Pages in Settings.
- **Vercel / Netlify**: Simply link your GitHub repo or drag-and-drop the directory into the Netlify/Vercel dashboard.
- **AWS S3 + CloudFront**: Sync files to an S3 bucket with static website hosting enabled behind an Amazon CloudFront CDN distribution.
