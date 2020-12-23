import {SELECT_LAN} from "../action-types";

export default {
  selectLan (lanKey) {
    window.location.reload();
    return {
      type: SELECT_LAN,
      payload: lanKey
    }
  }
}
