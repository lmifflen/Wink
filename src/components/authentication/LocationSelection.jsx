/** Import resorces from files. It work as a "tools" to produce the functionality of the app. */
import React, {  useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider";
import Location from "./Location";
import { StoreContext } from "./StoreProvider";
import "./LocationSelection.css";


/** The Location methods must return a Promise. */
const StoreProvider = (props) => {
  const authContext = useContext(LoginContext);
  const storeContext = useContext(StoreContext);
  const user = authContext.user;
  const [allStores, setAllStores] = useState([]);
  const navigate = useNavigate();
  let userToSend = JSON.stringify(user);
  useEffect(() => {
    const getStore = async () => {
      // console.log("sending userId: " + userToSend);
      const response = await fetch("/api/storeselection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userToSend,
      });
      const userData = JSON.parse(await response.text());
      // console.log(response);
      setAllStores(userData);
      // console.log("we have the user data", userData);
    };
    getStore(userToSend);
  }, [userToSend]);
 
/** The Location methods must return a Promise. */
  const profiles = (profile) => {
    storeContext.setStore(profile);
    navigate("/home");
    // console.log("the selected profile is", profile);
  };
// console.log("this is the store context", storeContext)
  return (<div><h1 className="location-header"> Please select your location: </h1>
    
    <div className='location-container'>
      
      {allStores ? (
        allStores.map((profile, index) => {
          return (
            <button className='location-button'
              onClick={() => {
                profiles(profile);
              }}
            >
              <Location selectedProfile={profile} />
            </button>
          );
        })
      ) : (
        <div>Loading...</div>
      )}
    </div>
    </div>
  );
};

/** It's part of the ES6 module system thats defines a default export. In the case of Wink project StoreProvider. */
export default StoreProvider;
