// ─────────────────────────────────────────────────────────────────────────────
// ACTION TYPES
// ─────────────────────────────────────────────────────────────────────────────
export const SET_CATEGORIES   = 'product/SET_CATEGORIES';
export const SET_PRODUCT_LIST = 'product/SET_PRODUCT_LIST';
export const SET_TOTAL        = 'product/SET_TOTAL';
export const SET_FETCH_STATE  = 'product/SET_FETCH_STATE';
export const SET_LIMIT        = 'product/SET_LIMIT';
export const SET_OFFSET       = 'product/SET_OFFSET';
export const SET_FILTER       = 'product/SET_FILTER';

// ─────────────────────────────────────────────────────────────────────────────
// FETCH STATE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
export const FETCH_STATES = {
  NOT_FETCHED: 'NOT_FETCHED',
  FETCHING:    'FETCHING',
  FETCHED:     'FETCHED',
  FAILED:      'FAILED',
};

// ─────────────────────────────────────────────────────────────────────────────
// ACTION CREATORS
// ─────────────────────────────────────────────────────────────────────────────
export const setCategories  = (categories)  => ({ type: SET_CATEGORIES,   payload: categories });
export const setProductList = (productList) => ({ type: SET_PRODUCT_LIST, payload: productList });
export const setTotal       = (total)       => ({ type: SET_TOTAL,        payload: total });
export const setFetchState  = (fetchState)  => ({ type: SET_FETCH_STATE,  payload: fetchState });
export const setLimit       = (limit)       => ({ type: SET_LIMIT,        payload: limit });
export const setOffset      = (offset)      => ({ type: SET_OFFSET,       payload: offset });
export const setFilter      = (filter)      => ({ type: SET_FILTER,       payload: filter });

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE  (spec-exact field names)
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  categories:   [],            // Object Array
  productList:  [],            // Object Array
  total:        0,             // Number — total product count from API
  limit:        25,            // Number — products per page (default 25)
  offset:       0,             // Number — pagination offset (default 0)
  filter:       '',            // String — active filter/search string
  fetchState:   'NOT_FETCHED', // String — one of FETCH_STATES
};

// ─────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────
export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case SET_PRODUCT_LIST:
      return { ...state, productList: action.payload };
    case SET_TOTAL:
      return { ...state, total: action.payload };
    case SET_FETCH_STATE:
      return { ...state, fetchState: action.payload };
    case SET_LIMIT:
      return { ...state, limit: action.payload };
    case SET_OFFSET:
      return { ...state, offset: action.payload };
    case SET_FILTER:
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}
