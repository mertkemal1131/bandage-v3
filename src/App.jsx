import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import store from './store'
import Header from './layout/Header'
import Footer from './layout/Footer'
import PageContent from './layout/PageContent'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'   // ← your new About page
import ContactPage from './pages/ContactPage'
import TeamPage   from './pages/TeamPage'
import SignupPage from './pages/SignupPage'

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="w-full font-['Montserrat']">
          <Header />
          <PageContent>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/shop" component={ShopPage} />
              <Route path="/product/:id" component={ProductDetailPage} />
              <Route path="/cart" component={CartPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/team"   component={TeamPage}   />
              <Route path="/signup" component={SignupPage} />
            </Switch>
          </PageContent>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" theme="colored" />
      </Router>
    </Provider>
  )
}
