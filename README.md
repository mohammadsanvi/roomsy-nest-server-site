# 🏡 Roomsy Nest - Roommate Finder API

Welcome to the **Roomsy Nest Server**, a backend API built with **Express.js** and **MongoDB** to support a roommate listing web application.

🔗 **Live Server URL:** [https://roomsy-nest-server-site.vercel.app/](https://roomsy-nest-server-site.vercel.app/)
---
🔗 **Client Site URL:** [https://roomsy-nest.web.app/](https://roomsy-nest.web.app/)

---

## 🚀 Features

- 🔐 **User Management**  
  Create and fetch user profiles securely with MongoDB.

- 📋 **Roommate Listings API**  
  CRUD (Create, Read, Update, Delete) operations for posting and managing roommate listings.

- 💖 **Like Functionality**  
  Users can like listings to reveal the contact number and increase engagement.

- 🏅 **Featured Roommates Section**  
  Fetch the top 6 available listings for homepage or featured sections.

- 🔍 **Filter Listings by Email**  
  Retrieve listings posted by a specific user based on email query.

---

## 📁 API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get a user by ID
- `POST /users` - Create a new user

### Listings
- `GET /roommate-listings` - Get all listings
- `GET /roommate-listings/:id` - Get listing by ID
- `GET /my-listings?email=user@example.com` - Get listings by user email
- `POST /roommate-listings` - Create a new listing
- `PUT /roommate-listings/:id` - Update a listing
- `DELETE /roommate-listings/:id` - Delete a listing
- `PUT /listings/:id` - Overwrite likes
- `PATCH /listings/:id/like` - Increment like count
- `GET /featured-roommates` - Get 6 available featured listings

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Vercel (for server deployment)
- CORS + dotenv for environment handling

---
