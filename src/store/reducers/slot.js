import {SAVE_SLOT_VENDORS} from "../action-types";

export default (state = {}, action) => {
  switch (action.type) {
    case SAVE_SLOT_VENDORS:
      return {
        ...state,
        vendors: action.payload
      };
    default:
      return state;
  }
}