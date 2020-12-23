import axios from './Request';

const api = {
  getMpays: "/user_mpay_numbers",
  addMpay: "/user_mpay_numbers",
  updateMpay: "/user_mpay_numbers/{user_mpay_number}"
};

const MpayRequest = {
  getMpays() {
    return new Promise((resolve, reject) => {
      axios.get(api.getMpays).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  addMpay(data) {
    return new Promise((resolve, reject) => {
      axios.post(api.addMpay, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  updateMpay(id, data) {
    const url = api.updateMpay.replace("{user_mpay_number}", id);
    return new Promise((resolve, reject) => {
      axios.patch(url, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default MpayRequest;