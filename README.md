# Fieldnote — Job Portal (MERN)

A full-stack job portal built with MongoDB, Express, React, and Node — job seekers browse and
apply to roles, employers post jobs and manage applicants, all behind a JWT-based auth system
with role-based access (seeker / employer).

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt — structured as MVC
  (`models/`, `controllers/`, `routes/`, `middleware/`)
- **Frontend:** React (Vite), React Router, Tailwind CSS, Framer Motion for animation

## Project structure

```
job-portal/
├── backend/
│   ├── config/db.js            MongoDB connection
│   ├── models/                 User, Job, Application (Mongoose schemas)
│   ├── controllers/            Business logic (auth, jobs, applications, users)
│   ├── routes/                 Express route definitions
│   ├── middleware/              JWT auth guard, role guard, error handler
│   ├── server.js                App entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/                Login, Signup, Home, JobListings, JobDetails,
    │   │                         PostJob, EmployerJobs, Applicants, MyApplications, Profile
    │   ├── components/           Navbar, JobCard, ProtectedRoute, PageTransition
    │   ├── context/AuthContext.jsx
    │   └── api/axios.js
    └── .env.example
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — a local MongoDB instance (`mongodb://127.0.0.1:27017/jobportal`) or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string
- `JWT_SECRET` — any long random string

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` and is already pointed at `http://localhost:5000/api`.

### 3. Try it out

1. Go to `/signup`, toggle to "I'm hiring", create an employer account
2. Post a job from the navbar
3. Open an incognito window (or log out), sign up as a job seeker, browse `/jobs`, and apply
4. Back in the employer account, go to "My postings" → "View applicants" to shortlist/reject/hire

## Notes on scope and design choices

- **Resumes are links, not file uploads** — seekers paste a resume URL (Google Drive, Dropbox,
  personal site, etc.) rather than uploading a file. This keeps the backend simple with no file
  storage/S3 setup required. Swapping in real file uploads later just means adding `multer` (or
  an S3 SDK) to `applicationController.js` and a matching file input on the frontend.
- **Auth** uses JWT stored in `localStorage` and sent as a Bearer token; passwords are hashed
  with bcrypt before saving.
- **Roles** (`seeker` / `employer`) are enforced both in the UI (routes redirect if you're the
  wrong role) and in the backend (`authorize()` middleware on every protected route) — never
  trust the frontend alone.
- **Design system**: a warm paper background, deep ink text, a muted gold accent, and a
  Fraunces/Inter type pairing — defined as reusable tokens in `tailwind.config.js` and component
  classes in `index.css` (`.btn-primary`, `.input`, `.panel`, etc.) so new pages stay consistent.
- **Animation** is intentional rather than decorative: an orchestrated hero entrance on the
  homepage, a spring-driven role toggle on signup, route-level fade transitions, and micro
  feedback on buttons/forms — not fade-in-on-every-card.

## Natural next steps

- Real file uploads for resumes/company logos (multer + S3 or Cloudinary)
- Email notifications on application status change
- An admin role to moderate job posts
- Saved/bookmarked jobs and job-alert emails
- Deploy: backend to Render/Railway, frontend to Vercel/Netlify, database to MongoDB Atlas
