# Campus Bulletin Board

## 1. Overview

This project is a MERN style web application created for the CPS 630 A3 assignment. Our app is called Campus Bulletin Board, and the main idea behind it is to give students and faculty members a simple place to post and manage campus related announcements. These can include club events, reminders, general notices, and other updates that students may want to share.

This project meets the core MERN requirements:

- React frontend: built with React + Vite for the UI and client-side routing.
- Node.js + Express backend: REST API servers the frontend and performs backend logic.
- MongoDB database: data stored with Mongoose models (`Bulletin`, `Category`, `User`).
- REST API integration: the frontend consumes the backend API for all CRUD operations.

Important implemented features (required by the assignment):

1. Authentication

- Multiple users can register and log in.
- Each user has their own data (bulletins they create are associated with their account).
- Authentication is implemented using a separate `User` Mongoose model and JWTs (access tokens and refresh tokens).
- Protected routes exist on the backend so only authenticated users can create or modify their own bulletins; admin role has elevated privileges.

2. UI following Nielsen usability principles

- Clarity: clear labels, visible status messages (toasts), and explicit error feedback.
- Consistency: consistent buttons, spacing, headings, and form layouts across pages.
- Feedback: actions show immediate feedback (success/error toasts, loading indicators).
- User control: confirmations are given for strong actions (e.g., logout, delete), clear navigation and back links.
- Minimalism: simple, readable styling using Tailwind with consistent spacing and clear primary actions.

3. Real-time communication

- Implemented with Socket.io on the backend and client to enable real-time features (bulletin chat rooms and a shared announcement room).
- Users can join a bulletin room and receive live messages and notifications (they can also be part of the chat in non-announcement bulletin chats).

Additional improvements in this assignment:

- Improved database structure: separated `User` and `Category` collections to reduce redundancy and normalize data.
- Role-based functionality: `admin` vs `user` roles; admin UI controls and protected admin routes.
- Conditional UI rendering: UI elements change based on role and ownership (edit/delete buttons only visible to owners/admins).
- Admin-specific controls available through the navbar (Admin menu) and admin pages.
- User profile page where users can update name, email, and password.
- Toasts for clearer feedback and a consistent loading state component.

---

## 2. Documentation

### Requirements

- Node.js
- npm
- MongoDB

### Environment variables

Create a `.env` file in the `backend` folder with at least:

```
MONGODB_URL=mongodb://localhost:27017/bulletinDB
JWT_SECRET=t1h9SFV19OYqmm4Wdm8hXXz56WAkY0C4vggQQ1PH7Yg
REFRESH_EXPIRES_MS=86400000
```

_Note:_ you can set the JWT_SECRET to anything

Adjust `MONGODB_URI`, if needed.

### Install & Run

1. Backend

```bash
cd backend
npm install
npm run start
```

The backend listens on `http://localhost:8080` by default and will seed sample data if the database collection is empty.

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default (Vite).

### How to use the application

1. Register / Login

- Register a new account on the Register page (name, email, password).
- Login returns an access token (stored in localStorage) and a refresh token.
- After login you will see new actions (Add Bulletin, My Bulletins) and be able to create content.

2. Regular user capabilities

- Create new bulletins (choose category, message, visibility public/private).
- Edit or soft-delete bulletins created by same user.
- View and update profile (name, email, password).

3. Admin capabilities

- Admins can view admin dashboard and manage categories and users.
- Admin can view all bulletins (including private), change bulletin authors, restore or permanently delete bulletins.
- Admin UI is accessible from the Admin menu in the navbar.
- To test:
    - Login in with the following credentials:
    ```
    username: admin@group45.ca
    password: seed-admin
    ```

4. Real-time features (Socket.io)

- Each bulletin has a chatroom; when you open a bulletin detail page you join its room.
- Messages sent in the room are delivered to other clients in real time.
- When a bulletin is soft-deleted or permanently removed, it is announced so users can close the chatroom.
- To test:
    - open the same bulletin in two browser windows (or one normal + one private window), post messages, and observe live updates.

### API Summary (most used endpoints)

