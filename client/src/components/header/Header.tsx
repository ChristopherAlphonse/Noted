import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectName, SET_LOGIN } from "../../redux/features/auth/authSlice";
import { logoutUser } from "../../services/authService";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);

  const logout = async () => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };

  return (
    <div>
      <div>
        <h3>
          <span>Welcome, </span>
          <span>{name}</span>
        </h3>
        <button onClick={logout}>Logout</button>
      </div>
      <hr />
    </div>
  );
};

export default Header;
