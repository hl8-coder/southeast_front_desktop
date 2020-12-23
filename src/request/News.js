import axios from './Request';

const api = {
  getAdvs: "/advertisements",
  getAnnouncements: "/announcements",
  getBanners: "/banners",
  getNews: "/news",
  getNewsDetail: "/news/{news}"
};

const NewsRequest = {
  getAdvs() {
    axios.get(api.getAdvs, {}).then(res => {

    });
  },
  getAnnouncements(params) {
    return new Promise((resolve, reject) => {
      axios.get(api.getAnnouncements, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getBanners(params) {
    return new Promise((resolve, reject) => {
      axios.get(api.getBanners, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  getNews () {
    axios.get(api.getNews).then(res => {

    });
  },
  getNewsDetail () {
    axios.get(api.getNewsDetail).then(res => {

    });
  }
};

export default NewsRequest;
