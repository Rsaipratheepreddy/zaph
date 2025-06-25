'use client';

import { useEffect, useRef, useLayoutEffect, forwardRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import styles from './Banner.module.css';
import Categories from './Categories';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

interface CardProps {
  image?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ image, className, style }, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.card} ${className || ''}`}
      style={style}
    >
      <div className={styles.cardImage} style={{ backgroundImage: `url(${image || '/images/placeholder.jpg'})` }}></div>
    </div>
  );
});

// Add display name for debugging
Card.displayName = 'Card';

export default function Banner() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLElement>(null);
  const bannerImageRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoriesSectionRef = useRef<HTMLDivElement>(null);

  // Set up refs for cards
  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    const title = titleRef.current;
    const banner = bannerRef.current;

    if (!header || !title || !banner) return;

    // Reset any existing animations
    gsap.killTweensOf(title.querySelectorAll('span'));
    gsap.killTweensOf(title.querySelector('p'));

    // Force initial state
    gsap.set(title.querySelectorAll('span'), { y: 100, opacity: 0 });
    gsap.set(title.querySelector('p'), { y: 30, opacity: 0 });

    // Initialize all cards with proper initial state
    cardRefs.current.forEach((card) => {
      if (card) {
        gsap.set(card, {
          scale: 0,
          opacity: 0,
          rotation: -5,
          transformOrigin: "center center"
        });
      }
    });

    // Initialize card animations
    const initCards = () => {
      const cardsElements = cardRefs.current.filter(Boolean);
      if (cardsElements.length === 0) return;

      // Create a master timeline for initial animations
      const masterTl = gsap.timeline();

      // Animate each card individually with staggered delay and strong bounce effect
      cardsElements.forEach((card, index) => {
        if (!card) return;

        // Pop-up animation with stronger bounce
        masterTl.to(card, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.5,
          ease: "elastic.out(1.2, 0.4)",
          delay: 0.1 * index // Shorter delay between cards
        }, index * 0.1); // Start each animation sooner
      });

      // Add floating animation to each card
      cardsElements.forEach((card, index) => {
        if (!card) return;

        const randomX = Math.random() * 20 - 10; // -10 to 10
        const randomY = Math.random() * 20 - 10; // -10 to 10
        const randomDuration = 3 + Math.random() * 2; // 3 to 5 seconds

        const floatTl = gsap.timeline({
          repeat: -1,
          yoyo: true,
          delay: 0.5 + (index * 0.15) + 1, // Start after appear animation
          id: `float-${index}`
        });

        floatTl.to(card, {
          x: `+=${randomX}`,
          y: `+=${randomY}`,
          rotation: randomX > 0 ? 3 : -3, // Slight rotation based on direction
          duration: randomDuration,
          ease: "sine.inOut"
        });
      });

      // Auto-shuffle animation
      startAutoShuffle(cardsElements);
    };

    // Auto-shuffle cards at regular intervals
    const startAutoShuffle = (cards: (HTMLDivElement | null)[]) => {
      if (cards.length < 2) return;

      // Function to get current positions of all cards
      const getCurrentPositions = () => {
        return cards.map(card => {
          if (!card) return { x: 0, y: 0 };
          return {
            x: parseFloat(gsap.getProperty(card, "x") as string) || 0,
            y: parseFloat(gsap.getProperty(card, "y") as string) || 0
          };
        });
      };

      // Function to generate random positions within container bounds
      const generateRandomPositions = () => {
        if (!cardsContainerRef.current) return getCurrentPositions();

        const containerRect = cardsContainerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        return cards.map(card => {
          if (!card) return { x: 0, y: 0 };
          const cardRect = card.getBoundingClientRect();

          // Calculate max bounds to keep cards within container
          const maxX = containerWidth - cardRect.width;
          const maxY = containerHeight - cardRect.height;

          return {
            x: Math.random() * maxX - maxX / 2,
            y: Math.random() * maxY / 2 - maxY / 4
          };
        });
      };

      // Function to shuffle cards
      const shuffleCards = () => {
        // Get current positions
        const currentPositions = getCurrentPositions();

        // Generate new random positions
        const newPositions = generateRandomPositions();

        // Create timeline for shuffle animation
        const shuffleTl = gsap.timeline();

        // Animate each card
        cards.forEach((card, index) => {
          if (!card) return;

          // Random values for varied animation
          const randomDuration = 1 + Math.random() * 0.5; // 1-1.5 seconds
          const randomDelay = Math.random() * 0.3; // 0-0.3 seconds delay
          const randomRotation = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 180; // -180 to 180 degrees

          // First scale up and start rotating
          shuffleTl.to(card, {
            scale: 1.1 + Math.random() * 0.1,
            rotation: randomRotation,
            duration: 0.5,
            ease: "power1.out",
            delay: randomDelay
          }, index * 0.05);

          // Then move to new position
          shuffleTl.to(card, {
            x: newPositions[index].x,
            y: newPositions[index].y,
            duration: randomDuration,
            ease: "power2.inOut"
          }, `>-0.3`);

          // Finally scale back down
          shuffleTl.to(card, {
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
          }, `>-0.2`);
        });
      };

      // Initial delay before first shuffle
      setTimeout(() => {
        // Do first shuffle
        shuffleCards();

        // Set interval for subsequent shuffles
        const intervalId = setInterval(shuffleCards, 5000); // Shuffle every 5 seconds

        // Clean up on unmount
        return () => clearInterval(intervalId);
      }, 2000); // Start sooner after page load
    };

    // Setup scroll-triggered animation to categories section
    const setupScrollAnimation = () => {
      if (!categoriesSectionRef.current) return;

      // Store original positions of cards for reverse animation
      const originalPositions = cardRefs.current.map(() => ({
        x: 0, // We'll use this as the base for GSAP animations
        y: 0,
        scale: 1,
        opacity: 1,
        rotation: 0
      }));

      // Create a master timeline for the scroll animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: categoriesSectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
          markers: false, // Set to true for debugging
          toggleActions: "play reverse restart reverse", // Important for reversing the animation
          onEnter: () => {
            // Pause floating animations when scrolling starts
            for (let i = 0; i < 5; i++) {
              const tl = gsap.getById(`float-${i}`);
              if (tl) tl.pause();
            }
          },
          onLeaveBack: () => {
            // Resume floating animations when scrolling back
            for (let i = 0; i < 5; i++) {
              const tl = gsap.getById(`float-${i}`);
              if (tl) tl.resume();
            }
          }
        }
      });

      // Map cards to their target categories
      const cardCategoryMap = [
        { cardIndex: 0, categoryId: 'design' }, // Design card
        { cardIndex: 1, categoryId: 'build' },  // Build card
        { cardIndex: 2, categoryId: 'grow' },   // Grow card
        { cardIndex: 3, categoryId: 'design' }, // Brand card
        { cardIndex: 4, categoryId: 'grow' }    // Marketing card
      ];

      // Animate each card to its target category
      cardCategoryMap.forEach(({ cardIndex, categoryId }) => {
        const card = cardRefs.current[cardIndex];
        if (!card) return;

        // Find the target category element
        const targetCategoryEl = document.getElementById(`category-${categoryId}`);
        if (!targetCategoryEl) return;

        // Find the fill element inside the target category
        const fillElement = targetCategoryEl.querySelector('[class*="categoryFill"]');
        if (!fillElement) return;

        // Get the target bounds for animation
        const getTargetPosition = () => {
          const targetBounds = targetCategoryEl.getBoundingClientRect();
          const cardBounds = card.getBoundingClientRect();

          return {
            x: targetBounds.left - cardBounds.left + (targetBounds.width / 2 - cardBounds.width / 2),
            y: targetBounds.top - cardBounds.top
          };
        };

        // Add to the scroll timeline - forward animation (scroll down)
        scrollTl.to(card, {
          x: () => getTargetPosition().x,
          y: () => getTargetPosition().y,
          scale: 1.2,
          rotation: 0,
          ease: "power2.inOut"
        }, cardIndex * 0.1);

        // When the card reaches its target position, animate the fill
        scrollTl.to(fillElement, {
          scaleY: 1,
          opacity: 0.95,
          ease: "power2.inOut",
          transformOrigin: "bottom center"
        }, ">-0.3"); // Slightly overlap with previous animation
      });
    };

    // Animate title elements
    const animateTitle = () => {
      if (!title) return;

      gsap.to(title.querySelectorAll('span'), {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      });

      const subtitleEl = title.querySelector('p');
      if (subtitleEl) {
        gsap.to(subtitleEl, {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power3.out"
        });
      }
    };

    // Execute animations with small delays to ensure DOM is ready
    setTimeout(initCards, 100); // Start card animations sooner
    setTimeout(setupScrollAnimation, 300);
    setTimeout(animateTitle, 100);

    // Create sticky header effect with improved scroll behavior
    ScrollTrigger.create({
      trigger: banner,
      start: "top top",
      end: "bottom top",
      pin: header,
      pinSpacing: false,
      onEnter: () => {
        gsap.to(header, {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          padding: '15px 5%',
          duration: 0.3
        });
      },
      onLeaveBack: () => {
        gsap.to(header, {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          padding: '20px 5%',
          duration: 0.3
        });
      }
    });

    // Make sure to clean up all animations and timeouts on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf(cardRefs.current.filter(Boolean));
    };
  }, []);

  return (
    <section
      className={styles.banner}
      ref={bannerRef}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
          zIndex: -1
        }}
      ></div>
      <header className={styles.header} ref={headerRef}>
        <div className={styles.logo}>
          <Image src="/logo.svg" alt="Logo" width={120} height={40} />
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>

      <div className={styles.content}>
        <div className={styles.title} ref={titleRef}>
          <h1>
            <span>We</span> <span>Build</span> <span>Digital</span> <span>Experiences</span>
          </h1>
          <p>Transforming ideas into exceptional digital solutions</p>
        </div>

        <div className={styles.cardsContainer} ref={cardsContainerRef}>
          <Card
            ref={setCardRef(0)}
            image="/images/card1.jpg"
            style={{ opacity: 0, scale: 0, transform: 'rotate(-5deg)' }}
          />
          <Card
            ref={setCardRef(1)}
            image="/images/card2.jpg"
            style={{ opacity: 0, scale: 0, transform: 'rotate(-5deg)' }}
          />
          <Card
            ref={setCardRef(2)}
            image="/images/card3.jpg"
            style={{ opacity: 0, scale: 0, transform: 'rotate(-5deg)' }}
          />
          <Card
            ref={setCardRef(3)}
            image="/images/card4.jpg"
            style={{ opacity: 0, scale: 0, transform: 'rotate(-5deg)' }}
          />
          <Card
            ref={setCardRef(4)}
            image="/images/card5.jpg"
            style={{ opacity: 0, scale: 0, transform: 'rotate(-5deg)' }}
          />
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <div className={styles.arrow}></div>
      </div>

      <Categories ref={categoriesSectionRef} />
    </section>
  );
}
