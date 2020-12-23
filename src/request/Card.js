import axios from './Request';

const api = {
  getCards: "/user_bank_accounts?include=bank",
  addCard: "/user_bank_accounts?include=bank",
  updateCard: "/user_bank_accounts/{user_bank_account}?include=bank"
};

const CardRequest = {
  getCards() {
    return new Promise((resolve, reject) => {
      axios.get(api.getCards).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  addCard(data) {
    return new Promise((resolve, reject) => {
      axios.post(api.addCard, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  updateCard(bankAccount, data) {
    const url = api.updateCard.replace('{user_bank_account}', bankAccount);
    return new Promise((resolve, reject) => {
      axios.patch(url, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default CardRequest;