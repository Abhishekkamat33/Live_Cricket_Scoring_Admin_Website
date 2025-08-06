import Link from "next/link";
import React from "react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "#demo" },
      { name: "API", href: "#api" },
    ],
    Support: [
      { name: "Help Center", href: "#help" },
      { name: "Contact Us", href: "#contact" },
      { name: "Community", href: "#community" },
      { name: "Status", href: "#status" },
    ],
    Company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
    ],
  };

  return (
    <footer className="relative z-10 bg-card/80 backdrop-blur-lg border-t border-white/20 text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              {/* Brand icon circle */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-[0_0_15px_hsl(var(--cricket-gold)/0.4)]">
                <span className="text-xl">🏏</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                Cricket Scorer
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-md">
              The ultimate cricket scoring platform trusted by teams, leagues,
              and cricket enthusiasts worldwide. Score smarter, analyze deeper,
              play better.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-muted-foreground max-w-md">
              <div className="flex items-center space-x-3">
                {/* Mail icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 flex-shrink-0 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a3 3 0 003.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                <span>support@cricketscorer.com</span>
              </div>

              <div className="flex items-center space-x-3">
                {/* Phone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 flex-shrink-0 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h.28a2 2 0 011.92 1.39l.72 1.9a2 2 0 01-.45 2.11l-1.38 1.38a11.042 11.042 0 005.516 5.516l1.38-1.38a2 2 0 012.11-.45l1.9.72A2 2 0 0119 18.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                  />
                </svg>
                <span>+1 (555) 123-4567</span>
              </div>

              <div className="flex items-center space-x-3">
                {/* MapPin icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 flex-shrink-0 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 22s8-4.5 8-11.5S13.657 2 12 2 4 6 4 10.5 12 22 12 22z"
                  />
                </svg>
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                {category}
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors duration-200 block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="my-10 border-white/20" />

        {/* Bottom bar with social icons and attribution */}
        <div className="flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm gap-6">
          <p>© {new Date().getFullYear()} Cricket Scorer. All rights reserved.</p>

          <div className="flex space-x-6">
            <a
              href="#"
              aria-label="Facebook"
              className="text-primary-foreground hover:text-primary transition-colors duration-200"
            >
              {/* Facebook SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.879v-6.987h-2.54v-2.892h2.54v-2.203c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.466h-1.26c-1.243 0-1.63.771-1.63 1.562v1.87h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 17 22 12z" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="text-primary-foreground hover:text-primary transition-colors duration-200"
            >
              {/* Twitter SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.98-2.48 9.14 9.14 0 01-2.92 1.12A4.52 4.52 0 0016.9 2c-2.52 0-4.56 2.03-4.56 4.53 0 .35.04.69.11 1.02A12.86 12.86 0 013 4.44a4.54 4.54 0 001.41 6.05 4.54 4.54 0 01-2.06-.57v.05c0 2.26 1.6 4.14 3.73 4.56a4.5 4.5 0 01-2.05.08 4.55 4.55 0 004.25 3.15A9.07 9.07 0 012 19.54a12.81 12.81 0 006.92 2.03c8.3 0 12.83-6.86 12.83-12.8 0-.2 0-.42-.02-.63A9.18 9.18 0 0023 3z" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="text-primary-foreground hover:text-primary transition-colors duration-200"
            >
              {/* Instagram SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3zm5 2a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.8-3.4a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="text-primary-foreground hover:text-primary transition-colors duration-200"
            >
              {/* YouTube SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M19.8 7.2s-.2-1.4-1.2-1.6c-1.1-.2-5.6-.2-5.6-.2s-4.5 0-5.6.2c-1 .2-1.2 1.6-1.2 1.6S6 9 6 10v4c0 1 .2 2 2 2l7.6-.1c1.8 0 1.8-2 1.8-2v-4c0-1-.2-2-2-2zM10 14V10l4 2-4 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-muted-foreground text-sm">
          Made with ❤️ by{" "}
          <Link
            href="https://github.com/AbhishekKumar-2002"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Abhishek Kumar
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
