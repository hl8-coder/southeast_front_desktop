import axios from './Request';

const api = {
  getList: "/withdrawals",
  withdrawal: "withdrawals",
  getWithdrawlDetails: "/withdrawals/{withdrawal}?include=bank",
  cancel: "/withdrawals/{withdrawal}"
};

const WithdrawalRequest = {
  getList() {
    axios.get(api.getList, {}).then(res => {

    });
  },
  withdrawal(data) {
    return new Promise((resolve, reject) => {
      axios.post(api.withdrawal, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getWithdrawlDetails(withdrawalId) {
    const url = api.getWithdrawlDetails.replace("{withdrawal}", withdrawalId);
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  cancelWithdrawal (withdrawalId) {
    const url = api.getWithdrawlDetails.replace("{withdrawal}", withdrawalId);
    return new Promise((resolve, reject) => {
      axios.delete(url).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default WithdrawalRequest;