/**
 * scripts/migrate-blog.mjs
 *
 * One-time migration: tarik SEMUA post dari WordPress REST API
 * dan simpan sebagai file .mdx di content/blog/.
 *
 * Cara pakai:
 *   node scripts/migrate-blog.mjs
 *
 * Setelah ini jalan, WP tidak lagi dibutuhkan untuk blog —
 * semua konten sudah jadi file lokal di content/blog/*.mdx
 */

import fs from "node:fs";
import path from "node:path";
import TurndownService from "turndown";

const WP_BASE = "https://mainstreetglobal.ca/wp-json/wp/v2";
const OUTPUT_DIR = path.join(process.cwd(), "content", "blog");
const IMAGES_DIR = path.join(process.cwd(), "public", "blog-images");

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchAllPosts() {
  let page = 1;
  let allPosts = [];

  while (true) {
    const res = await fetch(
      `${WP_BASE}/posts?per_page=100&page=${page}&_embed=1`
    );

    if (res.status === 400) break; // sudah lewat halaman terakhir
    if (!res.ok) throw new Error(`WP API error: ${res.status} ${res.statusText}`);

    const posts = await res.json();
    if (posts.length === 0) break;

    allPosts = allPosts.concat(posts);

    const totalPages = Number(res.headers.get("x-wp-totalpages") || "1");
    if (page >= totalPages) break;
    page++;
  }

  return allPosts;
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

async function downloadImage(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    fs.writeFileSync(path.join(IMAGES_DIR, filename), buffer);
    return `/blog-images/${filename}`;
  } catch {
    return null;
  }
}

async function migrate() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("Fetching posts from WordPress REST API...");
  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} posts.`);

  for (const post of posts) {
    const title = stripHtml(post.title.rendered);
    const slug = post.slug || slugify(title);
    const excerpt = stripHtml(post.excerpt.rendered).slice(0, 200);
    const date = post.date;
    const author = post._embedded?.author?.[0]?.name || "Ken Gooz";
    const categories =
      post._embedded?.["wp:term"]?.[0]?.map((c) => c.name).filter(Boolean) ||
      [];

    // Featured image: download locally so we don't depend on WP hosting anymore
    let coverImage = null;
    const featuredUrl =
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
    if (featuredUrl) {
      const ext = path.extname(new URL(featuredUrl).pathname) || ".jpg";
      const filename = `${slug}${ext}`;
      coverImage = await downloadImage(featuredUrl, filename);
    }

    // Convert HTML content -> Markdown
    const markdownBody = turndown.turndown(post.content.rendered);

    const frontmatter = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `slug: ${JSON.stringify(slug)}`,
      `date: ${JSON.stringify(date)}`,
      `author: ${JSON.stringify(author)}`,
      `excerpt: ${JSON.stringify(excerpt)}`,
      `categories: ${JSON.stringify(categories)}`,
      coverImage ? `coverImage: ${JSON.stringify(coverImage)}` : null,
      "---",
    ]
      .filter(Boolean)
      .join("\n");

    const fileContent = `${frontmatter}\n\n${markdownBody}\n`;
    const outPath = path.join(OUTPUT_DIR, `${slug}.mdx`);
    fs.writeFileSync(outPath, fileContent, "utf-8");
    console.log(`Wrote ${slug}.mdx`);
  }

  console.log(`\nDone. ${posts.length} posts migrated to content/blog/`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
