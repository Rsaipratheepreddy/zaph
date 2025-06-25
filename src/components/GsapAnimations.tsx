'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GsapAnimations({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic GSAP animation setup
    const ctx = gsap.context(() => {
      // Fade in animation for page elements
      gsap.fromTo(
        '.gsap-fade-in',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' }
      );

      // Scroll trigger animations
      ScrollTrigger.batch('.gsap-scroll-trigger', {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out' }
          );
        },
        once: true,
      });
    }, mainRef);

    // Cleanup function
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="gsap-main">
      {children}
    </div>
  );
}
