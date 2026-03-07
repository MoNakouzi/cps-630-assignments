# Campus Bulletin Board

## Overview

This project is a MERN style web application created for the CPS 630 CRUD Application assignment. Our app is called **Campus Bulletin Board**, and the main idea behind it is to give students a simple place to post and manage campus related announcements. These can include club events, reminders, general notices, and other updates that students may want to share.

The project follows the folder structure used in the labs, with a separate **frontend** and **backend**. The backend was built using **Node.js** and **Express**, connects to **MongoDB** using **Mongoose**, and runs on **localhost:8080** using `npm run start`. The frontend was built using **React + Vite** and runs on **localhost:5173** using `npm run dev`.

Overall, this project includes a working backend connected to MongoDB, a REST API with CRUD functionality, and multiple frontend views for interacting with the data, as per the assignment requirements.

In the future, this project could be improved by adding user authentication, image uploads, better styling, and a more complete frontend flow for all CRUD actions.

---

## How This Project Meets the Assignment Requirements

This project matches the assignment requirements in the following ways:

- The **backend** was developed using **Node.js and Express**.
- The application **connects to MongoDB** using **Mongoose**.
- A **test data seeding function** is included so that when the database or collection is empty, sample data is added automatically on startup.
- The **backend** starts with `npm run start` and runs on **localhost:8080**.
- The **frontend** starts with `npm run dev` and runs on **localhost:5173**.
- The project includes a **REST API** that supports the required CRUD operations:
  - Create one item
  - Read one item
  - Read multiple items
  - Update one item
  - Delete one item
- The frontend includes **7 different views**:
  - Home page
  - About Us page
  - Bulletin Board page
  - Bulletin Details page
  - Edit a Bulletin page
  - Delete a Bulletin page
  - Add a Bulletin page
  - Not Found page

---

## Project Structure

```text
g45-a2/
├── backend/
│   ├── data/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Technologies Used

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- CORS

### Frontend

- React
- Vite
- React Router
- Tailwind CSS

---

## How to Run the Project

### 1. Start MongoDB

Before running the project, make sure your MongoDB service is started.

#### Windows
On Windows, it's automatically started.

#### macOS

If MongoDB was installed using Homebrew, run:

```bash
brew services start mongodb-community
```

---

### 2. Start the Backend

Open a terminal and go into the backend folder:

```bash
cd backend
npm install
npm run start
```

The backend should start on:

```text
http://localhost:8080
```

When the backend starts, it connects to MongoDB and checks whether the collection already has data. If it is empty, the project inserts test data automatically.

---

### 3. Start the Frontend

Open a second terminal and go into the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend should start on:

```text
http://localhost:5173
```

---

## How to Use the Project

1. Start MongoDB.
2. Start the backend using `npm run start` inside the `backend` folder.
3. Start the frontend using `npm run dev` inside the `frontend` folder.
4. Open `http://localhost:5173` in your browser.
5. Use the different pages to browse, view, and update bulletin posts.

**Main views** currently included in the project are:
  - Home
  - About Us
  - Bulletin Board
  - Bulletin Details
  - Edit a Bulletin
  - Delete a Bulletin
  - Add a Bulletin
  - Not Found 

These views help demonstrate the required frontend structure and show how the frontend connects to the backend API.

---

## REST API Summary

Base URL:

```text
http://localhost:8080/api/bulletins
```

### Create an Item

- **POST** `/api/bulletins`

- Creates a new bulletin item.

### Read Multiple Items

- **GET** `/api/bulletins`

- Returns all bulletin items.

### Read One Item

- **GET** `/api/bulletins/:id`

- Returns one bulletin item by id.

### Update an Item

- **PATCH** `/api/bulletins/id/:id`

- Updates one bulletin item by id.

### Delete an Item

- **DELETE** `/api/bulletins/id/:id`

- Deletes one bulletin item by id.

These API routes were created to satisfy the CRUD requirements of the assignment and connect the frontend to the database.

---

## Reflection

This project helped us apply the main ideas from the MERN stack in a more complete way. We were able to work with a React frontend, an Express backend, MongoDB for storing data, and API routes that connect everything together.

One of the more important parts of this assignment was making sure the backend and frontend were properly connected and that the CRUD routes worked correctly with the database. Setting up the structure and making sure requests were handled properly took some debugging, especially when testing routes and checking that MongoDB data was being returned correctly.

We think one success in this project was building a clear structure that follows the format used in the labs. The project also includes multiple pages and a backend that seeds data automatically when needed, which helped make the application easier to test.

If we were to continue improving this project, we could finish polishing all frontend CRUD interactions, improve the overall UI, and add extra features like authentication and categories with better filtering.
