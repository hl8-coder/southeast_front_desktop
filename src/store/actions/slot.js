import {SAVE_SLOT_VENDORS} from "../action-types";

export default {
  saveSlotVendors (vendors) {
    return {
      type: SAVE_SLOT_VENDORS,
      payload: vendors
    }
  }
}