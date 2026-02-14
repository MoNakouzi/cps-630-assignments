# Overview

This project is a multi page web application built around a simple campus style bulletin board where users can view announcements and manage posts. The client side is served as static HTML pages with separate routes for viewing the board, adding a bulletin, editing a bulletin, and deleting a bulletin. While a Node.js/Express server provides support in the backend using a REST API to retrieve, create and update posts from a JSON database using HTTP requests. In the future, this concept could be extended with user accounts, search and filtering by category or author, and a real database for scalability and concurrency.

---

# Documentation

To run the project for the first time run the following commands:

1. `cd g45-al`
2. `npm ci`
3. `npm run build:css`
4. `npm run dev`

Click the link `http://localhost:8000` in the termianl and the site will open in your default browser

In a new terminal run the following command if you wold like to alter the page css while it is runnin

`npm run dev:css`

Upon clicking the link the site should open to the home page

---

# Reflection

The Campus Bulletin Board web app uses a Node.js and Express server to serve multiple HTML pages and a REST API under `/api/bulletins` for creating, viewing, updating, and deleting posts with data stored in a JSON file. The front end uses JavaScript `fetch` to interact with the API and Tailwind CSS for styling.

A success was getting the main CRUD flow working end to end, including dynamic rendering and filtering on the board page. The main challenge was keeping the client pages and API in sync, especially handling bulletin IDs and consistent updates..
