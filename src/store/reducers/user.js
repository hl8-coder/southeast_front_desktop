import {DELETE_USER, SAVE_USER_INFO, SAVE_USER_TOKEN, RESET_TIP} from "../action-types";

const initialState = {
  authTip: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER_INFO:
      return {
        ...state,
        userInfo: action.payload
      };
    case SAVE_USER_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case DELETE_USER:
      return {
        token: null,
        userInfo: null,
        authTip: false
      };
    case RESET_TIP:
      return {
        ...state,
        authTip: true
      };
    default:
      return state;
  }
}
