import axios from 'axios';

const createHttpRequest = (apiUrl: string) => {
  const instance = axios.create({
    baseURL: apiUrl,
    timeout: 120000
  });

  instance.defaults.headers.common['Content-Type'] = 'application/json';

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error.response?.data);
    }
  );

  const setHeader = (key: string, value: string) => {
    instance.defaults.headers.common[key] = value;
  };

  const setAuthorization = (token: string) => {
    instance.defaults.headers.common['Authorization'] = token;
  };

  return {
    instance,
    get: instance.get,
    put: instance.put,
    post: instance.post,
    delete: instance.delete,
    patch: instance.patch,
    setHeader,
    setAuthorization
  };
};

export default createHttpRequest;
