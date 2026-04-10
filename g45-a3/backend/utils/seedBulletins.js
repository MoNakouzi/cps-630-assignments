// Import bcrypt for hashing passwords
const bcrypt = require("bcrypt");

const Bulletin = require("../models/Bulletin");
const User = require("../models/User");
const Category = require("../models/Category");
const seedData = require("../data/seed");

// seedData exports categories, users, and bulletins
const bulletins = seedData.bulletins || [];
const seedCategories = seedData.categories || [];
const seedUsers = seedData.users || [];

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

        // Create categories
        const categoryMap = {};
        const categoriesToCreate = seedCategories;

        // For each category name in seedCategories
        for (const name of categoriesToCreate) {
            
            // Generate slug from name (e.g., "Events" -> "events")
            const slug = String(name)
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

        // Create users
        const userMap = {};
        const usersToCreate = seedUsers;

        // For each user name in seedUsers
        for (const name of usersToCreate) {

            // Generate email from name (e.g., "John Doe" -> "john.doe@group45.ca")
            const emailLocal =
                String(name)
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, ".")
                    .replace(/[^a-z0-9.]/g, "") || "user";

            const email = `${emailLocal}@group45.ca`;

            // Hash a placeholder password for seed users
            const passwordHash = await bcrypt.hash("seed-user", 10);

            // Try to find user by email (since email is unique)
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
                    visibility: b.visibility || "public",
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
