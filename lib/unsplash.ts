// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

// Helper function to get random food/restaurant image
export async function getRestaurantImage(query: string = 'restaurant food'): Promise<UnsplashImage | null> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return null;
  }
}

// Helper to get multiple images
export async function getRestaurantImages(query: string = 'restaurant', count: number = 3): Promise<UnsplashImage[]> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/photos/random?query=${encodeURIComponent(query)}&count=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
}

// Helper to search images
export async function searchImages(query: string, perPage: number = 10): Promise<UnsplashImage[]> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching Unsplash images:', error);
    return [];
  }
}

// Helper to get placeholder URL (for blog posts without images)
export function getUnsplashPlaceholder(query: string = 'restaurant', width: number = 1200, height: number = 630): string {
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}`;
}
