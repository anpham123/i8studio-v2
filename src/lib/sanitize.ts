import sanitize from "sanitize-html";

/**
 * Format Japanese text nodes so quotes 「...」 and compound words stay unified on the same line
 */
function formatJapanesePhrases(html: string): string {
  if (!html) return "";

  return html.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, text) => {
    if (tag) return tag;
    if (!text) return "";

    // 1. Keep Japanese quoted phrases 「...」 with trailing punctuation unified on the same line
    let formatted = text.replace(/「([^」\n]{1,40})」([、。，．！？）」』】〕〉》・]*)/g, '<span class="inline-block whitespace-nowrap">「$1」$2</span>');

    // 2. Keep long Katakana compound words (>= 4 chars) with trailing punctuation unified
    formatted = formatted.replace(/([\u30A1-\u30F6\u30FC]{4,}[、。，．！？）」』】〕〉》・]*)/g, '<span class="inline-block">$1</span>');

    return formatted;
  });
}

interface ImageCardData {
  imgTag: string;
  captionHtml?: string;
}

/**
 * Detect consecutive images (with or without captions) in blog content and group them into a dedicated gallery <div>
 * Auto-detects count:
 * - 1 image -> full width
 * - 2 images -> 2 columns split
 * - 3 images -> 3 columns split
 */
function formatBlogImages(html: string): string {
  if (!html || !html.includes("<img")) return html;

  // 1. Remove empty <p></p> or <p><br></p> tags that TipTap leaves between elements
  const cleaned = html.replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "");

  // 2. Match any image unit (with optional caption right below it)
  const imageUnits: ImageCardData[] = [];

  const imgWithCaptionRegex = /(?:<figure[^>]*>[\s\S]*?<img\b[^>]+>[\s\S]*?<\/figure>|<p[^>]*>\s*(?:<a\b[^>]*>)?\s*<img\b[^>]+>\s*(?:<\/a>)?\s*(?:<br\s*\/?>[\s\S]*?)?<\/p>(?:\s*<p[^>]*>(?:(?!<img|<h\d|<table|<ul|<ol)[\s\S]){1,120}?<\/p>)?|<img\b[^>]+>(?:\s*<p[^>]*>(?:(?!<img|<h\d|<table|<ul|<ol)[\s\S]){1,120}?<\/p>)?)/gi;

  const withPlaceholders = cleaned.replace(imgWithCaptionRegex, (match: string) => {
    // 2.1 Extract img tag
    const imgMatch = match.match(/<img\b[^>]+>/i);
    if (!imgMatch) return match;
    const imgTag = imgMatch[0];

    // 2.2 Extract caption if present
    let rawCaption = "";
    const figCapMatch = match.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    if (figCapMatch && typeof figCapMatch[1] === "string") {
      rawCaption = figCapMatch[1];
    } else {
      const trailingPMatch = match.match(/<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>$/i);
      if (trailingPMatch && typeof trailingPMatch[1] === "string") {
        rawCaption = trailingPMatch[1];
      } else {
        const brMatch = match.match(/<br\s*\/?>\s*([^<]+)<\/p>$/i);
        if (brMatch && typeof brMatch[1] === "string") {
          rawCaption = brMatch[1];
        }
      }
    }

    const captionHtml = typeof rawCaption === "string"
      ? rawCaption.trim().replace(/^<br\s*\/?>|<br\s*\/?>$/gi, "").trim()
      : "";

    const index = imageUnits.length;
    imageUnits.push({ imgTag, captionHtml: captionHtml || undefined });
    return `___IMG_CARD_${index}___`;
  });

  // 3. Group consecutive placeholders into a single gallery div with dynamic columns count
  const grouped = withPlaceholders.replace(/(?:\s*___IMG_CARD_\d+___\s*)+/gi, (group) => {
    const cardIndexes = group.match(/\d+/g) || [];
    const count = cardIndexes.length;
    const groupCards = cardIndexes
      .map((i) => {
        const item = imageUnits[parseInt(i, 10)];
        if (!item) return "";
        const hasCap = Boolean(item.captionHtml);
        const capEl = hasCap
          ? `<p class="img-caption">${item.captionHtml}</p>`
          : "";
        return `<div class="blog-img-item${hasCap ? " has-caption" : ""}">${item.imgTag}${capEl}</div>`;
      })
      .filter(Boolean)
      .join("\n");

    return `\n<div class="blog-paragraph-gallery gallery-cols-${count}">\n${groupCards}\n</div>\n`;
  });

  return grouped.trim();
}

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe HTML tags for rich text rendering while removing
 * dangerous elements like <script>, event handlers, etc.
 *
 * Uses `sanitize-html` which works in pure Node.js (no jsdom/browser needed).
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  const clean = sanitize(dirty, {
    allowedTags: [
      // Text formatting
      "b", "i", "em", "strong", "u", "s", "mark", "small", "sub", "sup",
      // Block elements
      "p", "br", "hr", "blockquote", "pre", "code",
      // Headings
      "h1", "h2", "h3", "h4", "h5", "h6",
      // Lists
      "ul", "ol", "li",
      // Links and media
      "a", "img", "figure", "figcaption",
      // Tables
      "table", "thead", "tbody", "tr", "th", "td",
      // Semantic
      "span", "div", "section", "article",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["class", "id", "style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Strip all tags not in the whitelist (don't escape them)
    disallowedTagsMode: "discard",
  });

  return formatBlogImages(formatJapanesePhrases(clean));
}

