import React from "react";

/** Renders Quill / rich-text HTML safely in read-only view */
export default function BlogHtmlContent({ html, className = "" }) {
  if (!html) return null;
  return (
    <div
      className={`blog-html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
