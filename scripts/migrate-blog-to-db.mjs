#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import TurndownService from 'turndown';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env') });

// Verify DATABASE_URL
const connectionString = process.env.DATABASE_URL;
console.log('🔍 DEBUG - DATABASE_URL:', connectionString ? `${connectionString.substring(0, 30)}...` : 'NOT FOUND');

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL not found in environment variables');
  console.log('   Make sure .env file exists with DATABASE_URL');
  process.exit(1);
}

// Create Neon adapter (Prisma 7 way)
console.log('🔌 Creating Neon adapter...');
const adapter = new PrismaNeon({
  connectionString: connectionString
});
console.log('✅ Neon adapter created');

// Create Prisma Client with adapter
console.log('🔌 Creating Prisma Client...');
const prisma = new PrismaClient({ adapter });
console.log('✅ Prisma Client created\n');

const turndownService = new TurndownService();

// WordPress REST API endpoint
const WP_API_BASE = 'https://mainstreetglobal.ca/wp-json/wp/v2';

// Unsplash API
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

// Image keywords pool - mix untuk variety
const IMAGE_KEYWORDS = [
  'restaurant interior',
  'fine dining food',
  'business consulting',
  'restaurant kitchen',
  'corporate strategy meeting',
  'chef cooking',
  'hospitality management',
  'food plating',
  'restaurant business',
  'culinary excellence',
];

// Track used Unsplash photo IDs to ensure uniqueness
const usedPhotoIds = new Set();

/**
 * Strip HTML tags from string
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * Truncate text to max length
 */
function truncate(text, maxLength = 200) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Fetch posts from WordPress with auto-pagination
 */
