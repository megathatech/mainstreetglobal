import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function fixAuthors() {
  console.log('🔧 Updating all authors to "Ken Gooz"...\n');
  
  try {
    const result = await prisma.post.updateMany({
      where: {
        OR: [
          { author: 'mainstreetglobalca' },
          { author: { not: 'Ken Gooz' } }
        ]
      },
      data: {
        author: 'Ken Gooz'
      }
    });
    
    console.log(`✅ Updated ${result.count} posts`);
    
    const totalKenGooz = await prisma.post.count({
      where: { author: 'Ken Gooz' }
    });
    
    console.log(`✅ Total posts by Ken Gooz: ${totalKenGooz}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixAuthors();
