\# I8 Studio Website — Final Build Spec



\## Overview

Full rebuild of i8studio.vn. Clone gốc + sales optimization + admin panel.

CG outsourcing company: 3DCG, Animation, VR, BIM for Japanese architecture market.

Target: Japanese architecture firms, developers, game studios.



\## Tech Stack

\- Next.js 14 (App Router) + TypeScript strict

\- Tailwind CSS v3.4

\- Prisma + SQLite (file: ./prisma/data/i8studio.db)

\- NextAuth.js (credentials provider, bcryptjs)

\- next-intl (i18n: en, ja)

\- Framer Motion (scroll animations, page transitions)

\- TipTap (@tiptap/react + @tiptap/starter-kit + @tiptap/extension-image) — WYSIWYG

\- sharp (image resize max 1920px, WebP conversion)

\- Zod (all input validation)

\- next-sitemap (auto sitemap.xml + robots.txt)

\- react-countup (animated stats)

\- lucide-react (icons)

\- next/font/google → Outfit (300,400,500,600,700,800)

\- date-fns (date formatting)

\- react-pageflip (flipbook page turning animation, 39k weekly downloads)

\- react-pdf + pdfjs-dist (render PDF pages to canvas for flipbook)

\- @react-pdf-viewer/core (fallback PDF viewer)



\## Directory Structure

```

src/

├── app/

│   ├── \[locale]/                    # i18n: en | ja

│   │   ├── layout.tsx               # Public layout: Header + Footer + FloatingCTA

│   │   ├── (public)/

│   │   │   ├── page.tsx             # Homepage (all 16 sections)

│   │   │   ├── service/

│   │   │   │   ├── page.tsx         # Service listing

│   │   │   │   └── \[slug]/page.tsx  # Service detail

│   │   │   ├── works/page.tsx       # Portfolio gallery + category filter

│   │   │   ├── about-us/page.tsx    # About page

│   │   │   ├── news/

│   │   │   │   ├── page.tsx         # News listing + pagination

│   │   │   │   └── \[slug]/page.tsx  # News detail

│   │   │   ├── blog/

│   │   │   │   ├── page.tsx

│   │   │   │   └── \[slug]/page.tsx

│   │   │   ├── case-studies/

│   │   │   │   ├── page.tsx

│   │   │   │   └── \[slug]/page.tsx

│   │   │   ├── qa/page.tsx          # Full Q\&A page

│   │   │   ├── insights/           # PDF Flipbook viewer (like PEDI Insights)

│   │   │   │   └── page.tsx        # Grid of flipbooks + inline viewer

│   │   │   └── contact/page.tsx     # Dedicated contact page

│   │   └── not-found.tsx            # Custom 404

│   │

│   ├── admin/                       # Admin panel (NO i18n, always Vietnamese)

│   │   ├── login/page.tsx           # Login form

│   │   ├── layout.tsx               # Sidebar + AdminHeader + Toast provider

│   │   ├── page.tsx                 # Dashboard

│   │   ├── posts/

│   │   │   ├── page.tsx             # DataTable: list all posts

│   │   │   ├── new/page.tsx         # Create post form

│   │   │   └── \[id]/page.tsx        # Edit post form

│   │   ├── works/

│   │   │   ├── page.tsx

│   │   │   ├── new/page.tsx

│   │   │   └── \[id]/page.tsx

│   │   ├── services/

│   │   │   ├── page.tsx

│   │   │   ├── new/page.tsx

│   │   │   └── \[id]/page.tsx

│   │   ├── testimonials/

│   │   │   ├── page.tsx

│   │   │   ├── new/page.tsx

│   │   │   └── \[id]/page.tsx

│   │   ├── partners/

│   │   │   ├── page.tsx

│   │   │   └── \[id]/page.tsx

│   │   ├── case-studies/

│   │   │   ├── page.tsx

│   │   │   ├── new/page.tsx

│   │   │   └── \[id]/page.tsx

│   │   ├── qa/

│   │   │   ├── page.tsx

│   │   │   └── \[id]/page.tsx

│   │   ├── slides/

│   │   │   ├── page.tsx

│   │   │   └── \[id]/page.tsx

│   │   ├── contacts/

│   │   │   ├── page.tsx             # List contact submissions

│   │   │   └── \[id]/page.tsx        # View detail + mark read

│   │   ├── subscribers/page.tsx     # Email subscribers list + export CSV

│   │   ├── flipbooks/              # PDF Flipbook management

│   │   │   ├── page.tsx             # List all flipbooks

│   │   │   ├── new/page.tsx         # Upload new PDF flipbook

│   │   │   └── \[id]/page.tsx        # Edit flipbook details

│   │   ├── media/page.tsx           # Media library: grid, upload, delete, copy URL

│   │   └── settings/page.tsx        # Company info key-value editor

│   │

│   ├── api/

│   │   ├── auth/\[...nextauth]/route.ts

│   │   ├── posts/

│   │   │   ├── route.ts             # GET ?page=\&limit=\&category=\&status=\&search=  |  POST

│   │   │   └── \[id]/route.ts        # GET | PUT | DELETE

│   │   ├── works/

│   │   │   ├── route.ts

│   │   │   └── \[id]/route.ts

│   │   ├── services/

│   │   │   ├── route.ts

│   │   │   └── \[id]/route.ts

│   │   ├── testimonials/

│   │   │   ├── route.ts

│   │   │   └── \[id]/route.ts

│   │   ├── partners/

│   │   │   ├── route.ts

│   │   │   └── \[id]/route.ts

│   │   ├── case-studies/

│   │   │   ├── route.ts

│   │   │   └── \[id]/route.ts

│   │   ├── qa/

│   │   │   ├── route.ts

│   │   │   └── \[id]/route.ts

│   │   ├── slides/

│   │   │   ├── route.ts

│   │   │   └── \[id]/route.ts

│   │   ├── contacts/

│   │   │   ├── route.ts             # GET list | POST (public form submit)

│   │   │   └── \[id]/route.ts        # GET | PUT (mark read) | DELETE

│   │   ├── subscribers/route.ts     # GET list | POST (email capture)

│   │   ├── flipbooks/

│   │   │   ├── route.ts             # GET list | POST (create + upload PDF)

│   │   │   └── \[id]/route.ts        # GET | PUT | DELETE

│   │   ├── settings/route.ts        # GET | PUT

│   │   ├── upload/route.ts          # POST multipart → resize → save to public/uploads/

│   │   ├── upload-pdf/route.ts      # POST multipart PDF → save to public/uploads/pdfs/

│   │   └── analytics/route.ts       # POST { type, page, metadata }

│   │

│   └── layout.tsx                   # Root layout (html, body)

│

├── components/

│   ├── public/

│   │   ├── Header.tsx

│   │   ├── Footer.tsx

│   │   ├── HeroSlider.tsx

│   │   ├── SocialProofBar.tsx

│   │   ├── StrengthsSection.tsx

│   │   ├── StatsCounter.tsx

│   │   ├── ServicesSection.tsx

│   │   ├── WorksSection.tsx

│   │   ├── ProcessSection.tsx

│   │   ├── TestimonialsSection.tsx

│   │   ├── AboutSection.tsx

│   │   ├── CaseStudyPreview.tsx

│   │   ├── ConcernsSection.tsx

│   │   ├── NewsSection.tsx

│   │   ├── QASection.tsx

│   │   ├── ContactSection.tsx

│   │   ├── FloatingCTA.tsx

│   │   ├── ExitIntentPopup.tsx

│   │   ├── FadeIn.tsx

│   │   ├── Lightbox.tsx

│   │   └── FlipbookViewer.tsx       # PDF flipbook with react-pageflip + react-pdf

│   ├── admin/

│   │   ├── Sidebar.tsx

│   │   ├── AdminHeader.tsx

│   │   ├── DataTable.tsx

│   │   ├── RichEditor.tsx

│   │   ├── ImageUpload.tsx

│   │   ├── StatsCard.tsx

│   │   ├── ConfirmDialog.tsx

│   │   ├── Pagination.tsx

│   │   └── Toast.tsx

│   └── ui/

│       ├── Button.tsx

│       ├── Input.tsx

│       ├── Textarea.tsx

│       ├── Select.tsx

│       ├── Badge.tsx

│       ├── Modal.tsx

│       ├── Skeleton.tsx

│       └── Switch.tsx

│

├── lib/

│   ├── prisma.ts                    # Singleton: globalThis.\_\_prisma

│   ├── auth.ts                      # NextAuth config

│   ├── utils.ts                     # slugify, formatDate, cn(), truncate

│   └── validations.ts              # Zod schemas for every entity

│

├── messages/

│   ├── en.json

│   └── ja.json

│

├── middleware.ts                    # Protect /admin/\*, redirect /admin/login if no session

│

├── prisma/

│   ├── schema.prisma

│   ├── seed.ts

│   └── data/                        # SQLite db file lives here (gitignored)

│

└── public/

&#x20;   ├── uploads/                     # User-uploaded images (gitignored)

&#x20;   ├── favicon.ico

&#x20;   └── og-default.jpg               # Default OG image

```



