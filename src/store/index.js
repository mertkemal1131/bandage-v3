import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

// ── Cart ──────────────────────────────────────────────────────────────────────
const cartInitial = { items: [], total: 0 };
function cartReducer(state = cartInitial, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const exists = state.items.find(i => i.id === action.payload.id);
      const items = exists
        ? state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.payload, qty: 1 }];
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'REMOVE_FROM_CART': {
      const items = state.items.filter(i => i.id !== action.payload);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'UPDATE_QTY': {
      const items = state.items.map(i => i.id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'CLEAR_CART':
      return cartInitial;
    default: return state;
  }
}

// ── Wishlist ──────────────────────────────────────────────────────────────────
function wishlistReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const exists = state.items.find(i => i.id === action.payload.id);
      return { items: exists ? state.items.filter(i => i.id !== action.payload.id) : [...state.items, action.payload] };
    }
    default: return state;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function authReducer(state = { user: null, loading: false, error: null }, action) {
  switch (action.type) {
    case 'AUTH_LOADING': return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS': return { user: action.payload, loading: false, error: null };
    case 'AUTH_FAIL': return { ...state, loading: false, error: action.payload };
    case 'LOGOUT': return { user: null, loading: false, error: null };
    default: return state;
  }
}

// ── Products ──────────────────────────────────────────────────────────────────
function productsReducer(state = { list: [], loading: false, filter: { category: 'all', sort: 'featured', search: '' } }, action) {
  switch (action.type) {
    case 'SET_FILTER': return { ...state, filter: { ...state.filter, ...action.payload } };
    default: return state;
  }
}

const rootReducer = combineReducers({ cart: cartReducer, wishlist: wishlistReducer, auth: authReducer, products: productsReducer });
const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
