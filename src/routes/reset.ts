import express from "express";
import db from '../lib/prisma'


const router = express.Router();

// Get Unprocessed Posts
router.get("/:code", async (req, res) => {
    try {
        let { code } = req.params;
        let smsAuth = await db.smsAuth.findFirstOrThrow({
            where: {
                code: code
            }
        });
        let resetUrl = `${process.env['WEB_URL']}/new-password?id=${smsAuth.userId}&token=${smsAuth?.token}`;
        res.redirect(resetUrl);
        return;
    } catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: "🚫 Unauthorized 🚫" });
        return;
    }
});

export default router;