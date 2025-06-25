'use client';

import { Inter, Playfair_Display, Montserrat, Space_Grotesk } from 'next/font/google';

// Font configurations
const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic']
});
const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function GlobalFonts() {
  return (
    <style jsx global>{`
      :root {
        --font-inter: ${inter.style.fontFamily};
        --font-playfair: ${playfair.style.fontFamily};
        --font-montserrat: ${montserrat.style.fontFamily};
        --font-space-grotesk: ${spaceGrotesk.style.fontFamily};
      }
    `}</style>
  );
}

// Export font classes for use in layout
export const fontClasses = {
  inter: inter.className,
  playfair: playfair.className,
  montserrat: montserrat.className,
  spaceGrotesk: spaceGrotesk.className
};
