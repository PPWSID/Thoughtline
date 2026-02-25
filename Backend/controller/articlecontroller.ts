import type { Request, Response } from "express";
import articleservice from "../service/articleservice.js";
import responsebuilder from "../utils/responebuilder.js";


async function createArticle(req: Request, res: Response) {
    try {
        
        const result: any = await articleservice.createArticle(req.body, (req as any).user);
        if (result && result.error) {
            return responsebuilder.responseError(res, 400, "Error creating article", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Article created successfully");
    } catch (error) {
        console.log(error);
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function getAllArticle(req: Request, res: Response) {
    try {
        const result = await articleservice.getAllArticle(req.query, (req as any).user);
        return responsebuilder.responseSuccess(res, result, 200, "Article retrieved successfully");
    } catch (error) {
        console.log(error);
        
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function getArticleById(req: Request, res: Response) {
    try {
        const result: any = await articleservice.getArticleById(req.params.id);
        if (result && result.error) {
            return responsebuilder.responseError(res, 404, "Article not found", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Article retrieved successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function updateArticle(req: Request, res: Response) {
    try {
        const result: any = await articleservice.updateArticle(req.params.id as string, req.body, (req as any).user);
        if (result && result.error) {
            return responsebuilder.responseError(res, 400, "Error updating article", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Article updated successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function deleteArticle(req: Request, res: Response) {
    try {
        const result: any = await articleservice.deleteArticle(req.params.id as string);
        if (result && result.error) {
            return responsebuilder.responseError(res, 400, "Error deleting article", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Article deleted successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function getOwnArticle(req: Request, res: Response) {
    try {
        const result: any = await articleservice.getOwnArticle((req as any).user, req.query);
        if (result && result.error) {
            return responsebuilder.responseError(res, 400, "Error getting own article", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Article retrieved successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function getArticleByFilter(req: Request, res: Response) {
    try {
        const result: any = await articleservice.getArticleByFilter(req.body);
        if (result && result.error) {
            return responsebuilder.responseError(res, 400, "Error getting article by filter", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Article retrieved successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function getAllArticleWithLogin(req: Request, res: Response) {
    try {
        const result = await articleservice.getAllArticleWithLogin(req.query, (req as any).user);
        return responsebuilder.responseSuccess(res, result, 200, "Article retrieved successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function reportArticle(req: Request, res: Response) {
    try {
        const result: any = await articleservice.reportArticle(req.body, req.params.id as string, (req as any).user);
        if (result && result.error) {
            return responsebuilder.responseError(res, 400, "Error reporting article", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Article reported successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function getReportedArticles(req: Request, res: Response) {
    try {
        const result: any = await articleservice.getReportedArticles();
        if (result && result.error) {
            return responsebuilder.responseError(res, 400, "Error getting reported articles", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Reported articles retrieved successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function deleteReport(req: Request, res: Response) {
    try {
        const result: any = await articleservice.deleteReport(req.params.id as string);
        if (result && result.error) {
            return responsebuilder.responseError(res, 400, "Error deleting report", result.error);
        }
        return responsebuilder.responseSuccess(res, result, 200, "Report deleted successfully");
    } catch (error) {
        return responsebuilder.responseError(res, 500, "Internal server error", error);
    }
}

export default {
    createArticle,
    getAllArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
    getOwnArticle,
    getArticleByFilter,
    getAllArticleWithLogin,
    reportArticle,
    getReportedArticles,
    deleteReport,
};
