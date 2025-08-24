# Urvann Plant Store 🌱

A modern, eco-friendly React app for browsing, searching, and managing plants. Supports user and admin flows, responsive design, and a beautiful, accessible UI.

## Features

- **Browse Plants:** View a catalog of indoor, outdoor, and specialty plants with images and details.
- **Search & Filter:** Search by name, description, or category. Filter by plant category.
- **Responsive Design:** Fully responsive with modern UI using Tailwind CSS.
- **Admin Dashboard:**
  - Secure login for admins.
  - Add new plants with image upload, multi-category selection, and custom availability.
  - Quick logout and responsive admin controls.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **State:** React Hooks, useState, useEffect, react-hook-form
- **Routing:** React Router DOM
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/) (toast notifications)
- **Icons:** Lucide React, inline SVG
- **API:** Axios, fetch (for plant CRUD)
- **Backend:** _You need to provide your own backend API for `/plants` and `/plant` endpoints_

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/urvann-plant-store.git
cd urvann-plant-store
```

### 2. Install Dependencies

```bash
npm install

```


### 4. Run the Project

```bash
npm run dev
# or
yarn dev
```

The app runs on `http://localhost:5173` by default.

---


---

## API Endpoints Required

- `GET /plants` — Get all plants (for home)
- `POST /admin` — Admin login (returns a JWT token)
- `POST /plant` — Add new plant (admin, token required)

> _You must provide a backend implementing these endpoints. The frontend expects JWT authentication for admin actions._

---


> Made with 💚 by [Your Name](https://github.com/itsshahbazhere) for Urvann Plant Store.