import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginatedPosts } from "@/lib/blog";

// Ken Gooz author info with Cloudinary photo
const AUTHOR_INFO = {
  name: "Ken Gooz",
  photo: "https://res.cloudinary.com/qdlpc6n3/image/upload/v1786764288/kengooz-profile.jpg",
};

const PER_PAGE = 9;

export const metadata = {
  title: "Blog Post - International Restaurant Consulting & Development",
  description:
    "Explore expert insights, strategies, and updates from Ken Gooz and Mainstreet Global on hospitality advisory, franchise development, and restaurant management.",
  alternates: {
    canonical: "https://mainstreetglobal.ca/blog-post/",
  },
  openGraph: {
    title: "Blog Post - Ken Gooz",
    description:
      "Expert insights on restaurant consulting, franchise development, and hospitality management.",
    url: "https://mainstreetglobal.ca/blog-post/",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPostPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  const { posts, totalPages, totalPosts } = await getPaginatedPosts(currentPage, PER_PAGE);

  // Build page URL helper
  const pageUrl = (p: number) => (p === 1 ? "/blog-post" : `/blog-post?page=${p}`);

  // Generate page numbers to show (max 5 around current)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900">Blog Post •</h1>
          {totalPosts > 0 && (
            <p className="mt-2 text-sm text-neutral-500">
              {totalPosts} articles · Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-lg bg-blue-50 p-8 text-center">
            <p className="text-neutral-600">
              Belum ada post. Jalankan{" "}
              <code className="rounded bg-white px-2 py-1 text-sm font-mono text-blue-600">
                node scripts/migrate-blog-to-db.mjs
              </code>{" "}
              untuk migrasi konten dari WordPress.
            </p>
          </div>
        ) : (
          <>
            {/* Post Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-xl"
                >
                  {/* Featured Image with Category Badge */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                    {post.coverImage ? (
                      <>
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Unsplash Attribution Overlay */}
                        {post.coverImageCredit && (
                          <div className="absolute bottom-1 right-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
                            {(() => {
                              const [name, link] = post.coverImageCredit.split("|");
                              return (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {name}
                                </a>
                              );
                            })()}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <Tag className="mx-auto h-12 w-12 text-blue-400" strokeWidth={1.5} />
                          <p className="mt-2 text-sm text-blue-600">Featured Image</p>
                        </div>
                      </div>
                    )}
                    {post.categories && post.categories.length > 0 && (
                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-[var(--kengooz-navy)] px-3 py-1 text-xs font-semibold text-white">
                          {post.categories[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <Link href={`/blog-post/${post.slug}`} className="group/title">
                      <h2 className="text-xl font-bold leading-tight text-neutral-900 transition-colors group-hover/title:text-[var(--kengooz-navy)]">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                      {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                      <div className="flex items-center gap-2">
                        <Image
                          src={AUTHOR_INFO.photo}
                          alt={AUTHOR_INFO.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>By {post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </div>
                    </div>

                    {/* Read More */}
                    <Link
                      href={`/blog-post/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--kengooz-navy)] transition-colors hover:text-[var(--kengooz-maroon)]"
                    >
                      Read More
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Blog pagination"
                className="mt-12 flex items-center justify-center gap-1"
              >
                {/* Prev */}
                <Link
                  href={pageUrl(currentPage - 1)}
                  aria-label="Previous page"
                  aria-disabled={currentPage === 1}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${
                    currentPage === 1
                      ? "pointer-events-none border-neutral-200 text-neutral-300"
                      : "border-neutral-300 text-neutral-600 hover:border-[var(--kengooz-navy)] hover:text-[var(--kengooz-navy)]"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="flex h-9 w-9 items-center justify-center text-sm text-neutral-400"
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={pageUrl(p as number)}
                      aria-label={`Page ${p}`}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                        p === currentPage
                          ? "border-[var(--kengooz-navy)] bg-[var(--kengooz-navy)] text-white"
                          : "border-neutral-300 text-neutral-600 hover:border-[var(--kengooz-navy)] hover:text-[var(--kengooz-navy)]"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}

                {/* Next */}
                <Link
                  href={pageUrl(currentPage + 1)}
                  aria-label="Next page"
                  aria-disabled={currentPage === totalPages}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${
                    currentPage === totalPages
                      ? "pointer-events-none border-neutral-200 text-neutral-300"
                      : "border-neutral-300 text-neutral-600 hover:border-[var(--kengooz-navy)] hover:text-[var(--kengooz-navy)]"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </nav>
            )}

            {/* Unsplash Attribution Footer */}
            <div className="mt-8 text-center text-xs text-neutral-500">
              Images from{" "}
              <a
                href="https://unsplash.com?utm_source=ken_gooz&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-700"
              >
                Unsplash
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
