'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLUListElement>(null);
  
  // Handle menu toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Animation for menu items
  useEffect(() => {
    if (!menuItemsRef.current) return;
    
    const menuItems = menuItemsRef.current.children;
    
    if (menuOpen) {
      gsap.fromTo(menuItems, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.5,
          ease: 'power3.out'
        }
      );
    }
  }, [menuOpen]);
  
  // Handle scroll animation for navbar
  useEffect(() => {
    if (!navRef.current) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const navLinks = navRef.current?.querySelectorAll('a');
      const logoContainer = navRef.current?.querySelector(`.${styles.logoContainer}`);
      
      if (scrollY > 50) {
        // Scrolled state
        gsap.to(navRef.current, {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          borderRadius: '0 0 30px 30px',
          padding: '0.8rem 0',
          duration: 0.3
        });
        
        // Change text color to black on scroll
        navLinks?.forEach(link => {
          if (!link.classList.contains(styles.active)) {
            gsap.to(link, {
              color: '#000',
              duration: 0.3
            });
          }
        });
        
        // Change logo text color on scroll
        const dimensionText = navRef.current?.querySelector(`.${styles.dimensionText}`);
        const lessText = navRef.current?.querySelector(`.${styles.lessText}`);
        
        if (dimensionText && lessText) {
          gsap.to(dimensionText, {
            color: getActiveColor(),
            duration: 0.3
          });
          gsap.to(lessText, {
            color: '#000',
            duration: 0.3
          });
        }
        
        // Transform logo container
        if (logoContainer) {
          gsap.to(logoContainer, {
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
            padding: '8px',
            width: '42px',
            height: '42px',
            duration: 0.3
          });
        }
        
        // Change hamburger color
        const hamburgerLines = navRef.current?.querySelectorAll(`.${styles.hamburger} span`);
        if (hamburgerLines) {
          hamburgerLines.forEach(line => {
            gsap.to(line, {
              backgroundColor: '#000',
              duration: 0.3
            });
          });
        }
      } else {
        // Top state
        gsap.to(navRef.current, {
          backgroundColor: 'rgba(255, 255, 255, 0)',
          boxShadow: 'none',
          borderRadius: '0',
          padding: '1.5rem 0',
          duration: 0.3
        });
        
        // Change text color to white when at top
        navLinks?.forEach(link => {
          if (!link.classList.contains(styles.active)) {
            gsap.to(link, {
              color: '#fff',
              duration: 0.3
            });
          }
        });
        
        // Change logo text color to white when at top
        const dimensionText = navRef.current?.querySelector(`.${styles.dimensionText}`);
        const lessText = navRef.current?.querySelector(`.${styles.lessText}`);
        
        if (dimensionText && lessText) {
          gsap.to(dimensionText, {
            color: '#fff',
            duration: 0.3
          });
          gsap.to(lessText, {
            color: '#fff',
            duration: 0.3
          });
        }
        
        // Reset logo container
        if (logoContainer) {
          gsap.to(logoContainer, {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            padding: '8px',
            width: '45px',
            height: '45px',
            duration: 0.3
          });
        }
        
        // Change hamburger color to white
        const hamburgerLines = navRef.current?.querySelectorAll(`.${styles.hamburger} span`);
        if (hamburgerLines) {
          hamburgerLines.forEach(line => {
            gsap.to(line, {
              backgroundColor: '#fff',
              duration: 0.3
            });
          });
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Get color based on current path
  const getActiveColor = () => {
    if (pathname.includes('/art')) return 'var(--art-color)';
    if (pathname.includes('/tech')) return 'var(--tech-color)';
    if (pathname.includes('/music')) return 'var(--music-color)';
    if (pathname.includes('/tattoo')) return 'var(--tattoo-color)';
    return '#000';
  };
  
  return (
    <nav className={styles.navigation} ref={navRef}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <Image 
              src="/images/logo.png" 
              alt="Dimensionless Logo" 
              width={40} 
              height={40} 
              className={styles.logoImage}
            />
          </div>
          <div className={styles.logoText}>
            <span className={styles.dimensionText}>DIMENSION</span><span className={styles.lessText}>LESS</span>
          </div>
        </Link>
        
        <div className={styles.menuToggle} onClick={toggleMenu}>
          <div className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <div className={`${styles.menu} ${menuOpen ? styles.open : ''}`} ref={menuRef}>
          <ul ref={menuItemsRef}>
            <li className={pathname === '/' ? styles.active : ''}>
              <Link href="/">Home</Link>
            </li>
            <li className={pathname.includes('/art') ? styles.active : ''}>
              <Link href="/art" style={{ color: pathname.includes('/art') ? 'var(--art-color)' : undefined }}>Art</Link>
            </li>
            <li className={pathname.includes('/tech') ? styles.active : ''}>
              <Link href="/tech" style={{ color: pathname.includes('/tech') ? 'var(--tech-color)' : undefined }}>Tech</Link>
            </li>
            <li className={pathname.includes('/music') ? styles.active : ''}>
              <Link href="/music" style={{ color: pathname.includes('/music') ? 'var(--music-color)' : undefined }}>Music</Link>
            </li>
            <li className={pathname.includes('/tattoo') ? styles.active : ''}>
              <Link href="/tattoo" style={{ color: pathname.includes('/tattoo') ? 'var(--tattoo-color)' : undefined }}>Tattoo</Link>
            </li>
            <li className={pathname === '/art-wall' ? styles.active : ''}>
              <Link href="/art-wall">Art Wall</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