\## Prisma Schema



```prisma

generator client {

&#x20; provider = "prisma-client-js"

}

datasource db {

&#x20; provider = "sqlite"

&#x20; url      = env("DATABASE\_URL")

}



model User {

&#x20; id        String   @id @default(cuid())

&#x20; email     String   @unique

&#x20; password  String                          // bcrypt hashed

&#x20; name      String

&#x20; role      String   @default("ADMIN")

&#x20; createdAt DateTime @default(now())

}



model Post {

&#x20; id              String    @id @default(cuid())

&#x20; title           String

&#x20; titleJa         String    @default("")

&#x20; slug            String    @unique

&#x20; content         String    @default("")

&#x20; contentJa       String    @default("")

&#x20; excerpt         String    @default("")

&#x20; excerptJa       String    @default("")

&#x20; coverImage      String    @default("")

&#x20; category        String    @default("NEWS")     // NEWS | BLOG

&#x20; status          String    @default("DRAFT")    // DRAFT | PUBLISHED

&#x20; metaTitle       String    @default("")

&#x20; metaDescription String    @default("")

&#x20; publishedAt     DateTime?

&#x20; createdAt       DateTime  @default(now())

&#x20; updatedAt       DateTime  @updatedAt

}



model Work {

&#x20; id        String   @id @default(cuid())

&#x20; title     String

&#x20; titleJa   String   @default("")

&#x20; subtitle  String   @default("")

&#x20; category  String   @default("3DCG")      // 3DCG | Animation | VR | BIM

&#x20; image     String   @default("")

&#x20; videoUrl  String   @default("")           // YouTube embed URL

&#x20; order     Int      @default(0)

&#x20; featured  Boolean  @default(false)

&#x20; createdAt DateTime @default(now())

}



model Service {

&#x20; id            String   @id @default(cuid())

&#x20; name          String

&#x20; nameJa        String   @default("")

&#x20; slug          String   @unique

&#x20; description   String   @default("")

&#x20; descriptionJa String   @default("")

&#x20; icon          String   @default("")       // lucide icon name

&#x20; image         String   @default("")

&#x20; priceHint     String   @default("")       // "From ¥50,000"

&#x20; priceHintJa   String   @default("")

&#x20; order         Int      @default(0)

&#x20; createdAt     DateTime @default(now())

}



model Slide {

&#x20; id         String   @id @default(cuid())

&#x20; title      String

&#x20; titleJa    String   @default("")

&#x20; subtitle   String   @default("")

&#x20; subtitleJa String   @default("")

&#x20; image      String   @default("")

&#x20; gradient   String   @default("")          // Tailwind gradient classes

&#x20; order      Int      @default(0)

&#x20; active     Boolean  @default(true)

&#x20; createdAt  DateTime @default(now())

}



model QA {

&#x20; id         String   @id @default(cuid())

&#x20; question   String

&#x20; questionJa String   @default("")

&#x20; answer     String

&#x20; answerJa   String   @default("")

&#x20; order      Int      @default(0)

&#x20; createdAt  DateTime @default(now())

}



model Testimonial {

&#x20; id            String   @id @default(cuid())

&#x20; clientName    String

&#x20; clientTitle   String   @default("")

&#x20; clientCompany String   @default("")

&#x20; clientPhoto   String   @default("")

&#x20; quote         String

&#x20; quoteJa       String   @default("")

&#x20; rating        Int      @default(5)

&#x20; featured      Boolean  @default(false)

&#x20; order         Int      @default(0)

&#x20; createdAt     DateTime @default(now())

}



model Partner {

&#x20; id        String   @id @default(cuid())

&#x20; name      String

&#x20; logo      String   @default("")

&#x20; url       String   @default("")

&#x20; order     Int      @default(0)

&#x20; active    Boolean  @default(true)

&#x20; createdAt DateTime @default(now())

}



model CaseStudy {

&#x20; id          String   @id @default(cuid())

&#x20; title       String

&#x20; titleJa     String   @default("")

&#x20; slug        String   @unique

&#x20; client      String   @default("")

&#x20; challenge   String   @default("")

&#x20; challengeJa String   @default("")

&#x20; solution    String   @default("")

&#x20; solutionJa  String   @default("")

&#x20; result      String   @default("")

&#x20; resultJa    String   @default("")

&#x20; beforeImage String   @default("")

&#x20; afterImage  String   @default("")

&#x20; metrics     String   @default("")         // JSON string

&#x20; serviceType String   @default("")

&#x20; featured    Boolean  @default(false)

&#x20; createdAt   DateTime @default(now())

}



model Setting {

&#x20; id    String @id @default(cuid())

&#x20; key   String @unique

&#x20; value String @default("")                 // JSON string for complex values

}



model ContactSubmission {

&#x20; id        String   @id @default(cuid())

&#x20; fullName  String

&#x20; email     String

&#x20; service   String   @default("")

&#x20; message   String

&#x20; read      Boolean  @default(false)

&#x20; createdAt DateTime @default(now())

}



model EmailSubscriber {

&#x20; id        String   @id @default(cuid())

&#x20; email     String   @unique

&#x20; name      String   @default("")

&#x20; source    String   @default("")           // EXIT\_POPUP | FOOTER | INLINE

&#x20; createdAt DateTime @default(now())

}



model AnalyticsEvent {

&#x20; id        String   @id @default(cuid())

&#x20; type      String                          // CTA\_CLICK | FORM\_SUBMIT | PAGE\_VIEW | DOWNLOAD

&#x20; page      String   @default("")

&#x20; metadata  String   @default("")           // JSON string

&#x20; createdAt DateTime @default(now())

}



model Flipbook {

&#x20; id          String   @id @default(cuid())

&#x20; title       String                        // e.g. "i8 Studio Insights Vol.1"

&#x20; titleJa     String   @default("")

&#x20; description String   @default("")

&#x20; descriptionJa String @default("")

&#x20; coverImage  String   @default("")         // Thumbnail for grid display

&#x20; pdfUrl      String                        // Path: /uploads/pdfs/filename.pdf

&#x20; order       Int      @default(0)

&#x20; active      Boolean  @default(true)

&#x20; createdAt   DateTime @default(now())

&#x20; updatedAt   DateTime @updatedAt

}

```



