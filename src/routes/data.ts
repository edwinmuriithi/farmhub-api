import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import { counties } from '../lib/counties.json'

const router = express.Router()
router.use(express.json())


// Get County Information.
router.get("/counties", [], async (req: Request, res: Response) => {
    try {
        let { county } = req.query;
        if (!county) {
            res.statusCode = 200;
            let _counties = counties.map((county: any) => {
                return county.name
            })
            res.json({ status: "success", counties: _counties })
            return
        }
        if (county) {
            res.statusCode = 200;
            let map: any = {};
            counties.map((county: any) => {
                map[String(county.name).toUpperCase()] = county.sub_counties;
            });
            console.log(map)
            res.json({ status: "success", subCounties: map[String(county).toUpperCase()] });
            return
        }
        res.json({ status: "success" })
        return
    }
    catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.json(error);
        return
    }
});



export default router