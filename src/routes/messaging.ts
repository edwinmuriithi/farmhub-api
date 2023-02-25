import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma';
import { getUserFromToken } from '../lib/utils';
import upload from "../lib/uploadMiddleware";


const router = express.Router();
router.use(express.json());

router.use(express.json({ limit: '25mb' }));
router.use(express.urlencoded({ limit: '25mb', extended: true }));


// Get Threads.
router.get("/", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let user = await getUserFromToken(token);
        let threads = await db.message.findMany({
            where: {
                OR: [
                    { recipientId: user || '' },
                    { senderId: user || '' },
                ]
            },
            distinct: ["recipientId", "senderId"],
            select: {
                senderId: true,
                image: true,
                recipientId: true,
                read: true,
                text: true,
                updatedAt: true,
                recipient: {
                    select: {
                        names: true
                    }
                },
                sender: {
                    select: {
                        names: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        let _threads = threads.map((thread: any) => {
            return { ...thread, image: thread.image ? `${req.protocol + "://" + req.get('host') + "/files/" + thread.image}` : '' }
        })
        res.statusCode = 200;
        res.json({ status: "success", threads: _threads })
        return;
    } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json({ status: "error", error });
        return;
    }
});

// Get Thread Messages
router.get("/:recipient", [requireJWT], async (req: Request, res: Response) => {
    try {
        let { recipient } = req.params;
        let token = req.headers.authorization || '';
        let messages = await db.message.findMany({
            where: {
                OR:
                    [{ recipientId: recipient }, { senderId: recipient }]
            },
            include: {
                recipient: {
                    select: { names: true }
                }, sender: { select: { names: true } }
            }
        });
        let _messages = messages.map((message: any) => {
            return { ...message, image: message.image ? `${req.protocol + "://" + req.get('host') + "/files/" + message.image}` : '' }
        })
        res.json({ messages: _messages, status: "success" });
        return;
    } catch (error: any) {
        res.statusCode = 400;
        console.error(error);
        if (error.code === 'P2002') {
            res.json({ status: "error", message: `User with the ${error.meta.target} provided not found` });
            return;
        }
        res.json({ status: "error", error });
        return;
    }
});



// Send Message
router.post("/", [requireJWT, <any>upload.single("image")], async (req: Request, res: Response) => {
    try {
        let recipient = req.body.recipient;
        let text = req.body.text;
        let phone = req.body.phone;
        if (!text) {
            res.statusCode = 400;
            res.json({ status: "error", error: `text are required` });
            return;
        }
        if (!recipient && !phone) {
            res.statusCode = 400;
            res.json({ status: "error", error: `phone or recipient is required` });
            return;
        }
        let token = req.headers.authorization || '';
        let user = await getUserFromToken(token);
        console.log(req?.file?.filename)
        let newMessage = await db.message.create({
            data: {
                text,
                image: req?.file?.filename || '',
                sender: { connect: { id: user || '' } },
                recipient: {
                    connect: {
                        ...(recipient) && { id: recipient },
                        ...(phone) && { phone: phone }
                    }
                }
            }
        });
        res.statusCode = 201;
        res.json({ message: newMessage.id, status: "success" });
        return;
    } catch (error: any) {
        res.statusCode = 400;
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", error: `User with the ${error.meta.target} provided already exists` });
            return;
        }
        if (error.code === 'P2025') {
            res.json({ status: "error", message: `Recipient not found` });
            return;
        }
        res.json(error);
        return;
    }
});

export default router;