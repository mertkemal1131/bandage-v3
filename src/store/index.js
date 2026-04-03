import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import logger from 'redux-logger';

import clientReducer       from './clientReducer';
import productReducer      from './productReducer';
import shoppingCartReducer from './shoppingCartReducer';
import { wishlistReducer } from './shoppingCartReducer';

// ─────────────────────────────────────────────────────────────────────────────
// Root reducer
// ─────────────────────────────────────────────────────────────────────────────
const rootReducer = combineReducers({
  client:       clientReducer,        // user, addressList, creditCards, roles, theme, language
  product:      productReducer,       // categories, productList, total, limit, offset, filter, fetchState
  shoppingCart: shoppingCartReducer,  // cart [{count, product}], payment, address
  wishlist:     wishlistReducer,      // items [] — UI convenience, not in spec
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// Only attach logger in development so production logs stay clean
// ─────────────────────────────────────────────────────────────────────────────
const middleware =
  process.env.NODE_ENV === 'development'
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────
const store = createStore(rootReducer, middleware);

export default store;
