'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface UnsplashImageProps {
  query?: string;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

interface ImageData {
  urls: {
    regular: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
}

export default function UnsplashImage({ 
  query = 'restaurant food', 
  width = 1200, 
  height = 630,
  className = '',
  alt = 'Restaurant image'
}: UnsplashImageProps) {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success && data.image) {
          setImageData(data.image);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, [query]);

  if (loading) {
    return (
      <div 
        className={`bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  if (error || !imageData) {
    return (
      <div 
        className={`bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-white text-center">
          <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Image
        src={imageData.urls.regular}
        alt={imageData.alt_description || alt}
        width={width}
        height={height}
        className="object-cover"
        unoptimized
      />
      <p className="text-xs text-gray-500 mt-2">
        Photo by{' '}
        <a 
          href={`https://unsplash.com/@${imageData.user.username}?utm_source=ken_gooz&utm_medium=referral`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          {imageData.user.name}
        </a>
        {' '}on{' '}
        <a 
          href="https://unsplash.com?utm_source=ken_gooz&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          Unsplash
        </a>
      </p>
    </div>
  );
}
