import React, { useContext } from "react";
import "./NavBar.css";
import wink from "../../images/wink.logo.png";
import { Link } from "react-router-dom";

import { LoginContext } from "../authentication/LoginProvider";

const Navbar = () => {
  const auth = useContext(LoginContext);

  const loggedInUser = auth.user;
  // const loading = auth.loading;
  return (
    <div className="navbar">
      <div className="container">
        <h1>
          <img className="wink" src={wink} alt="" width="50" />
        </h1>
        <ul>
          {loggedInUser && (
            <li>
              <p>
                <a className="menu" href="/">
                  HOME
                </a>
              </p>
            </li>
          )}
          {loggedInUser && (
            <li>
              <p>
                <a className="menu" href="/messaging">
                  MESSAGING
                </a>
              </p>
            </li>
          )}
          {loggedInUser && (
            <li>
              <p>
                <a className="menu" href="/">
                  CALENDAR
                </a>
              </p>
            </li>
          )}
          {loggedInUser && (
            <li>
              <p>
                <a className="menu" href="/">
                  TRAINING
                </a>
              </p>
            </li>
          )}

          <li>
            <p>
              <div>
                {" "}
                {!loggedInUser && (
                  <a href="/login">
                    <button className="btn">Login</button>
                  </a>
                )}
                {loggedInUser && (
                  <button className="btn" onClick={() => auth.logout()}>
                    Logout
                  </button>
                )}
              </div>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
