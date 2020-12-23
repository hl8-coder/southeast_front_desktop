import axios from './Request';

const api = {
  getPaymentPlatforms: "/payment_platforms?include=companyBankAccount",
  getPaymentMenu: "/payment_platforms/menu",
  getPaymentAll: "/payment_platforms/all"
};

const PaymentPlatformRequest = {
  getPaymentPlatforms (params) {
    return new Promise((resolve, reject) => {
      axios.get(api.getPaymentPlatforms, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getPaymentMenu () {
    return new Promise((resolve, reject) => {
      axios.get(api.getPaymentMenu).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getPaymentAll () {
    return new Promise((resolve, reject) => {
      axios.get(api.getPaymentAll).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default PaymentPlatformRequest;