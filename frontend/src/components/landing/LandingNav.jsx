import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";

const LandingNav = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-3" aria-label="SwiftChat home">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Swift Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold text-[var(--text-main)]">
            Swift-Chat
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
          style={{ border: "1px solid var(--border)", color: "var(--text-main)" }}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-5 w-5" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        <div className={`${isOpen ? "flex" : "hidden"} w-full flex-col gap-3 pt-4 md:flex md:w-auto md:flex-row md:items-center md:pt-0`}>
          <ThemeToggle />
          <Link to={isAuthenticated ? "/chathome" : "/login"} className="py-1 px-2 text-[var(--text-main)] hover:opacity-70">
            {isAuthenticated ? "Home" : "Login"}
          </Link>
          <Link to="/register" className="py-1 px-2 text-[var(--text-main)] hover:opacity-70">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
