import axios from './Request';
import Utils from '../util/Utils';
const api = {
  getGamePlatforms: "/game_platform_products",
  getWallets: "/game_platforms/wallets",
  getWalletsBalance: "/game_platforms/{code}/balance",
  loginGame: "/games/{game}/login",
  tryGame: "/games/{game}/try_login",
  getBalance: "/game_platforms/{game_platform}/balance",
  transfer: "/game_platforms/transfer",
  getJackpot: "/game_platforms/jackpot",
  getGames: "/games",
  getHotGames: "/games/hot",
  getInvalidBet: "/games/invalid_bet",
  getGamesNoSolts: "/games/no_slot"
};

const GameRequest = {
  getGamePlatforms(type) {
    return new Promise((resolve, reject) => {
      axios.get(api.getGamePlatforms, {
        params: {
          type: type
        }
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getWallets() {
    return new Promise((resolve, reject) => {
      axios.get(api.getWallets).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getWalletsBalance(code) {
    const url = api.getWalletsBalance.replace("{code}", code);
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  loginGame(game) {
    let is_mobile_device = Utils.isMobile() ? 1 : 0;
    const url = api.loginGame.replace("{game}", game);
    return new Promise((resolve, reject) => {
      axios.post(url, {}, {headers: {
        'is-mobile-device': is_mobile_device,
        'Sec-Fetch-Mode': 'core',
        'Sec-Fetch-Site': 'cross-site'
      }}).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  tryGame(game) {
    let is_mobile_device = Utils.isMobile() ? 1 : 0;
    console.log(game)
    const url = api.tryGame.replace("{game}", game);

    return new Promise((resolve, reject) => {
      axios.post(url, {}, {headers: {
        'is-mobile-device': is_mobile_device,
        'Sec-Fetch-Mode': 'core',
        'Sec-Fetch-Site': 'cross-site'
      }}).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getBalance() {
    axios.get(api.getBalance).then(res => {

    });
  },
  transfer(data) {
    return new Promise((resolve, reject) => {
      axios.post(api.transfer, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getGames(data) {
    return new Promise((resolve, reject) => {
      axios.get(api.getGames, {
        params: data
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })

  },
  getGamesNoSolts(data) {
    return new Promise((resolve, reject) => {
      axios.get(api.getGamesNoSolts, {
        params: data
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  getJackpot() {
    return new Promise((resolve, reject) => {
      axios.get(api.getJackpot).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  getHotGames(data) {
    return new Promise((resolve, reject) => {
      axios.get(api.getHotGames, {
        params: data
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  getInvalidBet() {
    return new Promise((resolve, reject) => {
      axios.get(api.getInvalidBet).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  }
};

export default GameRequest;
