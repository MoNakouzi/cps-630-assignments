// These read `x-user-id` and `x-user-role` headers to simulate authentication

function attachUser(req, res, next) {
    const userId = req.header("x-user-id");
    const userRole = req.header("x-user-role");

    if (userId) {
        req.user = {
            id: String(userId),
            role: userRole ? String(userRole) : "user",
        };
    } else {
        req.user = null;
    }

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
