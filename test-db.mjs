import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function testDB() {
  try {
    const count = await prisma.post.count();
    console.log('✅ Total posts in database:', count);
    
    if (count > 0) {
      const posts = await prisma.post.findMany({
        take: 3,
        select: { title: true, slug: true, published: true }
      });
      console.log('\n📝 Sample posts:');
      posts.forEach(p => console.log(`  - ${p.title} (published: ${p.published})`));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();
