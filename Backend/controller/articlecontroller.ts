import type { Request, Response } from "express";
import articleservice from "../service/articleservice.js";

async function createArticle(req: Request, res: Response) {
    try {
        const result: any = await articleservice.createArticle(req.body, (req as any).user);
        if (result && result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getAllArticle(req: Request, res: Response) {
    try {
        const result = await articleservice.getAllArticle();
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getArticleById(req: Request, res: Response) {
    try {
        const result: any = await articleservice.getArticleById(req.params.id);
        if (result && result.error) {
            return res.status(404).json({ error: result.error });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function updateArticle(req: Request, res: Response) {
    try {
        const result: any = await articleservice.updateArticle(req.params.id as string, req.body);
        if (result && result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function deleteArticle(req: Request, res: Response) {
    try {
        const result: any = await articleservice.deleteArticle(req.params.id as string);
        if (result && result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default {
    createArticle,
    getAllArticle,
    getArticleById,
    updateArticle,
    deleteArticle
};
