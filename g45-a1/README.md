# Overview

This project is a multi page web application built around a simple campus-style bulletin board, where users can view announcements and manage posts. The client side is served as static HTML pages with separate routes for viewing the board, adding a bulletin, editing a bulletin, and deleting a bulletin; while a Node.js/Express server provides support in the backend using a REST API to retrieve, create and update posts from a JSON database using HTTP requests. The REST API is under `/api/bulletins`, and the front end uses JavaScript `fetch` to interact with the API. Tailwind CSS is used for styling for modularity and custom classes.

---

# Documentation

## How to Run

1. Unzip the file
2. Navigate to the unzipped folder
2. In a terminal, run the following to install package dependencies:
```bash
npm ci
```
3. When all the packages install, run the following to run the application:
```bash
npm run dev
```

The webpage will start running on:
```bash
http://localhost:8000
```
Click the link `http://localhost:8000` in the terminal and the site will open in your default browser.

## Editing TailwindCSS

If you want to edit any of the Tailwind CSS classes, execute the following:

1. Open a new terminal
2. Navigate to the correct folder containing the application
3. Run the following command
```bash
npm run dev:css
```

Now, if you edit any tailwind classes, they will automatically show up.

---

# Reflection

A success was getting the main CRUD flow working end to end, including dynamic rendering and filtering on the board page. The main challenge was keeping the client pages and API in sync, especially handling bulletin IDs and consistent updates..

In the future, this concept could be extended with user accounts, search and filtering by category or author, and a real database for scalability and concurrency.
