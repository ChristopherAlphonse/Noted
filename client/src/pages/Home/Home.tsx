import React from "react";

import Header from "../../partials/Header";
import HeroHome from "../../partials/HeroHome";
import FeaturesHome from "../../partials/Features";

import Footer from "../../partials/Footer";

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
