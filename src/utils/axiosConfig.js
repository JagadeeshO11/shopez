import axios from 'axios';

let loadingCallback = null;

export const setLoadingCallback = (showLoading, hideLoading) => {
  loadingCallback = { showLoading, hideLoading };
};

axios.interceptors.request.use(
  (config) => {
    if (loadingCallback) loadingCallback.showLoading();
    return config;
  },
  (error) => {
    if (loadingCallback) loadingCallback.hideLoading();
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (loadingCallback) loadingCallback.hideLoading();
    return response;
  },
  (error) => {
    if (loadingCallback) loadingCallback.hideLoading();
    return Promise.reject(error);
  }
);

export default axios;
