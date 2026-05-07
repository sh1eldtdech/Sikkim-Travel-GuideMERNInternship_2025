<div align="center">
  <h1>Sikkim Travel Guide & Dashboard (MERN)</h1>
  <p><strong>A comprehensive, full-stack travel and tourism management platform dedicated to Sikkim.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.18+-000000?logo=express" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Redis-7+-DC382D?logo=redis" alt="Redis" />
    <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Razorpay-Payments-528DD1?logo=razorpay" alt="Razorpay" />
  </p>
</div>

---

## Overview

The **Sikkim Travel Guide** is an all-in-one platform designed to connect tourists, local business owners, and government officials. It provides a seamless experience for discovering destinations, booking hotels, renting bikes, and staying updated with real-time disaster alerts in the Himalayan region.

This project was built as part of a MERN Stack Internship, demonstrating advanced full-stack capabilities, secure authentication, third-party integrations, and performance optimizations.

---

## Key Features

- **Destination Exploration:** Curated travel guides for North, East, West, and South Sikkim with interactive maps (Leaflet).
- **Hotel & Homestay Booking:** Browse, filter, and book local accommodations with secure payment gateways (Razorpay).
- **Bike Rentals:** A dedicated module for renting bikes to explore the high-altitude passes of Sikkim.
- **Real-Time Disaster Alerts:** Government officials can broadcast critical weather and road condition alerts (PDFs & Images via Cloudinary).
- **Role-Based Dashboards:**
  - **Tourists:** Manage bookings and itineraries.
  - **Business Owners (Hotel/Bike):** Manage listings, track revenue via charts (Chart.js), and process bookings.
  - **Government Officials:** Issue alerts and manage regional notices.
  - **Admin:** Oversee the entire platform.
- **SEO Optimized:** Dynamic meta tags and OpenGraph setup (`react-helmet-async`, `vite-plugin-sitemap`).
- **High Security:** JWT authentication, bcrypt hashing, rate limiting, and XSS protection (DOMPurify & Helmet).

---

## Tech Stack

### Frontend (Client)
| Technology | Purpose |
|------------|---------|
| React 19 + Vite | UI Framework & Build Tool |
| Tailwind CSS v4 + DaisyUI | Styling & UI Components |
| React Router v7 | Client-Side Routing |
| React-Leaflet | Interactive Maps |
| Chart.js | Data Visualization |
| React-Helmet-Async | SEO & Meta Tags |
| Vite-Sitemap-Plugin | Sitemap Generation |
| Axios | HTTP Client |
| Context API | State Management |

### Backend (Server)
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB (Mongoose) | Database & ODM |
| Redis | Caching & Session Store |
| JWT + bcryptjs | Authentication & Password Hashing |
| Cloudinary + Multer | File Storage & Upload |
| Razorpay API | Payment Processing |
| Helmet | HTTP Security Headers |
| Express-Rate-Limit | API Rate Limiting |
| CORS | Cross-Origin Resource Sharing |

---

## Environment Variables

To run this project locally, you must set up the following environment variables.

### Backend (`Backend/.env`)
```env
# MongoDB Configuration
MONGODB_URI=mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret
RAZORPAY_ACCOUNT_NUMBER=your_razorpay_account_number

# Razorpay Payout Configuration
RAZORPAY_PAYOUT_ENABLED=true
RAZORPAY_PAYOUT_MODE=IMPS

# Redis Configuration (Optional - for token revocation)
REDIS_URL=redis://your_redis_url

# Admin Login Credentials
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

# Server Configuration
PORT=enter_your_port_number
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Port Retry Configuration
PORT_RETRY_COUNT=5
```

### Frontend (`Frontend/.env`)
```env
GOOGLE_MAPS_API_KEY=api_key;
VITE_API_KEY=vite_api_key
VITE_WEATHER_API_KEY=weather_api_key
VITE_API_BASE_URL=your_backend_url
VITE_RAZORPAY_KEY_ID=your_key_id
```

> **Security Note:** Never commit your actual `.env` files to version control. Use `.env.example` as a template.

---

## Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas)
- **Redis** (Local server or cloud service like Upstash)

### 1. Clone the Repository
```bash
git clone https://github.com/sh1eldtdech/Sikkim-Travel-GuideMERNInternship_2025.git
cd Sikkim-Travel-GuideMERNInternship_2025
```

### 2. Backend Setup
```bash
cd Backend
npm install
# Create .env file with the variables listed above
npm run dev
```
The backend server will start on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal:
```bash
cd Frontend
npm install
# Create .env file with the variables listed above
npm run dev
```
The frontend development server will start on `http://localhost:5173`.

---

## Project Structure

```text
Sikkim-Travel-Guide/
├── Backend/                      # Node.js + Express API
│   ├── controllers/              # Request handling logic
│   ├── models/                   # Mongoose schemas (Users, Hotels, Bookings, Alerts)
│   ├── routes/                   # Express API endpoints
│   ├── middleware/               # Auth, Error handling, Multer
│   ├── utils/                    # Cloudinary setup, Razorpay init
│   └── server.js                 # Backend entry point
│
└── Frontend/                     # React Vite Application
    ├── public/                   # Static assets (Favicon, Sitemap)
    ├── src/
    │   ├── assets/               # Images, Videos, Icons
    │   ├── components/           # Reusable UI (Headers, Footers, SEO, Cards)
    │   ├── context/              # React Context (Auth State)
    │   ├── pages/                # Route views (Home, Travel, Dashboards, Auth)
    │   ├── styles/                # Global & Component CSS
    │   ├── App.jsx               # App Routing
    │   └── main.jsx              # React DOM injection
    ├── index.html                # HTML Template
    └── vite.config.js            # Vite configuration
```

---

## Testing

```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd Frontend
npm test
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Verify `MONGODB_URI` in `.env` and ensure MongoDB is running |
| Redis connection refused | Check if Redis server is running or update `REDIS_URL` |
| CORS errors | Ensure `VITE_API_URL` matches backend URL in `.env` |
| Razorpay payment fails | Verify API keys are correct and in test mode |

---

## Roadmap

- [ ] Add multi-language support (Nepali, Hindi, English)
- [ ] Implement real-time chat support
- [ ] Add AI-powered travel recommendations
- [ ] Mobile app (React Native)
- [ ] Offline mode with service workers

---

## License

This project is proprietary and built as part of the SH1ELD Tech MERN Stack Internship 2026. All rights reserved.

---

## Acknowledgments

- Built during the SH1ELD Tech MERN Stack Internship 2026
- Special thanks to Subham Kashyap and SH1ELD TECH for their guidance
- Icons and assets sourced from [Flaticon](https://flaticon.com) and [Unsplash](https://unsplash.com)

---

## Contact

For inquiries or support, please reach out via:
- **Email:** [shieldslabs@gmail.com](mailto:shieldslabs@gmail.com)
- **GitHub Issues:** [Report a bug](https://github.com/sh1eldtdech/Sikkim-Travel-GuideMERNInternship_2025/issues)
