// icon:arrow-left-circle | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from "react";

 function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1.4rem"
      width="1.4rem"
      {...props}
    >
     <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>  
  );
}

export default ArrowLeft;
