import LandinngPage from "./components/views/LandingPage/LandingPage"
import LoginPage from "./components/views/LoginPage/LoginPage"
import NavBar from "./components/views/NavBar/NavBar"
import RegisterPage from "./components/views/RegisterPage/RegisterPage"
import UploadProductPage from "./components/views/UploadProductPage/UploadProductPage"
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

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<NewLandingPage />}></Route>
        <Route path="/login" element={<NewLoginPage />}></Route>
        <Route path="/register" element={<NewRegisterPage />}></Route>
        <Route path="/product/upload" element={<NewUploadProductPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
