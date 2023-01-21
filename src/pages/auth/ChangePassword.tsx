import React, { useState } from "react";
import "./ChangePassword.scss";
import { toast } from "react-toastify";
import { changePassword } from "../../services/authService";

import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";

const initialState = {
  oldPassword: "",
  password: "",
  password2: "",
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const changePass = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      return toast.error("New passwords do not match");
    }

    const formData = {
      oldPassword,
      password,
    };

    const data = await changePassword(formData);
    toast.success(data);
    navigate("/dashboard");
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
                        Old Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Old Password"
                        required
                        name="oldPassword"
                        value={oldPassword}
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
                        New Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="New Password"
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
                        Confirm New Password{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm New Password"
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
                        Reset Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChangePassword;
