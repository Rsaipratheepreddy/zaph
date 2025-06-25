'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from './EnhancedServices.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type ServiceProps = {
  id: string;
  title: string;
  color: string;
  path: string;
  description: string;
  features: string[];
  icon: string;
};

const services: ServiceProps[] = [
  {
    id: 'design',
    title: "DESIGN",
    color: "#FF9BCD", // Pink
    path: "/design",
    description: "We create stunning, user-friendly websites that engage visitors, build trust, and turn interest into action.",
    features: [
      "DISCOVERY",
      "WEB DESIGN",
      "USER EXPERIENCE DESIGN",
      "ACCESSIBLE DESIGN"
    ],
    icon: "DESIGN"
  },
  {
    id: 'build',
    title: "BUILD",
    color: "#B8E986", // Green
    path: "/build",
    description: "We develop high-performing, scalable solutions that work seamlessly for your goals and your customers.",
    features: [
      "WEBSITE DEVELOPMENT",
      "CRAFT CMS",
      "SPEKTRIX INTEGRATION",
      "SHOPIFY DEVELOPMENT",
      "TECHNICAL SEO"
    ],
    icon: "BUILD"
  },
  {
    id: 'grow',
    title: "GROW",
    color: "#50E3C2", // Teal
    path: "/grow",
    description: "We help you attract, engage, and convert customers with data-driven marketing that delivers results.",
    features: [
      "PAID ADVERTISING (PPC)",
      "SEARCH ENGINE OPTIMISATION",
      "DIGITAL MARKETING",
      "CONTENT STRATEGY",
      "SOCIAL MEDIA"
    ],
    icon: "GROW"
  }
];

export default function EnhancedServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const fluidFillRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Function to set refs for service cards
  const setServiceRef = (index: number) => (el: HTMLDivElement | null) => {
    serviceRefs.current[index] = el;
  };

  // We'll no longer use hover for fluid fill animation
  // Instead, we'll set up scroll triggers for each card

  // Initial animations and scroll-triggered fluid fill
  useEffect(() => {
    // Animation for section entry
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });

    // Animate cards entry
    tl.from(
      serviceRefs.current,
      {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.6"
    );

    // Initialize fluid fill elements and set up scroll triggers for each
    fluidFillRefs.current.forEach((fill, index) => {
      if (!fill || !serviceRefs.current[index]) return;

      // Set initial state
      gsap.set(fill, {
        height: '0%',
        backgroundColor: services[index].color,
        opacity: 0.9
      });

      // Create scroll trigger for fluid fill animation
      ScrollTrigger.create({
        trigger: serviceRefs.current[index],
        start: "top 70%",
        onEnter: () => {
          gsap.to(fill, {
            height: '100%',
            duration: 1.2,
            ease: 'power2.out'
          });
        },
        once: true
      });
    });

    // Cleanup
    return () => {
      // Kill any active animations and scroll triggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf(fluidFillRefs.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.services} id="services">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Services</h2>
        <div ref={cardsContainerRef} className={styles.serviceCards}>
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              ref={setServiceRef(index)}
              className={styles.serviceCard}
            // Fluid fill now triggered by scroll, not hover
            >
              {/* Service card header with icon */}
              <div
                className={styles.serviceIcon}
                style={{ backgroundColor: service.color }}
              >
                {service.icon}
              </div>

              {/* Service content */}
              <div className={styles.cardContent}>
                {/* Description */}
                <p className={styles.serviceDescription}>{service.description}</p>

                {/* Features list */}
                <ul className={styles.featuresList}>
                  {service.features.map((feature, i) => (
                    <li key={i} className={styles.featureItem}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fluid fill animation overlay */}
              <div
                className={styles.fluidFill}
                style={{ backgroundColor: service.color }}
                ref={(el) => { fluidFillRefs.current[index] = el; }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}