# IILM Campus Lost & Found Portal

A full-stack web application for managing lost and found items on the IILM University campus.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Image Upload**: Multer (local storage)

---

## Project Structure

```
iilm-lost-found/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── items.js
│   ├── uploads/          # Created automatically
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── utils/
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## Local Setup

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend Environment

```bash
cd..
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/iilm_lost_found
JWT_SECRET=your_very_long_random_secret_string_here
NODE_ENV=development
```

> **Tip**: Generate a secure JWT secret with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Start MongoDB (Local)

**Option A – homebrew (macOS)**:
```bash
brew services start mongodb-community
```

**Option B – Linux (systemd)**:
```bash
sudo systemctl start mongod
```

**Option C – Windows**:
```bash
net start MongoDB
```

**Option D – Docker**:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run the Application

Open two terminals:

**Terminal 1 – Backend**:
```bash
cd backend
npm run dev       # with nodemon (recommended)
# or
npm start         # without nodemon
```

**Terminal 2 – Frontend**:
```bash
cd frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

---

## API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update profile |
| PUT | `/api/auth/change-password` | Private | Change password |

### Items
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/items` | Public | Get all items (with filters/pagination) |
| POST | `/api/items` | Private | Create item |
| GET | `/api/items/stats` | Private | Dashboard stats |
| GET | `/api/items/user/my-items` | Private | Get user's items |
| GET | `/api/items/:id` | Public | Get item by ID |
| PUT | `/api/items/:id` | Private (owner) | Update item |
| DELETE | `/api/items/:id` | Private (owner) | Delete item |
| POST | `/api/items/:id/claim` | Private | Submit claim |
| PUT | `/api/items/:id/claim/:claimId` | Private (owner) | Accept/reject claim |

---

## Features

- ✅ JWT authentication with persistent login
- ✅ Report lost and found items with photos
- ✅ Searchable browse page with filters and pagination
- ✅ Claim request system with approval workflow
- ✅ Dashboard with stats and item management
- ✅ Profile editing and password change
- ✅ Protected routes (owner-only edit/delete)
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications and modals
- ✅ Skeleton loading states
- ✅ Image upload (5MB max)

---

## Deployment

### Backend → Render

1. Push backend to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo, select the `backend` folder as root
4. Set **Build command**: `npm install`
5. Set **Start command**: `npm start`
6. Add environment variables:
   - `MONGO_URI` → your MongoDB Atlas connection string
   - `JWT_SECRET` → your secret
   - `NODE_ENV` → `production`
   - `CLIENT_URL` → your Vercel frontend URL

### Frontend → Vercel

1. Push frontend to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import repo, set root to `frontend`
4. Add environment variable:
   - `VITE_API_URL` → your Render backend URL + `/api` (e.g., `https://your-app.onrender.com/api`)
5. Deploy

### MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create DB user and whitelist IPs (use `0.0.0.0/0` for Render)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/iilm_lost_found`

---

## Development Notes

- Images are stored in `backend/uploads/` locally
- For production, consider migrating to Cloudinary or AWS S3
- The Vite proxy config routes `/api` and `/uploads` to the backend during development
- JWT tokens expire after 30 days