\## Seed Data

Create seed.ts with:

\- 1 admin: admin@i8studio.vn / admin123456 (bcrypt hashed)

\- 6 services: 3DCG, Animation, VR, BIM, Pachinko Slot, Anime (with EN descriptions from original site)

\- 3 slides: "ELEVATE YOUR BUSINESS WITH PHOTOREAL", "HIGH QUALITY LOW PRICE", "SUPPORT YOUR IDEAS"

\- 7 Q\&A items (from original site)

\- 6 works: HOUSE forest, HOTEL curver, HOTEL sidewalk, Temple Kinkakuji, HOUSE bathroom, SAUNA wooden

\- 2 testimonials (sample): Japanese client quotes

\- 5 partners (placeholder names)

\- Settings: companyName="i8 STUDIO", email="info@i8studio.vn", phone="0914 049 090", address="Da Nang, Vietnam", foundedYear="2019"



\## Homepage Sections (in exact order)

```

&#x20;1. Header         — sticky, transparent→solid on scroll, nav links

&#x20;                    (Service, Works, About Us, Insights, News, Q\&A, Blog),

&#x20;                    gradient "Get Quote" CTA button in nav, ENG/日本語 toggle,

&#x20;                    mobile hamburger menu

&#x20;2. Hero Slider    — auto-play 5s, gradient bg, title + subtitle,

&#x20;                    2 CTA buttons: "Get Free Quote" (primary gradient) +

&#x20;                    "View Our Works" (outline white),

&#x20;                    trust line: "Trusted CG partner for 50+ Japanese companies",

&#x20;                    dots nav, scroll-down indicator

&#x20;3. Social Proof   — infinite-scroll logo carousel (Partner table) OR

&#x20;                    if no logos: stats bar "200+ Projects | 50+ Clients | Since 2019"

&#x20;4. Strengths      — image placeholder left, 5 checkmark items right,

&#x20;                    check icon = gradient blue-purple circle

&#x20;5. Stats Counter  — 4 columns: 200+ Projects, 50+ Clients, Since 2019, 5+ Countries

&#x20;                    animated counting on viewport enter (react-countup)

&#x20;6. Services       — subtitle "Service List" + H2 "WHAT WE DO" + paragraph,

&#x20;                    3×2 grid cards, each: image, name, description, priceHint,

&#x20;                    hover: translateY(-4px) + border glow, link to /service/\[slug]

&#x20;7. Works          — subtitle "Track Record" + H2 "Works",

&#x20;                    filter tabs: All | 3DCG | Animation | VR | BIM,

&#x20;                    3×2 grid, each: image + gradient overlay + title + subtitle,

&#x20;                    hover: image scale 1.05 + "View Project →",

&#x20;                    click: Lightbox modal (full image or YouTube embed),

&#x20;                    "View All Works" button

&#x20;8. Process        — H2 "How We Work", 5 steps horizontal (vertical on mobile):

&#x20;                    Inquiry → Consultation → Production → Review → Delivery,

&#x20;                    each with lucide icon + title + short description,

&#x20;                    animated connecting line, "Start Your Project" CTA button

&#x20;9. Testimonials   — H2 "What Our Clients Say",

&#x20;                    2-3 cards: quote, photo placeholder, name, title, company, 5 stars,

&#x20;                    from Testimonial table where featured=true

10\. About Us       — H2 "About us", text paragraph + "Learn more" button left,

&#x20;                    image grid (3 placeholders) right,

&#x20;                    mini timeline below: 2019→2020→2022→2024 milestones

11\. Case Studies   — H2 "Success Stories", 2-3 featured cards,

&#x20;                    each: client, project type, key metric result,

&#x20;                    "View All Case Studies" link.

&#x20;                    SKIP entire section if CaseStudy table is empty.

12\. Concerns       — H2 "Do you have concerns like these?",

&#x20;                    4 cards (icon + text), arrow-down animation,

&#x20;                    CTA text + "Let's Talk" button

13\. News           — H2 "News", 3 latest from Post where category=NEWS \& status=PUBLISHED,

&#x20;                    card: cover image + date + title, "View All News" link

14\. Q\&A            — H2 "Q\&A", accordion from QA table ordered by `order`,

&#x20;                    Framer Motion expand/collapse, "View More Q\&A" link

15\. Contact        — H2 "Contact Us", 2 columns:

&#x20;                    LEFT: form (Name, Email, Service dropdown, Message) = 4 fields,

&#x20;                    Submit button, "We respond within 24 hours",

&#x20;                    "NDA available upon request"

&#x20;                    RIGHT: multi-channel info:

&#x20;                    Email (mailto link), Phone (tel link), Line,

&#x20;                    Chatwork, Address, Working hours Mon-Fri 9:00-18:00 JST

16\. Footer         — 4 columns: Logo+tagline | Navigation | Services | Contact,

&#x20;                    bottom row: social links + "© 2019-2026 i8STUDIO" + trust text

\--- Floating CTA   — desktop: "Get Quote" pill fixed bottom-right, subtle pulse,

&#x20;                    hides when Contact section is in viewport.

&#x20;                    mobile: sticky bottom bar 56px, 3 buttons: Call | Line | Get Quote

\--- Exit Intent    — desktop only, triggers on mouseleave top edge,

&#x20;                    modal: "Download Our Portfolio" + email input + submit,

&#x20;                    saves to EmailSubscriber, shows 1x per session (sessionStorage)

```



