import httpRequest from '../httpsRequest';

const apiService = {
  getArticles() {
    return httpRequest.get('/article');
  },

  getArticleById(id: string) {
    return httpRequest.get(`/article/${id}`);
  },

  createArticle(payload: any) {
    return httpRequest.post('/article', payload);
  }
};

export default apiService;
