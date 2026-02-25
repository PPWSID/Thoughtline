import httpRequest from '../httpsRequest';

const articleservice = {
  getArticles(params?: any) {
    return httpRequest.get('/article/getall', { params });
  },
  getArticlesWithLogin(params?: any) {
    return httpRequest.get('/article/getall-article', { params });
  },
  getArticleById(id: string) {
    return httpRequest.get(`/article/getbyid/${id}`);
  },

  createArticle(payload: any) {
    return httpRequest.post('/article/create', payload);
  },

  updateArticle(id: string, payload: any) {
    return httpRequest.put(`/article/updatebyid/${id}`, payload);
  },

  deleteArticle(id: string) {
    return httpRequest.delete(`/article/deletebyid/${id}`);
  },

  getOwnArticle(params?: any) {
    return httpRequest.get('/article/getbyown', { params });
  },

  getArticlesByFilter(filter: any) {
    return httpRequest.post('/article/getbyfilter', filter);
  },

  reportArticle(id: string, payload: any) {
    return httpRequest.post(`/article/report/${id}`, payload);
  },
  
  getReportedArticles() {
    return httpRequest.get('/article/getreported');
  },

  deleteReport(id: string) {
    return httpRequest.delete(`/article/deletereport/${id}`);
  }
};

export default articleservice;