\## Design Tokens



\### Public Site (Dark Theme)

```

\--bg-primary: #0a0a0f

\--bg-card: rgba(255,255,255,0.02)

\--border-card: rgba(255,255,255,0.06)

\--text-primary: rgba(255,255,255,0.9)

\--text-secondary: rgba(255,255,255,0.6)

\--text-muted: rgba(255,255,255,0.4)

\--accent-blue: #3b82f6

\--accent-purple: #8b5cf6

\--gradient-primary: linear-gradient(135deg, #3b82f6, #8b5cf6)

\--radius-card: 14px

\--radius-button: 8px

Font: Outfit (next/font/google)

```



\### Admin Site (Light Theme)

```

\--bg-primary: #f9fafb (gray-50)

\--bg-sidebar: #1e293b (slate-800)

\--sidebar-width: 260px

\--accent: #2563eb (blue-600)

\--card-bg: white

\--card-shadow: shadow-sm

\--card-radius: rounded-lg

All labels: Vietnamese

Font: system default (faster load)

```



\## Admin Panel Detail



\### Sidebar Menu (Vietnamese labels)

```

📊 Tổng quan          → /admin

📝 Bài đăng           → /admin/posts          (filter: NEWS/BLOG, DRAFT/PUBLISHED)

🖼️ Works              → /admin/works

🔧 Dịch vụ            → /admin/services

💬 Testimonials        → /admin/testimonials

🤝 Đối tác            → /admin/partners

📋 Case Studies        → /admin/case-studies

❓ Q\&A                → /admin/qa

🎞️ Slides             → /admin/slides

📖 Flipbooks           → /admin/flipbooks

📨 Liên hệ            → /admin/contacts       (badge: số chưa đọc)

📧 Subscribers         → /admin/subscribers

📁 Media              → /admin/media

⚙️ Cài đặt            → /admin/settings

```



