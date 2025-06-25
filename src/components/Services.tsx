'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Services.module.css';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceProps {
  title: string;
  description: string;
  features: string[];
  color: string;
  path: string;
  id: string;
}

const services: ServiceProps[] = [
  {
    id: 'art',
    title: "ART",
    color: "var(--art-color)",
    path: "/art",
    description: "Explore artistic expressions through various mediums and styles.",
    features: ["Painting", "Digital Art", "Sculpture", "Mixed Media", "Contemporary Art"]
  },
  {
    id: 'tech',
    title: "TECH",
    color: "var(--tech-color)",
    path: "/tech",
    description: "Discover the intersection of technology and creative expression.",
    features: ["Interactive Installations", "Digital Experiences", "Creative Coding", "AR/VR Experiences", "Generative Art"]
  },
  {
    id: 'music',
    title: "MUSIC",
    color: "var(--music-color)",
    path: "/music",
    description: "Immerse yourself in sonic landscapes and audio-visual experiences.",
    features: ["Sound Design", "Audio Production", "Music Visualization", "Live Performances", "Audio Installations"]
  },
  {
    id: 'tattoo',
    title: "TATTOO",
    color: "var(--tattoo-color)",
    path: "/tattoo",
    description: "Discover the art of permanent body decoration and expression.",
    features: ["Custom Designs", "Traditional", "Minimalist", "Watercolor", "Blackwork"]
  }
];

export default function Services() {
  const servicesRef = useRef<HTMLElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Set service ref function
  const setServiceRef = (index: number) => (el: HTMLDivElement | null) => {
    serviceRefs.current[index] = el;
  };
  
  // Set progress ref function
  const setProgressRef = (index: number) => (el: HTMLDivElement | null) => {
    progressRefs.current[index] = el;
  };
  
  useEffect(() => {
    const serviceElements = serviceRefs.current.filter(Boolean);
    const progressElements = progressRefs.current.filter(Boolean);
    
    if (!servicesRef.current || serviceElements.length === 0) return;
    
    // Create scroll animations for each service
    serviceElements.forEach((service, index) => {
      const progressBar = progressElements[index];
      if (!service || !progressBar) return;
      
      // Create a timeline for each service
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: service,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            // Update progress bar
            gsap.to(progressBar, {
              width: `${self.progress * 100}%`,
              duration: 0.1
            });
            
            // Update progress percentage
            const percentageElement = service.querySelector(`.${styles.percentage}`);
            if (percentageElement) {
              percentageElement.textContent = `${Math.round(self.progress * 100)}%`;
            }
          }
        }
      });
      
      // Animate service elements
      tl.fromTo(service.querySelector(`.${styles.serviceTitle}`),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      )
      .fromTo(service.querySelector(`.${styles.serviceDescription}`),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      )
      .fromTo(service.querySelectorAll(`.${styles.featureItem}`),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.3 },
        '-=0.2'
      )
      .fromTo(service.querySelector(`.${styles.serviceLink}`),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        '-=0.1'
      );
    });
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
  
  return (
    <section className={styles.services} ref={servicesRef} id="services">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Services</h2>
        <p className={styles.sectionDescription}>
          Explore our diverse range of creative services spanning art, technology, music, and tattoo design.
        </p>
        
        <div className={styles.servicesList}>
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={styles.serviceCard} 
              ref={setServiceRef(index)}
              id={`service-${service.id}`}
            >
              <div className={styles.serviceHeader} style={{ backgroundColor: service.color }}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div className={styles.progress} ref={setProgressRef(index)}></div>
                  </div>
                  <span className={styles.percentage}>0%</span>
                </div>
              </div>
              
              <div className={styles.serviceContent}>
                <p className={styles.serviceDescription}>{service.description}</p>
                
                <ul className={styles.featuresList}>
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={styles.featureItem}>{feature}</li>
                  ))}
                </ul>
                
                <Link href={service.path} className={styles.serviceLink} style={{ color: service.color }}>
                  Explore {service.title}
                  <span className={styles.arrow}>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
