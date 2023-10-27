import React from "react";
import Banner from "./Banner/Banner";
import Category from "./Category/Category";
import Trending from "./Trending/Treanding";
import Other from "./Other/Other";

const HomePage = () => {
  return (
    <div className="home-page">
      <Banner />
      <Category />
      <Trending />
      <Other />
    </div>
  );
};
export default HomePage;
