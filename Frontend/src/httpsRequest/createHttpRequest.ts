import axios from 'axios';

const createHttpRequest = (apiUrl: string) => {
  const instance = axios.create({
    baseURL: apiUrl,
    timeout: 120000,
    withCredentials: true
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
      // If server is down or network error, error.response will be undefined
      return Promise.reject(error.response?.data || error);
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
    get: instance.get.bind(instance),
    put: instance.put.bind(instance),
    post: instance.post.bind(instance),
    delete: instance.delete.bind(instance),
    patch: instance.patch.bind(instance),
    setHeader,
    setAuthorization
  };
};

export default createHttpRequest;
