import httpRequest from '../httpsRequest';

const favoriteservice = {
  toggleFavorite(articleId: string) {
    return httpRequest.post('/favorite/toggle', { articleId });
  },

  getFavorites() {
    return httpRequest.get('/favorite/getall');
  },
};

export default favoriteservice;
