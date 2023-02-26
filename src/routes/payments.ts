import express, { Request, response, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import upload from "../lib/uploadMiddleware";
import { getUserFromToken } from "../lib/utils";

const router = express.Router();

// Create a new media.
router.post("/", [requireJWT, <any>upload.single("video")], async (req: Request, res: Response) => {
    try {
        const required = ['description', 'title'];
        required.map((field: any) => {
            if (Object.keys(req.body).indexOf(field) < 0) {
                res.status(400).json({ error: `${field} is required`, status: "error" });
                return;
            }
        });
        if (!req.file?.filename) { 
            res.status(400).json({ error: 'video is required', status: "error" });
            return;
        }
          // console.log(req.files)
        // if (req.files?.length && req.files?.length < 2) {
        //     res.status(400).json({ error: 'Image/thumbnail and video are required', status: "error" });
        //     return;
        // }
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            // let role = decodedSession.session.role;
            let userId = decodedSession.session.userId;
            let user = await db.user.findUnique({
                where: {
                    id: userId
                }
            })
            let post = await db.media.create({
                data: {
                    description: req.body.description,
                    thumbnail: "",
                    title: req.body.title,
                    video: req.file?.filename,
                    uploadedBy: { connect: { id: userId } }
                }
            });
            res.status(200).json({
                imageUrl: `${req.protocol + "://" + req.get('host') + "/files/" + req.file?.filename}`,
                id: post.id,
                // image: req.file.filename,
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

// Get Video Feed
router.get("/", [requireJWT], async (req: Request, res: Response) => {
    try {

        let mediaPosts = await db.media.findMany({
            orderBy: {
                updatedAt: 'desc'
            }
        });
        let _mediaPosts = mediaPosts.map((post: any) => {
            return { ...post, video: post.video ? `${req.protocol + "://" + req.get('host') + "/files/" + post.video}` : '' }
        })
        // console.log(mediaPosts)
        res.status(200).json({ media: _mediaPosts, status: "success" });
        return;
    } catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});

// Get Single Media Post.
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
                        id: post[0].id
                    },
                    status: "success"
                });
                return;
            }
            res.status(401).json({ error: "Post not found", status: "error" });
            return;

        }
    } catch (error) {
        console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
});

export default router;