const express = require("express");
const bulletin_data = require("../data/bulletinsData.json");
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


/******************************************************/
/********* Defining (CRUD) API POST routes ************/
/******************************************************/


/*******************************************************/
/********* Defining (CRUD) API PATCH routes ************/
/*******************************************************/


/*************************************&&*****************/
/********* Defining (CRUD) API DELETE routes ************/
/***************************************&&***************/


module.exports = router;