\### Dashboard (/admin)

\- 4 StatsCards row: Tổng bài đăng | Tổng Works | Liên hệ mới (chưa đọc) | Subscribers

\- Recent contacts table (5 mới nhất, chưa đọc highlighted)

\- Quick actions: "Tạo bài mới" button, "Xem liên hệ" button

\- Simple bar chart: contacts per month (last 6 months) — optional, skip if complex



\### DataTable Component (reusable for all entities)

\- Props: columns config, data, onEdit, onDelete, searchable, filterable

\- Features: text search, column filter dropdowns, sortable headers,

&#x20; pagination (10/20/50 per page), row click → edit page

\- Responsive: horizontal scroll on mobile, sticky first column



\### Post Editor (/admin/posts/new and /admin/posts/\[id])

\- Title (EN) + Title (JA) — 2 text inputs

\- Slug — auto-generated from EN title, editable

\- Category — select: NEWS | BLOG

\- Status — toggle switch: DRAFT | PUBLISHED

\- Cover Image — ImageUpload component (drag \& drop, preview, remove)

\- Excerpt (EN) + Excerpt (JA) — 2 textareas

\- Content (EN) — TipTap rich editor (bold, italic, headings, lists, images, links)

\- Content (JA) — TipTap rich editor

\- SEO: Meta Title, Meta Description — 2 text inputs

\- Published At — date picker

\- Preview button — opens /en/news/\[slug] in new tab

\- Save button (draft) + Publish button



\### ImageUpload Component

\- Drag \& drop zone with dashed border

\- Click to browse files

\- Preview thumbnail after select

\- File type validation: jpg, png, webp only

\- Max size: 5MB

\- On upload: POST /api/upload → sharp resize max 1920px → save to public/uploads/ → return URL

\- Remove button (X) to clear selection



\### Media Library (/admin/media)

\- Grid view: thumbnails of all files in public/uploads/

\- Upload button (same ImageUpload component)

\- Each item: thumbnail, filename, size, date, copy URL button, delete button

\- Delete confirmation dialog

\- Search by filename



\### Settings (/admin/settings)

\- Key-value editor for Setting table

\- Pre-seeded keys: companyName, companyNameJa, email, phone, address, addressJa,

&#x20; lineUrl, chatworkUrl, foundedYear, socialFacebook, socialInstagram, socialLinkedin

\- Each row: label, value input, save button

\- Auto-save on blur or enter



\### Contact Submissions (/admin/contacts)

\- DataTable: Name, Email, Service, Date, Read status (badge)

\- Click row → detail page: full message, mark as read button, delete button

\- Unread count shown as badge on sidebar menu item

\- Bulk action: mark selected as read



\### Subscribers (/admin/subscribers)

\- DataTable: Email, Name, Source, Date

\- Export CSV button

\- Delete individual



\## API Patterns (consistent across all entities)



\### List: GET /api/\[entity]

```

Query params: ?page=1\&limit=10\&search=\&sort=createdAt\&order=desc\&\[filters]

Response: { data: T\[], total: number, page: number, limit: number }

```



\### Create: POST /api/\[entity]

```

Body: Zod-validated JSON

Response: { data: T } | { error: string } (400/500)

Auth: session required (NextAuth getServerSession)

```



\### Read: GET /api/\[entity]/\[id]

```

Response: { data: T } | { error: "Not found" } (404)

```



\### Update: PUT /api/\[entity]/\[id]

```

Body: Zod-validated partial JSON

Response: { data: T }

Auth: session required

```



\### Delete: DELETE /api/\[entity]/\[id]

```

Response: { success: true }

Auth: session required

```



\### Upload: POST /api/upload

```

Body: FormData with "file" field

Process: validate type+size → sharp resize → save to public/uploads/\[timestamp]-\[name]

Response: { url: "/uploads/\[filename]" }

Auth: session required

```



\## SEO Requirements

\- generateMetadata() on every page: title, description, openGraph, twitter

\- JSON-LD: Organization (homepage), WebSite, Article (posts), FAQPage (Q\&A page)

\- next-sitemap config: generate sitemap.xml + robots.txt on build

\- Canonical URLs with locale prefix

\- All images have alt text

\- Default og:image: /og-default.jpg



