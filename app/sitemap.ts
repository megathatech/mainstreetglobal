import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://mainstreetglobal.ca";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: `${BASE_URL}/`, priority: 1 },
    { url: `${BASE_URL}/mainstreet-global/`, priority: 0.9 },
    { url: `${BASE_URL}/brittco-consulting/`, priority: 0.9 },
    { url: `${BASE_URL}/blog-post/`, priority: 0.8 },
    { url: `${BASE_URL}/contact-us/`, priority: 0.7 },
  ];

  const posts = await getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${BASE_URL}/blog-post/${post.slug}/`,
    lastModified: new Date(post.date),
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
