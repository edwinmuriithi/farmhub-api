import express, { Request, response, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import upload from "../lib/uploadMiddleware";


const router = express.Router()
router.use(express.json())

// Create a new post.
router.post("/", [requireJWT, <any>upload.single("image")], async (req: Request, res: Response) => {
    try {
        if (!req.body.description) {
            res.status(401).json({ error: 'Please provide a description', status: "error" });
            return;
        }
        console.log(req.body.text)
        if (!req.file) {
            res.status(400).json({ error: 'Please provide an image', status: "error" });
            return;
        }
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let role = decodedSession.session.role
            let userId = decodedSession.session.userId
            let user = await db.user.findUnique({
                where: {
                    id: userId
                }
            })
            let post = await db.post.create({
                data: {
                    description: req.body.description,
                    image: req.file.filename || '',
                    userId: userId
                }
            });
            res.status(200).json({
                imageUrl: `${req.protocol + "://" + req.get('host') + "/files/" + req.file?.filename}`,
                id: post.id,
                image: req.file.filename,
                status: "success"
            });
            return;
        }
    } catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});

// Get Post.
router.get("/:id", [requireJWT], async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId;
            let user = await db.user.findUnique({
                where: {
                    id: userId
                }
            });
            let post = await db.post.findMany({
                where: { id: id, userId: userId }
            });
            if (post.length > 0) {
                res.status(200).json({
                    post: {
                        description: post[0].description,
                        createdBy: post[0].userId,
                        image: post[0].image,
                        imageUrl: `${req.protocol + "://" + req.get('host') + "/files/" + post[0].image}`,
                        updatedAt: post[0].updatedAt,
                        createdAt: post[0].createdAt,
                    },
                    status: "success"
                });
                return;
            }
            res.status(401).json({ error: "Post not found", status: "error" });
            return;

        }
    } catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});

// Get Posts By User.
router.get("/", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId;
            let user = await db.user.findUnique({
                where: {
                    id: userId
                }
            });
            let post = await db.post.findMany({
                where: { userId: userId }
            });
            if (post.length > 0) {
                res.status(200).json({
                    post: {
                        description: post[0].description,
                        createdBy: post[0].userId,
                        image: post[0].image,
                        imageUrl: `${req.protocol + "://" + req.get('host') + "/files/" + post[0].image}`,
                        updatedAt: post[0].updatedAt,
                        createdAt: post[0].createdAt,
                    },
                    status: "success"
                });
                return;
            }
            res.status(401).json({ error: "Post not found", status: "error" });
            return;

        }
    } catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});


export default router