import { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import store from './store'
import axiosInstance from './api/axiosInstance'
import { setUser } from './store/clientReducer'
import { fetchCategories } from './store/thunks'
import Header from './layout/Header'
import Footer from './layout/Footer'
import PageContent from './layout/PageContent'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import TeamPage from './pages/TeamPage'
import SignupPage from './pages/SignupPage'

// ── AppContent ─────────────────────────────────────────────────────────────
// Separated from App so it sits inside <Provider> and can use useDispatch.
function AppContent() {
  const dispatch = useDispatch();

  // ── Categories — load once for all pages (Header dropdown, HomePage, ShopPage)
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ── Token verify on mount ────────────────────────────────────────────────
  // Spec:
  //  1. If token exists in localStorage:
  //       a. Put token in axios Authorization header (no Bearer prefix)
  //       b. GET /verify
  //          • success → put User in reducer, renew token in localStorage & header
  //          • failure → delete token from localStorage & header
  //  2. If no token → do nothing (user is a guest)
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return; // no stored session — nothing to do

    // a. Set token in axios header for this session (no Bearer prefix per spec)
    axiosInstance.defaults.headers.common['Authorization'] = token;

    // b. Verify with the API
    axiosInstance.get('/verify')
      .then(({ data }) => {
        // data is the User object; API also returns a fresh token inside it
        dispatch(setUser(data));

        // Renew: overwrite localStorage and header with the new token
        if (data.token) {
          localStorage.setItem('token', data.token);
          axiosInstance.defaults.headers.common['Authorization'] = data.token;
        }
      })
      .catch(() => {
        // Token is expired or invalid — clean up completely
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
      });
  }, [dispatch]);

  return (
    <Router>
      <div className="w-full font-['Montserrat']">
        <Header />
        <PageContent>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId" component={ProductDetailPage} />
            <Route path="/shop/:gender/:categoryName/:categoryId" component={ShopPage} />
            <Route path="/shop" component={ShopPage} />
            <Route path="/product/:id" component={ProductDetailPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/team" component={TeamPage} />
            <Route path="/signup" component={SignupPage} />
          </Switch>
        </PageContent>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </Router>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
// Owns the Redux Provider so AppContent (and everything inside it) can
// access the store via hooks.
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}