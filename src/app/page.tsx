'use client';

import styles from "./page.module.css";
import EnhancedHero from "../components/EnhancedHero";
import EnhancedServices from "../components/EnhancedServices";
import ArtWall from "../components/ArtWall";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

export default function Home() {
  return (
    <main>
      <Navigation />
      <EnhancedHero />
      <EnhancedServices />
      <ArtWall />
      <Footer />
    </main>
  );
}
