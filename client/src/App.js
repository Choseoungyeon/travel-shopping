import LandinngPage from "./components/views/LandingPage/LandingPage"
import LoginPage from "./components/views/LoginPage/LoginPage"
import NavBar from "./components/views/NavBar/NavBar"
import RegisterPage from "./components/views/RegisterPage/RegisterPage"
import UploadProductPage from "./components/views/UploadProductPage/UploadProductPage"
import ProductDetailPage from "./components/views/ProductDetailPage/ProductDetailPage"
import ProductModifyPage from "./components/views/ProductModifyPage/ProductModifyPage"
import CartPage from "./components/views/CartPage/CartPage"
import Auth from './hoc/auth'
import {
  BrowserRouter as Router,
  Routes,
  Route,
}from "react-router-dom"


function App() {
  const NewLandingPage = Auth(LandinngPage, null);
  const NewLoginPage = Auth(LoginPage, false);
  const NewRegisterPage = Auth(RegisterPage, false)
  const NewUploadProductPage = Auth(UploadProductPage, true)
  const NewProductDetailPage = Auth(ProductDetailPage, true)
  const NewCartPage = Auth(CartPage, true)
  const NewProductModifyPage = Auth(ProductModifyPage, true)

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<NewLandingPage />}></Route>
        <Route path="/login" element={<NewLoginPage />}></Route>
        <Route path="/register" element={<NewRegisterPage />}></Route>
        <Route path="/product/upload" element={<NewUploadProductPage />}></Route>
        <Route path="/user/cart" element={<NewCartPage />}></Route>
        <Route path={`/product/:productId`} element={<NewProductDetailPage />}></Route>
        <Route path={`/product/modified/:productId`} element={<NewProductModifyPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
