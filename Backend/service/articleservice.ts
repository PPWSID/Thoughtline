import "../config/global.js";
import Article from "../model/article.js";
import Favorite from "../model/favorite.js";
import ReportedArticle from "../model/reportedArticle.js";

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
    console.log(error);
    
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
    // ลบจาก Article
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) return { error: "Article not found" };

    // ลบจาก Favorite
    await Favorite.deleteMany({ articleId: id });

    // ลบจาก ReportedArticle
    await ReportedArticle.deleteMany({ articleId: id });

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
    return await Article.find({ category, is_active: true }).lean();
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
      .limit(limitNum)
      .lean();

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

async function reportArticle(body: any ,articleId: any, user: any) {
  try {
    const {reason_type, reason} = body;
    const article = await Article.findById(articleId);
    if (!article) return { error: "Article not found" };
    const newReportedArticle = new ReportedArticle({
      articleId,
      reason_type,
      reason,
      reported_by: user.id
    });
    await newReportedArticle.save();
    return { message: "Article reported successfully" };
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function getReportedArticles() {
  try {
    const reports = await ReportedArticle.find().sort({ createdAt: -1 }).lean();
    
    // Populate article details manually
    const populatedReports = await Promise.all(
      reports.map(async (report: any) => {
        const article = await Article.findById(report.articleId).lean();
        return {
          ...report,
          articleTitle: article?.title || "ไม่พบบทความนี้แล้ว",
          articleImage: article?.coverImage || "",
          id: report._id
        };
      })
    );

    return populatedReports;
  } catch (error) {
    return { error: "Internal server error" };
  }
}

async function deleteReport(id: string) {
  try {
    const deletedReport = await ReportedArticle.findByIdAndDelete(id);
    if (!deletedReport) return { error: "Report not found" };
    return { message: "Report dismissed successfully" };
  } catch (error) {
    return { error: "Internal server error" };
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
  reportArticle,
  getReportedArticles,
  deleteReport,
};
