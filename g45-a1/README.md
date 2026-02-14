# Overview

This project is a multi page web application based on a campus style bulletin board. Users can view posts, create new bulletins, edit existing ones, and delete posts.

In the future, this project could be extended with:
- User authentication and login
- Search functionality
- More advanced filtering
- A real database instead of a JSON file
- Pagination for large numbers of posts

We used GitHub and Git for version control. Commit history and work can be found here:
[GitHub commit history link](https://github.com/MoNakouzi/cps-630-assignments/commits/main/g45-a1)

---

# Documentation

## How to Run the Application

1. Unzip the project folder.
2. Open a terminal and navigate to the project directory.
3. Install dependencies by running:
```bash
npm ci
```
4. After installation is complete, start the server:
```bash
npm run dev
```

The application will run on:
```bash
http://localhost:8000
```
Open this link in your browser to access the site.



### Tailwind CSS Development

If you want to modify Tailwind styles:
1. Open a new terminal.
2. Navigate to the project folder.
3. Run:
```bash
npm run dev:css
```

This command watches for changes and rebuilds the CSS automatically.

---

# Features

- View all bulletins on the main board
- Filter bulletins by category
- Add new bulletin posts
- Edit existing bulletin posts
- Delete bulletin posts with confirmation
- Responsive layout using Tailwind CSS
- 404 page for invalid routes
- Multi-page routing using Express

---

# Reflection
## Submitted Content
The front end is built using static HTML pages (located in `/src/views/`). Each page has its own route, including:

- Main Board
- Add Bulletin
- Edit Bulletin
- Delete Bulletin
- About
- 404 Page

The back end is built using Node.js and Express (`server.js` and `/src/routes/bulletins.js`). It provides a REST API under the route:
```bash
/api/bulletins
```

The API handles retrieving, creating, updating, and deleting bulletin posts. The data is stored in a JSON file which acts as a simple database.

The front end uses JavaScript `fetch()` to communicate with the API.

Tailwind CSS is used for styling to keep the design clean and consistent.

## Successes/Challenges
One success in this project was completing the full CRUD flow from front end to back end. The board page dynamically loads data from the API and updates automatically after changes.

A challenge was keeping the API routes and client side JavaScript endpoints consistent. Handling bulletin IDs correctly was something that took a few tries to prevent update and delete errors. Another challenge was keeping all the files modular and clean. We ended up splitting the API endpoints into a separate Express router file (`/src/routes/bulletins.js`). Moreover, we split up the client side handle into separate Javascript files (under `/public/js/`) to allow for modular script imbedding into each separate HTML file.

Overall, this project helped reinforce how front end and back end components communicate in a full stack web application using REST principles.
