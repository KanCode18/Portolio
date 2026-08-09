import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import portfolio from './data/portfolio.json';

export const metadata: Metadata = {
  title: portfolio.content.metaTitle,
  description: portfolio.content.metaDescription,
  metadataBase: new URL('https://kanishk-portfolio.vercel.app'),
  openGraph: {
    title: portfolio.content.openGraphTitle,
    description: portfolio.content.openGraphDescription,
    type: 'website',
  },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