\## i18n Structure (next-intl)

\- Locales: en (default), ja

\- URL pattern: /en/... and /ja/...

\- messages/en.json and messages/ja.json contain:

&#x20; nav labels, section titles, CTA button text, form labels,

&#x20; placeholder text, footer text, error messages

\- Database content: each entity has paired fields (title/titleJa, content/contentJa)

\- Display logic: locale === "ja" ? titleJa || title : title



\## Coding Rules

\- Functional components, named exports

\- "use client" only when needed (event handlers, hooks, animations)

\- Server components by default, data fetching server-side

\- Validate ALL user input with Zod server-side

\- Slugs: auto-generate, lowercase, hyphens, strip special chars

\- Images: max 5MB, jpg/png/webp, sharp resize max 1920px width

\- Error handling: try/catch in API routes, return { error } with status code

\- No console.log in production code

\- Responsive: mobile-first approach



\## .env.local

```

DATABASE\_URL="file:./prisma/data/i8studio.db"

NEXTAUTH\_SECRET="generate-random-64-char-string-here"

NEXTAUTH\_URL="http://localhost:3000"

```



\## Docker (for deploy)

\- Dockerfile: multi-stage, node:20-alpine, standalone output

\- docker-compose.yml: app (port 3000) + nginx (80/443)

\- Volumes: ./data/db → /app/prisma/data, ./data/uploads → /app/public/uploads

\- nginx.conf: reverse proxy, gzip, cache static 30d, security headers, SSL placeholder



\## Commands

```bash

npm run dev              # Dev server localhost:3000

npm run build            # Production build

npm run start            # Start production

npx prisma migrate dev   # Create/run migrations

npx prisma db seed       # Seed sample data

npx prisma studio        # Database GUI browser

npm run lint             # ESLint

```



\## PDF Flipbook Feature (like PEDI Insights)



\### Overview

Trang "/insights" hiển thị các tài liệu PDF dạng sách lật trang (flipbook).

Giống kiểu https://pedicivil.com/pedi-insights/ — user click vào 1 cuốn,

PDF mở ra dạng sách 2 trang, lật bằng click hoặc kéo, có hiệu ứng gập trang.

i8studio có 4 file PDF cần hiển thị dạng này.



\### Libraries

\- `react-pageflip` (v2.0.3) — tạo hiệu ứng lật trang, 39k downloads/week

\- `react-pdf` + `pdfjs-dist` — render từng trang PDF thành image/canvas

\- Cả 2 đều phải dùng `"use client"` vì cần browser APIs



\### How it works (technical flow)

1\. Admin upload file PDF qua admin panel → lưu vào `public/uploads/pdfs/`

2\. Tạo record trong Flipbook table (title, coverImage, pdfUrl)

3\. Trang `/insights` load danh sách flipbooks từ DB → hiển thị grid cards

4\. User click 1 card → mở FlipbookViewer component:

&#x20;  - `react-pdf` load PDF file, lấy tổng số trang

&#x20;  - Render từng trang thành canvas/image

&#x20;  - Truyền các trang vào `react-pageflip` HTMLFlipBook component

&#x20;  - User lật trang bằng: click cạnh trái/phải, kéo góc trang,

&#x20;    hoặc dùng nút Previous/Next, hoặc phím mũi tên



\### Public Page: /\[locale]/insights/page.tsx

```

Layout:

\- H2 "Insights" hoặc "Publications"

\- Grid 2-3 cột: mỗi flipbook là 1 card

&#x20; - Cover image (thumbnail trang đầu hoặc ảnh custom)

&#x20; - Title: "i8 Studio Insights Vol.1"

&#x20; - Description ngắn

&#x20; - "Read Now" button

\- Click card → mở FlipbookViewer ngay trên trang (không redirect)

&#x20; hoặc mở fullscreen modal



Alternative: hiển thị tất cả flipbooks inline trên 1 trang

(giống PEDI — scroll xuống thấy từng cuốn)

```



\### FlipbookViewer Component

```tsx

// components/public/FlipbookViewer.tsx

"use client"



Props:

\- pdfUrl: string        // "/uploads/pdfs/insights-vol1.pdf"

\- width?: number        // default 550

\- height?: number       // default 733 (A4 ratio)



Features:

\- Load PDF bằng react-pdf Document + Page components

\- Render mỗi trang PDF thành canvas, capture thành image

\- Truyền images vào HTMLFlipBook từ react-pageflip

\- Controls bar bên dưới:

&#x20; - Previous / Next buttons

&#x20; - Page indicator: "Page 3 / 24"

&#x20; - Fullscreen toggle button

&#x20; - Zoom in/out (optional)

\- Keyboard: Arrow Left/Right để lật trang

\- Mobile: swipe trái/phải để lật

\- Loading skeleton khi đang render PDF

\- Error state nếu PDF load thất bại



Config HTMLFlipBook:

\- width={550} height={733}

\- size="stretch" (responsive)

\- minWidth={300} maxWidth={800}

\- showCover={true}

\- drawShadow={true}

\- flippingTime={800}

\- usePortrait={true} (mobile: hiện 1 trang)

\- startZIndex={0}

\- autoSize={true}

\- maxShadowOpacity={0.3}

\- mobileScrollSupport={true}



Page component (forwardRef required by react-pageflip):

\- First page + last page: data-density="hard" (bìa cứng)

\- Inner pages: data-density="soft" (trang mềm, gập đẹp hơn)

```



