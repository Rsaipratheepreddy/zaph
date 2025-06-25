'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './News.module.css';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface NewsItem {
  title: string;
  date: string;
  category: string;
  color: string;
}

const newsItems: NewsItem[] = [
  {
    title: "Latest Design Trends for 2025",
    date: "June 15, 2025",
    category: "Design",
    color: "#FF9BCD" // Pink
  },
  {
    title: "Building Scalable Web Applications",
    date: "June 10, 2025",
    category: "Development",
    color: "#B8E986" // Green
  },
  {
    title: "Digital Marketing Strategies That Work",
    date: "June 5, 2025",
    category: "Marketing",
    color: "#50E3C2" // Teal
  },
  {
    title: "The Future of AI in Creative Industries",
    date: "May 28, 2025",
    category: "Technology",
    color: "#00A1FF" // Blue
  }
];

export default function News() {
  const newsRef = useRef<HTMLDivElement>(null);
  const newsItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardPlaceholderRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const newsSection = newsRef.current;
    if (!newsSection) return;

    // Create card placeholders for incoming cards from banner

    // Set initial state for news items
    newsItemRefs.current.forEach((item) => {
      if (!item) return;
      gsap.set(item, {
        opacity: 0,
        y: 50
      });
    });

    // Create scroll animation for news items
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: newsSection,
        start: "top 70%",
        end: "top 30%",
        scrub: 1,
      }
    });

    // Animate news items
    newsItemRefs.current.forEach((item, index) => {
      if (!item) return;
      tl.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, index * 0.1);
    });

    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className={styles.newsSection} ref={newsRef} id="news">
      <div className={styles.newsContainer}>
        <h2 className={styles.newsHeading}>Latest News</h2>

        <div className={styles.cardPlaceholders}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={`placeholder-${index}`}
              className={styles.cardPlaceholder}
              ref={(el: HTMLDivElement | null) => { cardPlaceholderRefs.current[index] = el; }}
              id={`news-placeholder-${index}`}
            ></div>
          ))}
        </div>

        <div className={styles.newsGrid}>
          {newsItems.map((item, index) => (
            <div
              key={item.title}
              className={styles.newsItem}
              ref={(el: HTMLDivElement | null) => { newsItemRefs.current[index] = el; }}
              style={{ borderColor: item.color }}
            >
              <div className={styles.newsDate}>{item.date}</div>
              <h3 className={styles.newsTitle}>{item.title}</h3>
              <div className={styles.newsCategory} style={{ backgroundColor: item.color }}>
                {item.category}
              </div>
              <div className={styles.readMore}>Read More →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
