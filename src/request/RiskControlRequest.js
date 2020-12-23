import axios from './Request';

const api = {
  login: "/fraud_force/login",
  reg: "/fraud_force/register"
};

const RiskControlRequest = {
  login (data) {
    return new Promise((resolve, reject) => {
      axios.post(api.login, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  reg (data) {
    return new Promise((resolve, reject) => {
      axios.post(api.reg, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default RiskControlRequest;