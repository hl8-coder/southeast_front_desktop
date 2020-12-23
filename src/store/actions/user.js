import {SAVE_USER_INFO, SAVE_USER_TOKEN, DELETE_USER, RESET_TIP} from "../action-types";

let banlanceInterval = null
export default {
  saveUserInfo (userInfo) {
    return {
      type: SAVE_USER_INFO,
      payload: userInfo
    }
  },
  saveUserToken (token) {
    return {
      type: SAVE_USER_TOKEN,
      payload: token
    }
  },
  deleteUser () {
    clearInterval(banlanceInterval)
    return {
      type: DELETE_USER
    }
  },
  resetTip () {
    return {
      type: RESET_TIP
    }
  }
}
