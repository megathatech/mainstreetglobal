import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";

// Ken Gooz author info with Cloudinary photo
const AUTHOR_INFO = {
  name: "Ken Gooz",
  photo: "https://res.cloudinary.com/qdlpc6n3/image/upload/v1786764288/kengooz-profile.jpg"
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `https://mainstreetglobal.ca/blog-post/${post.slug}/`;
  return {
    title: `${post.title} - Ken Gooz`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    image: post.coverImage
      ? [post.coverImage]
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Mainstreet Global Inc",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Navigation */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blog-post"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-[var(--kengooz-navy)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      <article className="bg-gradient-to-b from-white to-neutral-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--kengooz-navy)] px-3 py-1 text-xs font-semibold text-white"
                >
                  <Tag className="h-3 w-3" />
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <Image
                src={AUTHOR_INFO.photo}
                alt={AUTHOR_INFO.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>
                By <span className="font-semibold">{post.author}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
            {post.coverImage ? (
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center">
                <div className="text-center">
                  <Tag className="mx-auto h-16 w-16 text-blue-400" strokeWidth={1.5} />
                  <p className="mt-3 text-lg font-medium text-blue-600">Featured Image</p>
                </div>
              </div>
            )}
            
            {/* Unsplash Attribution */}
            {post.coverImage && post.coverImageCredit && (
              <div className="bg-neutral-50 px-4 py-2 text-xs text-neutral-600 border-t border-neutral-200">
                Photo by{' '}
                {(() => {
                  const [name, link] = post.coverImageCredit.split('|');
                  return (
                    <a 
                      href={`${link}?utm_source=ken_gooz&utm_medium=referral`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {name}
                    </a>
                  );
                })()}
                {' '}on{' '}
                <a 
                  href="https://unsplash.com?utm_source=ken_gooz&utm_medium=referral" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  Unsplash
                </a>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-neutral mt-12 max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-p:leading-relaxed prose-a:text-[var(--kengooz-navy)] prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-img:rounded-lg">
            <MDXRemote source={post.content} />
          </div>

          {/* Share/Footer Section */}
          <div className="mt-16 border-t border-neutral-200 pt-8">
            <Link
              href="/blog-post"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--kengooz-navy)] transition-colors hover:text-[var(--kengooz-maroon)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
