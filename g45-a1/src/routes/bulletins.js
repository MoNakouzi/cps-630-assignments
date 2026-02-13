const express = require("express");
const fs = require("fs");
const path = require("path");
const bulletin_data = require("../data/bulletinsData.json");
const dataPath = path.join(__dirname, "..", "data", "bulletinsData.json");
const router = express.Router();

/*****************************************************/
/********* Defining (CRUD) API GET routes ************/
/*****************************************************/

// GET all bulletins
router.get("/", (req, res) => {
    res.json(bulletin_data);
    console.log(bulletin_data);
});

// GET a specific bulletin by id
router.get("/id/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const bulletin = bulletin_data.find(b => b.id === id);

    if (bulletin) {
        res.status(200).json(bulletin);
    } else {
        res.status(404).json({ error: `Bulletin with with ID "${id}" not found` });
    }
});

// GET all bulletins by a specific author (e.g., all bulletins by Campus Security)
router.get("/author/:author", (req, res) => {
    const bulletinAuthor = req.params.author;
    const bulletins = bulletin_data.filter(b => b.author.toLowerCase() === bulletinAuthor.toLowerCase());

    if (bulletins) {
        res.status(200).json(books);
    } else {
        res.status(404).json({ error: `Bulletin(s) by ${bulletinAuthor} not found.`})
    }
});

//Bulletin Storage Functions
function readData() {
  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    const parsed = JSON.parse(raw || "{}");
    if (!parsed.bulletins) parsed.bulletins = [];
    return parsed;
  } catch (e) {
    return { bulletins: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
}

/******************************************************/
/********* Defining (CRUD) API POST routes ************/
/******************************************************/

// Post call for Adding Bulletin to bulletinData.json
router.post("/", (req, res) => {
  const { title, description, catagory, tags, author } = req.body;

  if (!title || !catagory || !author) {
    return res.status(400).json({ error: "title, catagory, and author are required." });
  }

  const data = readData();
  const bulletins = data.bulletins;

    const maxId = bulletins.reduce((max, b) => {
    const n = Number(b.id);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);

  const nextId = maxId + 1;


  const newBulletin = {
    id: nextId,          // simple unique id
    title: title.trim(),
    catagory: catagory.trim(),
    message: description.trim(),
    author: author.trim(),
    tags: tags.trim(),
    date: new Date().toISOString().split('T')[0]
  };

  bulletins.push(newBulletin);
  data.bulletins = bulletins;
  writeData(data);

  return res.status(201).json(newBulletin);
});


/*******************************************************/
/********* Defining (CRUD) API PATCH routes ************/
/*******************************************************/


/*************************************&&*****************/
/********* Defining (CRUD) API DELETE routes ************/
/***************************************&&***************/


module.exports = router;
