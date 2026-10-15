// File: components/Navbar.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname();
  
  // Hide navbar on admin pages
  if (pathname.startsWith('/admin')) return null;

  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbarLogo, setShowNavbarLogo] = useState(false);
  const [pageVisibility, setPageVisibility] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoverDropdown, setHoverDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const isHomePage = pathname === '/';

  useEffect(() => {
    fetchPageVisibility();
  }, []);

  const fetchPageVisibility = async () => {
    try {
      const response = await fetch('/api/page-visibility');
      if (!response.ok) {
        console.error('Failed to fetch page visibility:', response.status);
        return;
      }
      const data = await response.json();
      setPageVisibility(data.settings || {});
    } catch (error) {
      console.error('Error fetching or parsing page visibility:', error.message);
    }
  };

  // Glass bar tightens and gains a shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setHoverDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!isHomePage) {
      setShowNavbarLogo(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowNavbarLogo(true);
      } else {
        setShowNavbarLogo(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const dropdowns = {
    about: {
      label: 'About',
      links: [
        { name: 'About Us', href: '/about', pageName: 'about' },
        { name: 'Group', href: '/group', pageName: 'group' },
      ]
    },
    platforms: {
      label: 'Platforms',
      links: [
        { name: 'Online Trading Portal', href: 'https://aibaxys.kenyaonlinetrading.com/ActiveTrader/#!/login/', external: true },
        { name: 'Agent Portal', href: 'https://aibaxys.kenyaonlinetrading.com/Agent/login', external: true },
        { name: 'Mobile Apps', href: '/platforms', pageName: 'platforms' },
      ]
    },
    services: {
      label: 'Services',
      links: [
        { name: 'Our Services', href: '/services', pageName: 'services' },
        { name: 'Leverage', href: '/leverage', pageName: 'leverage' },
        { name: 'Offshore Funds', href: '/global-markets', pageName: 'global-markets' },
        { name: 'Get Insured', href: 'https://katabima.io/?ref=AIBMAI1913', external: true },
      ]
    },
    fundAccount: {
      label: 'Fund Account',
      links: [
        { name: 'KSH', href: '/fund-account/local-stocks', pageName: 'fund-local-stocks' },
        { name: 'USD & GBP', href: '/fund-account/multi-currency', pageName: 'fund-multi-currency' },
        { name: 'International Equities & ETFs', href: '/fund-account/international-equities', pageName: 'fund-international' },
        { name: 'Offshore Funds', href: '/fund-account/offshore-funds', pageName: 'fund-offshore' },
      ]
    },
    ipo: {
      label: 'IPO',
      links: [
        { name: 'Quick Mart PLC IPO', href: '/ipo/quickmart', pageName: 'ipo-quickmart' },
        { name: 'Dangote Petroleum Refinery IPO', href: '/ipo/dangote', pageName: 'ipo-dangote' },
        { name: 'All IPOs', href: '/ipo', pageName: 'ipo' },
      ]
    }
  };

  const simpleNavLinks = [
    { name: 'Research', href: '/research', pageName: 'research' },
    { name: 'Downloads', href: '/downloads', pageName: 'downloads' },
    { name: 'IPO', dropdown: 'ipo', pageName: 'ipo' },
    { name: 'FAQ', href: '/faq', pageName: 'faq' },
    { name: 'Contact', href: '/contact', pageName: 'contact' },
  ];

  // A page is listed in the menu only if it is both accessible and shown in nav.
  const isVisibleInNav = (pageName) => {
    const visibility = pageVisibility[pageName];
    return !visibility || (visibility.showInNav !== false && visibility.isAccessible !== false);
  };

  const handleMouseEnter = (dropdownName) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoverDropdown(dropdownName);
    setOpenDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverDropdown(null);
      setOpenDropdown(null);
    }, 300);
  };

  return (
    <nav data-scrolled={scrolled ? "" : undefined} className="mx-navbar fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0a0a0f]/60 border-b border-gray-200/20 dark:border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 w-[180px]">
            <Image
              src={theme === 'dark' ? '/axys-logo-dark.png' : '/axys-logo-light.png'}
              alt="AXYS Investment Bank logo"
              width={180}
              height={60}
              className={`mx-navbar-logo h-12 w-auto ${showNavbarLogo ? 'opacity-100' : 'opacity-0'}`}
            />
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1 space-x-6" ref={dropdownRef}>
            <a href="/" className="text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-white transition-all duration-300 group-hover:w-full origin-left"></span>
            </a>

            <div className="relative" onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}>
              <button className="flex items-center space-x-1 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 relative group">
                <span className="relative">About<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-white transition-all duration-300 group-hover:w-full origin-left"></span></span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'about' && (
                <div className="absolute top-full left-0 mt-2 w-56 backdrop-blur-md bg-white/90 dark:bg-[#0a0a0f]/90 border border-gray-200/30 dark:border-white/10 rounded-lg shadow-xl overflow-hidden mx-dropdown-in">
                  {dropdowns.about.links.map((link) => {
                    const visibility = pageVisibility[link.pageName];
                    const shouldShow = !visibility || visibility.showInNav !== false;
                    if (!shouldShow) return null;
                    return (
                      <a key={link.name} href={link.href} className="block px-5 py-3 text-sm text-foreground dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-all duration-200">{link.name}</a>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => handleMouseEnter('platforms')} onMouseLeave={handleMouseLeave}>
              <a href="/platforms" className="flex items-center space-x-1 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 relative group">
                <span className="relative">Platforms<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-white transition-all duration-300 group-hover:w-full origin-left"></span></span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'platforms' ? 'rotate-180' : ''}`} />
              </a>
              {openDropdown === 'platforms' && (
                <div className="absolute top-full left-0 mt-2 w-64 backdrop-blur-md bg-white/90 dark:bg-[#0a0a0f]/90 border border-gray-200/30 dark:border-white/10 rounded-lg shadow-xl overflow-hidden mx-dropdown-in">
                  {dropdowns.platforms.links.map((link) => (
                    link.external ? (<a key={link.name} href={link.href} className="block px-5 py-3 text-sm text-foreground dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-all duration-200">{link.name}</a>) : (<a key={link.name} href={link.href} className="block px-5 py-3 text-sm text-foreground dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-all duration-200">{link.name}</a>)
                  ))}
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => handleMouseEnter('services')} onMouseLeave={handleMouseLeave}>
              <a href="/services" className="flex items-center space-x-1 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 relative group">
                <span className="relative">Services<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-white transition-all duration-300 group-hover:w-full origin-left"></span></span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
              </a>
              {openDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-2 w-56 backdrop-blur-md bg-white/90 dark:bg-[#0a0a0f]/90 border border-gray-200/30 dark:border-white/10 rounded-lg shadow-xl overflow-hidden mx-dropdown-in">
                  {dropdowns.services.links.map((link) => {
                    if (link.external) {
                      return (<a key={link.name} href={link.href} className="block px-5 py-3 text-sm text-foreground dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-all duration-200">{link.name}</a>);
                    }
                    const visibility = pageVisibility[link.pageName];
                    const shouldShow = !visibility || visibility.showInNav !== false;
                    if (!shouldShow) return null;
                    return (<a key={link.name} href={link.href} className="block px-5 py-3 text-sm text-foreground dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-all duration-200">{link.name}</a>);
                  })}
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => handleMouseEnter('fundAccount')} onMouseLeave={handleMouseLeave}>
              <button className="flex items-center space-x-1 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 relative group">
                <span className="relative">Fund Account<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-white transition-all duration-300 group-hover:w-full origin-left"></span></span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'fundAccount' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'fundAccount' && (
                <div className="absolute top-full left-0 mt-2 w-72 backdrop-blur-md bg-white/90 dark:bg-[#0a0a0f]/90 border border-gray-200/30 dark:border-white/10 rounded-lg shadow-xl overflow-hidden mx-dropdown-in">
                  {dropdowns.fundAccount.links.map((link) => {
                    const visibility = pageVisibility[link.pageName];
                    const shouldShow = !visibility || visibility.showInNav !== false;
                    if (!shouldShow) return null;
                    return (<a key={link.name} href={link.href} className="block px-5 py-3 text-sm text-foreground dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-all duration-200">{link.name}</a>);
                  })}
                </div>
              )}
            </div>

            {simpleNavLinks.map((link) => {
              const visibility = pageVisibility[link.pageName];
              const shouldShow = !visibility || visibility.showInNav !== false;
              if (!shouldShow) return null;
              if (link.dropdown) {
                const menu = dropdowns[link.dropdown];
                const items = menu.links.filter((item) => isVisibleInNav(item.pageName));
                if (items.length === 0) return null;
                return (
                  <div key={link.name} className="relative" onMouseEnter={() => handleMouseEnter(link.dropdown)} onMouseLeave={handleMouseLeave}>
                    <button className="flex items-center space-x-1 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 relative group">
                      <span className="relative">{menu.label}<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-white transition-all duration-300 group-hover:w-full origin-left"></span></span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === link.dropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.dropdown && (
                      <div className="absolute top-full left-0 mt-2 w-72 backdrop-blur-md bg-white/90 dark:bg-[#0a0a0f]/90 border border-gray-200/30 dark:border-white/10 rounded-lg shadow-xl overflow-hidden mx-dropdown-in">
                        {items.map((item) => (
                          <a key={item.name} href={item.href} className="block px-5 py-3 text-sm text-foreground dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-all duration-200">{item.name}</a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <a key={link.name} href={link.href} className="text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 relative group">
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-white transition-all duration-300 group-hover:w-full origin-left"></span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center space-x-4 w-[180px] justify-end">
            <button onClick={toggleTheme} className="p-2 rounded-lg glass hover:bg-primary/20 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Toggle theme">
              {theme === 'dark' ? (<Sun className="w-5 h-5 text-white" />) : (<Moon className="w-5 h-5 text-primary" />)}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg glass hover:bg-primary/20 dark:hover:bg-white/20 transition-all duration-300" aria-label="Toggle menu">
              {mobileMenuOpen ? (<X className="w-5 h-5 text-primary dark:text-white" />) : (<Menu className="w-5 h-5 text-primary dark:text-white" />)}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 mx-mobile-menu max-h-[calc(100vh-100px)] overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <a href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">Home</a>
              <div className="space-y-2"><div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">About</div>{dropdowns.about.links.map((link) => {
                const visibility = pageVisibility[link.pageName];
                const shouldShow = !visibility || visibility.showInNav !== false;
                if (!shouldShow) return null;
                return (<a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">{link.name}</a>);
              })}</div>
              <div className="space-y-2"><div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platforms</div>{dropdowns.platforms.links.map((link) => (link.external ? (<a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">{link.name}</a>) : (<a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">{link.name}</a>)))}</div>
              <div className="space-y-2"><div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Services</div>{dropdowns.services.links.map((link) => {
                if (link.external) {
                  return (<a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">{link.name}</a>);
                }
                const visibility = pageVisibility[link.pageName];
                const shouldShow = !visibility || visibility.showInNav !== false;
                if (!shouldShow) return null;
                return (<a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">{link.name}</a>);
              })}</div>
              <div className="space-y-2"><div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fund Account</div>{dropdowns.fundAccount.links.map((link) => {
                const visibility = pageVisibility[link.pageName];
                const shouldShow = !visibility || visibility.showInNav !== false;
                if (!shouldShow) return null;
                return (<a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">{link.name}</a>);
              })}</div>
              {simpleNavLinks.map((link) => {
                const visibility = pageVisibility[link.pageName];
                const shouldShow = !visibility || visibility.showInNav !== false;
                if (!shouldShow) return null;
                if (link.dropdown) {
                  const menu = dropdowns[link.dropdown];
                  const items = menu.links.filter((item) => isVisibleInNav(item.pageName));
                  if (items.length === 0) return null;
                  return (
                    <div key={link.name} className="space-y-2"><div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{menu.label}</div>{items.map((item) => (
                      <a key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">{item.name}</a>
                    ))}</div>
                  );
                }
                return (<a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground dark:text-white hover:text-primary dark:hover:text-white transition-colors duration-200 py-2">{link.name}</a>);
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
