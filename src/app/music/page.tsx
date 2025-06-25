'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Sample music projects
const musicProjects = [
  {
    id: 1,
    title: 'Sound Installation',
    description: 'An immersive audio experience that responds to the physical space and visitor movement.',
    image: '/images/music.jpg',
    tags: ['Spatial Audio', 'Interactive', 'Installation']
  },
  {
    id: 2,
    title: 'Experimental Album',
    description: 'A collection of compositions exploring the boundaries between music, noise, and silence.',
    image: '/images/tech.jpg',
    tags: ['Experimental', 'Electronic', 'Composition']
  },
  {
    id: 3,
    title: 'Visual Music',
    description: 'Audiovisual compositions where sound and image are intrinsically linked.',
    image: '/images/painting.jpg',
    tags: ['Audiovisual', 'Synesthesia', 'Performance']
  },
  {
    id: 4,
    title: 'Algorithmic Composition',
    description: 'Music created through generative processes and algorithmic systems.',
    image: '/images/tatto.jpg',
    tags: ['Generative', 'Algorithm', 'AI']
  }
];

export default function MusicPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Set project ref function
  const setProjectRef = (index: number) => (el: HTMLDivElement | null) => {
    projectRefs.current[index] = el;
  };
  
  useEffect(() => {
    // Animate header elements
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
    
    // Animate sound wave
    if (waveRef.current) {
      gsap.to(waveRef.current, {
        scaleY: 1.2,
        yoyo: true,
        repeat: -1,
        duration: 1.5,
        ease: 'sine.inOut'
      });
    }
    
    // Animate projects on scroll
    if (projectsRef.current) {
      const projects = projectRefs.current.filter(Boolean);
      
      projects.forEach((project, index) => {
        if (!project) return;
        
        gsap.fromTo(project,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2 * index,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: project,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none none'
            }
          }
        );
        
        // Create hover animation with music-inspired effect
        project.addEventListener('mouseenter', () => {
          gsap.to(project.querySelector(`.${styles.projectImage}`), {
            scale: 1.05,
            filter: 'hue-rotate(30deg)',
            duration: 0.3
          });
          
          gsap.to(project.querySelector(`.${styles.projectDetails}`), {
            y: 0,
            opacity: 1,
            duration: 0.3
          });
        });
        
        project.addEventListener('mouseleave', () => {
          gsap.to(project.querySelector(`.${styles.projectImage}`), {
            scale: 1,
            filter: 'hue-rotate(0deg)',
            duration: 0.3
          });
          
          gsap.to(project.querySelector(`.${styles.projectDetails}`), {
            y: 20,
            opacity: 0,
            duration: 0.3
          });
        });
      });
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
  
  return (
    <>
      <Navigation />
      <main className={styles.musicPage}>
        <header className={styles.header} ref={headerRef}>
          <div className={styles.headerContent}>
            <h1 ref={titleRef}>MUSIC</h1>
            <p className={styles.headerDescription}>
              Experience sound as an art form. Our music services blend composition,
              technology, and spatial design to create immersive sonic experiences
              that resonate with audiences in unexpected ways.
            </p>
          </div>
          <div className={styles.soundWave} ref={waveRef}>
            {[...Array(20)].map((_, i) => (
              <div key={i} className={styles.bar} style={{ 
                height: `${Math.random() * 60 + 20}%`,
                animationDelay: `${Math.random() * 0.5}s`
              }}></div>
            ))}
          </div>
        </header>
        
        <section className={styles.services}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Music Services</h2>
            <div className={styles.servicesList}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5.5" cy="17.5" r="2.5"></circle>
                    <circle cx="18.5" cy="17.5" r="2.5"></circle>
                    <path d="M5.5 17.5V6.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11"></path>
                    <line x1="8" y1="9" x2="16" y2="9"></line>
                    <line x1="8" y1="13" x2="16" y2="13"></line>
                  </svg>
                </div>
                <h3>Composition & Production</h3>
                <p>Original music composition and production for various contexts, from installations to performances.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                </div>
                <h3>Sound Design</h3>
                <p>Crafting sonic identities and soundscapes for brands, spaces, and interactive experiences.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                </div>
                <h3>Spatial Audio</h3>
                <p>Immersive audio experiences that respond to space, movement, and interaction.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="14" x2="23" y2="14"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="14" x2="4" y2="14"></line>
                  </svg>
                </div>
                <h3>Interactive Audio</h3>
                <p>Responsive sound systems that adapt to user input, environmental factors, or algorithmic processes.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.projects}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>
            <div className={styles.projectsGrid} ref={projectsRef}>
              {musicProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={styles.projectCard}
                  ref={setProjectRef(index)}
                >
                  <div className={styles.projectImageContainer}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={600}
                      height={400}
                      className={styles.projectImage}
                    />
                    <div className={styles.projectDetails}>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className={styles.projectTags}>
                        {project.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className={styles.approach}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Approach</h2>
            <div className={styles.approachContent}>
              <div className={styles.approachText}>
                <p>
                  We approach music as both an art form and a medium for communication. Our work
                  explores the boundaries between sound, space, and technology, creating experiences
                  that engage listeners in new and unexpected ways.
                </p>
                <p>
                  Whether composing for a specific space, designing interactive sound installations,
                  or producing experimental recordings, we focus on the emotional and perceptual
                  aspects of sound to create meaningful connections with audiences.
                </p>
                <p>
                  Our process combines traditional musicianship with innovative technologies,
                  allowing us to push the boundaries of what&apos;s possible in sonic art.
                </p>
              </div>
              <div className={styles.approachVisual}>
                <div className={styles.frequencyBars}>
                  {[...Array(30)].map((_, i) => (
                    <div 
                      key={i} 
                      className={styles.frequencyBar}
                      style={{ 
                        height: `${Math.random() * 80 + 20}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>Ready to explore the sonic dimension of your project?</h2>
            <p>Let&apos;s create something that resonates.</p>
            <button className={styles.ctaButton}>Get in Touch</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
