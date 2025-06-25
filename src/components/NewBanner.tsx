'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import styles from './NewBanner.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categoryTargets } from './Categories';

// Set z-index for proper card stacking
if (typeof window !== 'undefined') {
  gsap.config({
    force3D: true
  });
}

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Dimensionless() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const impactRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // Set up refs for cards
  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  useEffect(() => {
    // Handle header color change on scroll and progress bar
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      const totalScrollable = docHeight - windowHeight;
      const scrollProgress = Math.min(scrollTop / totalScrollable * 100, 100);

      setProgress(scrollProgress);

      if (window.scrollY > 50) {
        setScrolled(true);
        if (headerRef.current) {
          headerRef.current.style.backgroundColor = '#ffffff';
          headerRef.current.classList.add(styles.scrolled);
          const logoSpan = headerRef.current.querySelector(`.${styles.logo} span`);
          const navLinks = headerRef.current.querySelectorAll(`.${styles.nav} a`);

          if (logoSpan) {
            (logoSpan as HTMLElement).style.color = '#000000';
          }

          navLinks.forEach(link => {
            (link as HTMLElement).style.color = '#000000';
          });
        }
      } else {
        setScrolled(false);
        if (headerRef.current) {
          headerRef.current.style.backgroundColor = 'transparent';
          headerRef.current.classList.remove(styles.scrolled);
          const logoSpan = headerRef.current.querySelector(`.${styles.logo} span`);
          const navLinks = headerRef.current.querySelectorAll(`.${styles.nav} a`);

          if (logoSpan) {
            (logoSpan as HTMLElement).style.color = '#ffffff';
          }

          navLinks.forEach(link => {
            (link as HTMLElement).style.color = '#ffffff';
          });
        }
      }

      // Update progress bar
      if (progressRef.current) {
        progressRef.current.style.width = `${scrollProgress}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount

    // Initialize animations when component mounts
    const heading = headingRef.current;
    const impact = impactRef.current;
    const description = descriptionRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!heading || !impact || !description || cards.length === 0) return;

    // Reset any existing animations
    gsap.killTweensOf([heading, impact, description, ...cards]);

    // Create a timeline for the animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Set initial states
    gsap.set([heading, impact], {
      y: 50,
      opacity: 0
    });

    gsap.set(description, {
      y: 30,
      opacity: 0
    });

    // Set initial states for cards - stacked like in the first image
    cards.forEach((card, index) => {
      gsap.set(card, {
        x: index * 5,
        y: index * 5,
        opacity: 0,
        scale: 1 - (index * 0.02),
        rotation: -2 + (index * 1),
        zIndex: 5 - index
      });
    });

    // Animate heading and text elements
    tl.to(heading, { y: 0, opacity: 1, duration: 1 })
      .to(impact, { y: 0, opacity: 1, duration: 1 }, '-=0.7')
      .to(description, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
      // Animate cards from stacked hidden to visible positions - maintaining the stacked look
      .to(cards, {
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3')
      // Add a slight delay before the first shuffle
      .to({}, { duration: 0.5 })
      // First shuffle - fan out the cards slightly
      .to(cards, {
        x: (i) => 20 + (i * 15),
        y: (i) => 10 + (i * 10),
        rotation: (i) => -5 + (i * 2),
        scale: (i) => 1 - (i * 0.01),
        stagger: 0.08,
        duration: 0.8,
        ease: 'power2.inOut'
      });

    // Add shuffle animation that runs periodically
    const shuffleTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 4,
      delay: 2,
      id: 'shuffle-animation'
    });

    // Carousel shuffle animation sequence with blue glow effects
    shuffleTl
      // First move - fan out cards in a carousel style
      .to(cards, {
        x: (i) => 30 + (i * 20) - (i === 0 ? 50 : 0),
        y: (i) => i === 0 ? -30 : (i * 15),
        rotation: (i) => i === 0 ? -8 : (-3 + (i * 2)),
        scale: (i) => i === 0 ? 1.05 : (0.95 - (i * 0.02)),
        zIndex: (i) => i === 0 ? 10 : (5 - i),
        boxShadow: (i) => i === 0 ?
          '0 20px 40px rgba(0, 123, 189, 0.5), 0 0 25px rgba(0, 210, 255, 0.4)' :
          '0 10px 30px rgba(0, 123, 189, 0.3), 0 0 15px rgba(0, 210, 255, 0.2)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.inOut'
      })
      // Hold for a moment
      .to({}, { duration: 1 })
      // Second move - rotate the carousel (card at back comes to front)
      .to(cards, {
        x: (i, target) => {
          // Get the index of this card and calculate its new position
          // This simulates a carousel rotation where the last card comes to the front
          const newIndex = (i + 1) % cards.length;
          return newIndex === 0 ? -50 : (30 + (newIndex * 20));
        },
        y: (i, target) => {
          const newIndex = (i + 1) % cards.length;
          return newIndex === 0 ? -30 : (newIndex * 15);
        },
        rotation: (i, target) => {
          const newIndex = (i + 1) % cards.length;
          return newIndex === 0 ? -8 : (-3 + (newIndex * 2));
        },
        scale: (i, target) => {
          const newIndex = (i + 1) % cards.length;
          return newIndex === 0 ? 1.05 : (0.95 - (newIndex * 0.02));
        },
        zIndex: (i, target) => {
          const newIndex = (i + 1) % cards.length;
          return newIndex === 0 ? 10 : (5 - newIndex);
        },
        boxShadow: (i, target) => {
          const newIndex = (i + 1) % cards.length;
          return newIndex === 0 ?
            '0 20px 40px rgba(0, 123, 189, 0.5), 0 0 25px rgba(0, 210, 255, 0.4)' :
            '0 10px 30px rgba(0, 123, 189, 0.3), 0 0 15px rgba(0, 210, 255, 0.2)';
        },
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.inOut'
      })
      // Hold for a moment
      .to({}, { duration: 1 })
      // Return to original stacked position
      .to(cards, {
        x: (i) => i * 5,
        y: (i) => i * 5,
        rotation: (i) => -2 + (i * 1),
        scale: (i) => 1 - (i * 0.02),
        zIndex: (i) => 5 - i,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 123, 189, 0.3)',
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.inOut'
      });

    // Add floating animation to cards
    cards.forEach((card, index) => {
      if (!card) return;

      // Create continuous floating animation
      const floatTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        delay: 1 + (index * 0.2)
      });

      // Different floating animation for each card
      floatTl.to(card, {
        y: `+=${index * 5 + 10}`,
        rotationY: index % 2 === 0 ? 3 : -3,
        rotationX: index % 2 === 0 ? -2 : 2,
        duration: 2 + index * 0.5,
        ease: 'sine.inOut'
      }).to(card, {
        y: `+=${-(index * 5 + 10)}`,
        rotationY: index % 2 === 0 ? -3 : 3,
        rotationX: index % 2 === 0 ? 2 : -2,
        duration: 2 + index * 0.5,
        ease: 'sine.inOut'
      });

      // Create hover effect
      card.addEventListener('mouseenter', () => {
        // Pause the floating animation
        floatTl.pause();

        // Hover animation
        gsap.to(card, {
          y: (i) => (i * 40) - 15,
          scale: 1.05,
          zIndex: 10,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
          duration: 0.3
        });
      });

      card.addEventListener('mouseleave', () => {
        // Resume the floating animation
        floatTl.resume();

        // Reset to original state
        gsap.to(card, {
          y: index * 40,
          scale: 1,
          zIndex: 3 - index,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          duration: 0.3
        });
      });
    });

    // Create scroll animation for cards
    ScrollTrigger.create({
      trigger: cardsContainerRef.current,
      start: 'top 60%',
      end: 'bottom 20%',
      scrub: 1,
      onEnter: () => {
        // Fan out the cards when scrolling down
        gsap.to(cards, {
          x: (i) => (i - 1) * 150,
          y: (i) => (1 - i) * 30,
          rotationY: (i) => (i - 1) * 10,
          stagger: 0.1,
          duration: 1,
          ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        // Return to stacked position when scrolling back up
        gsap.to(cards, {
          x: 0,
          y: (i) => i * 40,
          rotationY: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power2.out'
        });
      }
    });

    // Create scroll animation to move cards from banner to categories section
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      // Create a timeline for each card to move to its corresponding category
      cards.forEach((card, index) => {
        // Get the target category element
        const categoryIndex = index % 3; // Cycle through the 3 categories
        const targetCategory = document.getElementById(`category-${categoryTargets[categoryIndex].id}`);

        if (card && targetCategory) {
          // Set initial z-index for proper stacking
          gsap.set(card, {
            zIndex: 100 - index
          });

          // Create ScrollTrigger for each card
          ScrollTrigger.create({
            trigger: categoriesSection,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
            markers: false,
            onUpdate: (self) => {
              // Calculate progress for animated percentage
              const progress = Math.round(self.progress * 100);
              const progressDisplay = card.querySelector(`.${styles.cardProgress}`);
              if (progressDisplay) {
                progressDisplay.textContent = `${progress}%`;

                // Make progress more visible as it increases
                const opacity = 0.3 + (self.progress * 0.7);
                (progressDisplay as HTMLElement).style.opacity = opacity.toString();
              }
            },
            animation: gsap.timeline()
              .to(card, {
                x: () => {
                  // Get the global positions to calculate the movement
                  const cardRect = card.getBoundingClientRect();
                  const targetRect = targetCategory.getBoundingClientRect();
                  return targetRect.left - cardRect.left + (targetRect.width / 2 - cardRect.width / 2);
                },
                y: () => {
                  const cardRect = card.getBoundingClientRect();
                  const targetRect = targetCategory.getBoundingClientRect();
                  // Adjust the position to account for scroll
                  return targetRect.top - cardRect.top + window.scrollY;
                },
                scale: 0.9,
                rotation: 0,
                zIndex: 50 - index,
                duration: 1,
                ease: 'power2.inOut'
              })
              .to(card.querySelector(`.${styles.cardOverlay}`), {
                backgroundColor: categoryTargets[categoryIndex].color,
                opacity: 0.7,
                duration: 0.5
              }, '<')
          });
        }
      });
    }

    // Store event handlers for proper cleanup
    const mouseEnterHandlers: Array<(e: MouseEvent) => void> = [];
    const mouseLeaveHandlers: Array<(e: MouseEvent) => void> = [];

    cards.forEach((card, index) => {
      if (!card) return;

      const handleMouseEnter = () => {
        // Find and pause the floating timeline
        const floatTl = gsap.getById(`float-${index}`);
        if (floatTl) floatTl.pause();

        gsap.to(card, {
          y: (i) => (i * 40) - 15,
          scale: 1.05,
          zIndex: 10,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
          duration: 0.3
        });
      };

      const handleMouseLeave = () => {
        // Find and resume the floating timeline
        const floatTl = gsap.getById(`float-${index}`);
        if (floatTl) floatTl.resume();

        gsap.to(card, {
          y: index * 40,
          scale: 1,
          zIndex: 3 - index,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          duration: 0.3
        });
      };

      // Store handlers for cleanup
      mouseEnterHandlers[index] = handleMouseEnter;
      mouseLeaveHandlers[index] = handleMouseLeave;

      // Add event listeners
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      // Create continuous floating animation with ID for reference
      const floatTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        delay: 1 + (index * 0.2),
        id: `float-${index}`
      });

      // Different floating animation for each card
      floatTl.to(card, {
        y: `+=${index * 5 + 10}`,
        rotationY: index % 2 === 0 ? 3 : -3,
        rotationX: index % 2 === 0 ? -2 : 2,
        duration: 2 + index * 0.5,
        ease: 'sine.inOut'
      }).to(card, {
        y: `+=${-(index * 5 + 10)}`,
        rotationY: index % 2 === 0 ? -3 : 3,
        rotationX: index % 2 === 0 ? 2 : -2,
        duration: 2 + index * 0.5,
        ease: 'sine.inOut'
      });
    });

    // Clean up animations on unmount
    return () => {
      // Kill all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      // Kill all GSAP animations
      gsap.killTweensOf([heading, impact, description, ...cards]);

      // Kill the shuffle timeline
      const shuffleTimeline = gsap.getById('shuffle-animation');
      if (shuffleTimeline) shuffleTimeline.kill();

      // Kill all floating timelines by ID
      cards.forEach((_, index) => {
        const tl = gsap.getById(`float-${index}`);
        if (tl) tl.kill();
      });

      // Remove all event listeners with proper references
      cards.forEach((card, index) => {
        if (card) {
          card.removeEventListener('mouseenter', mouseEnterHandlers[index]);
          card.removeEventListener('mouseleave', mouseLeaveHandlers[index]);
        }
      });
    };
  }, []);

  return (
    <section className={styles.banner} ref={bannerRef} id="banner">
      <header className={styles.header} ref={headerRef} style={{ backgroundColor: scrolled ? '#ffffff' : 'transparent', boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none' }}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} ref={progressRef} style={{ width: `${progress}%` }}></div>
        </div>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="DIMENSIONLESS" width={48} height={48} />
            <span>DIMENSIONLESS</span>
          </div>
          <nav className={styles.nav}>
            <ul>
              <li><a href="#">Work</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Solutions</a></li>
              <li><a href="#">Insights</a></li>
              <li><a href="#">Technology</a></li>
              <li><a href="#">Company</a></li>
            </ul>
          </nav>
          <button className={styles.ctaButton}>Let&apos;s talk</button>
        </div>
      </header>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading} ref={headingRef}>GENUINE.</h1>
          <h1 className={styles.impact} ref={impactRef}>IMPACT.</h1>
          <p className={styles.description} ref={descriptionRef}>
            We are an industry-leading digital marketing agency
            partnering with bold brands to drive impact across every
            stage of the customer journey - maximizing it, measuring it,
            and repeating it.
          </p>

          <div className={styles.clients}>
            <span>COTOPAX1</span>
            <span>ENDOWTE</span>
            <span>NIKE</span>
            <span>COCA-COLA</span>
          </div>
        </div>

        <div className={styles.cardsContainer} ref={cardsContainerRef}>
          <div className={styles.card} ref={setCardRef(0)}>
            <div className={styles.cardImageContainer}>
              <Image
                src="/images/tatto.jpg"
                alt="Tattoo Art"
                width={300}
                height={400}
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardOverlay}>
              <span className={styles.cardLabel}>Tattoo</span>
              <div className={styles.cardProgress}>0%</div>
            </div>
          </div>
          <div className={styles.card} ref={setCardRef(1)}>
            <div className={styles.cardImageContainer}>
              <Image
                src="/images/painting.jpg"
                alt="Painting Art"
                width={300}
                height={400}
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardOverlay}>
              <span className={styles.cardLabel}>Painting</span>
              <div className={styles.cardProgress}>0%</div>
            </div>
          </div>
          <div className={styles.card} ref={setCardRef(2)}>
            <div className={styles.cardImageContainer}>
              <Image
                src="/images/tech.jpg"
                alt="Technology"
                width={300}
                height={400}
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardOverlay}>
              <span className={styles.cardLabel}>Technology</span>
              <div className={styles.cardProgress}>0%</div>
            </div>
          </div>
          <div className={styles.card} ref={setCardRef(3)}>
            <div className={styles.cardImageContainer}>
              <Image
                src="/images/music.jpg"
                alt="Music"
                width={300}
                height={400}
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardOverlay}>
              <span className={styles.cardLabel}>Music</span>
              <div className={styles.cardProgress}>0%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
