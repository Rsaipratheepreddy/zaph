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

// Sample art projects
const artProjects = [
  {
    id: 1,
    title: 'Abstract Expressions',
    description: 'A collection of abstract paintings exploring color and emotion.',
    image: '/images/painting.jpg',
    tags: ['Painting', 'Abstract', 'Mixed Media']
  },
  {
    id: 2,
    title: 'Urban Landscapes',
    description: 'Photorealistic urban scenes with a focus on architectural elements.',
    image: '/images/tech.jpg',
    tags: ['Urban', 'Realism', 'Architecture']
  },
  {
    id: 3,
    title: 'Digital Illustrations',
    description: 'Modern digital illustrations combining traditional techniques with technology.',
    image: '/images/music.jpg',
    tags: ['Digital', 'Illustration', 'Contemporary']
  },
  {
    id: 4,
    title: 'Sculptural Forms',
    description: 'Three-dimensional explorations of form, texture, and space.',
    image: '/images/tatto.jpg',
    tags: ['Sculpture', '3D', 'Installation']
  }
];

export default function ArtPage() {
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
        
        // Animate project details on hover
        project.addEventListener('mouseenter', () => {
          gsap.to(project.querySelector(`.${styles.projectDetails}`), {
            y: 0,
            opacity: 1,
            duration: 0.3
          });
        });
        
        project.addEventListener('mouseleave', () => {
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
      <main className={styles.artPage}>
        <header className={styles.header} ref={headerRef}>
          <div className={styles.headerContent}>
            <h1 ref={titleRef}>ART</h1>
            <p className={styles.headerDescription}>
              Explore artistic expressions through various mediums and styles. Our art services focus on creating
              meaningful visual experiences that resonate with audiences and convey powerful messages.
            </p>
          </div>
        </header>
        
        <section className={styles.services}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Art Services</h2>
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
                <h3>Painting & Drawing</h3>
                <p>Traditional and contemporary approaches to painting and drawing, from realistic to abstract styles.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <h3>Digital Art</h3>
                <p>Modern digital illustrations and artwork created using cutting-edge software and techniques.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3>Sculpture & Installation</h3>
                <p>Three-dimensional art forms exploring space, form, and materiality in various scales and contexts.</p>
              </div>
              
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path>
                    <polyline points="8 10 12 14 16 10"></polyline>
                  </svg>
                </div>
                <h3>Mixed Media</h3>
                <p>Experimental approaches combining multiple materials and techniques to create unique artistic expressions.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.projects}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>
            <div className={styles.projectsGrid} ref={projectsRef}>
              {artProjects.map((project, index) => (
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
        
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>Ready to bring your artistic vision to life?</h2>
            <p>Let's collaborate on your next creative project.</p>
            <button className={styles.ctaButton}>Get in Touch</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
