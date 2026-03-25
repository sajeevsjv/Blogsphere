import React from "react";



export function getInitials(name) {

  if (!name || typeof name !== "string" || !name.trim()) return "?";

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

  }

  return name.trim().slice(0, 2).toUpperCase();

}



/** Small circular avatar with initials — no external images */

export default function UserAvatar({ name, size = "md", className = "" }) {

  const initials = getInitials(name);

  const sizes = {

    sm: "h-8 w-8 text-xs",

    md: "h-9 w-9 text-xs",

    lg: "h-10 w-10 text-sm",

  };

  return (

    <div

      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-900 ${sizes[size] || sizes.md} ${className}`}

      aria-hidden

    >

      {initials}

    </div>

  );

}

