import axios from './Request';

const api = {
  getConfigs: "/configs",
  getCurrencies: "/currencies",
  getCurrency: "/currencies/current",
  uploadImg: "/images",
  getLanguages: "/languages",
  getRewards: "/rewards",
  getVips: "/vips",
  getDroplist: "/drop_list/{code}",
  getBankMaintenance: "/banks/maintenance",
};

const ConfigurationRequest = {
  getConfigs() {
    axios.get(api.getConfigs, {}).then(res => {

    });
  },
  getCurrencies() {
    return new Promise((resolve, reject) => {
      axios.get(api.getCurrencies).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  getBankMaintenance() {
    return new Promise((resolve, reject) => {
      axios.get(api.getBankMaintenance).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  getCurrency() {
    return new Promise((resolve, reject) => {
      axios.get(api.getCurrency).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  uploadImg (image) {
    const configs = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 0
    };
    const params = new FormData();
    params.append('image', image);
    return new Promise((resolve, reject) => {
      axios.post(api.uploadImg, params, configs).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getLanguages () {
    axios.get(api.getLanguages).then(res => {

    });
  },
  getRewards () {
    axios.get(api.getRewards).then(res => {

    });
  },
  getVips () {
    axios.get(api.getVips).then(res => {

    });
  },
  getDroplist(code) {
    const url_code = api.getDroplist.replace("{code}", code);
    return new Promise((resolve, reject) => {
      axios.get(url_code).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default ConfigurationRequest;