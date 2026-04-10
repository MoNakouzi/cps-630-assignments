// Authentication middleware implements JWT verification to populate `req.user`.
const jwt = require("jsonwebtoken");

// Verify Authorization Bearer token; treat missing/invalid token as guest
function attachUser(req, res, next) {
    // Check for Authorization header (case-insensitive) and verify JWT
    const auth = req.header("authorization") || req.header("Authorization");

    // If Authorization header is present and starts with "Bearer ", verify the token
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        // Extract the token part after "Bearer "
        const token = auth.slice(7).trim();
        try {
            // Verify the token
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user info (id and role) to req.user
            req.user = { id: String(payload.id), role: payload.role || "user" };

            return next();
        } catch (err) {
            // Invalid token is treated as unauthenticated
            req.user = null;
            return next();
        }
    }

    // No token present: treat request as guest (no req.user)
    req.user = null;

    next();
}

function requireAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") return next();
    return res.status(403).json({ error: "Admin privileges required" });
}

function requireAuth(req, res, next) {
    if (req.user) return next();
    return res.status(401).json({ error: "Authentication required" });
}

module.exports = { attachUser, requireAdmin, requireAuth };
