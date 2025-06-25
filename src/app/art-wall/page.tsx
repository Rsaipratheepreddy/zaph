'use client';

import { useEffect, useRef, useState } from 'react';
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

// Sample art pieces for the gallery
const artPieces = [
  {
    id: 1,
    title: 'Geometric Abstraction',
    artist: 'Mia Chen',
    image: '/images/painting.jpg',
    category: 'Digital',
    year: 2023
  },
  {
    id: 2,
    title: 'Urban Fragments',
    artist: 'Liam Johnson',
    image: '/images/tech.jpg',
    category: 'Mixed Media',
    year: 2022
  },
  {
    id: 3,
    title: 'Chromatic Waves',
    artist: 'Sofia Rodriguez',
    image: '/images/music.jpg',
    category: 'Painting',
    year: 2023
  },
  {
    id: 4,
    title: 'Neon Dreams',
    artist: 'Javier Kim',
    image: '/images/tatto.jpg',
    category: 'Digital',
    year: 2022
  },
  {
    id: 5,
    title: 'Organic Forms',
    artist: 'Eliza Wright',
    image: '/images/placeholder.jpg',
    category: 'Sculpture',
    year: 2023
  },
  {
    id: 6,
    title: 'Textural Study',
    artist: 'Marcus Lee',
    image: '/images/painting.jpg',
    category: 'Mixed Media',
    year: 2021
  },
  {
    id: 7,
    title: 'Spatial Harmony',
    artist: 'Ava Chen',
    image: '/images/tech.jpg',
    category: 'Installation',
    year: 2023
  },
  {
    id: 8,
    title: 'Monochrome Perspective',
    artist: 'Noah Garcia',
    image: '/images/music.jpg',
    category: 'Photography',
    year: 2022
  }
];

// Filter categories
const categories = ['All', 'Digital', 'Mixed Media', 'Painting', 'Sculpture', 'Installation', 'Photography'];

export default function ArtWallPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredArt, setFilteredArt] = useState(artPieces);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const artRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Set art ref function
  const setArtRef = (index: number) => (el: HTMLDivElement | null) => {
    artRefs.current[index] = el;
  };
  
  // Filter art pieces based on category
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredArt(artPieces);
    } else {
      setFilteredArt(artPieces.filter(piece => piece.category === activeCategory));
    }
  }, [activeCategory]);
  
  // Initialize animations
  useEffect(() => {
    // Animate header elements
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
    
    // Animate gallery items on scroll
    if (galleryRef.current) {
      const arts = artRefs.current.filter(Boolean);
      
      arts.forEach((art, index) => {
        if (!art) return;
        
        gsap.fromTo(art,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.1 * index,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: art,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }
    
    // Initialize carousel
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      const slides = carousel.querySelectorAll(`.${styles.carouselSlide}`);
      
      gsap.set(slides, { x: '100%' });
      gsap.set(slides[0], { x: '0%' });
      
      // Auto-advance carousel
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [filteredArt]);
  
  // Carousel navigation
  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % filteredArt.length;
    animateSlide(currentIndex, newIndex);
    setCurrentIndex(newIndex);
  };
  
  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + filteredArt.length) % filteredArt.length;
    animateSlide(currentIndex, newIndex, true);
    setCurrentIndex(newIndex);
  };
  
  const animateSlide = (current: number, next: number, reverse: boolean = false) => {
    if (!carouselRef.current) return;
    
    const slides = carouselRef.current.querySelectorAll(`.${styles.carouselSlide}`);
    const currentSlide = slides[current];
    const nextSlide = slides[next];
    
    if (reverse) {
      gsap.fromTo(nextSlide, 
        { x: '-100%' }, 
        { x: '0%', duration: 0.7, ease: 'power2.inOut' }
      );
      gsap.to(currentSlide, { x: '100%', duration: 0.7, ease: 'power2.inOut' });
    } else {
      gsap.fromTo(nextSlide, 
        { x: '100%' }, 
        { x: '0%', duration: 0.7, ease: 'power2.inOut' }
      );
      gsap.to(currentSlide, { x: '-100%', duration: 0.7, ease: 'power2.inOut' });
    }
  };
  
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <header className={styles.header} ref={headerRef}>
          <div className={styles.container}>
            <h1 className={styles.title} ref={titleRef}>Art Wall</h1>
            <p className={styles.subtitle}>Explore our curated collection of contemporary art</p>
          </div>
        </header>
        
        <section className={styles.featured}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Artwork</h2>
            <div className={styles.carousel} ref={carouselRef}>
              {filteredArt.map((piece, index) => (
                <div 
                  key={piece.id} 
                  className={`${styles.carouselSlide} ${index === currentIndex ? styles.active : ''}`}
                >
                  <div className={styles.carouselImage}>
                    <Image
                      src={piece.image || '/images/placeholder.jpg'}
                      alt={piece.title}
                      width={1200}
                      height={800}
                      className={styles.slideImage}
                    />
                  </div>
                  <div className={styles.carouselContent}>
                    <h3>{piece.title}</h3>
                    <p className={styles.artist}>{piece.artist}</p>
                    <p className={styles.category}>{piece.category}, {piece.year}</p>
                  </div>
                </div>
              ))}
              <button className={`${styles.carouselControl} ${styles.prev}`} onClick={prevSlide}>
                <span>←</span>
              </button>
              <button className={`${styles.carouselControl} ${styles.next}`} onClick={nextSlide}>
                <span>→</span>
              </button>
            </div>
          </div>
        </section>
        
        <section className={styles.gallery}>
          <div className={styles.container}>
            <div className={styles.filterControls}>
              {categories.map((category) => (
                <button 
                  key={category} 
                  className={`${styles.filterButton} ${activeCategory === category ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className={styles.galleryGrid} ref={galleryRef}>
              {filteredArt.map((piece, index) => (
                <div 
                  key={piece.id} 
                  className={styles.galleryItem}
                  ref={setArtRef(index)}
                >
                  <div className={styles.galleryImageContainer}>
                    <Image
                      src={piece.image || '/images/placeholder.jpg'}
                      alt={piece.title}
                      width={600}
                      height={600}
                      className={styles.galleryImage}
                    />
                    <div className={styles.galleryOverlay}>
                      <h3>{piece.title}</h3>
                      <p>{piece.artist}</p>
                      <button className={styles.viewButton}>View Details</button>
                    </div>
                  </div>
                  <div className={styles.galleryInfo}>
                    <h3>{piece.title}</h3>
                    <p className={styles.artist}>{piece.artist}</p>
                    <p className={styles.category}>{piece.category}, {piece.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className={styles.upload}>
          <div className={styles.container}>
            <div className={styles.uploadContent}>
              <h2>Submit Your Artwork</h2>
              <p>Join our community of artists and showcase your work on our Art Wall.</p>
              <button className={styles.uploadButton}>Upload Artwork</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
