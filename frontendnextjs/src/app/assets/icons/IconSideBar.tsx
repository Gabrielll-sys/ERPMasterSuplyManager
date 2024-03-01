// icon:layout-text-sidebar-reverse | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from "react";

function IconSideBar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="2.4em"
      width="2.4em"
      {...props}
    >
      <path d="M12.5 3a.5.5 0 010 1h-5a.5.5 0 010-1h5zm0 3a.5.5 0 010 1h-5a.5.5 0 010-1h5zm.5 3.5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h5a.5.5 0 00.5-.5zm-.5 2.5a.5.5 0 010 1h-5a.5.5 0 010-1h5z" />
      <path d="M16 2a2 2 0 00-2-2H2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2zM4 1v14H2a1 1 0 01-1-1V2a1 1 0 011-1h2zm1 0h9a1 1 0 011 1v12a1 1 0 01-1 1H5V1z" />
    </svg>
  );
}

export default IconSideBar;
