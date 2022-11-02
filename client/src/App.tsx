import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { Login, Register, Forgot, Reset } from "./pages/auth/AuthIndex";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getLoginStatus } from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import Maintenance from "./pages/maintenance/Maintenance";

import Terms from "./components/terms/Terms";
import Dashboard from "./components/dashboard/Dashboard";

import "aos/dist/aos.css";
import "./css/style.css";

import AOS from "aos";

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



  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

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
        <Route path="/maintenance:oncommand" element={<Maintenance />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
