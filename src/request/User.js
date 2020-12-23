import axios from './Request';

const api = {
  reg: "/users?include=info,account,vip,reward",
  getUserInfo: "/user?include=info,account,vip,reward",
  updateUserInfo: "/user?include=info,account,vip,reward",
  getUserBalance: "/user/balance",
  modifyPwd: "/user/password?include=info,account",
  forgotPass: "/user/forget_password",
  resetPwd: "/user/reset",
  sendPhoneCode: "/user/send_phone_code",
  sendEmailCode: "/user/send_email_code",
  verifyCode: "/user/verify_code",
  claimVerifyPrize: "/user/claim_verify_prize?include=info",
  checkUnique: "/users/check_field_unique",
  accessLogs: "/access_logs",
  getLanguage: "/auth/language"
};

const UserRequest = {
  reg(params) {
    return new Promise((resolve, reject) => {
      axios.post(api.reg, {
        ...params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getUserInfo() {
    return new Promise((resolve, reject) => {
      axios.get(api.getUserInfo).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  updateUserInfo(data) {
    return new Promise((resolve, reject) => {
      axios.patch(api.updateUserInfo, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getUserBalance () {
    return new Promise((resolve, reject) => {
      axios.get(api.getUserBalance).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  modifyPwd (data) {
    return new Promise((resolve, reject) => {
      axios.patch(api.modifyPwd, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  resetPwd () {
    axios.patch(api.resetPwd).then(res => {

    });
  },
  forgotPass (data) {
    return new Promise((resolve, reject) => {
      axios.patch(api.forgotPass, data).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  sendPhoneCode() {
    return new Promise((resolve, reject) => {
      axios.get(api.sendPhoneCode).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  sendEmailCode() {
    return new Promise((resolve, reject) => {
      axios.get(api.sendEmailCode).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  verifyCode (data) {
    return new Promise((resolve, reject) => {
      axios.post(api.verifyCode, data).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  claimVerifyPrize (data) {
    return new Promise((resolve, reject) => {
      axios.post(api.claimVerifyPrize, data).then((res) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  checkUnique (data) {
    return new Promise((resolve, reject) => {
      axios.patch(api.checkUnique, data).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  },
  accessLogs(data) {
    return new Promise((resolve, reject) => {
      axios.post(api.accessLogs, data).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  },
  getLanguage() {
    return new Promise((resolve, reject) => {
      axios.get(api.getLanguage).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
  }
};

export default UserRequest;
