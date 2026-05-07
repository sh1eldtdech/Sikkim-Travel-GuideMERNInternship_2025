# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MERN stack application for a Sikkim Travel Guide platform that connects tourists with local businesses (hotels, bike rentals) and provides travel information. The system features multiple user roles with distinct authentication flows and business entity management.

## Development Commands

### Backend (Express.js + MongoDB)
```bash
cd Backend
npm install              # Install dependencies
npm start               # Start production server
npm run dev             # Start development server with nodemon
```

### Frontend (React + Vite)
```bash
cd Frontend
npm install              # Install dependencies
npm run dev              # Start development server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Environment Setup
- Backend requires `.env` file with MongoDB URI, JWT secrets, Cloudinary credentials, Razorpay keys, Redis URL
- Frontend requires `.env` file with `VITE_API_BASE_URL` pointing to backend server
- Default backend port: 3000 (with auto-retry on port conflicts)
- Default frontend port: 5173

## Architecture

### Multi-Entity Role Model
The platform supports multiple user roles and business entities with separate authentication and management:
- **Hotels**: Hotel owners register, add hotels/rooms, manage bookings
- **Bike Rentals**: Bike rental owners register, add bikes, manage rentals
- **Tourists**: Users browse listings, make bookings, view their bookings
- **Admin**: Unified dashboard for approving owners and listings across all entities
- **Government Officials**: Dedicated portal to issue official notices and real-time disaster alerts

### Authentication System
- **JWT-based authentication** with httpOnly cookies for security
- **Separate auth contexts** for each user type (User, Owner, BikeOwner, Admin, Government)
- **Token refresh mechanism** with automatic retry on 401 errors
- **Token revocation** via Redis blacklisting (optional - degrades gracefully if Redis unavailable)
- **Rate limiting** on auth endpoints (5 login attempts/15min, 3 registration attempts/hour)

### Database Models
- **User**: Tourist accounts with basic profile
- **Owner**: Hotel owner accounts with admin approval workflow
- **BikeOwner**: Bike rental owner accounts with admin approval workflow
- **GovernmentOfficial**: Government accounts for issuing notices and disaster alerts
- **Notice**: Official notices and disaster alerts with severity levels and PDF attachments
- **Hotel**: Hotel listings with images, amenities, policies, owner reference
- **Room**: Room types with pricing and availability per hotel
- **Bike**: Bike listings with images, features, hourly/daily rates
- **Booking**: Hotel bookings with payment integration (amount field is optional for partial bookings)

### API Structure
```
/user/*          - Tourist authentication and bookings
/owner/*         - Hotel owner authentication and management
/bike-owner/*    - Bike rental owner authentication and management
/admin-auth/*    - Admin authentication
/admin/*         - Admin dashboard and management (JWT protected)
/gov-auth/*      - Government official authentication
/notices/*       - Disaster alerts and official notices management
/hotels/*        - Hotel listings and management
/rooms/*         - Room management
/bikes/*         - Bike listings and management
/bookings/*      - Booking and payment processing
```

### Frontend Structure
- **Lazy-loaded routes** for code splitting
- **Protected route wrappers**: `OwnerRoute`, `BikeOwnerRoute`, `GovRoute` for role-based access
- **Context providers**: `UserAuthProvider`, `OwnerAuthProvider`, `BikeOwnerAuthProvider`, `GovAuthProvider` for auth state
- **API client**: Axios instance with automatic token refresh and error handling
- **UserAuthContext**: Centralized tourist authentication state with `useUserAuth` hook

## Key Patterns

### Authentication Flow
1. User registers/logs in → JWT tokens set in httpOnly cookies
2. Protected routes check token via middleware (`protectUser`, `protectOwner`, `protectBikeOwner`, `protectAdmin`, `protectGov`)
3. Token refresh happens automatically via axios interceptor on 401 errors
4. Logout revokes tokens via Redis blacklist and clears cookies
5. **Cookie-based authentication**: All API calls use `credentials: "include"` instead of localStorage tokens
6. **UserAuthContext**: Provides centralized tourist auth state with `user`, `isAuthenticated`, `authLoading`, `checkAuth`, and `logout`

### Owner Approval Workflow
1. Business owners register with documents → status: "pending"
2. Admin reviews and approves/rejects via admin dashboard
3. Approved owners can login and manage their listings
4. Listings also require admin approval before being visible to tourists

### File Upload Strategy
- All images and documents stored in **Cloudinary**
- Separate storage configurations for documents, hotel images, bike images
- Multer middleware handles multipart form data with validation
- Image optimization applied via Cloudinary transformations

### Payment Flow (Razorpay)
- **Cookie-based authentication**: Payment API calls use httpOnly cookies, not localStorage tokens
- **Order creation**: `createRazorpayOrder(bookingId, amount)` creates Razorpay order
- **Payment verification**: `verifyRazorpayPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId })` verifies payment
- **User prefill**: Booking form pre-fills user data from UserAuthContext (name, email, phone)
- **PaymentForm component**: Handles Razorpay checkout with loading states and error handling

### Error Handling
- Global error handler in server.js with structured responses
- Validation middleware using Joi schemas
- Rate limiting with express-rate-limit
- CORS configured for specific origins with credentials support
- **Improved CORS**: Better origin normalization and loopback detection for local development
- **Response compression**: Compression middleware with configurable threshold (1KB) and level (6)

### Database Connection
- MongoDB connection with custom DNS configuration
- Automatic retry on connection failures
- Graceful degradation if Redis unavailable for token revocation

### Performance Optimizations
- **Response compression**: Compression middleware for responses larger than 1KB
- **Cache headers**: Static assets cached for 1 year, API responses cached for 5 minutes (except auth endpoints)
- **Code splitting**: Frontend uses lazy-loaded routes for better initial load time

## Important Notes

### Security Considerations
- All passwords hashed with bcrypt (12 rounds)
- JWT tokens stored in httpOnly cookies (not localStorage)
- Admin accounts created via secure backend process only
- Input validation on all endpoints using Joi schemas
- Rate limiting on authentication endpoints
- Helmet middleware for security headers
- **Cookie-based auth**: All API calls use `credentials: "include"` for secure token transmission

### Deployment Considerations
- Frontend uses `vercel.json` for SPA routing on Vercel
- Backend requires environment variables for all external services
- Redis connection is optional - system works without it
- CORS must be configured for production domains

### Code Organization
- Backend routes organized by business entity
- Frontend pages organized by feature area
- Shared utilities for API calls, validation, authentication
- Separate middleware for auth, upload, rate limiting, validation

### Testing and Development
- Rate limiting disabled in development mode
- Backend auto-retries ports if configured port is in use
- Frontend uses Vite for fast development with HMR
- ESLint configured for React and JavaScript best practices