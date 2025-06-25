'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import styles from './Footer.module.css';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!footerRef.current || !linksRef.current) return;
    
    const links = linksRef.current.querySelectorAll('a');
    
    // Animate links on hover
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          y: -3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
    
    // Animate footer elements on scroll
    gsap.fromTo(footerRef.current.querySelectorAll(`.${styles.footerColumn}`),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        }
      }
    );
    
    return () => {
      // Clean up event listeners
      links.forEach(link => {
        const clone = link.cloneNode(true);
        if (link.parentNode) {
          link.parentNode.replaceChild(clone, link);
        }
      });
    };
  }, []);
  
  return (
    <footer className={styles.footer} ref={footerRef}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerLogo}>
              <span className={styles.dimensionText}>DIMENSION</span>
              <span className={styles.lessText}>LESS</span>
            </h3>
            <p className={styles.footerDescription}>
              A minimalistic artistic platform blending art, technology, music, and tattoos with captivating animations.
            </p>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Services</h4>
            <div className={styles.footerLinks} ref={linksRef}>
              <Link href="/art">Art</Link>
              <Link href="/tech">Tech</Link>
              <Link href="/music">Music</Link>
              <Link href="/tattoo">Tattoo</Link>
              <Link href="/art-wall">Art Wall</Link>
            </div>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Connect</h4>
            <div className={styles.footerLinks}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Behance</a>
              <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">Dribbble</a>
              <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">SoundCloud</a>
            </div>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Newsletter</h4>
            <p className={styles.newsletterText}>
              Subscribe to our newsletter to receive updates on new art pieces, events, and more.
            </p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Dimensionless. All rights reserved.
          </p>
          <div className={styles.footerBottomLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
