import "../config/global.js";
import Article from "../model/article.js";

async function getAllArticle() {
  try {
    return await Article.find({ is_active: true }).sort({ createdAt: -1 });
  } catch (error) {
    console.log(error);
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
      is_active: true
    });
    
    await newArticle.save();
    return newArticle;
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
}

async function updateArticle(id: string, body: any) {
  try {
    const { title, content, coverImage, category, excerpt } = body;
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content, coverImage, category, excerpt },
      { new: true }
    );
    if (!updatedArticle) return { error: "Article not found" };
    return updatedArticle;
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
}

async function deleteArticle(id: string) {
  try {
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) return { error: "Article not found" };
    return { message: "Article deleted successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
}

async function getArticleById(id: any) {
  try {
    const article = await Article.findById(id);
    if (!article) return { error: "Article not found" };
    return article;
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
}

async function getArticleByCategory(category: any) {
  try {
    return await Article.find({ category, is_active: true });
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
}

async function getArticleByFilter(body: any) {
}

export default { 
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticle,
  getArticleById,
  getArticleByCategory,
  getArticleByFilter
};