import React from "react";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Licensing", href: "#" },
  { label: "Contact", href: "#" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-4 rounded-lg bg-zinc-900 shadow" aria-label="Site footer">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/" className="mb-4 flex items-center space-x-3 sm:mb-0" aria-label="SwiftChat home">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="SwiftChat logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-white">SwiftChat</span>
          </a>

          <nav aria-label="Footer links">
            <ul className="mb-6 flex flex-wrap items-center gap-y-2 text-sm font-medium text-gray-400 sm:mb-0">
              {footerLinks.map((link, index) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`hover:underline ${index < footerLinks.length - 1 ? "me-4 md:me-6" : ""}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />

        <p className="block text-center text-sm text-gray-400">
          © {currentYear} <a href="/" className="hover:underline">SwiftChat</a>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
