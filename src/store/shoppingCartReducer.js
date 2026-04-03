// ─────────────────────────────────────────────────────────────────────────────
// ACTION TYPES
// ─────────────────────────────────────────────────────────────────────────────
export const SET_CART    = 'shoppingCart/SET_CART';
export const SET_PAYMENT = 'shoppingCart/SET_PAYMENT';
export const SET_ADDRESS = 'shoppingCart/SET_ADDRESS';

// ─────────────────────────────────────────────────────────────────────────────
// ACTION CREATORS
// ─────────────────────────────────────────────────────────────────────────────
export const setCart    = (cart)    => ({ type: SET_CART,    payload: cart });
export const setPayment = (payment) => ({ type: SET_PAYMENT, payload: payment });
export const setAddress = (address) => ({ type: SET_ADDRESS, payload: address });

// ─────────────────────────────────────────────────────────────────────────────
// CART THUNK HELPERS  (read current state → derive new cart → dispatch setCart)
// Cart shape: [ { count: Number, product: Object }, … ]
// ─────────────────────────────────────────────────────────────────────────────
export const addToCart = (product) => (dispatch, getState) => {
  const cart = getState().shoppingCart.cart;
  const existing = cart.find(item => item.product.id === product.id);
  const newCart = existing
    ? cart.map(item =>
        item.product.id === product.id
          ? { ...item, count: item.count + 1 }
          : item
      )
    : [...cart, { count: 1, product }];
  dispatch(setCart(newCart));
};

export const removeFromCart = (productId) => (dispatch, getState) => {
  const cart = getState().shoppingCart.cart;
  dispatch(setCart(cart.filter(item => item.product.id !== productId)));
};

export const updateCartItemCount = (productId, count) => (dispatch, getState) => {
  if (count < 1) return;
  const cart = getState().shoppingCart.cart;
  dispatch(setCart(cart.map(item =>
    item.product.id === productId ? { ...item, count } : item
  )));
};

export const clearCart = () => (dispatch) => {
  dispatch(setCart([]));
};

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST  (kept as extra convenience — not in spec, but used across UI)
// ─────────────────────────────────────────────────────────────────────────────
export const TOGGLE_WISHLIST = 'wishlist/TOGGLE_WISHLIST';
export const toggleWishlist  = (product) => ({ type: TOGGLE_WISHLIST, payload: product });

function wishlistReducer(state = { items: [] }, action) {
  switch (action.type) {
    case TOGGLE_WISHLIST: {
      const exists = state.items.find(i => i.id === action.payload.id);
      return {
        items: exists
          ? state.items.filter(i => i.id !== action.payload.id)
          : [...state.items, action.payload],
      };
    }
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE  (spec-exact field names)
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  // [ { count: 1, product: { id, name, price, … } }, … ]
  cart:    [],
  payment: {},   // Object — payment info
  address: {},   // Object — selected address
};

// ─────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────
export default function shoppingCartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return { ...state, cart: action.payload };
    case SET_PAYMENT:
      return { ...state, payment: action.payload };
    case SET_ADDRESS:
      return { ...state, address: action.payload };
    default:
      return state;
  }
}

export { wishlistReducer };
