# AI Chat PPT Generator

An AI-powered chat application that generates and edits PowerPoint presentations using natural language. Built with Vue 3, Express, TypeScript, and Google Gemini AI.

## 🎯 Overview

Create professional PowerPoint presentations through a conversational interface. Describe what you want, and the AI generates a complete presentation with structured slides that you can download as a PPTX file. Edit existing presentations by continuing the conversation.

## ✨ Features

- **AI-Powered Generation**: Create presentations from natural language prompts using Google Gemini AI
- **Interactive Chat**: Conversational UI with real-time message exchange
- **Dynamic Editing**: Edit existing presentations through chat commands
- **Live Preview**: View presentation structure in real-time before downloading
- **Material Design UI**: Modern interface built with Vuetify 3
- **Download Support**: Export presentations as PPTX files
- **Chat History**: View and manage conversation history

## 🏗️ Technology Stack

**Backend**: Node.js, Express, TypeScript, Google Gemini AI, PptxGenJS

**Frontend**: Vue 3, Vuetify 3, TypeScript, Pinia, Vue Router, Pug, Axios

## 📁 Project Structure

```
ai-chat-ppt-app/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── routes/            # API routes (chat, ppt)
│   │   ├── services/          # Business logic (AI, PPT)
│   │   └── index.ts           # Server entry point
│   ├── .env                   # Environment variables
│   └── package.json
├── frontend/                   # Vue 3 application
│   ├── src/
│   │   ├── views/            # View components (Home, Chat, History, Edit)
│   │   ├── stores/           # Pinia state management
│   │   ├── router/           # Vue Router config
│   │   └── main.ts           # App entry point
│   └── package.json
└── start.sh                   # Start script
```

## ⚠️ Important Notes

- **No Database**: This application does not use a database. All chat history and presentations are stored in memory and will be lost when the server restarts.
- **In-Memory Storage**: Data persistence is not available in the current implementation.

## 🚀 Setup

### Prerequisites

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **Google Gemini API Key** ([Get from Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-chat-ppt-app
   ```

2. **Configure Backend**
   Create `backend/.env`:
   ```env
   GEMINI_API_KEY=your-api-key
   PORT=3000
   ```

   **Example .env file:**
   ```env
   # Google Gemini API Key (required)
   GEMINI_API_KEY=your-api-key

   # Server Port (optional, defaults to 3000)
   PORT=3000
   ```

3. **Install Dependencies**

   **Option A: Using start script** (recommended)
   ```bash
   ./start.sh
   ```

   **Option B: Manual installation**
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

### Running the Application

**Option 1: Start script** (starts both servers)
```bash
./start.sh
```

**Option 2: Manual start** (two terminals)

Terminal 1 - Backend:
```bash
cd backend && npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend && npm run serve
```

### Access

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000

## 📖 Usage

### Creating a Presentation

1. Enter a prompt in the chat input, for example:
   - "Create a presentation about artificial intelligence"
   - "Make a 5-slide presentation on renewable energy"
   - "Generate a business proposal for a mobile app startup"

2. View the preview in the right panel

3. Click the download button to save your PPTX file

### Editing Presentations

Continue the conversation to edit:
- "Add a slide about machine learning"
- "Update the first slide to be more professional"
- "Add statistics to the second slide"

## 🔌 API Endpoints

**Chat API** (`/api/chat`)
- `POST /` - Send chat message and generate presentation
- `GET /history` - Get chat history
- `POST /clear` - Clear chat history

**PPT API** (`/api/ppt`)
- `POST /generate` - Generate PowerPoint file

**Dependencies not installed:**
```bash
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

**Failed to generate response:**
- Check your API key in `backend/.env`
- Verify the key is valid at [Google AI Studio](https://makersuite.google.com/)

**Version**: 1.0.0