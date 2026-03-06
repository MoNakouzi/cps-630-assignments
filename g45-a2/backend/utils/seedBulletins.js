const Bulletin = require("../models/bulletinSchema");
const { bulletins } = require("../data/seed");

async function addSeedData() {
  try {
    const bulletinCount = await Bulletin.estimatedDocumentCount();

    if (bulletinCount === 0) {
      console.log("Database is empty. Adding initial bulletins...");

      for (const bulletin of bulletins) {
        try {
          const newBulletin = new Bulletin(bulletin);
          await newBulletin.save();
          console.log(
            "Bulletin added with ID: " +
              bulletin.id +
              " and title: " +
              bulletin.title,
          );
        } catch (err) {
          console.error(
            "Error adding bulletin with ID: " +
              bulletin.id +
              " and title: " +
              bulletin.title +
              " " +
              err,
          );
        }
      }
    } else {
      console.log(
        "Bulletins already exist in database. Not adding test bulletins.",
      );
    }
  } catch (err) {
    console.error("Error checking or seeding bulletins:", err);
  }
}

module.exports = addSeedData;
