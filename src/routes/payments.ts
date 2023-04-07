import express, { Request, response, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import { parsePhoneNumber } from "../lib/sms";
import upload from "../lib/uploadMiddleware";
import { getRoleFromToken, getUserFromPhone, getUserFromToken } from "../lib/utils";

const router = express.Router();
router.use(express.json());

// Create a new media.
router.post("/", [requireJWT], async (req: Request, res: Response) => {
    try {
        const required = ['amount', 'description', 'phone'];
        required.map((field: any) => {
            if (Object.keys(req.body).indexOf(field) < 0) {
                res.status(400).json({ error: `${field} is required`, status: "error" });
                return;
            }
        });
        let data = req.body;
        let user = await getUserFromPhone(parsePhoneNumber(req.body.phone) || '');
        if (!user) {
            res.statusCode = 400;
            res.json({ status: "error", error: "Invalid phone number provided" });
            return;
        }
        let userRole = await db.user.findFirst({
            where: {
                id: user || ''
            }
        })
        if (userRole?.role !== 'USER') {
            res.statusCode = 400;
            res.json({ status: "error", error: "Invalid phone number provided. Provide a user" });
            return;
        }
        let token = req.headers.authorization || '';
        token = token.split(' ')[1];
        let role = await getRoleFromToken(token);
        if (role !== "ADMINISTRATOR") {
            res.statusCode = 400;
            res.json({ status: "error", error: "Unauthorized" });
            return;
        }
        let payment = await db.payment.create({
            data: {
                user: {
                    connect: {
                        id: user || ''

                    }
                },
                amount: parseFloat(data.amount),
                description: data.description
            }
        });
        res.statusCode = 201;
        res.json({ payment: payment.id, status: "success" });
        return;
    } catch (error) {
        console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});

// Get All Payments
router.get("/", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        token = token.split(' ')[1];
        let role = await getRoleFromToken(token);
        if (role !== "ADMINISTRATOR") {
            res.statusCode = 400;
            res.json({ status: "error", error: "Unauthorized" });
            return;
        }
        let { phone } = req.query;
        let payments = await db.payment.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        phone: true, names: true
                    }
                }
            },
            where: {
                ...(phone) && { userId: await getUserFromPhone(String(phone)) || '' }
            }
        });
        let _payments = payments.map((payment: any) => {
            return { ...payment, phone: payment.user.phone, names: payment.user.names }
        })
        res.status(200).json({ payments: _payments, status: "success" });
        return;
    } catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});

// Get Single Payment.
router.get("/:id", [requireJWT], async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let token = req.headers.authorization || '';
        token = token.split(' ')[1];
        let role = await getRoleFromToken(token);
        if (role !== "ADMINISTRATOR") {
            res.statusCode = 401;
            res.json({ status: "error", error: "Unauthorized" });
            return;
        }
        let payment = await db.payment.findFirst({
            where: {
                id: id
            }
        });
        if (payment) {
            res.status(200).json({ payment, status: "success" });
            return;
        };
        res.status(401).json({ error: "Payment not found", status: "error" });
        return;
    } catch (error) {
        console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});


// Get Single Payment.
router.delete("/:id", [requireJWT], async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let token = req.headers.authorization || '';
        token = token.split(' ')[1];
        let role = await getRoleFromToken(token);
        if (role !== "ADMINISTRATOR") {
            res.statusCode = 401;
            res.json({ status: "error", error: "Unauthorized" });
            return;
        }
        let payment = await db.payment.delete({
            where: {
                id: id
            }
        });
        if (payment) {
            res.status(200).json({ payment, status: "success" });
            return;
        };
        res.status(401).json({ error: "Payment not found", status: "error" });
        return;
    } catch (error) {
        console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});

export default router;