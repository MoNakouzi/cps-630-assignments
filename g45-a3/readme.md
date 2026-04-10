# Campus Bulletin Board

## 1. Overview

This project is a MERN style web application created for the CPS 630 CRUD Application assignment. Our app is called Campus Bulletin Board, and the main idea behind it is to give students and faculty members a simple place to post and manage campus related announcements. These can include club events, reminders, general notices, and other updates that students may want to share.

The project follows the folder structure used in the labs, with a separate frontend (React) and backend (Express) folders. The backend was built using Node.js and Express, it connects to MongoDB using Mongoose. The frontend was built using React + Vite and Tailwind CSS for styling.

Overall, this project includes a working backend connected to MongoDB, a REST API with CRUD functionality, and multiple frontend views for interacting with the data, as per the assignment requirements.

In the future, this project could be improved by adding user authentication, image uploads, pagination, better styling, improved error handling, and a more complete frontend flow for all CRUD actions.

We used GitHub and Git for version control. Commit history and work can be found here:
[GitHub commit history link](https://github.com/MoNakouzi/cps-630-assignments/commits/main/g45-a2)

## 2. How This Project Meets the Assignment Requirements

This project matches the assignment requirements in the following ways:

- The backend was developed using Node.js and Express.
- The application connects to MongoDB using Mongoose.
- A test data seeding function is included so that when the database or collection is empty, sample data is added automatically on startup.
- The backend starts with `npm run start` and runs on `localhost:8080`.
- The frontend starts with `npm run dev` and runs on `localhost:5173`.
- The project includes a REST API that supports the required CRUD operations:
  - Create one item
  - Read one item
  - Read multiple items
  - Update one item
  - Delete one item
- The frontend includes 7 different views:
  - Home page
  - About Us page
  - Bulletin Board page
  - Bulletin Details page
  - Edit a Bulletin page
  - Delete a Bulletin page
  - Add a Bulletin page
  - Not Found page

## 3. Project Structure

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

## 4. How to Run the Project

### Step 1: Start MongoDB

Before running the project, make sure your MongoDB service is started.

#### Windows
On Windows, MongoDB is usually automatically started.

#### macOS

If MongoDB was installed using Homebrew, run:

```bash
brew services start mongodb-community
```

### Step 2: Start the Backend

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


### Step 3: Start the Frontend

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


1. Start MongoDB.
2. Start the backend using `npm run start` inside the `backend` folder.
3. Start the frontend using `npm run dev` inside the `frontend` folder.
4. Open `http://localhost:5173` in your browser.
5. Use the different pages to browse, view, and update bulletin posts.

Main views currently included in the project are:
  - Home
  - About Us
  - Bulletin Board
  - Bulletin Details
  - Edit a Bulletin
  - Delete a Bulletin
  - Add a Bulletin
  - Not Found 

These views help demonstrate the required frontend structure and show how the frontend connects to the backend API.

## 5. REST API Summary

### 5.1. Base URL:

```text
http://localhost:8080/api/bulletins
```

### 5.2. Create an Item

- POST `/api/bulletins`

- Creates a new bulletin item
  - Uses parameteres form `req.body` to create object
  - Validates for any missing required fields

### 5.3. Read Multiple Items

- GET `/api/bulletins`

- Returns all bulletin items
  - Filtering and searching are also implemented as part of this

### 5.4. Read One Item

- GET `/api/bulletins/:id`

- Returns one bulletin item based on ID

### 5.5. Update an Item

- PATCH `/api/bulletins/:id`

- Updates one bulletin item based on ID

### 5.6. Delete an Item

- DELETE `/api/bulletins/:id`

- Deletes one bulletin item based on ID

These API routes were created to satisfy the CRUD requirements of the assignment and connect the frontend to the database.

## 6. Reflection

This project helped us apply the main ideas from the MERN stack in a more complete way. We were able to work with a React frontend, an Express backend, MongoDB for storing data, and API routes that connect everything together.

One of the more important parts of this assignment was making sure the backend and frontend were properly connected and that the CRUD routes worked correctly with the database. Setting up the structure and making sure requests were handled properly took some debugging, especially when testing routes and checking that MongoDB data was being returned correctly.

On the frontend side, one big challenge was ensuring modularity and consistency in the pages. There were several components that served the same purpose with slightly different styling and structure that were used across different pages in the frontend, and ensuring those were made into reusable components was important. On the backend side, one big challenge was implementing searching and filtering. Initially, we implemented it using separate endpoints, but that overcomplicated the API calls and got much harder when we tried to implement both category filtering and searching. We were able to overcome these challenges by researching into best practices and simplifying our approach, as well as abstracting React components as best as we can.

One success in this project was building a clear structure that follows the format used in the labs. The project also includes multiple pages and a backend that seeds data automatically when needed, which helped make the application easier to test. It was a great way of putting everything we learned together.