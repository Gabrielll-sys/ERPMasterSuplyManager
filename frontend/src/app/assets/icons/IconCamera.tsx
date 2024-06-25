// icon:camera | Feathericons https://feathericons.com/ | Cole Bemis
import * as React from "react";

function IconCamera(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <path d="M16 13 A4 4 0 0 1 12 17 A4 4 0 0 1 8 13 A4 4 0 0 1 16 13 z" />
    </svg>
  );
}

export default IconCamera;