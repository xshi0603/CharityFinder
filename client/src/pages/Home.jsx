import React, { useContext } from "react";
import { UserContext } from "../utils/auth";
import "../styles/Home.css";

export const Home = () => {
  const { userData } = useContext(UserContext);

  return (
    <div className="home description">
      <h1 className="mt-0">CharityFinder</h1>
      <p>Remove the hassle of finding charitable organizations that you’re passionate about with CharityFinder</p>
      <p>Search through 1000s of charitable organizations</p>
      <p>Get recommendations for charities that match your passions</p>
      <p>Keep track of your favorite organizations</p>

      {userData && (
        <h3 className="user-info">
          {/* Firebase user auth verfication of current user logged in */}
          Current user signed in: {userData.firstName} {userData.lastName},{" "}
          {userData.email}
        </h3>
      )}
    </div>
  );
};
