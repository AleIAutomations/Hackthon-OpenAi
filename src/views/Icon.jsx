import React from "react";

const paths = {
  chart: <><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></>,
  settings: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="18" r="2" /></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5" /></>,
  arrow: <><path d="m7 7 10 10M7 17h10V7" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v.1" /></>,
  reset: <><path d="M4 5v5h5M4 10a8 8 0 1 1 1 8" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  table: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M10 10v10" /></>,
  check: <path d="m5 12 4 4L19 6" />,
};
export function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.info}</svg>;
}

