import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div>
      <NavBar />
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
          <div className="--flex-start">
            HERO ;Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Doloribus, libero reprehenderit ipsam hic fugit debitis vel! Numquam
            illum optio ipsam fugiat quis ut, mollitia repellat dignissimos qui
            similique error tempore!
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
