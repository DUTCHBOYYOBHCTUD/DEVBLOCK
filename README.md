# CODERECET

## Project Repository
Commit and save your changes here

### Team Name: DEVBLOCK
### Team Members: Chris Kuriyakose, Akash Babu, Dhanush A, Anan M Binoj

---

## Project Description
*PromptHub* is a decentralized, AI-powered creative collaboration platform where users post prompts, and AI generates creative responses (text and images). The community votes on the best content, and top submissions are rewarded with tokens. This helps build a valuable, on-chain, crowdsourced knowledge and creativity base while fostering gamified innovation.

---

## Technical Details

### Technologies/Components Used

#### Languages:
- JavaScript
- JSX
- CSS

#### Frameworks:
- React.js (Frontend)
- Node.js (Backend)
- Express.js (API framework)

#### Libraries:
- mongoose – MongoDB object modeling
- dotenv – Environment variable management
- cors – Cross-origin requests
- jsonwebtoken – JWT-based user auth
- axios – API requests

#### Tools:
- MongoDB Atlas – Cloud database
- Vite – Frontend build tool
- Visual Studio Code – IDE
- Git & GitHub – Version control
- OpenRouter API (OpenAI Key) – AI access
- MetaMask & Ganache – Blockchain testing & wallet integration

---

## Implementation

### For Software:

#### ✅ User Login & Registration
Users sign up or log in securely using JWT authentication. Sessions are persisted securely using tokens.

#### 📝 Prompt Submission
Users submit creative prompts via a form. Prompts are sent to the backend and processed by the OpenAI API.

#### 🤖 AI Response Generation
The OpenAI API returns a text or image response. The response is stored in MongoDB and rendered in real-time on the frontend.

#### 📊 Voting System
Users upvote or downvote responses. Votes are tracked and stored to highlight trending and most valuable content.

#### 👤 Profile & Saved Prompts
Users can view their own submitted prompts and bookmark/saved content through their personal dashboard.

#### 💸 Token Reward System
Top-voted users receive PoB tokens (ERC-20) as a reward. These tokens are recorded on the blockchain and can be traded for future NFTs or used in the community marketplace.

---

## Installation

npm install


## Run

node index.js
npm run dev


---

## Project Documentation

### 1. Architecture Overview

#### Frontend (React + Vite)
- *src/* — Main React app
  - *components/* — Shared UI components (Navbar, LoadingPage, Login, Submit, etc.)
  - *pages/* — Route-based pages (Home, Generate, SavedPrompts, Profile, NFTShop, Categories, Wallet)
  - *App.jsx* & *main.jsx* — Entry point & router setup
  - *App.css* & *index.css* — Global styles, dark mode, animations

#### Backend (Node + Express)
- *index.js / app.js / server.js* — Server bootstrap, MongoDB connection, CORS & logging
- *routes/*
  - *authRoutes.js* — Login / signup
  - *generate.js* — Text generation
  - *generateImage.js* — Image generation
  - *prompts.js* — Fetch all prompts
  - *submit.js* — Save new prompt/response
  - *vote.js* — Upvote handling
  - *profile.js* — User profile data
  - *top.js* — Trending content
- *models/* — Mongoose schemas for User, Prompt, Vote

---

### 2. API Reference

| Method | Endpoint              | Description                                  |
|--------|-----------------------|----------------------------------------------|
| GET    | /api/test             | Health check                                 |
| POST   | /api/auth/register    | Register new user                            |
| POST   | /api/auth/login       | Authenticate & receive JWT                   |
| GET    | /api/profile          | Get current user profile                     |
| GET    | /api/prompts          | List all prompts & AI responses              |
| POST   | /api/submit           | Submit a new prompt (text or image)          |
| POST   | /api/generate         | Generate AI text response via OpenRouter     |
| POST   | /api/generate-image   | Generate AI image via OpenRouter             |
| POST   | /api/vote             | Upvote or downvote a response                |
| GET    | /api/top              | Fetch top‑voted responses                    |

---

### 3. Data Models
js
// User
{
  username: String,
  email:    String,
  password: String (hashed),
  saved:    [Prompt._id],
  votes:    [Vote._id]
}

// Prompt
{
  user:      User._id,
  text:      String,
  imageUrl:  String,
  createdAt: Date,
  votes:     Number
}

// Vote
{
  user:     User._id,
  prompt:   Prompt._id,
  value:    Number (1 or -1),
  votedAt:  Date
}



prompthub/
├── client/                # React frontend
│   ├── public/
│   └── src/
├── server/                # Express backend
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── index.js
├── package.json
└── README.md




## Challenges We Faced

- 🔗 *Frontend + Backend + Blockchain Integration*  
  Integrating three separately developed components — frontend (React), backend (Node/Express), and PoB Token (Solidity) — led to complex interdependencies and debugging overhead.

- 🔄 *Token Flow Synchronization*  
  Coordinating blockchain token minting logic with database state (votes, users, prompts) was time-intensive. Handling this in real-time required efficient error handling and retries.

- 🚀 *Unified Deployment*  
  Building and deploying this as one unified app posed major issues — especially with Vite's static hosting, Express routing, and Ganache network dependencies.

- 🛠 *CI/CD & Version Control Conflicts*  
  Team-wide parallel development led to Git merge conflicts in .env, contract ABIs, and shared routes.

- 🧠 *Maintaining Session State Across Domains*  
  Passing wallet info and JWT tokens across the dApp reliably required custom state managers and cross-storage sync.

---

## Team Contributions

- *Chris Kuriyakose*  
  Lead Blockchain Developer — designed and implemented the PoB token contract, wallet integration, token reward flow, and helped with deployment scripts.

- *Akash Babu*  
  Frontend Developer — developed the UI, integrated animations with Framer Motion, and connected API routes with visual logic.

- *Dhanush A*  
   UI/UX Designer + QA — designed user-friendly components, ensured responsiveness, handled bug testing, and managed feedback rounds.

- *Anan M Binoj*  
  Backend Engineer — created core APIs, MongoDB schemas, OpenAI integration routes, and handled server security/auth.
