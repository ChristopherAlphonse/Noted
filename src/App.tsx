import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css";
import "../public/style.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Forgot, Login, Register, Reset } from "./pages/auth/AuthIndex";
import React, { useEffect } from "react";

import AOS from "aos";
import Dashboard from "./components/dashboard/dashboard";
import Home from "./pages/Home/Home";
import Maintenance from "./pages/maintenance/Maintenance";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import Terms from "./components/terms/Terms";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { getLoginStatus } from "./services/authService";
import { useDispatch } from "react-redux";

axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loginStatus = async () => {
      const status = await getLoginStatus();
      await console.log(`IsUserLogIn: ${status}`);
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
