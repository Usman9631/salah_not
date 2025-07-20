import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // For any custom styles
import './HeroSection.css';
import masjidImg from '../images/masjidpic.png';

const HeroSection = () => {
  return (
    <div className="hero-section-bg">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light py-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            <img src={masjidImg} alt="Masjid Logo" width="40" height="40" className="d-inline-block align-text-top rounded-circle me-2" />
            Växjö
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#">About Us</a></li>
              <li className="nav-item"><a className="nav-link" href="#">What We Do</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Events</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Donate</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Contact</a></li>
            </ul>
            <Link to="/login" className="btn btn-outline-primary ms-3">Login</Link>
            <button className="btn btn-warning ms-2">Donate Now</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold mb-3">Where Hearts Find Solace: Welcome To Växjö</h1>
              <p className="lead mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet dolor mauris suscipit felis pellentesque et, dolor. Tristique ipsum, mattis ut mauris nam dictum velit risus. Donec elementum suspendisse.</p>
              <button className="btn btn-warning btn-lg">Discover More</button>
            </div>
            {/* Remove the right-side image column */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection; 