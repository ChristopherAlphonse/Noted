import React from "react";
import { Link } from "react-router-dom";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <ShowOnLogout>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ShowOnLogout>
          <ShowOnLogout>
            <li>
              <button>
                <Link to="/login">Login</Link>
              </button>
            </li>
          </ShowOnLogout>
          <ShowOnLogin>
            <li>
              <button>
                <Link to="/dashboard">Welcome to Kansas</Link>
              </button>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>
      {/* HERO SECTION */}
      <section className="container hero">
        <div className="hero-text">
          {/* <div className="--flex-start">
            <NumberText num="14K" text="Brand Owners" />
            <NumberText num="23K" text="Active Users" />
            <NumberText num="500+" text="Partners" />
          </div> */}
        </div>
      </section>
    </div>
  );
};

// const NumberText = ({ num, text }) => {
//   return (
//     <div className="--mr">
//       <h3 className="--color-white">{num}</h3>
//       <p className="--color-white">{text}</p>
//     </div>
//   );
// };

export default Home;
