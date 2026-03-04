import React from "react";

export default function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="currentColor"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.5 7.90906L32.091 9.50005L9.50017 32.0909L7.90918 30.4999L30.5 7.90906Z"
        fill="currentColor"
      />
      <path
        d="M30.5 32.0911L32.091 30.5001L9.50017 7.90926L7.90918 9.50025L30.5 32.0911Z"
        fill="currentColor"
      />
    </svg>
  );
}
