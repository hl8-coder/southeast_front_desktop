import axios from './Request';

const api = {
  login: "/authorizations?include=info,account,vip,reward",
  fresh: "/authorizations/current",
  logout: "/authorizations/current",
  getTokenByCode: "/exchange/code",
  getHome: "/home",
};

const AuthRequest = {
  login(params) {
    return new Promise((resolve, reject) => {
      axios.post(api.login, params).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  fresh() {
    axios.put(api.fresh).then(res => {
      // todo
    })
  },
  logout() {
    return new Promise((resolve, reject) => {
      axios.delete(api.logout).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  getTokenByCode(code) {
    return new Promise((resolve, reject) => {
      axios.get(api.getTokenByCode, {
        params: {
          t_code: code
        }
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
  },
  getHome() {
    return new Promise((resolve, reject) => {
      axios.get(api.getHome).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  }
};

export default AuthRequest;
