import {
  SAVE_ANNOUNCEMENTS,
  SAVE_ANNOUNCEMENTS_CATEGORIES,
  SELECT_ANNOUNCEMENTS_CATEGORY,
  SWITCH_ANNOUNCEMENTS_MODAL,
  SWITCH_ANNOUNCEMENTS_POPUP
} from "../action-types";

export default {
  saveAnnouncements (announcements) {
    return {
      type: SAVE_ANNOUNCEMENTS,
      payload: announcements
    }
  },
  saveCategories (categories) {
    return {
      type: SAVE_ANNOUNCEMENTS_CATEGORIES,
      payload: categories
    }
  },
  selectCategory (categoryKey) {
    return {
      type: SELECT_ANNOUNCEMENTS_CATEGORY,
      payload: categoryKey
    }
  },
  switchModal (state) {
    return {
      type: SWITCH_ANNOUNCEMENTS_MODAL,
      payload: state
    }
  },
  switchPopup (state) {
    return {
      type: SWITCH_ANNOUNCEMENTS_POPUP,
      payload: state
    }
  }
}