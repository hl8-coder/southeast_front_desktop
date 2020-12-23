import {SELECT_LAN} from "../action-types";

const initialState = {
  currentLanKey: null,
  languageList: [{
    key: "en-US",
    currency: "USD",
    style: "en"
  }, {
    key: "vi-VN",
    currency: "VND",
    style: "vn"
  }, {
    key: "th-TH",
    currency: "THB",
    style: "th"
  }],
  defaultLanKey: "vi-VN"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_LAN:
      return {
        ...state,
        currentLanKey: action.payload
      };
    default:
      return state;
  }
}
