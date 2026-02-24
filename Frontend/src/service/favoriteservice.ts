import httpRequest from '../httpsRequest';

const favoriteservice = {
  toggleFavorite(articleId: string) {
    return httpRequest.post('/favorite/toggle', { articleId });
  },

  getFavorites() {
    return httpRequest.get('/favorite/getall');
  },

  checkIsFavorite(articleId: string) {
    return httpRequest.get(`/favorite/check/${articleId}`);
  }
};

export default favoriteservice;
