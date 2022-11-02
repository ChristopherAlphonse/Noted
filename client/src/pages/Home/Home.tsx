import React from "react";
import { Link } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import NavBar from "../../components/navbar/NavBar";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div>
      <NavBar />
      <Hero />
    </div>
  );
};

export default Home;
