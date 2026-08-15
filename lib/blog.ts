import { prisma } from './prisma';
import type { Post, Category } from '@prisma/client';

// Prisma relation type: Post with categories included
type PostWithCategories = Post & {
  categories: Category[];
};

export type BlogPostMeta = {
  title: string;
  slug: string;
  date: string;
  author: string;
  excerpt: string;
  categories: string[];
  coverImage?: string;
  coverImageCredit?: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

function mapPost(post: PostWithCategories): BlogPostMeta {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date.toISOString(),
    author: post.author,
    excerpt: post.excerpt || '',
    categories: post.categories.map((cat: Category) => cat.name),
    coverImage: post.coverImage || undefined,
    coverImageCredit: post.coverImageCredit || undefined,
  };
}

/**
 * Get all published posts from database
 */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { categories: true },
      orderBy: { date: 'desc' },
    });

    return posts.map((post: PostWithCategories) => mapPost(post));
  } catch (error) {
    console.warn('Unable to fetch posts from database:', error);
    return [];
  }
}

export type PaginatedPosts = {
  posts: BlogPostMeta[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

/**
 * Get paginated posts from database
 */
export async function getPaginatedPosts(
  page: number = 1,
  perPage: number = 9
): Promise<PaginatedPosts> {
  try {
    const skip = (page - 1) * perPage;

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        include: { categories: true },
        orderBy: { date: 'desc' },
        skip,
        take: perPage,
      }),
      prisma.post.count({ where: { published: true } }),
    ]);

    return {
      posts: posts.map((post: PostWithCategories) => mapPost(post)),
      totalPosts,
      totalPages: Math.ceil(totalPosts / perPage),
      currentPage: page,
      perPage,
    };
  } catch (error) {
    console.warn('Unable to fetch posts from database:', error);
    return { posts: [], totalPosts: 0, totalPages: 0, currentPage: 1, perPage };
  }
}

/**
 * Get single post by slug from database
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { categories: true },
    });

    if (!post) return null;

    return {
      ...mapPost(post),
      content: post.content,
    };
  } catch (error) {
    console.warn('Unable to fetch post from database:', error);
    return null;
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });

    return posts.map((post: { slug: string }) => post.slug);
  } catch (error) {
    console.warn('Unable to fetch posts from database:', error);
    return [];
  }
}
