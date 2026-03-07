const Bulletin = require("../models/bulletinSchema");
const { bulletins } = require("../data/seed");

function makeBulletinKey(bulletin) {
    return [bulletin.title, bulletin.category, bulletin.author, bulletin.date]
        .map((value) => String(value || "").trim())
        .join("||");
}

async function addSeedData() {
    try {
        const existingBulletins = await Bulletin.find(
            {},
            "title category author date",
        ).lean();

        const existingKeys = new Set(
            existingBulletins.map((bulletin) => makeBulletinKey(bulletin)),
        );

        let inserted = 0;
        let skipped = 0;

        for (const bulletin of bulletins) {
            const sanitized = {
                title: String(bulletin.title || "").trim(),
                category: String(bulletin.category || "").trim(),
                message: bulletin.message ? String(bulletin.message).trim() : "",
                author: String(bulletin.author || "").trim(),
                date: String(bulletin.date || "").trim(),
            };

            if (
                !sanitized.title ||
                !sanitized.category ||
                !sanitized.author ||
                !sanitized.date
            ) {
                console.warn(
                    "Skipping invalid seed bulletin (missing required field):",
                    sanitized,
                );
                skipped += 1;
                continue;
            }

            const key = makeBulletinKey(sanitized);

            if (existingKeys.has(key)) {
                skipped += 1;
                continue;
            }

            try {
                await Bulletin.create(sanitized);
                existingKeys.add(key);
                inserted += 1;
                console.log("Seed bulletin added with title:", sanitized.title);
            } catch (err) {
                console.error(
                    "Error adding seed bulletin with title:",
                    sanitized.title,
                    err,
                );
            }
        }

        console.log(
            `Seed sync complete. Inserted ${inserted}, skipped ${skipped}.`,
        );
    } catch (err) {
        console.error("Error checking or seeding bulletins:", err);
    }
}

module.exports = addSeedData;
