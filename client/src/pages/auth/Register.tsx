import React, { useState } from "react";

import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Header from "../../components/header/Header";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { name, email, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Passwords must be up to 6 characters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      name,
      email,
      password,
    };
    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      // console.log(data);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">
                  Welcome to{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400 italic">
                    {" "}
                    NOTED
                  </span>
                </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={register}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="name"
                      >
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        name="name"
                        value={name}
                        onChange={handleInputChange}
                        className="form-input w-full text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        className="form-input w-full text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Password"
                        required
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        className="form-input w-full text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Confirm Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        name="password2"
                        value={password2}
                        onChange={handleInputChange}
                        className="form-input w-full text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <button
                        type="submit"
                        className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-center mt-3">
                    By creating an account, you agree to the{" "}
                    <a className="underline" href="/terms">
                      terms & conditions
                    </a>
                    .
                  </div>
                </form>

                <div className="text-gray-600 text-center mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline transition duration-150 ease-in-out"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
