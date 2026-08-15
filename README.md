# Mainstreet Global / Ken Gooz / Brittco - Multi-Brand Website

A Next.js 16 multi-brand website showcasing three distinct restaurant consulting brands: **Ken Gooz**, **Mainstreet Global**, and **Brittco Consulting**.

## 🎨 Features

### Multi-Brand Architecture
- **3 Distinct Brands** with separate layouts, headers, and footers
- **Route Groups** for organized brand separation
- **Custom Color Palettes** for each brand
- **Responsive Design** with mobile-first approach

### Ken Gooz (Main Brand)
- **Homepage**: Hero section, services overview, CTA buttons
- **Blog**: MDX-powered blog with category filtering
- **Contact**: Two-column layout with form and contact info
- **Colors**: Beige (#F5F5DC), Navy (#001F3F), Maroon (#800020)

### Mainstreet Global
- **Services Page**: 6 service cards with icons
- **Corporate Layout**: Professional blue gradient theme
- **Colors**: Blue (#1E3A8A), Light Blue (#3B82F6), Gray (#6B7280)

### Brittco Consulting
- **About/Expertise/Services/Values**: Comprehensive sections
- **Black & Red Theme**: Bold, modern design
- **Colors**: Black (#000000), Red (#DC2626), Yellow accents

### Technical Stack
- **Framework**: Next.js 16.3.1 with App Router & Turbopack
- **Styling**: TailwindCSS with custom color palette
- **Icons**: Lucide React
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Images**: Unsplash API integration
- **Forms**: Web3Forms for contact submissions
- **Content**: MDX for blog posts
- **TypeScript**: Full type safety

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL database (Neon recommended)
- Unsplash API account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mainstreet-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan credentials kamu:
```env
# Database - PostgreSQL Neon
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Unsplash API
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY="your_access_key"
UNSPLASH_SECRET_KEY="your_secret_key"

# Web3Forms - Contact Form
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY="your_web3forms_key"
```

4. **Setup Database**

Generate Prisma client:
```bash
npx prisma generate
```

Push schema to database:
```bash
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mainstreet-nextjs/
├── app/
│   ├── (kengooz)/          # Ken Gooz routes
│   │   ├── layout.tsx      # Ken Gooz layout
│   │   ├── page.tsx        # Homepage
│   │   ├── blog-post/      # Blog listing & detail
│   │   └── contact-us/     # Contact page
│   ├── (mainstreet)/       # Mainstreet Global routes
│   │   ├── layout.tsx      
│   │   └── mainstreet-global/
│   ├── (brittco)/          # Brittco routes
│   │   ├── layout.tsx
│   │   └── brittco-consulting/
│   ├── api/
│   │   └── unsplash/       # Unsplash API endpoint
│   ├── globals.css         # Global styles + custom colors
│   └── layout.tsx          # Root layout
├── components/
│   ├── headers/            # Brand-specific headers
│   ├── footers/            # Brand-specific footers
│   ├── forms/              # Contact form
│   └── shared/             # Shared components
├── content/
│   └── blog/               # MDX blog posts
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── unsplash.ts         # Unsplash helpers
│   └── blog.ts             # Blog utilities
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── scripts/                # Utility scripts
```

## 🎯 Key Features

### 1. Navigation System
- **Desktop**: Dropdown menu with "Menu" label and ChevronDown icon
- **Mobile**: Burger menu (3 lines) → Sidebar slide-in from right
- **Dynamic Headers**: Different layouts for homepage vs internal pages

### 2. Database Integration (PostgreSQL + Prisma)
- **Posts Table**: Blog posts with categories, images, publish status
- **Categories Table**: Blog categories with many-to-many relationship
- **Contacts Table**: Contact form submissions

See [DATABASE.md](./DATABASE.md) for detailed documentation.

### 3. Unsplash API
- Dynamic featured images for blog posts
- Restaurant-themed image library
- Client & server-side helpers
- Built-in attribution

See [UNSPLASH.md](./UNSPLASH.md) for usage guide.

### 4. Blog System
- MDX support for rich content
- Category filtering
- Featured images (Unsplash or static)
- SEO-friendly URLs
- Pagination ready

### 5. Contact Form
- Web3Forms integration
- Form validation
- Success/error states
- Loading indicators

## 🎨 Color Palette

### Ken Gooz
```css
--kengooz-beige: #F5F5DC
--kengooz-navy: #001F3F
--kengooz-maroon: #800020
```

### Mainstreet Global
```css
--mainstreet-blue: #1E3A8A
--mainstreet-light-blue: #3B82F6
--mainstreet-gray: #6B7280
```

### Brittco Consulting
```css
--brittco-red: #DC2626
--brittco-black: #000000
--brittco-yellow: #FCD34D (accents)
```

## 📝 Content Management

### Adding Blog Posts

1. Create MDX file in `content/blog/`:
```mdx
---
title: "Your Post Title"
date: "2024-01-01"
author: "Ken Gooz"
category: "Management"
excerpt: "Short description"
---

# Your Content Here

Write your blog post content in MDX format.
```

2. Images automatically fetch from Unsplash or use placeholder

### Database Operations

```typescript
import { prisma } from '@/lib/prisma';

// Create post
const post = await prisma.post.create({
  data: {
    title: 'New Post',
    slug: 'new-post',
    content: 'Content...',
    published: true
  }
});

// Get published posts
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { categories: true }
});
```

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes

# Linting
npm run lint         # Run ESLint
```

## 📚 Documentation

- [DATABASE.md](./DATABASE.md) - Database schema & Prisma usage
- [UNSPLASH.md](./UNSPLASH.md) - Unsplash API integration guide
- [UNSPLASH_EXAMPLES.md](./UNSPLASH_EXAMPLES.md) - Code examples
- [CLAUDE.md](./CLAUDE.md) - AI assistant context

## 🌐 Pages Overview

| Route | Brand | Description |
|-------|-------|-------------|
| `/` | Ken Gooz | Homepage with hero & services |
| `/blog-post` | Ken Gooz | Blog listing (3-column) |
| `/blog-post/[slug]` | Ken Gooz | Blog post detail |
| `/contact-us` | Ken Gooz | Contact form & info |
| `/mainstreet-global` | Mainstreet | Services showcase |
| `/brittco-consulting` | Brittco | About, Services, Values |

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
   - `UNSPLASH_SECRET_KEY`
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
4. Deploy

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## 📦 Dependencies

### Core
- `next` 16.3.1
- `react` 19.0.0
- `typescript` 5.7.2

### Styling
- `tailwindcss` 4.0.16
- `lucide-react` 0.469.0

### Database
- `@prisma/client` 7.9.1
- `prisma` 7.9.1

### Forms & APIs
- `@web3forms/react` 2.0.0
- Native fetch for Unsplash

### Content
- `next-mdx-remote` 5.0.0
- `gray-matter` 4.0.3

## 🤝 Contributing

This is a private project for Ken Gooz / Mainstreet Global / Brittco brands.

## 📄 License

Private - All Rights Reserved

## 🔗 Links

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Unsplash API**: https://unsplash.com/documentation
- **TailwindCSS**: https://tailwindcss.com/docs

## 📞 Support

For questions or support, contact: [Your Contact Email]

---

Built with ❤️ using Next.js 16 & Turbopack
