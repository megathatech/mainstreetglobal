#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * Patterns to remove from post content:
 *
 * 1. HTML <img> tags with mainstreetglobal.ca src
 *    <img ... src="https://mainstreetglobal.ca/wp-content/..." ...>
 *    also handles self-closing <img ... /> or wrapped in <figure>, <p>
 *
 * 2. Markdown image syntax
 *    ![alt text](https://mainstreetglobal.ca/wp-content/...)
 *
 * 3. Wrapped figure/div containers that only contain a WP image
 *    e.g. <figure class="..."><img ...></figure>
 *
 * 4. Also handles escaped Markdown from turndown:
 *    \[![alt](https://mainstreetglobal.ca/...)\]
 */

const WP_DOMAIN = 'mainstreetglobal.ca/wp-content/uploads';

function stripWordPressImages(content) {
  let cleaned = content;
  let removedCount = 0;

  // 1. Remove <figure> blocks containing WP images
  const figureRegex = /<figure[^>]*>[\s\S]*?<img[^>]*mainstreetglobal\.ca\/wp-content[^>]*>[\s\S]*?<\/figure>/gi;
  const figureMatches = (cleaned.match(figureRegex) || []).length;
  cleaned = cleaned.replace(figureRegex, '');
  removedCount += figureMatches;

  // 2. Remove standalone HTML <img> tags pointing to WP
  const imgTagRegex = /<img[^>]*mainstreetglobal\.ca\/wp-content[^>]*\/?>/gi;
  const imgMatches = (cleaned.match(imgTagRegex) || []).length;
  cleaned = cleaned.replace(imgTagRegex, '');
  removedCount += imgMatches;

  // 3. Remove Markdown image syntax: ![...](https://mainstreetglobal.ca/wp-content/...)
  const mdImageRegex = /!\[[^\]]*\]\(https?:\/\/mainstreetglobal\.ca\/wp-content\/[^)]+\)/gi;
  const mdMatches = (cleaned.match(mdImageRegex) || []).length;
  cleaned = cleaned.replace(mdImageRegex, '');
  removedCount += mdMatches;

  // 4. Remove escaped Markdown images from turndown output
  //    e.g. \![alt\](https://mainstreetglobal.ca/wp-content/...)
  const escapedMdRegex = /\\!\[[^\]]*\]\(https?:\/\/mainstreetglobal\.ca\/wp-content\/[^)]+\)/gi;
  const escapedMatches = (cleaned.match(escapedMdRegex) || []).length;
  cleaned = cleaned.replace(escapedMdRegex, '');
  removedCount += escapedMatches;

  // 5. Remove any remaining bare WP image URLs that appear as links
  //    e.g. [image](https://mainstreetglobal.ca/wp-content/uploads/...)
  const mdLinkWpRegex = /\[[^\]]*\]\(https?:\/\/mainstreetglobal\.ca\/wp-content\/[^)]+\)/gi;
  const mdLinkMatches = (cleaned.match(mdLinkWpRegex) || []).length;
  cleaned = cleaned.replace(mdLinkWpRegex, '');
  removedCount += mdLinkMatches;

  // 6. Remove leftover empty <p> or whitespace-only lines after removal
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // collapse multiple blank lines
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');  // remove empty <p> tags

  return { cleaned: cleaned.trim(), removedCount };
}

async function main() {
  console.log('🚀 Stripping WordPress images from all post content\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const posts = await prisma.post.findMany({
    select: { id: true, slug: true, title: true, content: true },
  });

  console.log(`📋 Found ${posts.length} posts to process\n`);

  let totalRemoved = 0;
  let updatedPosts = 0;
  let skippedPosts = 0;

  for (const post of posts) {
    const { cleaned, removedCount } = stripWordPressImages(post.content || '');

    if (removedCount > 0) {
      await prisma.post.update({
        where: { id: post.id },
        data: { content: cleaned },
      });
      console.log(`✅ [${post.slug}] Removed ${removedCount} WP image(s)`);
      totalRemoved += removedCount;
      updatedPosts++;
    } else {
      // Check if WP domain still exists in content (catch-all sanity check)
      if (post.content && post.content.includes(WP_DOMAIN)) {
        console.log(`⚠️  [${post.slug}] Still contains WP URL but no pattern matched — check manually`);
        console.log(`   Sample: ${post.content.substring(post.content.indexOf(WP_DOMAIN) - 20, post.content.indexOf(WP_DOMAIN) + 60)}`);
      } else {
        skippedPosts++;
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Done!\n');
  console.log(`📊 Summary:`);
  console.log(`   Posts processed:  ${posts.length}`);
  console.log(`   Posts updated:    ${updatedPosts}`);
  console.log(`   Posts unchanged:  ${skippedPosts}`);
  console.log(`   Total WP images removed: ${totalRemoved}`);

  // Final verification: check if any post still contains WP URLs
  const remaining = await prisma.post.findMany({
    where: {
      content: { contains: 'mainstreetglobal.ca/wp-content' },
    },
    select: { slug: true, title: true },
  });

  if (remaining.length > 0) {
    console.log(`\n⚠️  ${remaining.length} post(s) still contain WP URLs:`);
    remaining.forEach(p => console.log(`   - ${p.slug}`));
  } else {
    console.log(`\n🎉 All WP image URLs successfully removed!`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
