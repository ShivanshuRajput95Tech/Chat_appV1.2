import React from "react";
import Hero from "../components/landing/Hero";
import LandingNav from "../components/landing/LandingNav";
import Footer from "../components/landing/Footer";
import Features from "../components/landing/Features";
import Payments from "../components/landing/Payments";
import CustomerLogos from "../components/landing/CustomerLogos";

const Home = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-main)", transition: "background-color .2s ease" }}>
      <LandingNav />
      <Hero />
      <Features />
      <Payments />
      <CustomerLogos />
      <Footer />
    </div>
  );
};

export default Home;