\### Admin: /admin/flipbooks/



\#### List page (/admin/flipbooks/page.tsx)

\- DataTable: Title, Cover, PDF file, Status (active/inactive), Order, Actions

\- "Thêm flipbook mới" button



\#### Create page (/admin/flipbooks/new/page.tsx)

\- Title (EN) + Title (JA)

\- Description (EN) + Description (JA)

\- Cover Image upload (ImageUpload component) — optional,

&#x20; nếu không upload thì auto-capture trang 1 của PDF làm thumbnail

\- PDF file upload:

&#x20; - Drag \& drop zone, accept only .pdf

&#x20; - Max size: 50MB (PDF có thể lớn)

&#x20; - Upload qua POST /api/upload-pdf → lưu vào public/uploads/pdfs/

&#x20; - Preview: hiển thị trang đầu tiên sau khi upload

\- Order (number input)

\- Active toggle (switch)

\- Save button



\#### Edit page (/admin/flipbooks/\[id]/page.tsx)

\- Load existing data, same form

\- Cho phép thay PDF file mới (xóa file cũ)

\- Delete button (confirm dialog, xóa cả file PDF)



\### API: /api/upload-pdf/route.ts

```

POST: FormData with "file" field

\- Validate: file type must be application/pdf

\- Validate: max size 50MB

\- Save to public/uploads/pdfs/\[timestamp]-\[originalname].pdf

\- Response: { url: "/uploads/pdfs/\[filename].pdf" }

\- Auth: session required

```



\### API: /api/flipbooks/route.ts

```

GET: list all flipbooks

&#x20; - Public (no auth): only active=true, ordered by `order` ASC

&#x20; - Admin (with auth): all, with pagination

POST: create new flipbook (auth required)

&#x20; - Body: { title, titleJa, description, descriptionJa, coverImage, pdfUrl, order, active }

&#x20; - Validate with Zod

```



\### Nav Update

Add "Insights" to Header navigation between "About Us" and "News":

Service | Works | About Us | \*\*Insights\*\* | News | Q\&A | Blog



\### Admin Sidebar Update

Add to sidebar menu:

```

📊 Tổng quan

📝 Bài đăng

🖼️ Works

🔧 Dịch vụ

💬 Testimonials

🤝 Đối tác

📋 Case Studies

❓ Q\&A

🎞️ Slides

📖 Flipbooks            ← NEW

📨 Liên hệ

📧 Subscribers

📁 Media

⚙️ Cài đặt

```



\### Docker Volume Update

Add PDF uploads volume:

\- ./data/uploads → /app/public/uploads (covers both images and pdfs/)



\### Claude Code Prompt for this feature

```

Build PDF Flipbook feature:



1\. Install react-pageflip react-pdf pdfjs-dist

2\. Add Flipbook model to Prisma schema, migrate

3\. Create /api/upload-pdf route (accept PDF, max 50MB, save to public/uploads/pdfs/)

4\. Create /api/flipbooks CRUD routes

5\. Build FlipbookViewer component:

&#x20;  - "use client", load PDF with react-pdf

&#x20;  - Render each page as canvas image

&#x20;  - Pass to HTMLFlipBook from react-pageflip

&#x20;  - Controls: prev/next, page indicator, fullscreen

&#x20;  - First/last page = hard cover, inner = soft

&#x20;  - Responsive: portrait mode on mobile

&#x20;  - Keyboard arrow keys + swipe support

6\. Build /\[locale]/insights page:

&#x20;  - Grid of flipbook cards (cover, title, description)

&#x20;  - Click card → open FlipbookViewer inline or modal

7\. Build admin /admin/flipbooks: list, create, edit

&#x20;  - PDF upload with drag \& drop

&#x20;  - Cover image auto-capture from page 1 if not provided

8\. Add "Insights" to Header nav and admin sidebar



Tham khảo giao diện: https://pedicivil.com/pedi-insights/

Hiệu ứng lật trang sách, 2 trang mở cùng lúc trên desktop,

1 trang trên mobile.

```





\## PDF Flipbook Feature (like PEDI Insights)



\### Overview

Trang /insights hiển thị grid các PDF publications (newsletter, brochure, portfolio)

dưới dạng flipbook — lật trang như sách thật. Tham khảo: pedicivil.com/pedi-insights/

User upload 4 file PDF, mỗi file hiển thị như 1 cuốn sách có thể lật.



\### Libraries

\- `react-pageflip` (StPageFlip wrapper) — hiệu ứng lật trang realistic, canvas-based

\- `react-pdf` + `pdfjs-dist` — render từng trang PDF thành image để đưa vào flipbook

\- Cả 2 đều "use client" components



\### Public Page: /\[locale]/insights/page.tsx

