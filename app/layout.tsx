import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kanishk Chhabra - Frontend Developer | Delhi',
  description: 'Kanishk Chhabra is a Delhi-based frontend developer with 3+ years of experience building high-performance React and Next.js products.',
  metadataBase: new URL('https://kanishk-portfolio.vercel.app'),
  openGraph: {
    title: 'Kanishk Chhabra - Frontend Developer',
    description: 'Portfolio for a frontend engineer with React, Next.js, and TypeScript experience.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.js"
          strategy="beforeInteractive"
        />
        <Script
          id="pdfjs-worker-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.pdfjsLib = window.pdfjsLib || {};
              window.pdfjsLib.GlobalWorkerOptions = window.pdfjsLib.GlobalWorkerOptions || {};
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
