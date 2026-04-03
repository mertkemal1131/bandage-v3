// ─────────────────────────────────────────────────────────────────────────────
// ACTION TYPES
// ─────────────────────────────────────────────────────────────────────────────
export const SET_USER     = 'client/SET_USER';
export const SET_ROLES    = 'client/SET_ROLES';
export const SET_THEME    = 'client/SET_THEME';
export const SET_LANGUAGE = 'client/SET_LANGUAGE';

// ─────────────────────────────────────────────────────────────────────────────
// ACTION CREATORS
// ─────────────────────────────────────────────────────────────────────────────
export const setUser     = (user)     => ({ type: SET_USER,     payload: user });
export const setRoles    = (roles)    => ({ type: SET_ROLES,    payload: roles });
export const setTheme    = (theme)    => ({ type: SET_THEME,    payload: theme });
export const setLanguage = (language) => ({ type: SET_LANGUAGE, payload: language });

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE  (spec-exact field names)
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  user:        null,  // Object — logged-in user info
  addressList: [],    // Object Array
  creditCards: [],    // Object Array
  roles:       [],    // Object Array — fetched from API
  theme:       'light',
  language:    'en',
};

// ─────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────
export default function clientReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_ROLES:
      return { ...state, roles: action.payload };
    case SET_THEME:
      return { ...state, theme: action.payload };
    case SET_LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
}