```

Layout:

\- H2 "Insights" + subtitle "Our publications and newsletters"

\- Grid 2×2 (responsive: 1 col mobile, 2 col tablet, 2 col desktop)

\- Mỗi item = FlipbookCard:

&#x20; - Cover image thumbnail (coverImage từ DB, hoặc render trang 1 của PDF)

&#x20; - Title (e.g. "i8 Studio Insights Vol.1")

&#x20; - Description ngắn

&#x20; - "Read Now" button

\- Click "Read Now" → mở FlipbookViewer ngay trên trang (expand inline)

&#x20; hoặc modal fullscreen



FlipbookViewer behavior:

\- Load PDF từ pdfUrl

\- react-pdf render mỗi page thành canvas/image

\- react-pageflip nhận các page images, hiển thị dạng sách mở

\- Controls:

&#x20; - Prev / Next page buttons

&#x20; - Page number indicator: "Page 5 / 24"

&#x20; - Fullscreen toggle button

&#x20; - Thumbnail slider (optional: thanh preview nhỏ bên dưới)

&#x20; - Keyboard: arrow left/right để lật trang

&#x20; - Touch/swipe trên mobile

\- showCover: true (trang đầu = bìa, hiển thị 1 trang)

\- Các trang giữa hiển thị 2 trang song song (spread view)

\- Trang cuối = bìa sau, hiển thị 1 trang

\- Size: responsive, maxWidth 1200px, auto height theo tỷ lệ PDF

\- drawShadow: true (bóng đổ khi lật trang)

\- flippingTime: 800ms

```



\### FlipbookViewer Component: /components/public/FlipbookViewer.tsx

```tsx

"use client"

// Key implementation notes:



// 1. Import react-pdf with worker

import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`



// 2. Import react-pageflip

import HTMLFlipBook from 'react-pageflip'



// 3. Flow:

// - Load PDF with react-pdf Document → get numPages

// - For each page: render <Page> inside a forwardRef wrapper

// - Pass all page components as children to <HTMLFlipBook>



// 4. Each page must be wrapped in React.forwardRef:

const FlipPage = React.forwardRef(({ pageNumber, width }, ref) => (

&#x20; <div ref={ref} className="flipbook-page">

&#x20;   <Page pageNumber={pageNumber} width={width} renderTextLayer={false} renderAnnotationLayer={false} />

&#x20; </div>

))



// 5. HTMLFlipBook props:

// width={550} height={733}  (A4 ratio roughly)

// size="stretch"

// minWidth={300} maxWidth={600}

// minHeight={400} maxHeight={800}

// showCover={true}

// drawShadow={true}

// flippingTime={800}

// usePortrait={true}  (mobile: single page mode)

// startZIndex={0}



// 6. Controls bar below the book:

// \[◄ Prev] \[Page 3 / 24] \[Next ►] \[⛶ Fullscreen]

```



\### Admin: /admin/flipbooks/

```

Sidebar menu item: "📖 Flipbooks" (between Slides and Contacts)



List page (/admin/flipbooks):

\- DataTable: Title | Cover | PDF | Trạng thái | Thứ tự | Hành động

\- Active/Inactive badge

\- Preview button → opens flipbook in new tab



Create page (/admin/flipbooks/new):

\- Title (EN) + Title (JA)

\- Description (EN) + Description (JA) — textarea, no rich editor needed

\- Cover Image — ImageUpload component (optional, nếu không upload thì

&#x20; auto-generate từ page 1 của PDF)

\- PDF File — dedicated PDF upload component:

&#x20; - Drag \& drop zone, accept only .pdf

&#x20; - Max 50MB (PDF files can be large)

&#x20; - Show filename + file size after upload

&#x20; - Preview: render page 1 as thumbnail

&#x20; - Upload to POST /api/upload-pdf → save to public/uploads/pdfs/

\- Order — number input

\- Active — toggle switch

\- Save button



Edit page (/admin/flipbooks/\[id]):

\- Same form, pre-filled

\- Option to replace PDF file

\- Delete button with confirm dialog



API: /api/upload-pdf/route.ts:

\- Accept multipart FormData with "file" field

\- Validate: must be application/pdf, max 50MB

\- Save to public/uploads/pdfs/\[timestamp]-\[originalname].pdf

\- Return { url: "/uploads/pdfs/\[filename].pdf" }

\- Auth: session required

```



\### Nav Integration

\- Add "Insights" to Header nav between "About Us" and "News"

\- Mobile menu: same position

\- Footer: add "Insights" to navigation column



\### Docker Volume

\- Add to volumes: ./data/uploads/pdfs → /app/public/uploads/pdfs



\### Claude Code Prompt for this feature

```

Build the PDF Flipbook feature:



1\. Install: npm install react-pageflip react-pdf pdfjs-dist



2\. Create Flipbook model migration (prisma migrate dev)



3\. Build FlipbookViewer component:

&#x20;  - "use client", load PDF with react-pdf, render pages into

&#x20;    react-pageflip HTMLFlipBook

&#x20;  - Each page wrapped in React.forwardRef

&#x20;  - Controls: prev/next buttons, page indicator, fullscreen toggle

&#x20;  - Responsive: stretch mode, portrait on mobile

&#x20;  - Keyboard arrow navigation

&#x20;  - showCover=true, drawShadow=true



4\. Build /\[locale]/insights/page.tsx:

&#x20;  - Fetch active flipbooks from DB ordered by `order`

&#x20;  - Grid of FlipbookCards (cover + title + "Read Now")

&#x20;  - Click → expand FlipbookViewer inline or fullscreen modal



5\. Build admin CRUD /admin/flipbooks/:

&#x20;  - List, Create, Edit pages

&#x20;  - PDF upload (max 50MB, save to public/uploads/pdfs/)

&#x20;  - Cover image upload (optional)

&#x20;  - Active toggle, order number



6\. Add "Insights" to Header nav and Footer nav



7\. Add API routes: /api/flipbooks, /api/flipbooks/\[id], /api/upload-pdf

```





