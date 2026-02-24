import httpRequest from '../httpsRequest';

const userservice = {
  login(payload: any) {
    return httpRequest.post('/user/login', payload);
  },

  logout() {
    return httpRequest.post('/user/logout');
  },

  register(payload: any) {
    return httpRequest.post('/user/register', payload);
  },

  getProfile() {
    return httpRequest.get('/user/getprofile');
  },

  updateProfile(payload: any) {
    return httpRequest.put('/user/updateprofile', payload);
  }
};

export default userservice;
