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

### 1. Clone the Repository

Run the following commands:

```bash
git clone https://github.com/prova-anika-216474306/BainBites.git
cd BainBites
```

---

### 2. Start the Backend (FastAPI)

Run the following commands:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

App will run at:  
[http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 3. Start the Frontend (React.js)

Run the following commands:

```bash
cd ../frontend
npm install
```

Update the config file at `src/config.js`:

```js
const BASE_URL = "http://127.0.0.1:8000"; // Change to Heroku URL in production
```

Then run:

```bash
npm start
```

App will run at:  
[http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
BainBites/
├── backend/        # FastAPI backend
│   └── main.py     # API routes and logic
├── frontend/       # React frontend
│   └── src/
│       └── config.js
├── README.md       # This file
```

---

## 🌐 Live Deployment

- **Frontend:** Hosted on Heroku  
- **Backend:** Hosted on Heroku or locally at `http://127.0.0.1:8000`
