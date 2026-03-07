# Campus Bulletin Board

## Overview

Campus Bulletin Board is a MERN-style web application built for the CPS 630 CRUD Application assignment. The project allows users to browse campus announcements, view bulletin details, and update bulletin entries through a React front end and a Node.js, Express, MongoDB back end. The idea behind the application is to provide a simple space where students can share and manage bulletin posts such as news, events, reminders, and general announcements.

The application follows the assignment's required split structure with a separate `frontend` folder and `backend` folder. The back end runs on **localhost:8080** using **Node.js + Express**, connects to **MongoDB** through **Mongoose**, and seeds test data automatically when the collection is empty. The front end runs on **localhost:5173** using **React + Vite** and includes multiple pages, including a home page, bulletin list page, bulletin detail page, edit page, and about page.

This project matches the main assignment requirements in the following ways:

- It uses **Node.js and Express** for the back end.
- It connects to a **MongoDB** database using **Mongoose**.
- It includes a startup seeding function that inserts test bulletin data when the database is empty.
- The back end starts with **`npm run start`** on port **8080**.
- The front end starts with **`npm run dev`** on port **5173**.
- It provides a **REST API** with CRUD routes for creating, reading one item, reading multiple items, updating, and deleting.
- It includes **at least three web views** on the front end.

In the future, this project could be extended by adding authentication, richer bulletin categories, image uploads, pagination, and a fully completed front end flow for create and delete actions.

---

## Project Structure

```text
g45-a2/
├── backend/
│   ├── data/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Technologies Used

### Back End

- Node.js
- Express
- MongoDB
- Mongoose
- CORS

### Front End

- React
- Vite
- React Router
- Tailwind CSS

---

## How to Run the Project

### 1. Start MongoDB

Before starting the app, make sure the MongoDB service is running.

#### macOS

If MongoDB was installed with Homebrew:

```bash
brew services start mongodb-community
```


#### Windows

Open **Command Prompt as Administrator** and run:

```bash
net start MongoDB
```

---

### 2. Start the Back End

Open a terminal and move into the backend folder:

```bash
cd backend
npm install
npm run start
```

The back end runs on:

```text
http://localhost:8080
```

When the server starts:

- it connects to MongoDB at `mongodb://localhost:27017/bulletinDB`
- it checks whether the bulletins collection is empty
- if empty, it inserts the provided seed data automatically

---

### 3. Start the Front End

Open a second terminal and move into the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

The front end runs on:

```text
http://localhost:5173
```

---

## How to Use the Application

1. Start MongoDB.
2. Start the back end with `npm run start` inside the `backend` folder.
3. Start the front end with `npm run dev` inside the `frontend` folder.
4. Open `http://localhost:5173` in your browser.
5. Navigate through the application pages.
6. View the bulletin board, open an individual bulletin, and edit an existing bulletin.

Current main front end pages include:

- **Home**: landing page for the application
- **Bulletin List**: displays all bulletin items and supports category and search filtering
- **Bulletin Detail**: displays a single bulletin item
- **Edit Bulletin**: allows an existing bulletin to be updated
- **About**: lists the group members and project context

---

## REST API Documentation

Base URL:

```text
http://localhost:8080/api/bulletins
```

### Create a Bulletin

**POST** `/api/bulletins`

Creates a new bulletin.

Example body:

```json
{
  "title": "Club Meeting",
  "category": "Events",
  "message": "Join us this Friday at 5 PM.",
  "author": "Student Union"
}
```

Expected response:

- `201 Created` on success
- `400 Bad Request` for invalid input
- `500 Internal Server Error` if the server fails

### Read Multiple Bulletins

**GET** `/api/bulletins`

Returns all bulletin items.

Optional query parameters:

- `category`
- `q`
- `field`

Examples:

```text
GET /api/bulletins
GET /api/bulletins?category=Events
GET /api/bulletins?q=club&field=title
```

Expected response:

- `200 OK`
- `500 Internal Server Error`

### Read One Bulletin

**GET** `/api/bulletins/:id`

Returns a single bulletin by MongoDB `_id`.

Expected response:

- `200 OK`
- `400 Bad Request` for an invalid id
- `404 Not Found` if no bulletin exists with that id
- `500 Internal Server Error`

### Update a Bulletin

**PATCH** `/api/bulletins/id/:id`

Updates one bulletin by id.

Example body:

```json
{
  "title": "Updated Club Meeting",
  "category": "Events",
  "message": "The meeting has moved to Room 203.",
  "author": "Student Union"
}
```

Expected response:

- `200 OK`
- `400 Bad Request`
- `404 Not Found`
- `500 Internal Server Error`

### Delete a Bulletin

**DELETE** `/api/bulletins/id/:id`

Deletes one bulletin by id.

Expected response:

- `204 No Content`
- `400 Bad Request`
- `404 Not Found`
- `500 Internal Server Error`

---



## Reflection

This project demonstrates the core full stack concepts required for the assignment, especially the separation between front end and back end, database integration with MongoDB, and the use of REST API design for CRUD operations. One success in this project was building a clean backend structure with separate folders for models, routes, utilities, and seed data, which made the application easier to organize and maintain.

Another success was connecting the React client to the Express server and using route-based pages to display and manage bulletin data. The filtering and single-item detail views also helped make the application feel more complete and realistic.

One challenge was coordinating the front end and back end so that the routes, HTTP methods, and data structure matched correctly. Another challenge was ensuring MongoDB started correctly on the local machine before running the project. A further area for improvement is completing and polishing the dedicated create and delete front end views so that all CRUD operations are fully demonstrated through the user interface as well as through the API.

Overall, this project was a useful exercise in MERN development because it brought together routing, API design, database integration, and React-based user interaction in one application.
