import axios from './Request';

const api = {
  bonuses: "/bonuses",
  applyBonus: "/promotions/{promotion}/claim",
  getPromoType: "/promotion_types",
  getPromoList: "/promotion_types/{code}/promotions",
  getPromoDetails: "/promotions/{promotion}"
};

const BonusRequest = {
  getBonuses(params) {
    return new Promise((resolve, reject) => {
      axios.get(api.bonuses, {
        params: params
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  applyBonus(id, data) {
    const url = api.applyBonus.replace("{promotion}", id);
    return new Promise((resolve, reject) => {
      axios.post(url, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getPromoType() {
    return new Promise((resolve, reject) => {
      axios.get(api.getPromoType).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error)
      });
    })
  },
  getPromoList(code) {
    const url = api.getPromoList.replace("{code}", code);
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  getPromoDetails(promoId) {
    const url = api.getPromoDetails.replace("{promotion}", promoId);
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  }
};

export default BonusRequest;