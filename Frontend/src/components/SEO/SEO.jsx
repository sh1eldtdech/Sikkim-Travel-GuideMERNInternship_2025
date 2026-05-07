import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, name, type, url, image }) {
  const siteTitle = title ? `${title} | Sikkim Travel Guide or Sikkim Pal` : 'Sikkim Travel Guide or Sikkim Pal | Explore the Beauty of Sikkim';
  const siteDescription = description || "Discover the best places to visit, hotels, and bike rentals in Sikkim. Your ultimate travel guide for an unforgettable adventure.";
  const siteName = name || 'Sikkim Travel Guide or Sikkim Pal';
  const siteType = type || 'website';
  const siteUrl = url || 'https://sikkimpal.in'; // Assuming this is the domain based on history
  const siteImage = image || 'https://res.cloudinary.com/dvzpej8o4/image/upload/v1740639943/sikkim-hero_b1tuy7.jpg'; // using an image from the project if possible or a generic one

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name='description' content={siteDescription} />
      {/* canonical link to prevent duplicate content issues in SEO */}
      <link rel="canonical" href={siteUrl} />

      {/* OpenGraph tags (for Facebook, LinkedIn, etc.) */}
      <meta property='og:title' content={siteTitle} />
      <meta property='og:description' content={siteDescription} />
      <meta property='og:type' content={siteType} />
      <meta property='og:url' content={siteUrl} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:image' content={siteImage} />

      {/* Twitter tags */}
      <meta name='twitter:creator' content={siteName} />
      <meta name='twitter:card' content={siteType === 'article' ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:title' content={siteTitle} />
      <meta name='twitter:description' content={siteDescription} />
      <meta name='twitter:image' content={siteImage} />
    </Helmet>
  );
}