- POST `/api/auth/login` — login, returns access and refresh tokens
- POST `/api/auth/refresh` — refresh access token
- POST `/api/auth/logout` — invalidate refresh token
- POST `/api/users` — create user (register)
- GET `/api/bulletins` — list (filter/search/pagination supported)
- GET `/api/bulletins/:id` — get single bulletin (private rules apply)
- POST `/api/bulletins` — create bulletin (auth required)
- PATCH `/api/bulletins/:id` — update bulletin (author or admin)
- POST `/api/bulletins/:id/soft-delete` — soft-delete (author or admin)
- POST `/api/bulletins/:id/restore` — restore (admin only)

Refer to the `backend/routes` folder for more details on request/response shapes.

---

## 3. Reflection (Assignment 3)

### What was added compared to Assignment 2

This assignment extends the earlier work (Assignment 2) by adding authentication, role-based rendering, visibility controls, and real-time features:

- Authentication (JWT & refresh tokens) with a `User` model and login/register flows.
- Real-time chatrooms attached to bulletins (Socket.io integration).
- UI/UX improvements emphasizing Nielsen usability principles (clear labels, consistent buttons, toasts for feedback, loading states).
- Better data normalization (separate `Category` and `User` collections) and clearer admin controls.

There were a lot more features we originally wanted to implement, but with finals and everything getting busy, we had to prioritize getting the core functionality working properly. Things like restoring soft-deleted bulletins, promoting users to admins through the UI, and improving how visibility and permissions are handled were all ideas we didn’t fully get to. Even so, this was a really good assignment and helped tie together a lot of concepts from the course in a practical way.

### Highlights: the three required features

1. Authentication

- Implemented using `User` Mongoose model, JWT access tokens, and refresh tokens.
- Protected routes ensure only authenticated users can create/update their own content and admins can perform elevated actions.
- Each user has their own data: bulletins are associated with the creating user's `_id`.

2. Usability-focused UI

- Form labels are explicit and consistent; primary actions are prominent and secondary actions are subtle.
- Immediate feedback via toasts for success/error; consistent loading indicators while data loads.
- Navigation improvements (active link highlight, clear back links, and role-specific controls) make the app easier to use.

3. Real-time communication

- Socket.io wire-up allows clients to join bulletin rooms and exchange messages in real time.
- Room events notify clients about bulletin lifecycle changes (deleted/closed), improving the collaborative experience.

### Key improvements and why they matter

- Database normalization: separating categories and users reduces duplication and makes updates safer and faster.
- Role-based rendering: the UI only shows admin features to admins; this reduces confusion and prevents accidental operations.
- Visibility model: `public` vs `private` bulletins lets users keep drafts or personal notes private while publishing others.
- Consistent design and error handling: toasts and loading states reduce uncertainty and make interactions predictable.

### Challenges faced

- Authentication was honestly one of the most frustrating parts. Getting access and refresh tokens working properly and making sure authFetch handled expiry without breaking everything took way longer than expected. A lot of trial and error with tokens not refreshing or requests failing randomly.

- Managing user-specific data was also tricky. Making sure private bulletins only show for the correct user/admin sounds simple but debugging it wasn’t. There were multiple times where IDs didn’t match or the token wasn’t being sent, so things just silently failed.

- Socket.io took some time to figure out. Getting users to join the correct rooms and making sure events (like delete/restore) actually showed up across different tabs required a lot of testing and small fixes.

### How challenges were solved

- We ended up creating an `authFetch` helper in the frontend to handle tokens in one place instead of repeating logic everywhere. That made things more stable.
- Added server-side checks for authorization on bulletins and used a lot of console logs to confirm `req.user` was correct while debugging.
- For Socket.io, I simplified things by creating small helper functions for room names and made sure all events followed the same pattern so it was easier to reason about.

### Successes

- Authentication and roles are working end-to-end. Users can register, log in, create bulletins, and admins can manage things properly.
- Real-time features are working, with chat updates and delete events showing across clients.
- UI improvements (toasts, consistent actions, loading states) made the app feel more complete and usable.
