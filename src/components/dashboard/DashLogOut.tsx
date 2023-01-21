import React from "react";
import Header from "../header/Header";

const DashLogOut = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />

        <main className="flex-grow">
          <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              {/* Hero content */}
              <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                {/* Section header */}
                <div className="text-center pt-12 md:pt-24">
                  <h1
                    className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
                    data-aos="zoom-y-out"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400 italic">
                      NOTED
                    </span>
                  </h1>
                  <div className="max-w-3xl mx-auto">
                    <p
                      className="text-xl text-gray-600 mb-8"
                      data-aos="zoom-y-out"
                      data-aos-delay="150"
                    >
                      It seems you're not logged in. Please sign in or sign up
                      to access our content.
                    </p>
                    <div
                      className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                      data-aos="zoom-y-out"
                      data-aos-delay="300"
                    >
                      <div>
                        <a
                          className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0"
                          href="/"
                        >
                          Home Page
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Copyrights note */}
        <div className="text-sm text-gray-600 mr-4 mb-2 flex justify-center">
          Made by{" "}
          <a className="text-blue-600 hover:underline" href="/">
            &nbsp; Noted
          </a>
          . All rights reserved.
        </div>
      </div>
    </>
  );
};

export default DashLogOut;
