import React from "react";
import Hero from "../components/landing/Hero";
import { useAuth } from "../context/AuthContext";
import LandingNav from "../components/landing/LandingNav";
import Footer from "../components/landing/Footer";
import Features from "../components/landing/Features";
import Payments from "../components/landing/Payments";
import CustomerLogos from "../components/landing/CustomerLogos";

const Home = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="bg-zinc-900">
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
