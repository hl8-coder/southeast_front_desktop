import {
  SAVE_ANNOUNCEMENTS,
  SAVE_ANNOUNCEMENTS_CATEGORIES,
  SELECT_ANNOUNCEMENTS_CATEGORY,
  SWITCH_ANNOUNCEMENTS_MODAL,
  SWITCH_ANNOUNCEMENTS_POPUP
} from "../action-types";

const initialState = {
  announcements: [],
  categories: [],
  selectedCategory: "",
  modalState: false,
  popupState: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: action.payload
      };
    case SAVE_ANNOUNCEMENTS_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    case SELECT_ANNOUNCEMENTS_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    case SWITCH_ANNOUNCEMENTS_MODAL:
      return {
        ...state,
        modalState: action.payload
      };
    case SWITCH_ANNOUNCEMENTS_POPUP:
      return {
        ...state,
        popupState: action.payload
      };
    default:
      return state;
  }
}