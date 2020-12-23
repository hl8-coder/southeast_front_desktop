import axios from './Request';

const api = {
  getDropList: "/drop_list/history_deposit_withdrawal",
  getDepositWithdrawal: "/history/deposit_withdrawal",
  getTransfer: "/history/fund_transfer",
  getAdjustment: "/history/adjustment",
  getPromoClaim: "/history/promotion_claim",
  getRebate: "/history/rebate"
};

const HistoryRequest = {
  getDropList() {
    return new Promise((resolve, reject) => {
      axios.get(api.getDropList).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getDepositWithdrawal(params) {
    return new Promise((resolve, reject) => {
      axios.get(api.getDepositWithdrawal, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getTransfer(params) {
    return new Promise((resolve, reject) => {
      axios.get(api.getTransfer, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getAdjustment(params) {
    return new Promise((resolve, reject) => {
      axios.get(api.getAdjustment, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getPromoClaim(params) {
    return new Promise((resolve, reject) => {
      axios.get(api.getPromoClaim, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getRebate(params) {
    return new Promise((resolve, reject) => {
      axios.get(api.getRebate, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default HistoryRequest;