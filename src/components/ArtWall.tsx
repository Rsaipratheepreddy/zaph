'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import styles from './ArtWall.module.css';

// Register Draggable
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

// Sample art pieces for initial display
const initialArtPieces = [
  {
    id: 1,
    title: 'Abstract Composition',
    artist: 'Jane Doe',
    imageUrl: '/images/painting.jpg',
    type: 'Painting'
  },
  {
    id: 2,
    title: 'Digital Landscape',
    artist: 'John Smith',
    imageUrl: '/images/tech.jpg',
    type: 'Digital Art'
  },
  {
    id: 3,
    title: 'Sound Visualization',
    artist: 'Alex Johnson',
    imageUrl: '/images/music.jpg',
    type: 'Mixed Media'
  },
  {
    id: 4,
    title: 'Tattoo Design',
    artist: 'Sam Wilson',
    imageUrl: '/images/tatto.jpg',
    type: 'Design'
  }
];

export default function ArtWall() {
  const [artPieces, setArtPieces] = useState(initialArtPieces);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    type: 'Painting'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const artPieceRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Set art piece ref function
  const setArtPieceRef = (index: number) => (el: HTMLDivElement | null) => {
    artPieceRefs.current[index] = el;
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile || !uploadedPreview) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Add new art piece to the collection
      const newArtPiece = {
        id: Date.now(),
        title: formData.title,
        artist: formData.artist,
        imageUrl: uploadedPreview,
        type: formData.type
      };
      
      setArtPieces(prev => [...prev, newArtPiece]);
      
      // Reset form
      setFormData({
        title: '',
        artist: '',
        type: 'Painting'
      });
      setUploadedFile(null);
      setUploadedPreview(null);
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  // Initialize carousel with GSAP
  useEffect(() => {
    if (!carouselRef.current || !carouselTrackRef.current) return;
    
    const artElements = artPieceRefs.current.filter(Boolean);
    
    // Set initial positions with staggered effect
    gsap.fromTo(artElements,
      { 
        y: 100, 
        opacity: 0,
        rotation: () => gsap.utils.random(-5, 5)
      },
      { 
        y: 0, 
        opacity: 1,
        rotation: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      }
    );
    
    // Make carousel draggable
    if (carouselTrackRef.current) {
      const trackWidth = carouselTrackRef.current.scrollWidth;
      const viewportWidth = carouselRef.current.clientWidth;
      const maxX = viewportWidth - trackWidth;
      
      Draggable.create(carouselTrackRef.current, {
        type: 'x',
        bounds: { minX: maxX, maxX: 0 },
        inertia: true,
        edgeResistance: 0.65,
        onDrag: function() {
          // Update position during drag
          gsap.to(artElements, {
            scale: 0.95,
            duration: 0.2
          });
        },
        onDragEnd: function() {
          // Restore scale when drag ends
          gsap.to(artElements, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    }
    
    // Create hover animations for art pieces
    artElements.forEach((art) => {
      if (!art) return;
      
      art.addEventListener('mouseenter', () => {
        gsap.to(art, {
          y: -15,
          scale: 1.05,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
          zIndex: 10,
          duration: 0.3
        });
      });
      
      art.addEventListener('mouseleave', () => {
        gsap.to(art, {
          y: 0,
          scale: 1,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
          duration: 0.3
        });
      });
    });
    
    return () => {
      // Clean up event listeners
      artElements.forEach((art) => {
        if (!art) return;
        
        const clone = art.cloneNode(true);
        if (art.parentNode) {
          art.parentNode.replaceChild(clone, art);
        }
      });
      
      // Kill all GSAP animations
      gsap.killTweensOf(artElements);
      
      // Kill Draggable instances
      Draggable.get(carouselTrackRef.current)?.kill();
    };
  }, [artPieces]);
  
  return (
    <section className={styles.artWall}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Art Wall Gallery</h2>
        <p className={styles.sectionDescription}>
          Explore our collection of artistic works or contribute your own creations to our growing gallery.
        </p>
        
        <div className={styles.carousel} ref={carouselRef}>
          <div className={styles.carouselTrack} ref={carouselTrackRef}>
            {artPieces.map((art, index) => (
              <div 
                key={art.id} 
                className={styles.artPiece}
                ref={setArtPieceRef(index)}
              >
                <div className={styles.artImageContainer}>
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    width={300}
                    height={400}
                    className={styles.artImage}
                  />
                </div>
                <div className={styles.artInfo}>
                  <h3 className={styles.artTitle}>{art.title}</h3>
                  <p className={styles.artArtist}>by {art.artist}</p>
                  <span className={styles.artType}>{art.type}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.carouselInstructions}>
            <span>← Drag to explore →</span>
          </div>
        </div>
        
        <div className={styles.uploadSection}>
          <h3 className={styles.uploadTitle}>Share Your Art</h3>
          <form className={styles.uploadForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="file" className={styles.fileInputLabel}>
                {uploadedPreview ? (
                  <div className={styles.previewContainer}>
                    <Image
                      src={uploadedPreview}
                      alt="Preview"
                      width={150}
                      height={150}
                      className={styles.preview}
                    />
                    <span className={styles.changeFile}>Change Image</span>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Upload Artwork</span>
                  </>
                )}
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
            
            <div className={styles.formFields}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="artist">Artist Name</label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="type">Art Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Painting">Painting</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Photography">Photography</option>
                  <option value="Sculpture">Sculpture</option>
                  <option value="Mixed Media">Mixed Media</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isUploading || !uploadedFile}
              >
                {isUploading ? 'Uploading...' : 'Share Artwork'}
              </button>
            </div>
          </form>
          
          {uploadSuccess && (
            <div className={styles.successMessage}>
              Your artwork has been successfully added to the gallery!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
