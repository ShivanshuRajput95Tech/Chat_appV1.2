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
    <footer className="mx-3 rounded-lg shadow md:mx-4" style={{ background: "var(--panel)", border: "1px solid var(--border)" }} aria-label="Site footer">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href="/" className="flex items-center space-x-3" aria-label="SwiftChat home">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="SwiftChat logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold" style={{ color: "var(--text-main)" }}>
              SwiftChat
            </span>
          </a>

          <nav aria-label="Footer links">
            <ul className="flex flex-wrap items-center gap-y-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              {footerLinks.map((link, index) => (
                <li key={link.label}>
                  <a href={link.href} className={`hover:underline ${index < footerLinks.length - 1 ? "me-4 md:me-6" : ""}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="my-6 sm:mx-auto lg:my-8" style={{ borderColor: "var(--border)" }} />

        <p className="block text-center text-sm" style={{ color: "var(--text-muted)" }}>
          © {currentYear} <a href="/" className="hover:underline">SwiftChat</a>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
