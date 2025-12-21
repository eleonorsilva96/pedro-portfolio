import React from "react";

export default function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props} // create new object with copied svg properties 
    >
      <g id="arrow-right">
        <path
          id="Vector (Stroke)"
          d="M17 7.3789L33.1211 23.5L17 39.6211L14.8789 37.5L28.8789 23.5L14.8789 9.49999L17 7.3789Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
