'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from './EnhancedHero.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Card types
type Card = {
  id: number;
  type: 'art' | 'tech' | 'music' | 'tattoo';
  image: string;
  title: string;
  color: string;
};

export default function EnhancedHero() {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Card data
  const [cards] = useState<Card[]>([
    {
      id: 1,
      type: 'art',
      image: '/images/painting.jpg',
      title: 'ART',
      color: '#FF9BCD'
    },
    {
      id: 2,
      type: 'tech',
      image: '/images/tech.jpg',
      title: 'TECH',
      color: '#B8E986'
    },
    {
      id: 3,
      type: 'music',
      image: '/images/music.jpg',
      title: 'MUSIC',
      color: '#50E3C2'
    },
    {
      id: 4,
      type: 'tattoo',
      image: '/images/tatto.jpg',
      title: 'TATTOO',
      color: '#00a1ff'
    }
  ]);

  // Handle mouse movement for subtle parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };

      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.querySelectorAll(`.${styles.card}`);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (mousePosition.current.x - centerX) / centerX;
        const moveY = (mousePosition.current.y - centerY) / centerY;

        cards.forEach((card, index) => {
          // Different parallax depth for each card
          const depth = 0.03 + (index * 0.01);

          gsap.to(card, {
            x: moveX * 15 * depth,
            y: moveY * 15 * depth,
            rotateX: moveY * 2,
            rotateY: -moveX * 2,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Initialize canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Set up resize handler
        const handleResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Create minimalistic animated background
        let time = 0;
        let animationFrameId: number;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        // Track mouse position for background movement
        const handleBackgroundMouseMove = (e: MouseEvent) => {
          targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
          targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('mousemove', handleBackgroundMouseMove);

        // Color themes based on our services
        const colors = [
          { r: 255, g: 155, b: 205 }, // Art: Pink
          { r: 184, g: 233, b: 134 }, // Tech: Green
          { r: 80, g: 227, b: 194 },  // Music: Teal
          { r: 0, g: 161, b: 255 }    // Tattoo: Blue
        ];

        const animate = () => {
          // Smooth mouse movement
          mouseX += (targetMouseX - mouseX) * 0.05;
          mouseY += (targetMouseY - mouseY) * 0.05;

          // Clear canvas with a dark background
          ctx.fillStyle = 'rgba(15, 15, 20, 1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw minimalistic lines with mouse influence
          const lineCount = 8;
          const lineSpacing = canvas.height / (lineCount + 1);

          for (let i = 0; i < lineCount; i++) {
            const y = lineSpacing * (i + 1);
            const amplitude = 5 + (i % 3) * 5; // Varying amplitudes
            const frequency = 0.002 + (i % 4) * 0.001; // Varying frequencies
            const speed = 0.0005 + (i % 3) * 0.0002; // Varying speeds
            const colorIndex = i % 4;

            // Mouse influence on wave position
            const mouseInfluence = 15 * (i % 3 + 1);
            const offsetX = mouseX * mouseInfluence;
            const offsetY = mouseY * (mouseInfluence * 0.5);

            ctx.strokeStyle = `rgba(${colors[colorIndex].r}, ${colors[colorIndex].g}, ${colors[colorIndex].b}, 0.15)`;
            ctx.lineWidth = 1;

            ctx.beginPath();

            for (let x = 0; x < canvas.width; x += 2) {
              // Add mouse influence to the wave
              const waveY = Math.sin(x * frequency + time * speed + offsetX * 0.01) * amplitude;
              ctx.lineTo(x, y + waveY + offsetY);
            }

            ctx.stroke();
          }

          // Draw subtle dots with mouse influence
          const dotCount = 30;
          for (let i = 0; i < dotCount; i++) {
            // Base position with time-based animation
            let x = (Math.sin(time * 0.0003 + i * 0.3) * 0.5 + 0.5) * canvas.width;
            let y = (Math.cos(time * 0.0004 + i * 0.5) * 0.5 + 0.5) * canvas.height;

            // Add subtle mouse influence to dot positions
            const dotMouseInfluence = 20 * ((i % 4) + 1);
            x += mouseX * dotMouseInfluence;
            y += mouseY * dotMouseInfluence;

            const size = 1 + (i % 3);
            const colorIndex = i % 4;

            ctx.fillStyle = `rgba(${colors[colorIndex].r}, ${colors[colorIndex].g}, ${colors[colorIndex].b}, 0.2)`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }

          // Add very subtle grain
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const buffer = imageData.data;

          for (let i = 0; i < buffer.length; i += 40) { // Process fewer pixels for better performance
            const noise = Math.random() * 5 - 2.5;
            buffer[i] = Math.min(255, Math.max(0, buffer[i] + noise));
            buffer[i + 1] = Math.min(255, Math.max(0, buffer[i + 1] + noise));
            buffer[i + 2] = Math.min(255, Math.max(0, buffer[i + 2] + noise));
          }

          ctx.putImageData(imageData, 0, 0);

          time++;
          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('mousemove', handleBackgroundMouseMove);
          cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, []);

  // Initialize main animations
  useEffect(() => {
    // Main animation timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate heading
    tl.fromTo(
      headingRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
      0.2
    );

    // Animate subheading
    tl.fromTo(
      subheadingRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      0.6
    );

    // Animate description
    tl.fromTo(
      descriptionRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      0.8
    );

    // Animate cards
    if (cardsContainerRef.current) {
      const cardElements = cardsContainerRef.current.querySelectorAll(`.${styles.card}`);

      tl.fromTo(
        cardElements,
        {
          y: 50,
          opacity: 0,
          rotateY: 15,
          rotateX: 10,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power2.out'
        },
        0.4
      );

      // Add subtle floating animation to cards
      cardElements.forEach((card, index) => {
        gsap.to(card, {
          y: `+=${5 + index * 2}`,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2
        });
      });
    }

    // Animate buttons
    tl.fromTo(
      `.${styles.ctaButton}`,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.8 },
      1
    );

    // Scroll trigger for subtle parallax
    if (heroRef.current) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Fade out content on scroll
          gsap.to(`.${styles.content}`, {
            opacity: 1 - progress * 1.5,
            y: progress * 30,
            duration: 0.1,
            overwrite: 'auto'
          });
        }
      });
    }

    // Card hover animations
    const cards = document.querySelectorAll(`.${styles.card}`);
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.05,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });

    // Button hover animations
    const buttons = document.querySelectorAll(`.${styles.ctaButton}`);
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    return () => {
      // Cleanup animations
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Animated Background */}
      <div className={styles.backgroundContainer}>
        <canvas ref={canvasRef} className={styles.animatedBackground} />
      </div>

      {/* Content */}
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 ref={headingRef} className={styles.heading}>
            Artistic Expression
          </h1>

          <h2 ref={subheadingRef} className={styles.subheading}>
            Blending creativity across domains
          </h2>

          <p ref={descriptionRef} className={styles.description}>
            We create immersive experiences that blend artistic expression with cutting-edge technology,
            musical innovation, and the timeless art of tattooing.
          </p>

          <div className={styles.ctaContainer}>
            <Link href="/art-wall" className={styles.ctaButton}>
              Explore Art Wall
            </Link>
            <Link href="/services" className={`${styles.ctaButton} ${styles.secondaryCta}`}>
              Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div ref={cardsContainerRef} className={styles.cardsContainer}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} ${styles[card.type]}`}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardImageContainer}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className={styles.cardImage}
                />
              </div>
              <div
                className={styles.cardOverlay}
                style={{ backgroundColor: `${card.color}40` }} // 40 = 25% opacity
              />
              <h3 className={styles.cardTitle} style={{ color: card.color }}>
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}