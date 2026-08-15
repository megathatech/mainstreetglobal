import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function fixCategories() {
  console.log('🔧 Simplifying categories to only @kengooz...\n');
  
  try {
    // Get all categories
    const categories = await prisma.category.findMany();
    console.log('Current categories:', categories.map(c => c.name));
    
    // Find @kengooz category
    let kengooz = categories.find(c => c.slug === 'kengooz');
    
    if (!kengooz) {
      kengooz = await prisma.category.create({
        data: { name: '@kengooz', slug: 'kengooz' }
      });
      console.log('✅ Created @kengooz category');
    }
    
    // Update all posts to use @kengooz category only
    const allPosts = await prisma.post.findMany({
      include: { categories: true }
    });
    
    console.log(`\n📝 Processing ${allPosts.length} posts...`);
    
    for (const post of allPosts) {
      // Check if post already has @kengooz
      const hasKengooz = post.categories.some(c => c.id === kengooz.id);
      
      if (!hasKengooz) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            categories: {
              set: [{ id: kengooz.id }]
            }
          }
        });
      } else if (post.categories.length > 1) {
        // Has kengooz but also other categories, keep only kengooz
        await prisma.post.update({
          where: { id: post.id },
          data: {
            categories: {
              set: [{ id: kengooz.id }]
            }
          }
        });
      }
    }
    
    console.log('✅ All posts now use @kengooz category');
    
    // Delete other categories
    const otherCategories = categories.filter(c => c.id !== kengooz.id);
    for (const cat of otherCategories) {
      try {
        await prisma.category.delete({ where: { id: cat.id } });
        console.log(`✅ Deleted: ${cat.name}`);
      } catch (e) {
        console.log(`⚠️  Could not delete ${cat.name}: ${e.message}`);
      }
    }
    
    // Verify
    const finalCategories = await prisma.category.findMany();
    console.log(`\n✅ Final categories: ${finalCategories.map(c => c.name).join(', ')}`);
    
    const postsCount = await prisma.post.count({
      where: { categories: { some: { id: kengooz.id } } }
    });
    console.log(`✅ Posts with @kengooz: ${postsCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategories();
