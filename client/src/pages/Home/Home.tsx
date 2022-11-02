import React from "react";

import Header from "../../components/header/Header";
import HeroHome from "../../components/hero/HeroHome";
import FeaturesHome from "../../components/feature/Features";

import Footer from "../../components/footer/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <HeroHome />
        <FeaturesHome />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
