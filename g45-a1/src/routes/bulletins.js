const express = require("express");
const bulletin_data = require("../data/bulletinsData.json");
const router = express.Router();

// Preprocessing bulletin data to flatten any nested structures
const getBulletinsArray = () => {
    if (Array.isArray(bulletin_data)) {
        return bulletin_data;
    } else {
        return bulletin_data.bulletins;
    }
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
    const bulletins = bulletinsList.filter(b => b.author.toLowerCase() === bulletinAuthor.toLowerCase());

    if (bulletins) {
        res.status(200).json(bulletins);
    } else {
        res.status(404).json({ error: `Bulletin(s) by ${bulletinAuthor} not found.`})
    }
});


/******************************************************/
/********* Defining (CRUD) API POST routes ************/
/******************************************************/


/*******************************************************/
/********* Defining (CRUD) API PATCH routes ************/
/*******************************************************/


/********************************************************/
/********* Defining (CRUD) API DELETE routes ************/
/********************************************************/


module.exports = router;
