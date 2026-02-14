const express = require("express");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "bulletinsData.json");

const router = express.Router();

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

// Preprocessing bulletin data to flatten any nested structures
const getBulletinsArray = () => {
    const data = readData();
    return data.bulletins;
}

/*****************************************************/
/********* Defining (CRUD) API GET routes ************/
/*****************************************************/

// GET all bulletins
router.get("/", (req, res) => {
    const bulletins = getBulletinsArray();
    res.json(bulletins);
});

// GET a specific bulletin by id
router.get("/id/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const bulletins = getBulletinsArray();
    const bulletin = bulletins.find(b => b.id === id);

    if (bulletin) {
        res.status(200).json(bulletin);
    } else {
        res.status(404).json({ error: `Bulletin with with ID=${id} not found` });
    }
});

// GET all bulletins by a specific author (e.g., all bulletins by Campus Security)
router.get("/author/:author", (req, res) => {
    const bulletinAuthor = req.params.author;
    const bulletinsList = getBulletinsArray();
    const bulletins = bulletinsList.filter(b =>
        b.author.toLowerCase() === bulletinAuthor.toLowerCase()
    );

    if (bulletins.length > 0) {
        res.status(200).json(bulletins);
    } else {
        res.status(404).json({ error: `Bulletin(s) by ${bulletinAuthor} not found.` });
    }
});

/******************************************************/
/********* Defining (CRUD) API POST routes ************/
/******************************************************/

// Post call for Adding Bulletin to bulletinData.json
router.post("/", (req, res) => {
    const { title, message, category, author } = req.body;

    if (!title || !category || !author) {
        return res.status(400).json({ error: "Title, Category, and Author fields are required." });
    }

    const data = readData();
    const bulletins = data.bulletins;

    const maxId = bulletins.reduce((max, b) => {
        const n = Number(b.id);
        return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0);

    const nextId = maxId + 1;


    const newBulletin = {
        id: nextId,
        title: title.trim(),
        category: category.trim(),
        message: (message || "").trim(),
        author: author.trim(),
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

router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);
    const data = readData();
    const bulletins = data.bulletins || [];

    const idx = bulletins.findIndex(b => Number(b.id) === id);
    if (idx === -1) {
        return res.status(404).json({ error: `Bulletin with ID=${id} not found` });
    }

    const existing = bulletins[idx];
    const { title, message, category, author } = req.body;

    // Validate required fields (title, category, author)
    if (!title || !category || !author) {
        return res.status(400).json({ error: 'Title, Category, and Author fields are required.' });
    }

    const updated = Object.assign({}, existing, {
        title: String(title).trim(),
        message: (message || '').trim(),
        category: String(category).trim(),
        author: String(author).trim(),
        date: new Date().toISOString().split('T')[0]
    });

    bulletins[idx] = updated;
    data.bulletins = bulletins;
    writeData(data);

    return res.status(200).json(updated);
});

/********************************************************/
/********* Defining (CRUD) API DELETE routes ************/
/********************************************************/
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const data = readData();
    const bulletins = data.bulletins || [];

    const idx = bulletins.findIndex(b => Number(b.id) === id);
    if (idx === -1) {
        return res.status(404).json({ error: `Bulletin with ID=${id} not found` });
    }

    const removed = bulletins.splice(idx, 1)[0];
    data.bulletins = bulletins;
    writeData(data);

    return res.status(200).json({ success: true, removed });
});

module.exports = router;
