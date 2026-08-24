import sanitize from "sanitize-html";

/**
 * Format Japanese text nodes so quotes 「...」 and compound words stay unified on the same line
 */
function formatJapanesePhrases(html: string): string {
  if (!html) return "";

  return html.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, text) => {
    if (tag) return tag;
    if (!text) return "";

    // 1. Keep Japanese quoted phrases 「...」 (up to 40 chars) unified on the same line
    let formatted = text.replace(/「([^」\n]{1,40})」/g, '<span class="inline-block whitespace-nowrap">「$1」</span>');

    // 2. Keep long Katakana compound words (>= 4 chars like ビジュアライゼーション) unified
    formatted = formatted.replace(/([\u30A1-\u30F6\u30FC]{4,})/g, '<span class="inline-block">$1</span>');

    return formatted;
  });
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

  return formatJapanesePhrases(clean);
}
