import type { Request, Response } from "express";
import usersevice from "../service/usersevice.js";

async function registerUser(req: Request, res: Response) {
    try {
        const result: any = await usersevice.registerUser(req.body);
        if (result && result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function loginUser(req: Request, res: Response) {
    try {
        const result: any = await usersevice.loginUser(req.body);
        if (result && result.error) {
            return res.status(401).json({ error: result.error });
        }

        // เก็บ Token ใน Cookie (Bearer Token)
        res.cookie('token', result.token, {
            httpOnly: true, // ป้องกัน XSS
            secure: process.env.NODE_ENV === 'production', // ใช้ HTTPS ใน production
            maxAge: 24 * 60 * 60 * 1000 // 1 วัน
        });

        return res.status(200).json({ 
            message: "Login successful"        
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default {
    registerUser,
    loginUser,
};