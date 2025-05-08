// icon:currency-real | Tabler Icons https://tablericons.com/ | Csaba Kissi
import * as React from "react";

function IconCurrencyReal(props: React.SVGProps<SVGSVGElement>) {
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
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M21 6h-4a3 3 0 000 6h1a3 3 0 010 6h-4M4 18V6h3a3 3 0 110 6H4c5.5 0 5 4 6 6M18 6V4M17 20v-2" />
    </svg>
  );
}

export default IconCurrencyReal;