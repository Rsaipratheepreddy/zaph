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

// Sample tech projects
const techProjects = [
  {
    id: 1,
    title: 'Interactive Installation',
    description: 'A responsive digital installation that reacts to audience movement and sound.',
    image: '/images/tech.jpg',
    tags: ['Interactive', 'Sensors', 'Projection Mapping']
  },
  {
    id: 2,
    title: 'Generative Art System',
    description: 'Algorithm-based art creation system that produces unique visual compositions.',
    image: '/images/painting.jpg',
    tags: ['Generative Art', 'AI', 'Processing']
  },
  {
    id: 3,
    title: 'AR Experience',
    description: 'Augmented reality application that overlays digital content onto physical spaces.',
    image: '/images/music.jpg',
    tags: ['AR', 'Mobile', 'Spatial Computing']
  },
  {
    id: 4,
    title: 'Data Visualization',
    description: 'Creative visualization of complex datasets through interactive and aesthetic means.',
    image: '/images/tatto.jpg',
    tags: ['Data', 'Visualization', 'Web']
  }
];

export default function TechPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
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
    
    // Create glitch effect for tech title
    if (titleRef.current) {
      const glitchInterval = setInterval(() => {
        // Random chance of glitch
        if (Math.random() > 0.7) {
          gsap.to(titleRef.current, {
            skewX: () => Math.random() * 10 - 5,
            duration: 0.1,
            onComplete: () => {
              gsap.to(titleRef.current, {
                skewX: 0,
                duration: 0.1
              });
            }
          });
        }
      }, 2000);
      
      return () => clearInterval(glitchInterval);
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
        
        // Create hover animation with tech-inspired effect
        project.addEventListener('mouseenter', () => {
          gsap.to(project.querySelector(`.${styles.projectImage}`), {
            scale: 1.05,
            filter: 'brightness(1.2) contrast(1.1)',
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
            filter: 'brightness(1) contrast(1)',
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
      <main className={styles.techPage}>
        <header className={styles.header} ref={headerRef}>
          <div className={styles.headerContent}>
            <h1 ref={titleRef}>TECH</h1>
            <p className={styles.headerDescription}>
              Discover the intersection of technology and creative expression. We create
              interactive installations, digital experiences, and technological art that
              pushes the boundaries of what&apos;s possible.
            </p>
          </div>
          <div className={styles.gridOverlay}></div>
        </header>
        
        <section className={styles.services}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Tech Services</h2>
            <div className={styles.servicesList}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3>Interactive Installations</h3>
                <p>Responsive digital installations that create immersive experiences through technology.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                </div>
                <h3>Creative Coding</h3>
                <p>Algorithm-based art creation and generative design using modern programming techniques.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <h3>AR/VR Experiences</h3>
                <p>Immersive augmented and virtual reality experiences that blend digital and physical worlds.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3>Data Visualization</h3>
                <p>Artistic representation of complex data through interactive and visually compelling means.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.projects}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>
            <div className={styles.projectsGrid} ref={projectsRef}>
              {techProjects.map((project, index) => (
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
        
        <section className={styles.process}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Process</h2>
            <div className={styles.processList}>
              <div className={styles.processStep}>
                <div className={styles.processNumber}>01</div>
                <h3>Concept Development</h3>
                <p>We collaborate to develop innovative concepts that merge art and technology in meaningful ways.</p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.processNumber}>02</div>
                <h3>Prototyping</h3>
                <p>Rapid prototyping allows us to test ideas quickly and refine the technical implementation.</p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.processNumber}>03</div>
                <h3>Development</h3>
                <p>Our team of creative technologists builds robust solutions using cutting-edge technologies.</p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.processNumber}>04</div>
                <h3>Deployment</h3>
                <p>We handle the installation, testing, and optimization of the final experience.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>Ready to explore the possibilities of creative technology?</h2>
            <p>Let&apos;s collaborate on your next innovative project.</p>
            <button className={styles.ctaButton}>Get in Touch</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