async function fetchAllWpPosts() {
  const allPosts = [];
  let page = 1;
  let totalPages = 1;

  console.log('📥 Fetching posts from WordPress API...\n');

  while (page <= totalPages) {
    const url = `${WP_API_BASE}/posts?per_page=100&page=${page}&_embed=1`;
    console.log(`   Fetching page ${page}/${totalPages}...`);

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`);
    }

    const posts = await response.json();
    allPosts.push(...posts);

    // Get total pages from header
    totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
    page++;
  }

  console.log(`✅ Fetched ${allPosts.length} posts from WordPress\n`);
  return allPosts;
}

/**
 * Get unique Unsplash photo based on keyword and ensure uniqueness
 */
async function getUniqueUnsplashPhoto(keyword, postIndex) {
  // Rotate keywords based on post index for variety
  const keywordIndex = postIndex % IMAGE_KEYWORDS.length;
  let currentKeyword = IMAGE_KEYWORDS[keywordIndex];

  // Try to match keyword with post categories if possible
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerKeyword.includes('management') || lowerKeyword.includes('business')) {
      currentKeyword = 'corporate strategy meeting';
    } else if (lowerKeyword.includes('finance') || lowerKeyword.includes('accounting')) {
      currentKeyword = 'business consulting';
    } else if (lowerKeyword.includes('kitchen') || lowerKeyword.includes('cooking')) {
      currentKeyword = 'chef cooking';
    } else if (lowerKeyword.includes('food')) {
      currentKeyword = 'fine dining food';
    }
  }

  let attempts = 0;
  const maxAttempts = IMAGE_KEYWORDS.length;

  while (attempts < maxAttempts) {
    try {
      const url = `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(currentKeyword)}&per_page=30&orientation=landscape`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }

      const data = await response.json();
      const results = data.results || [];

      // Find first photo that hasn't been used
      for (const photo of results) {
        if (!usedPhotoIds.has(photo.id)) {
          usedPhotoIds.add(photo.id);
          
          return {
            url: photo.urls.regular,
            credit: `${photo.user.name}|${photo.user.links.html}`,
            photoId: photo.id,
          };
        }
      }

      // All photos in this search used, try next keyword
      attempts++;
      const nextKeywordIndex = (keywordIndex + attempts) % IMAGE_KEYWORDS.length;
      currentKeyword = IMAGE_KEYWORDS[nextKeywordIndex];
      
      console.log(`      ⚠️  All photos used for "${currentKeyword}", trying "${IMAGE_KEYWORDS[nextKeywordIndex]}"...`);
      
    } catch (error) {
      console.error(`      ❌ Unsplash error for "${currentKeyword}":`, error.message);
      attempts++;
      
      if (attempts < maxAttempts) {
        const nextKeywordIndex = (keywordIndex + attempts) % IMAGE_KEYWORDS.length;
        currentKeyword = IMAGE_KEYWORDS[nextKeywordIndex];
      }
    }
  }

  // Fallback: return null if couldn't get unique image
  console.warn(`      ⚠️  Could not find unique image after ${maxAttempts} attempts`);
  return null;
}

/**
 * Migrate a single WordPress post to Prisma
 */
async function migratePost(wpPost, index) {
  try {
    // Extract data
    const title = stripHtml(wpPost.title.rendered);
    const slug = wpPost.slug;
    const content = turndownService.turndown(wpPost.content.rendered);
    const excerpt = truncate(stripHtml(wpPost.excerpt.rendered), 200);
    const date = new Date(wpPost.date);
    
    // Author
    const author = wpPost._embedded?.author?.[0]?.name || 'Ken Gooz';
    
    // Categories
    const wpCategories = wpPost._embedded?.['wp:term']?.[0] || [];
    
    console.log(`📝 [${index + 1}] Migrating: "${title}"`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Date: ${date.toISOString()}`);
    console.log(`   Author: ${author}`);
    console.log(`   Categories: ${wpCategories.map(c => c.name).join(', ') || 'None'}`);

    // Get unique Unsplash photo
    console.log(`   🖼️  Fetching unique Unsplash image...`);
    const firstCategory = wpCategories[0]?.name || null;
    const unsplashPhoto = await getUniqueUnsplashPhoto(firstCategory, index);
    
    if (unsplashPhoto) {
      console.log(`   ✅ Image: ${unsplashPhoto.photoId} (${unsplashPhoto.credit.split('|')[0]})`);
    } else {
      console.log(`   ⚠️  No unique image available`);
    }

    // Upsert categories
    const categoryConnections = [];
    for (const wpCat of wpCategories) {
      const categorySlug = wpCat.slug;
      const categoryName = wpCat.name;
      
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: { name: categoryName },
        create: {
          slug: categorySlug,
          name: categoryName,
        },
      });
      
      categoryConnections.push({ id: category.id });
    }

    // Upsert post
    const post = await prisma.post.upsert({
      where: { slug },
      update: {
        title,
        content,
        excerpt,
        author,
        date,
        published: true,
        coverImage: unsplashPhoto?.url || null,
        coverImageCredit: unsplashPhoto?.credit || null,
        categories: {
          set: categoryConnections,
        },
      },
      create: {
        slug,
        title,
        content,
        excerpt,
        author,
        date,
        published: true,
        coverImage: unsplashPhoto?.url || null,
        coverImageCredit: unsplashPhoto?.credit || null,
        categories: {
          connect: categoryConnections,
        },
      },
    });

    console.log(`   ✅ Migrated successfully\n`);
    return { success: true, hasImage: !!unsplashPhoto };
    
  } catch (error) {
    console.error(`   ❌ Error migrating post:`, error.message);
    console.error('');
    return { success: false, hasImage: false };
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting WordPress to Postgres migration\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ Error: NEXT_PUBLIC_UNSPLASH_ACCESS_KEY not found in environment variables');
    process.exit(1);
  }

  try {
    // Fetch all WordPress posts
    const wpPosts = await fetchAllWpPosts();

    if (wpPosts.length === 0) {
      console.log('⚠️  No posts found to migrate');
      return;
    }

    // Migrate each post
    let successCount = 0;
    let imageCount = 0;

    for (let i = 0; i < wpPosts.length; i++) {
      const result = await migratePost(wpPosts[i], i);
      if (result.success) {
        successCount++;
        if (result.hasImage) imageCount++;
      }
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Migration Complete!\n');
    console.log(`📊 Statistics:`);
    console.log(`   Total WordPress posts: ${wpPosts.length}`);
    console.log(`   Successfully migrated: ${successCount}`);
    console.log(`   Unique images assigned: ${imageCount}`);
    console.log(`   Unique Unsplash photos used: ${usedPhotoIds.size}`);
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
main();
