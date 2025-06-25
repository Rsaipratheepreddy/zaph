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

// Sample tattoo projects
const tattooProjects = [
  {
    id: 1,
    title: 'Geometric Minimalism',
    description: 'Clean lines and geometric shapes create modern, minimalist designs with deep meaning.',
    image: '/images/tatto.jpg',
    tags: ['Geometric', 'Minimalist', 'Black Work']
  },
  {
    id: 2,
    title: 'Botanical Studies',
    description: 'Detailed botanical illustrations inspired by scientific drawings and natural forms.',
    image: '/images/painting.jpg',
    tags: ['Botanical', 'Fine Line', 'Black & Grey']
  },
  {
    id: 3,
    title: 'Abstract Expressions',
    description: 'Fluid forms and abstract compositions that flow with the body\'s natural contours.',
    image: '/images/tech.jpg',
    tags: ['Abstract', 'Watercolor', 'Contemporary']
  },
  {
    id: 4,
    title: 'Typographic Art',
    description: 'Letterforms and typography integrated into artistic compositions with personal meaning.',
    image: '/images/music.jpg',
    tags: ['Typography', 'Script', 'Custom']
  }
];

// Tattoo artists
const artists = [
  {
    id: 1,
    name: 'Alex Rivera',
    specialty: 'Fine Line & Geometric',
    image: '/images/painting.jpg'
  },
  {
    id: 2,
    name: 'Jordan Chen',
    specialty: 'Black Work & Abstract',
    image: '/images/tech.jpg'
  },
  {
    id: 3,
    name: 'Morgan Taylor',
    specialty: 'Botanical & Nature',
    image: '/images/music.jpg'
  }
];

export default function TattooPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const artistsRef = useRef<HTMLDivElement>(null);
  const artistRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Set project ref function
  const setProjectRef = (index: number) => (el: HTMLDivElement | null) => {
    projectRefs.current[index] = el;
  };
  
  // Set artist ref function
  const setArtistRef = (index: number) => (el: HTMLDivElement | null) => {
    artistRefs.current[index] = el;
  };
  
  useEffect(() => {
    // Animate header elements
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
    
    // Animate ink splash effect
    if (headerRef.current) {
      const inkSplash = document.createElement('div');
      inkSplash.className = styles.inkSplash;
      headerRef.current.appendChild(inkSplash);
      
      gsap.fromTo(inkSplash,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 0.2, 
          duration: 1.5, 
          ease: 'power3.out',
          onComplete: () => {
            gsap.to(inkSplash, {
              opacity: 0.1,
              duration: 1,
              yoyo: true,
              repeat: -1
            });
          }
        }
      );
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
        
        // Create hover animation with tattoo-inspired effect
        project.addEventListener('mouseenter', () => {
          gsap.to(project.querySelector(`.${styles.projectImage}`), {
            scale: 1.05,
            filter: 'contrast(1.1)',
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
            filter: 'contrast(1)',
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
    
    // Animate artists on scroll
    if (artistsRef.current) {
      const artists = artistRefs.current.filter(Boolean);
      
      artists.forEach((artist, index) => {
        if (!artist) return;
        
        gsap.fromTo(artist,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.15 * index,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: artist,
              start: 'top 80%',
              end: 'top 60%',
              toggleActions: 'play none none none'
            }
          }
        );
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
      <main className={styles.tattooPage}>
        <header className={styles.header} ref={headerRef}>
          <div className={styles.headerContent}>
            <h1 ref={titleRef}>TATTOO</h1>
            <p className={styles.headerDescription}>
              Permanent art for the body. Our tattoo studio combines artistic vision with
              technical precision to create custom designs that express your unique identity.
            </p>
          </div>
        </header>
        
        <section className={styles.services}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Tattoo Services</h2>
            <div className={styles.servicesList}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                </div>
                <h3>Custom Design</h3>
                <p>Personalized tattoo designs created in collaboration with our artists to reflect your vision.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
                    <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                    <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                    <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                    <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                    <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
                  </svg>
                </div>
                <h3>Fine Line & Minimalist</h3>
                <p>Delicate, precise linework and minimalist designs with attention to detail and clean execution.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </div>
                <h3>Cover-Ups & Reworks</h3>
                <p>Transforming existing tattoos with creative solutions that integrate and enhance rather than simply hide.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" y1="22" x2="4" y2="15"></line>
                  </svg>
                </div>
                <h3>Blackwork & Abstract</h3>
                <p>Bold, graphic designs using solid black ink and abstract forms to create striking visual impact.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.projects}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Work</h2>
            <div className={styles.projectsGrid} ref={projectsRef}>
              {tattooProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={styles.projectCard}
                  ref={setProjectRef(index)}
                >
                  <div className={styles.projectImageContainer}>
                    <Image
                      src={project.image || '/images/placeholder.jpg'}
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
        
        <section className={styles.artists}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Artists</h2>
            <div className={styles.artistsGrid} ref={artistsRef}>
              {artists.map((artist, index) => (
                <div 
                  key={artist.id} 
                  className={styles.artistCard}
                  ref={setArtistRef(index)}
                >
                  <div className={styles.artistImageContainer}>
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      width={400}
                      height={400}
                      className={styles.artistImage}
                    />
                  </div>
                  <div className={styles.artistInfo}>
                    <h3>{artist.name}</h3>
                    <p>{artist.specialty}</p>
                    <button className={styles.portfolioButton}>View Portfolio</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className={styles.process}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Process</h2>
            <div className={styles.processList}>
              <div className={styles.processStep}>
                <div className={styles.processNumber}>01</div>
                <h3>Consultation</h3>
                <p>We begin with a detailed consultation to understand your vision, placement preferences, and artistic direction.</p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.processNumber}>02</div>
                <h3>Design</h3>
                <p>Our artists create custom designs based on your input, refining until it perfectly captures your vision.</p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.processNumber}>03</div>
                <h3>Session</h3>
                <p>The tattoo session takes place in our clean, comfortable studio with attention to detail and your comfort.</p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.processNumber}>04</div>
                <h3>Aftercare</h3>
                <p>We provide comprehensive aftercare instructions to ensure proper healing and longevity of your tattoo.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>Ready to make your mark?</h2>
            <p>Book a consultation with one of our artists to begin your tattoo journey.</p>
            <button className={styles.ctaButton}>Book Consultation</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
