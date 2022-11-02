import React from "react";
import { Logo } from "../../data";

const NavBar = () => {
  return (
    <nav className="bg-[#111827] px-2 sm:px-4 py-5 ">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/" className="flex items-center">
          <img src={Logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-[#9ca3af]">
            Noted
          </span>
        </a>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col p-4 mt-4  rounded-lg border md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0   bg-[#111827] text-[#9ca3af]">
            <li>
              <a
                href="/terms"
                type="button"
                className="text-white bg-[#24292F] hover:bg-[#30363d] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30  mb-2"
              >
                Terms and Conditions
              </a>
            </li>
            {/* <li>
              <a
                href="/login"
                type="button"
                className="text-white bg-[#24292F] hover:bg-[#30363d] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30  mb-2"
              >
                Login
              </a>
            </li>
            <li>
              <a
                href="/register"
                type="button"
                className="text-white bg-[#24292F] hover:bg-[#30363d] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30  mb-2"
              >
                Register
              </a>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
