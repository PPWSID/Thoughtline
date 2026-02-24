import "../config/global.js";
import Favorite from "../model/favorite.js";
import Article from "../model/article.js";

async function toggleFavorite(userId: string, articleId: string) {
    try {
        const existing = await Favorite.findOne({ userId, articleId });
        
        if (existing) {
            await Favorite.deleteOne({ _id: existing._id });
            return { action: "removed" };
        } else {
            const newFavorite = new Favorite({ userId, articleId });
            await newFavorite.save();
            return { action: "added" };
        }
    } catch (error) {
        return { error: "Internal server error" };
    }
}

async function getFavorites(userId: string) {
    try {
        const favorites = await Favorite.find({ userId }).populate('articleId').lean();
        // Return only the articles and add isFavorite: true
        return favorites
            .filter(f => f.articleId !== null)
            .map((f: any) => ({
                ...f.articleId,
                isFavorite: true
            }));
    } catch (error) {
        return { error: "Internal server error" };
    }
}

async function checkIsFavorite(userId: string, articleId: string) {
    try {
        const existing = await Favorite.findOne({ userId, articleId });
        return !!existing;
    } catch (error) {
        return false;
    }
}

export default {
    toggleFavorite,
    getFavorites,
    checkIsFavorite
};
