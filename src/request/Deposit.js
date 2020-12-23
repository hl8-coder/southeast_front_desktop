import axios from './Request';

const api = {
  getList: "/deposits",
  deposit: "/deposits",
  getCompanyList: "/deposits/company_bank_accounts"
};

const DepositRequest = {
  getList() {
    axios.get(api.getList, {}).then(res => {

    });
  },
  deposit(data) {
    return new Promise((resolve, reject) => {
      axios.post(api.deposit, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getCompanyList () {
    axios.get(api.getCompanyList).then(res => {

    });
  }
};

export default DepositRequest;