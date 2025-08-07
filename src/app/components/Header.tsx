'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-lg sticky top-0 z-50 border-b border-white/20 shadow-lg   ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary rounded">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-cricket flex items-center justify-center">
            {/* Trophy SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 9v6m-4-6v6m1-6h2a2 2 0 002-2v-3H9v3a2 2 0 002 2zM18 5h-3a2 2 0 00-2 2v3h7v-3a2 2 0 00-2-2zM6 5H3a2 2 0 00-2 2v3h7V7a2 2 0 00-2-2z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-primary select-none">Cricket Scorer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Primary Navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMobileMenu}
              className="text-foreground hover:text-primary transition-colors ease-in-out duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons desktop */}
      
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => router.push('/login')}
              type="button"
              className="px-4 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg shadow-lg hover:from-primary/90 hover:to-accent/90 transition-transform duration-300 transform active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-6.518 3.752A1 1 0 017 13.993V8.007a1 1 0 011.234-.97l6.518 3.752a1 1 0 010 1.661z" />
              </svg>
              Start Scoring
            </button>
          </div>
        

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
        >
          {mobileMenuOpen ? (
            // Close icon (X)
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger menu icon
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-card/80 backdrop-blur-lg border-t border-white/20 shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobileMenu}
                className="text-foreground block px-3 py-2 rounded-md hover:bg-primary hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}

          
                <button
                  onClick={() => {
                    closeMobileMenu();
                    router.push('/login');
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    router.push('/login');
                  }}
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg shadow-lg hover:from-primary/90 hover:to-accent/90 transition-transform duration-300 transform active:scale-95"
                >
                  Start Scoring
                </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
