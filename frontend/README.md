# NyayaAI Frontend

> An AI-powered assistant for the Constitution of India — built with React + Vite + Tailwind CSS.

---

## Prerequisites

- **Node.js** ≥ 18  
- **npm** ≥ 9  
- Your NyayaAI FastAPI backend (from `NyayaAI.ipynb`) — **or** use Demo Mode to test the UI without it.

---

## Quick Start

```bash
# 1. Go into the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment (copy the example and edit as needed)
copy .env.example .env

# 4. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

Create a `.env` file in the `frontend/` directory (copy from `.env.example`):

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | URL of your FastAPI backend | `http://127.0.0.1:8000` |
| `VITE_DEMO_MODE` | `"true"` to use sample responses without a backend | `"true"` |

> ⚠️ Never commit `.env` to version control. It is already in `.gitignore`.

---

## Demo Mode

Demo Mode lets you test the complete UI without a running backend.

**To enable Demo Mode** (default):
```
VITE_DEMO_MODE=true
```

**To disable Demo Mode** (use real backend):
```
VITE_DEMO_MODE=false
VITE_API_BASE_URL=http://127.0.0.1:8000
```

When Demo Mode is disabled and the backend is unreachable, you will see a clear error message with a Retry option. The app will **never** silently fall back to sample data in live mode.

---

## Connecting to Your Google Colab Backend

Your `NyayaAI.ipynb` notebook runs a FastAPI server. Colab runtimes are **not** reachable at `localhost` from your browser — you need a tunnel:

### Option A — ngrok (recommended)

```python
# In a Colab cell, after starting FastAPI:
!pip install pyngrok -q
from pyngrok import ngrok
public_url = ngrok.connect(8000)
print("Backend URL:", public_url)
```

Then set in your `.env`:
```
VITE_DEMO_MODE=false
VITE_API_BASE_URL=https://xxxx.ngrok-free.app
```

### Option B — localtunnel

```bash
# In Colab terminal:
npx localtunnel --port 8000
```

Then set:
```
VITE_API_BASE_URL=https://xxxx.loca.lt
```

### Option C — Deployed Backend

If you deploy the FastAPI server (e.g., on Render, Railway, or a VPS):
```
VITE_DEMO_MODE=false
VITE_API_BASE_URL=https://your-deployed-backend.example.com
```

After changing `.env`, **restart the dev server** (`Ctrl+C`, then `npm run dev`).

---

## API Contract

The frontend expects this endpoint on your backend:

```
POST /ask
Content-Type: application/json

Request:
{ "question": "Explain Article 14 in simple English." }

Response:
{ "question": "...", "answer": "..." }
```

Optional fields in the response (not required but displayed if present):
- `sources` — array of strings with page references

---

## Project Structure

```
frontend/
├── public/
│   └── logo.svg              # NyayaAI scales-of-justice logo
├── src/
│   ├── components/
│   │   ├── Logo.jsx           # Brand logo component
│   │   ├── Navbar.jsx         # Sticky navigation bar
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── ChatPage.jsx       # Full chat interface
│   │   ├── Sidebar.jsx        # Conversation history sidebar
│   │   ├── MessageList.jsx    # Chat message bubbles
│   │   ├── ChatInput.jsx      # Auto-resize textarea
│   │   └── LoadingDots.jsx    # Animated loading indicator
│   ├── services/
│   │   ├── api.js             # API layer (real + demo)
│   │   └── demoData.js        # Sample responses for demo mode
│   ├── constants.js           # Suggested questions, nav links
│   ├── App.jsx                # Root component / view router
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles + Tailwind
├── .env                       # Local env (not committed)
├── .env.example               # Template — commit this
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Build for Production

```bash
npm run build
```

Outputs to `frontend/dist/`. Deploy this directory to any static host (Netlify, Vercel, GitHub Pages, etc.).

---

## Legal Disclaimer

NyayaAI is an **educational tool** for understanding the Constitution of India. It is **not** legal advice. Always verify constitutional text against official Government of India publications and consult a qualified legal professional for legal matters.
