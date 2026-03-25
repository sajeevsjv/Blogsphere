/** Detects if a string likely contains HTML from a rich editor */
export function isLikelyHtml(value) {
  if (!value || typeof value !== "string") return false;
  return /<\/?[a-z][\s\S]*>/i.test(value.trim());
}

/** Plain text preview from HTML (for cards) */
export function stripHtmlToText(html) {
  if (!html || typeof html !== "string") return "";
  try {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
  } catch {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}
