import {createStore} from "redux";
import rootReducer from "./reducers";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const user = cookies.get("HL8_AUTH_USER");
let persistReduxState = localStorage.getItem("HL8_STATES");
if (persistReduxState) {
  persistReduxState = JSON.parse(localStorage.getItem("HL8_STATES"));
  persistReduxState.user = user;
} else {
  persistReduxState = {};
}

const store = createStore(
  rootReducer,
  persistReduxState
);

store.subscribe(() => {
  const states = store.getState();
  let persistStates = {
    user: states.user,
    language: states.language,
    slot: states.slot
  };
  localStorage.setItem('HL8_STATES', JSON.stringify(persistStates));
  const domain = document.domain.replace("www.", ".");
  if (states.user.token) {
    cookies.set("HL8_AUTH_USER", states.user, { path: "/", domain });
  } else {
    cookies.remove("HL8_AUTH_USER", { path: "/", domain });
  }
});

export default store;