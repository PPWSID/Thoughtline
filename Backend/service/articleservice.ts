import { log } from "node:console";
import "../config/global.js";
import Article from "../model/article.js";
import Favorite from "../model/favorite.js";

async function getAllArticle(query: any = {} , user : any) {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 9;
    const skip = (page - 1) * limit;
    
    const totalCount = await Article.countDocuments({ is_active: true });
    const articles = await Article.find({ is_active: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const articlesWithFavorites = await Promise.all(
      articles.map(async (article: any) => {
        return {
          ...article,
          isFavorite: user ? await checkIsFavorite(article._id, user) : false
        };
      })
    );

    return {
      articles: articlesWithFavorites,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    };
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function createArticle(body: any, user: any) {
  try {
    const { title, content, coverImage, category, excerpt } = body;

    if (!title || !content) {
      return { error: "Title and Content are required" };
    }

    const newArticle = new Article({ 
      title, 
      content, 
      coverImage, 
      category, 
      excerpt,
      author: user?.name || "Anonymous",
      is_active: true,
      created_by : user.id,
      updated_by : user.id
    });
    
    await newArticle.save();
    return newArticle;
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function updateArticle(id: string, body: any, user: any) {
  try {
    const { title, content, coverImage, category, excerpt } = body;
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content, coverImage, category, excerpt, updated_by: user.id },
      { new: true }
    );
    if (!updatedArticle) return { error: "Article not found" };
    return updatedArticle;
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function deleteArticle(id: string) {
  try {
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) return { error: "Article not found" };
    return { message: "Article deleted successfully" };
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function getArticleById(id: any) {
  try {
    const article = await Article.findById(id);
    if (!article) return { error: "Article not found" };
    return article;
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function getArticleByCategory(category: any) {
  try {
    return await Article.find({ category, is_active: true });
  } catch (error) {
    return { error: "Internal server error" };
  }
}


async function getOwnArticle(user: any, query: any = {}) {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 9;
    const skip = (page - 1) * limit;

    const totalCount = await Article.countDocuments({ created_by: user.id });
    const articles = await Article.find({ created_by: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      articles,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    };
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function getArticleByFilter(body: any) {
  try {
    const { category, page = 1, limit = 9 } = body;
    const pageNum = parseInt(page as any) || 1;
    const limitNum = parseInt(limit as any) || 9;
    const skip = (pageNum - 1) * limitNum;

    const query: any = { is_active: true };
    if (category === 'default' || category === '') {
      query.category = null;
    } else if (category && category !== 'Default' && category !== '') {
      query.category = category;
    }

    const totalCount = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return {
      articles,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        limit: limitNum
      }
    };
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function getAllArticleWithLogin(body: any, user: any) {
  try {
    const { category, page = 1, limit = 9 } = body;
    const pageNum = parseInt(page as any) || 1;
    const limitNum = parseInt(limit as any) || 9;
    const skip = (pageNum - 1) * limitNum;

    const query: any = { is_active: true };
    if (category === 'default' || category === '') {
      query.category = null;
    } else if (category && category !== 'Default' && category !== '') {
      query.category = category;
    }

    const totalCount = await Article.countDocuments(query);

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const articlesWithFavorites = await Promise.all(
      articles.map(async (article: any) => {
        return {
          ...article,
          isFavorite: user ? await checkIsFavorite(article._id, user) : false
        };
      })
    );
    return {
      articles: articlesWithFavorites,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        limit: limitNum
      }
    };

  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function checkIsFavorite(articleId: any, user: any) {
  try {
    const check = await Favorite.exists({ articleId: articleId, userId: user.id });
    
    return !!check;
  } catch (error) {
    return false;
  }
}


export default { 
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticle,
  getArticleById,
  getArticleByCategory,
  getOwnArticle,
  getArticleByFilter,
  getAllArticleWithLogin,
};