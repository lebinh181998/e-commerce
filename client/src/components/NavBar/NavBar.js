import { NavLink } from "react-router-dom";
import React from "react";
import classes from "./NavBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { accountActions } from "../../store/reducerAccount";
import useHttp from "../../hook/use-http";

const NavBar = () => {
  const isLogin = useSelector((state) => state.account.isLogin);
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();

  const { SendToServer, isLoading } = useHttp();

  const onLogout = (e) => {
    e.preventDefault();
    SendToServer("/logout", (data, err) => {
      if (!err) {
        dispatch(accountActions.ON_LOGOUT());
      }
    });
  };

  return (
    <div className={classes.navbar}>
      <div className={classes["navbar-left"]}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/shop"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
          end
        >
          Shop
        </NavLink>
      </div>
      <div className={classes["navbar-center"]}>
        <h4>BOUTIQUE</h4>
      </div>
      <div className={classes["navbar-right"]}>
        {isLogin ? (
          <>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              <i className={`fa fa-shopping-cart`}></i>Cart
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              <i className="fa fa-history"></i>History
            </NavLink>
            <NavLink to="/">
              <i className="fa fa-user"></i>
              <div className={classes["username"]}>
                <p>{user.username}</p>
                <i className="fa fa-sort-desc"></i>
              </div>
            </NavLink>
            <NavLink onClick={onLogout}>{`( Logout )`}</NavLink>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
            end
          >
            <i className="fa fa-user"></i>Login
          </NavLink>
        )}
      </div>
    </div>
  );
};
export default NavBar;
