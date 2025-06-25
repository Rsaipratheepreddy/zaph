'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Draggable } from 'gsap/dist/Draggable';
import styles from './Hero.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Draggable);
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Set card ref function
  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  // Setup draggable cards
  const setupDraggableCards = (cards: (HTMLDivElement | null)[]) => {
    const filteredCards = cards.filter(Boolean) as HTMLDivElement[];
    const container = cardsContainerRef.current;

    if (!container) return;

    // Set initial card positions - stacked with slight offset
    filteredCards.forEach((card, index) => {
      gsap.set(card, {
        x: index * 2,
        y: index * 2,
        scale: 1 - (index * 0.05),
        rotation: -2 + (index * 0.5),
        opacity: index === 0 ? 1 : 0.8 - (index * 0.1),
        zIndex: filteredCards.length - index,
        cursor: 'grab',
        transformOrigin: 'center center',
      });
    });

    // Make each card draggable
    filteredCards.forEach((card, index) => {
      // Create draggable instance for each card
      Draggable.create(card, {
        type: 'x,y',
        bounds: container,
        edgeResistance: 0.65,
        inertia: true,
        onDragStart: function () {
          // Bring card to front when dragging
          gsap.to(card, {
            zIndex: 100,
            scale: 1.05,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            duration: 0.2,
          });

          // Set as active card
          setActiveCardIndex(index);
        },
        onDrag: function () {
          // Add slight rotation based on velocity
          const rotation = this.getVelocity() / 200;
          gsap.to(card, {
            rotation: gsap.utils.clamp(-10, 10, rotation),
            duration: 0.2,
          });
        },
        onDragEnd: function () {
          // Animate card back to a natural position
          gsap.to(card, {
            boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
          });
        },
      });
    });

    // Add subtle floating effect to cards
    filteredCards.forEach((card, index) => {
      gsap.to(card, {
        y: '+=3',
        rotation: '+=1',
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        id: `float-${index}`,
      });
    });
  };

  useEffect(() => {
    // Initialize GSAP animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate heading elements
    tl.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
      .fromTo(
        subheadingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        descriptionRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      );

    // Get cards and ensure they're valid
    const cards = cardRefs.current.filter(Boolean);

    // Initial fade-in for cards
    cards.forEach((card, index) => {
      gsap.set(card, {
        opacity: 0,
        scale: 0.8,
        y: 20,
      });
    });

    // Fade in cards
    tl.to(cards, {
      opacity: 1,
      scale: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'back.out(1.2)',
      onComplete: () => {
        // Setup draggable cards after initial reveal
        setupDraggableCards(cards);
      },
    }, '-=0.2');

    // Mouse event handlers for cards
    const mouseEnterHandlers = Array(5)
      .fill(0)
      .map((_, index) => {
        return function handleMouseEnter() {
          const card = cardRefs.current[index];
          if (!card) return;

          // Pause floating animation
          const floatTl = gsap.getById(`float-${index}`);
          if (floatTl) floatTl.pause();

          // Elevate card on hover if not being dragged
          if (index !== activeCardIndex) {
            gsap.to(card, {
              y: '-=10',
              scale: 1.05,
              rotation: 0,
              duration: 0.3,
              ease: 'power2.out',
              zIndex: 50,
            });
          }
        };
      });

    const mouseLeaveHandlers = Array(5)
      .fill(0)
      .map((_, index) => {
        return function handleMouseLeave() {
          const card = cardRefs.current[index];
          if (!card) return;

          // Resume floating animation
          const floatTl = gsap.getById(`float-${index}`);
          if (floatTl) floatTl.resume();

          // Return to original state if not the active card
          if (index !== activeCardIndex) {
            gsap.to(card, {
              y: index * 2,
              scale: 1 - (index * 0.05),
              rotation: -2 + (index * 0.5),
              duration: 0.3,
              ease: 'power2.out',
              zIndex: 5 - index,
            });
          }
        };
      });

    cards.forEach((card, index) => {
      if (!card) return;

      card.addEventListener('mouseenter', mouseEnterHandlers[index]);
      card.addEventListener('mouseleave', mouseLeaveHandlers[index]);
    });

    return () => {
      // Kill all animations
      if (tl) tl.kill();

      // Kill floating animations
      cards.forEach((_, index) => {
        const floatTl = gsap.getById(`float-${index}`);
        if (floatTl) floatTl.kill();
      });

      // Remove all event listeners with proper references
      cards.forEach((card, index) => {
        if (card) {
          card.removeEventListener('mouseenter', mouseEnterHandlers[index]);
          card.removeEventListener('mouseleave', mouseLeaveHandlers[index]);
        }
      });

      // Kill ScrollTrigger instances
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      className={styles.hero}
      ref={heroRef}
      style={{
        backgroundImage: 'url(/home-banner-image.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay with more artistic gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)',
          zIndex: 0,
        }}
      ></div>
      <div className={styles.container}>
        <div className={styles.heroContent} ref={cardsContainerRef}>
          <h1 className={styles.heading} ref={headingRef}>
            <span className={styles.artColor}>ART</span>
            <span className={styles.techColor}>TECH</span>
            <span className={styles.musicColor}>MUSIC</span>
            <span className={styles.tattooColor}>TATTOO</span>
          </h1>
          <h2 className={styles.subheading} ref={subheadingRef}>
            A minimalistic artistic platform
          </h2>
          <p className={styles.description} ref={descriptionRef}>
            Explore the intersection of art, technology, music, and tattoos through our
            immersive digital experience. Discover new perspectives and creative expressions.
          </p>

          <div className={styles.cta}>
            <Link href="/art-wall" className={styles.primaryButton}>
              Explore Art Wall
            </Link>
            <Link href="#services" className={styles.secondaryButton}>
              Our Services
            </Link>
          </div>
        </div>

        <div className={styles.cardsContainer} ref={cardsContainerRef}>
          <div className={styles.card} ref={setCardRef(0)}>
            <div className={styles.cardImageContainer}>
              <Image
                src="/images/painting.jpg"
                alt="Art"
                width={300}
                height={400}
                className={styles.cardImage}
              />
            </div>
            <div className={`${styles.cardOverlay} ${styles.artOverlay}`}>
              <span className={styles.cardLabel}>Art</span>
            </div>
          </div>
          <div className={styles.card} ref={setCardRef(1)}>
            <div className={styles.cardImageContainer}>
              <Image
                src="/images/tech.jpg"
                alt="Technology"
                width={300}
                height={400}
                className={styles.cardImage}
              />
            </div>
            <div className={`${styles.cardOverlay} ${styles.techOverlay}`}>
              <span className={styles.cardLabel}>Tech</span>
            </div>
          </div>
          <div className={styles.card} ref={setCardRef(2)}>
            <div className={styles.cardImageContainer}>
              <Image
                src="/images/music.jpg"
                alt="Music"
                width={300}
                height={400}
                className={styles.cardImage}
              />
            </div>
            <div className={`${styles.cardOverlay} ${styles.musicOverlay}`}>
              <span className={styles.cardLabel}>Music</span>
            </div>
          </div>
          <div className={styles.card} ref={setCardRef(3)}>
            <div className={styles.cardImageContainer}>
              <Image
                src="/images/tatto.jpg"
                alt="Tattoo"
                width={300}
                height={400}
                className={styles.cardImage}
              />
            </div>
            <div className={`${styles.cardOverlay} ${styles.tattooOverlay}`}>
              <span className={styles.cardLabel}>Tattoo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
