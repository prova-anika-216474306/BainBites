# 🍽️ Bain Bites – Restaurant Recommender for Bain Toronto

A full-stack app that helps Bain Partners in Toronto quickly find and vote on restaurant recommendations for client meetings.  
Built with **React** (frontend) and **FastAPI** (backend), powered by **Yelp** and **OpenAI**.

---

## 📦 Features

- Smart restaurant recommendations based on filters  
- Collaborative restaurant lists for events  
- Voting system to make decisions as a team  
- AI-generated summaries of restaurant vibe, popularity, and specialty  

---

## 🧑‍💻 Run Locally

### 1️⃣ Clone the Repo and Run Backend + Frontend

````bash
# Clone the repository
git clone https://github.com/prova-anika-216474306/BainBites.git
cd BainBites

# 🚀 Backend (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs at http://127.0.0.1:8000

# 🚀 Frontend (React.js)
cd ../frontend
npm install

# In src/config.js, set:
# const BASE_URL = "http://127.0.0.1:8000"; // Change to Heroku URL in production

npm start
# Runs at http://localhost:3000
