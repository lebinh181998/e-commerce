import React from "react";
import classes from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { accountActions } from "../../../store/accountReducer";
import useHttp from "../../../hooks/use-http";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { SendToServer, isLoading } = useHttp();

  const onLogout = () => {
    SendToServer("/logout", (data, err) => {
      if (!err) {
        dispatch(accountActions.ON_LOGOUT());
      } else {
        alert(data.message);
      }
    });
  };

  return (
    <div className={`${classes.popup}`}>
      <p>MAIN</p>
      <ul>
        <li>
          <Link to="/admin">
            <i className="fa-solid fa-house text-primary me-2"></i>Dashboard
          </Link>
        </li>
      </ul>
      <p>LISTS</p>
      <ul>
        <li>
          <Link to="/admin/user">
            <i className="fa-solid fa-user text-primary me-2"></i>Users
          </Link>
        </li>
        <li>
          <Link to="/admin/products">
            <i className="fa-solid fa-hotel text-primary me-2"></i>Products
          </Link>
        </li>
        <li>
          <Link to="/admin/rooms">
            <i className="fa-solid fa-door-closed text-primary me-2"></i>Rooms
          </Link>
        </li>
      </ul>
      <p>NEW</p>
      <ul>
        <li>
          <Link to="/admin/new-product">
            <i className="fa-solid fa-hotel text-primary me-2"></i>New Product
          </Link>
        </li>
        <li>
          <Link to="/admin/new-room">
            <i className="fa-solid fa-door-closed text-primary me-2"></i>New
            Admin
          </Link>
        </li>
      </ul>
      <p>USER</p>
      <ul>
        <li>
          <button onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket text-primary me-2"></i>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
