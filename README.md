# 🚀 Bhishan Pangeni — Portfolio Website

Welcome to my personal portfolio website!
This project showcases my **skills, projects, experience, resume, and technical work**, with an integrated backend for dynamic content and API functionality.

🌐 **Live Site:** [bhishanpangeni.com.np](https://bhishanpangeni.com.np)

---

## ✨ Features

* 🎨 **Modern React UI** — Built with React and Vite
* 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile
* 💼 **Projects Showcase** — Highlights personal and professional projects
* 📄 **Resume Viewer & Download** — Fetches and displays the latest resume
* 📬 **Contact Form** — Allows visitors to get in touch
* ⚡ **FastAPI Backend** — REST API for dynamic portfolio functionality
* ☁️ **Cloud-based Resume Storage** — Resume URL managed through the backend
* 🔐 **CORS & API Security** — Configured communication between frontend and backend
* 🚀 **Automated Deployment** — Frontend deployed through GitHub Pages
* 🌐 **Custom Domain** — Hosted at `bhishanpangeni.com.np`

---

## 🏗️ Project Architecture

The project follows a separate frontend/backend architecture:

```text
Portfolio
│
├── client/                 # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # FastAPI backend
│   ├── ...
│   └── ...
│
├── .github/
│   └── workflows/          # GitHub Actions
│
├── CNAME                   # Custom domain configuration
├── pyproject.toml
└── README.md
```
## 📂 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bhishanP/Portfolio.git
cd Portfolio
```

---

## 🎨 Frontend Setup

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production build will be generated in:

```text
client/dist/
```

---

## ⚙️ Backend Setup

Navigate to the server directory:

```bash
cd server
```

Create and activate a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

If the project uses `uv`, install dependencies with:

```bash
uv sync
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

FastAPI documentation is available at:

```text
http://localhost:8000/docs
```

---

## 🔗 Frontend–Backend Configuration

The frontend communicates with the FastAPI backend using the `VITE_API_URL` environment variable.

### Local Development

```env
VITE_API_URL=http://localhost:8000
```

### Production

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

The frontend then accesses API endpoints using:

```javascript
const API_URL = import.meta.env.VITE_API_URL;

axios.get(`${API_URL}/api/resume`);
```

---

## 🚀 Deployment

### Frontend — GitHub Pages

The React/Vite frontend is built using:

```bash
npm run build
```

The generated `dist` directory is deployed to GitHub Pages through GitHub Actions.

The production website is available at:

```text
https://bhishanpangeni.com.np
```

### Backend — Render

The FastAPI backend is deployed separately on Render.

The production server runs using:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

The frontend uses the Render API URL through:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

---

## 🔧 Customization

### Update Resume

The resume functionality is handled through the FastAPI backend. The frontend retrieves the latest resume URL from:

```text
GET /api/resume
```

### Update Portfolio Content

Frontend components can be modified inside:

```text
client/src/
```

### Update Backend APIs

Backend routes and logic can be modified inside:

```text
server/
```

### Update API URL

For local development:

```env
VITE_API_URL=http://localhost:8000
```

For production:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

---

## 📩 Contact

Have a project, opportunity, or just want to connect?

📧 **Email:** [bhishanpangeni2003@gmail.com](mailto:bhishanpangeni2003@gmail.com)
🌐 **Portfolio:** [bhishanpangeni.com.np](https://bhishanpangeni.com.np)
🐙 **GitHub:** [github.com/bhishanP](https://github.com/bhishanP)

---

## 🔮 Future Enhancements

* 🌙 Dark/Light mode improvements
* 📊 Interactive project analytics
* 📝 Blog and technical articles
* 💬 Enhanced contact and messaging system
* 🤖 AI-powered portfolio features
* 📈 More dynamic content and integrations

---

## 📜 License

This project is open-source and available under the terms specified in the repository license.

---

👨‍💻 **Built with ❤️ by Bhishan Pangeni**
