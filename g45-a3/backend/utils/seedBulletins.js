const Bulletin = require("../models/Bulletin");
const User = require("../models/User");
const Category = require("../models/Category");
const { bulletins } = require("../data/seed");

// Import bcrypt for hashing passwords
const bcrypt = require("bcrypt");

// Seed data helper creates users, categories, and bulletins if empty.
async function addSeedData() {
    try {
        const bulletinCount = await Bulletin.estimatedDocumentCount();

        // If bulletins already exist, skip adding seed data
        if (bulletinCount > 0) {
            console.log(
                "Bulletins already exist in database. Not adding test bulletins.",
            );
            return;
        }

        console.log("Database is empty. Adding initial seed data...");

        // Create categories and map category names to their ObjectIds for linking to bulletins
        const categoryNames = [];

        for (const bulletin of bulletins) {
            const name = (bulletin.category || "").trim();

            // Skip empty category names
            if (!name) {
                continue;
            }

            // If the category name is not already in our list, add it
            if (!categoryNames.includes(name)) {
                categoryNames.push(name);
            }
        }

        const categoryMap = {};

        for (const name of categoryNames) {
            // Create a clean slug (lowercase and hyphens, no special chars)
            const slug = name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

            // Try to find category by slug (since slug is unique)
            let cat = await Category.findOne({ slug });

            // If it doesn't exist, create it
            if (!cat) {
                cat = await Category.create({ name, slug });
                console.log("Category created:", name);
            }

            // Save category ID for linking to bulletins
            categoryMap[name] = cat._id;
        }

        // Create users (authors) and map author names to their ObjectIds
        const authorNames = [];

        for (const bulletin of bulletins) {
            const name = (bulletin.author || "").trim();

            // Skip empty author names
            if (!name) {
                continue;
            }

            // Add only if not already in the list
            if (!authorNames.includes(name)) {
                authorNames.push(name);
            }
        }

        const userMap = {};

        for (const name of authorNames) {
            // Create a placeholder email from the author's name
            const emailLocal =
                name
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, ".")
                    .replace(/[^a-z0-9.]/g, "") || "user";

            const email = `${emailLocal}@group45.ca`;

            // Hash a placeholder password for seed users
            const passwordHash = await bcrypt.hash("seed-user", 10);

            // Try to find user by email (since email should be unique)
            let user = await User.findOne({ email });

            // If the user does not exist, create it
            if (!user) {
                user = await User.create({ name, email, passwordHash });
                console.log("User created:", name);
            }

            // Save user ID for linking bulletins to authors
            userMap[name] = user._id;
        }

        // Create one admin seed user
        const adminEmail = "admin@group45.ca";

        // Check if admin already exists
        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            // Hash a placeholder password for seed admin user
            const passwordHash = await bcrypt.hash("seed-admin", 10);

            adminUser = await User.create({
                name: "Admin",
                email: adminEmail,
                passwordHash,
                role: "admin",
            });

            console.log("Admin user created");
        } else {
            console.log("Admin user already exists");
        }

        // Create bulletins linking to category and user ObjectIds
        for (const b of bulletins) {
            try {
                const categoryId = categoryMap[b.category] || null;
                const authorId = userMap[b.author] || null;

                const bulletinData = {
                    title: b.title || "",
                    category: categoryId,
                    message: b.message || "",
                    author: authorId,
                    date: b.date ? new Date(b.date) : new Date(),
                };

                const newBulletin = new Bulletin(bulletinData);
                await newBulletin.save();
                console.log("Bulletin added with Title:", b.title);
            } catch (err) {
                console.error(
                    "Error adding bulletin with Title:",
                    b.title,
                    err,
                );
            }
        }
    } catch (err) {
        console.error("Error checking or seeding bulletins:", err);
    }
}

module.exports = addSeedData;
