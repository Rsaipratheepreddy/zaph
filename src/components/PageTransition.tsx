'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import styles from './PageTransition.module.css';

export default function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Determine the color based on the current path
  const getTransitionColor = () => {
    if (pathname?.includes('/art')) return 'var(--art-color)';
    if (pathname?.includes('/tech')) return 'var(--tech-color)';
    if (pathname?.includes('/music')) return 'var(--music-color)';
    if (pathname?.includes('/tattoo')) return 'var(--tattoo-color)';
    return '#ffffff'; // Default color
  };
  
  useEffect(() => {
    // Skip initial page load animation
    if (!overlayRef.current) return;
    
    const color = getTransitionColor();
    
    // Set the overlay color
    overlayRef.current.style.backgroundColor = color;
    
    // Animation timeline
    const tl = gsap.timeline();
    
    // Page transition in
    tl.fromTo(overlayRef.current, 
      { 
        y: '100%',
      },
      {
        y: '0%',
        duration: 0.5,
        ease: 'power3.inOut',
      }
    );
    
    // Page transition out
    tl.to(overlayRef.current, {
      y: '-100%',
      duration: 0.5,
      ease: 'power3.inOut',
      delay: 0.2
    });
    
    // Reset overlay position after animation completes
    tl.set(overlayRef.current, { y: '100%' });
    
    return () => {
      tl.kill();
    };
  }, [pathname]);
  
  return (
    <div className={styles.pageTransition} ref={overlayRef}></div>
  );
}
