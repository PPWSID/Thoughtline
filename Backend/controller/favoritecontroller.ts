import type { Request, Response } from "express";
import favoriteservice from "../service/favoriteservice.js";
import responebuilder from "../utils/responebuilder.js";

async function toggleFavorite(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const { articleId } = req.body;

        if (!articleId) {
            return responebuilder.responseError(res, 400, "Article ID is required");
        }

        const result: any = await favoriteservice.toggleFavorite(userId, articleId);
        if (result && result.error) {
            return responebuilder.responseError(res, 400, "Error toggling favorite", result.error);
        }
        return responebuilder.responseSuccess(res, result, 200, `Article ${result.action} favorites`);
    } catch (error) {
        return responebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function getFavorites(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const result: any = await favoriteservice.getFavorites(userId);
        if (result && result.error) {
            return responebuilder.responseError(res, 400, "Error getting favorites", result.error);
        }
        return responebuilder.responseSuccess(res, result, 200, "Favorites retrieved successfully");
    } catch (error) {
        return responebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function checkIsFavorite(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const { articleId } = req.params;

        if (!articleId) {
            return responebuilder.responseError(res, 400, "Article ID is required");
        }

        const isFavorite = await favoriteservice.checkIsFavorite(userId, articleId as string);
        return responebuilder.responseSuccess(res, { isFavorite }, 200, "Check favorite successful");
    } catch (error) {
        return responebuilder.responseError(res, 500, "Internal server error", error);
    }
}

export default {
    toggleFavorite,
    getFavorites,
    checkIsFavorite
};
