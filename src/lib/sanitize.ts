import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe HTML tags for rich text rendering while removing
 * dangerous elements like <script>, event handlers, etc.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
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
    ALLOWED_ATTR: [
      "href", "target", "rel", "src", "alt", "width", "height",
      "class", "id", "style",
    ],
    // Force links to open safely
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });
}
