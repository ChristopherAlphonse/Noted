import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { Login, Register, Forgot, Reset } from "./pages/auth/AuthIndex";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getLoginStatus } from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import PageNotFound from "./pages/pageNotFound/pageNotFound";
import React from "react";

axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loginStatus = async () => {
      const status = await getLoginStatus();
      dispatch(SET_LOGIN(status));
    };
    loginStatus();
  }, [dispatch]);
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/resetpassword/:resetToken" element={<Reset />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
