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
  console.log('🔧 Updating categories...\n');
  
  try {
    // 1. Find all categories
    const allCategories = await prisma.category.findMany();
    console.log('Current categories:', allCategories.map(c => `${c.name} (${c.slug})`));
    
    // 2. Find or create @kengooz category
    let kengoozCategory = await prisma.category.findFirst({
      where: { slug: 'kengooz' }
    });
    
    if (!kengoozCategory) {
      kengoozCategory = await prisma.category.create({
        data: {
          name: '@kengooz',
          slug: 'kengooz'
        }
      });
      console.log('✅ Created @kengooz category');
    } else {
      // Update name if needed
      if (kengoozCategory.name !== '@kengooz') {
        kengoozCategory = await prisma.category.update({
          where: { id: kengoozCategory.id },
          data: { name: '@kengooz' }
        });
        console.log('✅ Updated category name to @kengooz');
      }
    }
    
    // 3. Find categories to merge (Uncategorized, Ken Gooz, etc)
    const categoriesToMerge = await prisma.category.findMany({
      where: {
        AND: [
          { id: { not: kengoozCategory.id } },
          {
            OR: [
              { slug: 'uncategorized' },
              { name: 'Uncategorized' },
              { name: 'Ken Gooz' },
              { name: { contains: 'kengooz', mode: 'insensitive' } }
            ]
          }
        ]
      }
    });
    
    console.log(`\n📦 Found ${categoriesToMerge.length} categories to merge`);
    
    // 4. Move all posts to @kengooz and delete old categories
    for (const oldCategory of categoriesToMerge) {
      console.log(`   Moving posts from: ${oldCategory.name}`);
      
      const posts = await prisma.post.findMany({
        where: {
          categories: {
            some: { id: oldCategory.id }
          }
        },
        select: { id: true }
      });
      
      console.log(`   Found ${posts.length} posts`);
      
      for (const post of posts) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            categories: {
              disconnect: { id: oldCategory.id },
              connect: { id: kengoozCategory.id }
            }
          }
        });
      }
      
      // Delete old category
      await prisma.category.delete({
        where: { id: oldCategory.id }
      });
      
      console.log(`   ✅ Deleted: ${oldCategory.name}`);
    }
    
    // 5. Final status
    const finalCategories = await prisma.category.findMany();
    console.log(`\n✅ Final categories: ${finalCategories.length}`);
    finalCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });
    
    const totalPosts = await prisma.post.count({
      where: {
        categories: {
          some: { id: kengoozCategory.id }
        }
      }
    });
    
    console.log(`\n✅ Total posts with @kengooz: ${totalPosts}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategories();
