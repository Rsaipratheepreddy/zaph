'use client';

import { useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Categories.module.css';

// Create a safe version of useLayoutEffect that falls back to useEffect during SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryProps {
  title: string;
  color: string;
  services: string[];
}

const categories: CategoryProps[] = [
  {
    title: "DESIGN",
    color: "#FF9BCD", // Pink
    services: ["DISCOVERY", "WEB DESIGN", "USER EXPERIENCE DESIGN", "ACCESSIBLE DESIGN"]
  },
  {
    title: "BUILD",
    color: "#B8E986", // Green
    services: ["WEBSITE DEVELOPMENT", "CRAFT CMS", "SPEKTRIX INTEGRATION", "SHOPIFY DEVELOPMENT", "TECHNICAL SEO"]
  },
  {
    title: "GROW",
    color: "#50E3C2", // Teal
    services: ["PAID ADVERTISING (PPC)", "SEARCH ENGINE OPTIMISATION", "DIGITAL MARKETING", "CONTENT STRATEGY", "SOCIAL MEDIA"]
  }
];

interface CategoryTargetProps {
  id: string;
  color: string;
}

export const categoryTargets: CategoryTargetProps[] = [
  { id: 'design', color: '#FF9BCD' },
  { id: 'build', color: '#B8E986' },
  { id: 'grow', color: '#50E3C2' }
];

export default function Categories() {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const percentageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    const categoriesSection = categoriesRef.current;
    if (!categoriesSection) return;

    // Create a timeline for the category animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: categoriesSection,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
        // markers: false, // Removed markers for production
      }
    });

    // Set initial state for all fills
    fillRefs.current.forEach((fill) => {
      if (!fill) return;
      gsap.set(fill, { 
        scaleY: 0,
        transformOrigin: "bottom center"
      });
    });
    
    // Set initial state for all content
    categoryRefs.current.forEach((card) => {
      if (!card) return;
      const contentElement = card.querySelector(`.${styles.categoryContent}`);
      if (contentElement) {
        gsap.set(contentElement, { opacity: 0 });
      }
    });
    
    // Animate each category card with a fill effect and percentage counter
    categoryRefs.current.forEach((card, index) => {
      if (!card) return;
      
      const fillElement = fillRefs.current[index];
      const contentElement = card.querySelector(`.${styles.categoryContent}`);
      const percentageElement = percentageRefs.current[index];
      
      if (fillElement && contentElement && percentageElement) {
        // Create paint fill animation
        tl.to(fillElement, {
          scaleY: 1,
          duration: 0.5,
          ease: "power2.inOut",
          onUpdate: function() {
            const progress = Math.round(this.progress() * 100);
            percentageElement.textContent = `${progress}%`;
            
            // Make percentage more visible as it increases
            const opacity = 0.3 + (this.progress() * 0.7);
            percentageElement.style.opacity = opacity.toString();
          }
        }, index * 0.3)
        .to(contentElement, {
          opacity: 1,
          duration: 0.3,
          ease: "power1.inOut"
        }, index * 0.3 + 0.3);
      }
    });

    return () => {
      // Clean up ScrollTrigger
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section className={styles.categoriesSection} ref={categoriesRef} id="categories">
      <div className={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <div 
            key={category.title}
            className={styles.categoryCard}
            ref={(el: HTMLDivElement | null) => { categoryRefs.current[index] = el }}
            id={`category-${categoryTargets[index].id}`}
          >
            <div className={styles.cardPercentage} ref={(el: HTMLDivElement | null) => { percentageRefs.current[index] = el }}>0%</div>
            <div 
              className={styles.categoryFill} 
              style={{ backgroundColor: category.color }}
              ref={(el: HTMLDivElement | null) => { fillRefs.current[index] = el }}
            ></div>
            <div className={styles.categoryContent}>
              <h2 className={styles.categoryTitle}>{category.title}</h2>
              <p className={styles.categoryDescription}>
                {category.title === "DESIGN" && "We create stunning, user-friendly websites that engage visitors, build trust, and turn interest into action."}
                {category.title === "BUILD" && "We develop high-performing, scalable solutions that work seamlessly for your goals and your customers."}
                {category.title === "GROW" && "We help you attract, engage, and convert customers with data-driven marketing that delivers results."}
              </p>
              <ul className={styles.servicesList}>
                {category.services.map(service => (
                  <li key={service} className={styles.serviceItem}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
