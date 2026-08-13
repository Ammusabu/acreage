# 🏠 Acreage - Vacation Rental Marketplace

A full-stack vacation rental marketplace built with Next.js, FastAPI, and SQLite — inspired by the Airbnb experience.

## 🌐 Live Demo

- **Frontend**: [https://acreage-seven.vercel.app](https://acreage-seven.vercel.app)
- **Backend API**: [https://acreage-wek1.onrender.com](https://acreage-wek1.onrender.com)
- **API Documentation**: [https://acreage-wek1.onrender.com/docs](https://acreage-wek1.onrender.com/docs)

## 📸 Screenshots

### Homepage
<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/2a84a361-9880-469a-9e3a-6751751427e4" />

### Listing Detail
<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/dc474c61-1fa3-445d-b32d-e7e56cbbab1c" />

### Booking Flow
<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/d1583640-f1f4-4587-9639-65fabc51236f" />

### Host Dashboard
<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/c2f6ea84-03aa-4287-8d2f-ac85ec04c50a" />

## ✨ Features

### 🏡 Home & Discovery
- Browse property listings with photo cards
- Search by location, dates, and guests
- Category filters (Beachfront, Cabins, Mountain, Luxury, etc.)
- Horizontal scrolling sections with arrow navigation
- Interactive map with property pins
- Dark mode support

### 📝 Listing Details
- Photo gallery with collage layout
- Property details (title, description, location, amenities)
- Host information with Superhost badge
- Availability calendar with date picker
- Price breakdown with fees
- Interactive map showing property location

### 📅 Booking Flow
- Select dates with availability validation
- Guest count selection
- Booking summary with price breakdown
- Mock checkout and confirmation
- "My Trips" dashboard with booking history
- Leave reviews for completed stays

### 👨‍💻 Host Experience
- Full CRUD for listings
- Host dashboard with listing management
- View bookings for owned listings
- Analytics (total listings, bookings, revenue)

### ❤️ Favorites & Wishlist
- Save favorite properties
- View all saved properties
- Remove from favorites

### 🔐 Authentication
- Simple login with Guest and Host roles
- Demo accounts for testing
- Role-based UI (Guest vs Host views)

### 🌙 Dark Mode
- Toggle between light and dark themes
- Persistent theme selection

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **Leaflet** - Interactive maps
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **Pydantic** - Data validation

## 📁 Project Structure

```
acreage/
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── favorites/          # Favorites page
│   │   ├── host/               # Host dashboard
│   │   ├── listings/[id]/      # Listing detail
│   │   ├── search/             # Search results
│   │   ├── trips/              # My Trips page
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── bookings/           # Booking components
│   │   ├── host/               # Host components
│   │   ├── listings/           # Listing components
│   │   └── shared/             # Shared components
│   ├── context/                # Auth context
│   ├── lib/
│   │   ├── api/                # API client
│   │   └── types/              # TypeScript types
│   └── public/                 # Static assets
│
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # API routes
│   │   ├── core/               # Core config
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   └── main.py             # FastAPI app
│   ├── acreage.db              # SQLite database
│   ├── run.py                  # Server runner
│   └── requirements.txt        # Python dependencies
│
├── screenshots/                # Screenshots for README
├── README.md
└── .gitignore
```

## 📊 Database Schema

### Users
- id, email, username, hashed_password
- is_host, host_since
- avatar_url, bio
- created_at, updated_at

### Listings
- id, host_id (FK → users)
- title, description, property_type, room_type
- location, latitude, longitude
- price_per_night (in cents), max_guests
- bedrooms, beds, bathrooms
- images (JSON array)
- rating, review_count
- is_active, deleted_at

### Bookings
- id, listing_id (FK → listings)
- guest_id (FK → users)
- check_in, check_out
- guest_count, total_price
- status (pending/confirmed/cancelled/completed)

### Reviews
- id, booking_id (FK → bookings)
- listing_id (FK → listings)
- reviewer_id (FK → users)
- rating (1-5), comment
- created_at, updated_at

### Favorites
- id, user_id (FK → users)
- listing_id (FK → listings)
- created_at

### Amenities
- id, name, icon

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at http://localhost:3000

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

The backend will run at http://localhost:8000

### Seed Database

```bash
cd backend
python seed_data.py
```

### Environment Variables

Create `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Create `.env` in backend:
```
DATABASE_URL=sqlite:///./acreage.db
SECRET_KEY=your-secret-key-here
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/listings` | Get all listings |
| GET | `/api/v1/listings/{id}` | Get listing details |
| POST | `/api/v1/listings` | Create listing |
| PUT | `/api/v1/listings/{id}` | Update listing |
| DELETE | `/api/v1/listings/{id}` | Delete listing |
| POST | `/api/v1/bookings` | Create booking |
| GET | `/api/v1/bookings` | Get user bookings |
| POST | `/api/v1/favorites/toggle` | Toggle favorite |
| GET | `/api/v1/favorites` | Get favorites |
| POST | `/api/v1/reviews` | Create review |
| GET | `/api/v1/host/dashboard` | Get host dashboard |

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Guest | guest@example.com | password |
| Guest | bob@example.com | password |
| Host | host@example.com | password |
| Host | michael@example.com | password |

## 📱 Responsive Design

- **Desktop** - Full experience with 6-column grid
- **Tablet** - 3-4 columns with optimized spacing
- **Mobile** - 2 columns with compact layout

## 🚀 Deployment

### Live URLs

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | [https://acreage-seven.vercel.app](https://acreage-seven.vercel.app) |
| **Backend (Render)** | [https://acreage-wek1.onrender.com](https://acreage-wek1.onrender.com) |
| **API Docs** | [https://acreage-wek1.onrender.com/docs](https://acreage-wek1.onrender.com/docs) |

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
vercel deploy
```

### Backend Deployment (Render)

```bash
cd backend
pip install -r requirements.txt
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Environment Variables for Production

**Vercel (Frontend):**
```
NEXT_PUBLIC_API_URL=https://acreage-wek1.onrender.com/api/v1
```

**Render (Backend):**
```
DATABASE_URL=sqlite:///./acreage.db
SECRET_KEY=your-production-secret-key
PYTHON_VERSION=3.11.0
```

## 📄 License

MIT

## 🙏 Acknowledgments

- [Airbnb](https://www.airbnb.com) - Design inspiration
- [Unsplash](https://unsplash.com) - Stock photos
- [Lucide](https://lucide.dev) - Icons
- [Leaflet](https://leafletjs.com) - Maps

---
Built with ❤️ for the Acreage assignment
