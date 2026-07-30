import sanitize from "sanitize-html";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe HTML tags for rich text rendering while removing
 * dangerous elements like <script>, event handlers, etc.
 *
 * Uses `sanitize-html` which works in pure Node.js (no jsdom/browser needed).
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  return sanitize(dirty, {
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
}
