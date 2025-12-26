import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <section className="home" id="home">
      <div className="home__content">
        <h1>Welcome to AgriConnect</h1>
        <p>
          Agri Connect is a hyperlocal and private hub for villages across the
          length and breadth of the country INDIA where rural user can interact
          with each other regarding matters concerning the local community.
          Revolutionizing agriculture by empowering farmers with direct access to
          marketplaces, personalized crop guidance, and real-time weather updates
          — all in one platform.
        </p>

        <ul className="home__features">
          <li>🌾 Sell produce directly to consumers and retailers</li>
          <li>📋 Get expert tips on crop care, soil, and seasonal farming</li>
          <li>🌦️ Stay updated with real-time weather alerts</li>
          <li>🛒 Explore local demand & prices through our marketplace</li>
        </ul>

        <div className="home__buttons">
          <Link to="/soilinfo" className="btn">Explore Soil Info</Link>
          {/* <a href="#market" className="btn btn--secondary">Visit Marketplace</a> */}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
